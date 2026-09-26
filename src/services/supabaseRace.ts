import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { RaceRoom, RacePlayer, TestDuration, Difficulty, Category } from '../types/typing';
import { getRandomPassage } from '../data/passages';
import { getSupabaseCredentials } from './supabaseClient';

export interface MultiplayerMatchHistoryItem {
  id: string;
  roomCode: string;
  timestamp: number;
  rank: number;
  totalPlayers: number;
  wpm: number;
  accuracy: number;
  duration: number;
}

type RoomCallback = (room: RaceRoom | null) => void;

class SupabaseRaceService {
  private supabase: ReturnType<typeof createClient> | null = null;
  private channel: RealtimeChannel | null = null;
  private matchmakingChannel: RealtimeChannel | null = null;
  private localBroadcast: BroadcastChannel | null = null;
  private matchmakingBroadcast: BroadcastChannel | null = null;
  private currentRoom: RaceRoom | null = null;
  private localPlayerId: string = `player_${Math.random().toString(36).substr(2, 8)}`;
  private listener: RoomCallback | null = null;
  private connectionMode: 'supabase' | 'broadcast' = 'broadcast';

  constructor() {
    this.initSupabase();
    this.initMatchmakingListener();
  }

  public initSupabase(customUrl?: string, customKey?: string) {
    const creds = getSupabaseCredentials();
    const url = customUrl || creds.url;
    const key = customKey || creds.key;

    if (url && key && url.startsWith('http')) {
      try {
        this.supabase = createClient(url, key, {
          auth: { persistSession: false },
        });
        this.connectionMode = 'supabase';
      } catch (err) {
        console.warn('Supabase client initialization fallback to local broadcast channel:', err);
        this.supabase = null;
        this.connectionMode = 'broadcast';
      }
    } else {
      this.supabase = null;
      this.connectionMode = 'broadcast';
    }
  }

  public setAuthenticatedUser(userId: string) {
    if (userId) {
      this.localPlayerId = userId;
    }
  }

  public getConnectionMode(): 'supabase' | 'broadcast' {
    return this.connectionMode;
  }

  public getPlayerId(): string {
    return this.localPlayerId;
  }

  public subscribe(cb: RoomCallback) {
    this.listener = cb;
    cb(this.currentRoom);
    return () => {
      this.listener = null;
    };
  }

  private notify(room: RaceRoom | null) {
    this.currentRoom = room;
    if (this.listener) {
      this.listener(room);
    }
  }

  /**
   * Generates a clean 5-character alphanumeric room code
   */
  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Creates a new Multiplayer Race Room as Host
   */
  public createRoom(
    hostName: string,
    avatarStyle: string,
    config: {
      duration: TestDuration;
      difficulty: Difficulty;
      category: Category;
      testMode: 'time' | 'words';
      wordCount?: number;
      maxPlayers?: number;
      wordSet?: string;
    }
  ): string {
    const roomCode = this.generateRoomCode();
    const passage = getRandomPassage(config.category, config.difficulty).text;

    const hostPlayer: RacePlayer = {
      id: this.localPlayerId,
      name: hostName || 'Host',
      avatarStyle,
      isHost: true,
      isReady: true,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      isFinished: false,
      isConnected: true,
    };

    const newRoom: RaceRoom = {
      code: roomCode,
      hostId: this.localPlayerId,
      status: 'lobby',
      passage,
      duration: config.duration,
      testMode: config.testMode,
      wordCount: config.wordCount,
      difficulty: config.difficulty,
      category: config.category,
      maxPlayers: config.maxPlayers || 6,
      wordSet: config.wordSet || 'Standard',
      players: {
        [this.localPlayerId]: hostPlayer,
      },
    };

    this.setupChannel(roomCode, true, newRoom);
    this.notify(newRoom);
    this.announceOpenRoom(newRoom);
    return roomCode;
  }

  /**
   * Joins an existing Multiplayer Room
   */
  public joinRoom(
    roomCode: string,
    playerName: string,
    avatarStyle: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const code = roomCode.trim().toUpperCase();

      this.setupChannel(code, false);

      // Broadcast join request
      const guestPlayer: RacePlayer = {
        id: this.localPlayerId,
        name: playerName || 'Racer',
        avatarStyle,
        isHost: false,
        isReady: false,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        isFinished: false,
        isConnected: true,
      };

      this.broadcast('player_join', { player: guestPlayer, roomCode: code });

      // Timeout fallback if host is unreachable
      const timeout = setTimeout(() => {
        if (!this.currentRoom || this.currentRoom.code !== code) {
          resolve(false);
        }
      }, 3500);

      const checkJoined = () => {
        if (this.currentRoom && this.currentRoom.code === code) {
          clearTimeout(timeout);
          resolve(true);
        }
      };

      // Periodic check for host response
      const interval = setInterval(() => {
        if (this.currentRoom && this.currentRoom.code === code) {
          clearInterval(interval);
          checkJoined();
        }
      }, 100);
    });
  }

  /**
   * Genuine Quick Match: Searches for an available open room without bots.
   * If none exists, resolves false honestly.
   */
  public findQuickMatch(playerName: string, avatarStyle: string): Promise<{ success: boolean; roomCode?: string; message?: string }> {
    return new Promise((resolve) => {
      let found = false;

      const handleDiscovery = (data: { roomCode: string; playerCount: number; maxPlayers: number; status: string }) => {
        if (found) return;
        if (data && data.roomCode && data.status === 'lobby' && data.playerCount < data.maxPlayers) {
          found = true;
          this.joinRoom(data.roomCode, playerName, avatarStyle).then((joined) => {
            if (joined) {
              resolve({ success: true, roomCode: data.roomCode });
            } else {
              resolve({ 
                success: false, 
                message: 'Found lobby was full or no longer accepting racers.' 
              });
            }
          });
        }
      };

      // Ask if any hosts are advertising open lobbies
      if (this.matchmakingBroadcast) {
        this.matchmakingBroadcast.postMessage({ type: 'find_room', requesterId: this.localPlayerId });
      }
      if (this.matchmakingChannel) {
        this.matchmakingChannel.send({
          type: 'broadcast',
          event: 'find_room',
          payload: { requesterId: this.localPlayerId },
        });
      }

      // Listen for room announcements
      const tempListener = (event: MessageEvent) => {
        if (event.data?.type === 'room_available') {
          handleDiscovery(event.data.payload);
        }
      };
      if (this.matchmakingBroadcast) {
        this.matchmakingBroadcast.addEventListener('message', tempListener);
      }

      // Timeout after 3.5 seconds with honest "no opponent found" result
      setTimeout(() => {
        if (this.matchmakingBroadcast) {
          this.matchmakingBroadcast.removeEventListener('message', tempListener);
        }
        if (!found) {
          resolve({
            success: false,
            message: 'No active opponents found in queue. Create a room to host a match, or open another browser tab to race locally.',
          });
        }
      }, 3500);
    });
  }

  /**
   * Toggles Ready state
   */
  public setReady(isReady: boolean) {
    if (!this.currentRoom) return;
    const player = this.currentRoom.players[this.localPlayerId];
    if (player) {
      player.isReady = isReady;
      this.broadcast('state_sync', this.currentRoom);
      this.notify({ ...this.currentRoom });
    }
  }

  /**
   * Updates host room configuration
   */
  public updateConfig(config: Partial<RaceRoom>) {
    if (!this.currentRoom || this.currentRoom.hostId !== this.localPlayerId) return;
    const updated = { ...this.currentRoom, ...config };
    this.broadcast('state_sync', updated);
    this.notify(updated);
  }

  /**
   * Initiates synchronized race countdown
   */
  public startRaceCountdown() {
    if (!this.currentRoom || this.currentRoom.hostId !== this.localPlayerId) return;
    const startTimestamp = Date.now() + 3500; // 3.5s synchronized countdown
    const updated: RaceRoom = {
      ...this.currentRoom,
      status: 'countdown',
      startTimestamp,
    };
    this.broadcast('state_sync', updated);
    this.notify(updated);
  }

  /**
   * Broadcasts live typing progress and WPM
   */
  public updateProgress(progress: number, wpm: number, accuracy: number, second?: number) {
    if (!this.currentRoom) return;
    const player = this.currentRoom.players[this.localPlayerId];
    if (!player) return;

    player.progress = progress;
    player.wpm = wpm;
    player.accuracy = accuracy;

    if (!player.metricsHistory) {
      player.metricsHistory = [];
    }

    const currentSec = typeof second === 'number' && second > 0 ? second : (
      this.currentRoom.startTimestamp 
        ? Math.max(1, Math.round((Date.now() - (this.currentRoom.startTimestamp + 500)) / 1000))
        : 1
    );

    const lastSnap = player.metricsHistory[player.metricsHistory.length - 1];
    if (!lastSnap || currentSec > lastSnap.second) {
      player.metricsHistory.push({ second: currentSec, wpm, accuracy });
    } else if (lastSnap && currentSec === lastSnap.second) {
      lastSnap.wpm = wpm;
      lastSnap.accuracy = accuracy;
    }

    this.broadcast('progress_update', {
      playerId: this.localPlayerId,
      progress,
      wpm,
      accuracy,
      second: currentSec,
    });
  }

  /**
   * Broadcasts finished state and records to match history
   */
  public finishRace(wpm: number, accuracy: number, metricsHistory?: { second: number; wpm: number; accuracy?: number }[]) {
    if (!this.currentRoom) return;
    const player = this.currentRoom.players[this.localPlayerId];
    if (!player) return;

    player.isFinished = true;
    player.finishTime = Date.now();
    player.wpm = wpm;
    player.accuracy = accuracy;
    player.progress = 100;
    if (metricsHistory && metricsHistory.length > 0) {
      player.metricsHistory = metricsHistory;
    }

    // Determine rank based on finish order
    const finishedCount = Object.values(this.currentRoom.players).filter(p => p.isFinished).length;
    player.rank = finishedCount;

    // Record into local match history
    this.saveMatchToHistory({
      id: `match_${Date.now()}`,
      roomCode: this.currentRoom.code,
      timestamp: Date.now(),
      rank: player.rank,
      totalPlayers: Object.keys(this.currentRoom.players).length,
      wpm,
      accuracy,
      duration: this.currentRoom.duration || 30,
    });

    // Check if all active connected players finished
    const activePlayers = Object.values(this.currentRoom.players).filter(p => p.isConnected !== false);
    const allFinished = activePlayers.length > 0 && activePlayers.every(p => p.isFinished);
    if (allFinished) {
      this.currentRoom.status = 'completed';
    }

    this.broadcast('state_sync', this.currentRoom);
    this.notify({ ...this.currentRoom });
  }

  /**
   * Requests a rematch in the same room
   */
  public requestRematch() {
    if (!this.currentRoom) return;
    const newPassage = getRandomPassage(this.currentRoom.category, this.currentRoom.difficulty).text;
    
    // Reset players
    const resetPlayers: Record<string, RacePlayer> = {};
    for (const [id, p] of Object.entries(this.currentRoom.players)) {
      resetPlayers[id] = {
        ...p,
        isReady: p.isHost,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        isFinished: false,
        rank: undefined,
        finishTime: undefined,
      };
    }

    const nextRoom: RaceRoom = {
      ...this.currentRoom,
      status: 'lobby',
      passage: newPassage,
      startTimestamp: undefined,
      players: resetPlayers,
    };

    this.broadcast('state_sync', nextRoom);
    this.notify(nextRoom);
  }

  /**
   * Leaves current room
   */
  public leaveRoom() {
    if (this.currentRoom) {
      this.broadcast('player_leave', { playerId: this.localPlayerId });
    }
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
    if (this.localBroadcast) {
      this.localBroadcast.close();
      this.localBroadcast = null;
    }
    this.notify(null);
  }

  /**
   * Retrieves user's genuine multiplayer match history
   */
  public getMatchHistory(): MultiplayerMatchHistoryItem[] {
    try {
      const data = localStorage.getItem('typerush_multiplayer_history');
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  private saveMatchToHistory(item: MultiplayerMatchHistoryItem) {
    try {
      const history = this.getMatchHistory();
      const updated = [item, ...history].slice(0, 30);
      localStorage.setItem('typerush_multiplayer_history', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }

  private initMatchmakingListener() {
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      this.matchmakingBroadcast = new BroadcastChannel('typerush_matchmaking_discovery');
      this.matchmakingBroadcast.onmessage = (event) => {
        if (event.data?.type === 'find_room') {
          // If this tab is currently hosting an open lobby, reply with availability
          if (this.currentRoom && this.currentRoom.hostId === this.localPlayerId && this.currentRoom.status === 'lobby') {
            const currentCount = Object.keys(this.currentRoom.players).length;
            if (currentCount < (this.currentRoom.maxPlayers || 6)) {
              this.matchmakingBroadcast?.postMessage({
                type: 'room_available',
                payload: {
                  roomCode: this.currentRoom.code,
                  playerCount: currentCount,
                  maxPlayers: this.currentRoom.maxPlayers || 6,
                  status: this.currentRoom.status,
                },
              });
            }
          }
        }
      };
    }

    if (this.supabase) {
      try {
        this.matchmakingChannel = this.supabase.channel('typerush_matchmaking', {
          config: { broadcast: { self: false } },
        });

        this.matchmakingChannel
          .on('broadcast', { event: 'find_room' }, () => {
            if (this.currentRoom && this.currentRoom.hostId === this.localPlayerId && this.currentRoom.status === 'lobby') {
              const currentCount = Object.keys(this.currentRoom.players).length;
              if (currentCount < (this.currentRoom.maxPlayers || 6)) {
                this.matchmakingChannel?.send({
                  type: 'broadcast',
                  event: 'room_available',
                  payload: {
                    roomCode: this.currentRoom.code,
                    playerCount: currentCount,
                    maxPlayers: this.currentRoom.maxPlayers || 6,
                    status: this.currentRoom.status,
                  },
                });
              }
            }
          })
          .subscribe();
      } catch (err) {
        console.warn('Matchmaking channel subscribe error:', err);
      }
    }
  }

  private announceOpenRoom(room: RaceRoom) {
    const payload = {
      roomCode: room.code,
      playerCount: Object.keys(room.players).length,
      maxPlayers: room.maxPlayers || 6,
      status: room.status,
    };
    if (this.matchmakingBroadcast) {
      this.matchmakingBroadcast.postMessage({ type: 'room_available', payload });
    }
    if (this.matchmakingChannel) {
      this.matchmakingChannel.send({
        type: 'broadcast',
        event: 'room_available',
        payload,
      });
    }
  }

  private setupChannel(roomCode: string, isHost: boolean, initialRoom?: RaceRoom) {
    if (this.channel) this.channel.unsubscribe();
    if (this.localBroadcast) this.localBroadcast.close();

    // 1. Supabase Realtime channel if available
    if (this.supabase) {
      try {
        this.channel = this.supabase.channel(`race_${roomCode}`, {
          config: { broadcast: { self: false } },
        });

        this.channel
          .on('broadcast', { event: 'state_sync' }, ({ payload }) => this.handleStateSync(payload))
          .on('broadcast', { event: 'player_join' }, ({ payload }) => this.handlePlayerJoin(payload))
          .on('broadcast', { event: 'progress_update' }, ({ payload }) => this.handleProgressUpdate(payload))
          .on('broadcast', { event: 'player_leave' }, ({ payload }) => this.handlePlayerLeave(payload))
          .subscribe();
      } catch (err) {
        console.warn('Supabase subscription error:', err);
      }
    }

    // 2. Browser BroadcastChannel for instant local multi-tab 1v1
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      this.localBroadcast = new BroadcastChannel(`typerush_room_${roomCode}`);
      this.localBroadcast.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'state_sync') this.handleStateSync(payload);
        if (type === 'player_join') this.handlePlayerJoin(payload);
        if (type === 'progress_update') this.handleProgressUpdate(payload);
        if (type === 'player_leave') this.handlePlayerLeave(payload);
      };
    }

    if (initialRoom) {
      this.currentRoom = initialRoom;
    }
  }

  private broadcast(event: string, payload: unknown) {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    }
    if (this.localBroadcast) {
      this.localBroadcast.postMessage({ type: event, payload });
    }
  }

  private handleStateSync(payload: RaceRoom) {
    if (payload && (!this.currentRoom || this.currentRoom.code === payload.code)) {
      this.notify(payload);
    }
  }

  private handlePlayerJoin({ player, roomCode }: { player: RacePlayer; roomCode: string }) {
    if (!this.currentRoom || this.currentRoom.code !== roomCode) return;
    // If host, add player and broadcast updated state
    if (this.currentRoom.hostId === this.localPlayerId) {
      const currentCount = Object.keys(this.currentRoom.players).length;
      if (this.currentRoom.maxPlayers && currentCount >= this.currentRoom.maxPlayers) {
        return; // Room is full
      }
      const players = { ...this.currentRoom.players, [player.id]: { ...player, isConnected: true } };
      const updated: RaceRoom = { ...this.currentRoom, players };
      this.broadcast('state_sync', updated);
      this.notify(updated);
    }
  }

  private handleProgressUpdate({ playerId, progress, wpm, accuracy, second }: { playerId: string; progress: number; wpm: number; accuracy: number; second?: number }) {
    if (!this.currentRoom) return;
    const player = this.currentRoom.players[playerId];
    if (player) {
      player.progress = progress;
      player.wpm = wpm;
      player.accuracy = accuracy;

      if (!player.metricsHistory) {
        player.metricsHistory = [];
      }

      const sec = typeof second === 'number' && second > 0 ? second : (
        this.currentRoom.startTimestamp
          ? Math.max(1, Math.round((Date.now() - (this.currentRoom.startTimestamp + 500)) / 1000))
          : 1
      );

      const lastSnap = player.metricsHistory[player.metricsHistory.length - 1];
      if (!lastSnap || sec > lastSnap.second) {
        player.metricsHistory.push({ second: sec, wpm, accuracy });
      } else if (lastSnap && sec === lastSnap.second) {
        lastSnap.wpm = wpm;
        lastSnap.accuracy = accuracy;
      }

      this.notify({ ...this.currentRoom });
    }
  }

  private handlePlayerLeave({ playerId }: { playerId: string }) {
    if (!this.currentRoom) return;
    if (this.currentRoom.status === 'racing' || this.currentRoom.status === 'countdown') {
      const player = this.currentRoom.players[playerId];
      if (player) {
        player.isConnected = false;
        player.disconnectedAt = Date.now();
        // Check if all remaining active players are finished
        const activePlayers = Object.values(this.currentRoom.players).filter(p => p.isConnected !== false);
        const allFinished = activePlayers.length > 0 && activePlayers.every(p => p.isFinished);
        if (allFinished) {
          this.currentRoom.status = 'completed';
        }
        this.broadcast('state_sync', this.currentRoom);
        this.notify({ ...this.currentRoom });
      }
    } else {
      const players = { ...this.currentRoom.players };
      delete players[playerId];
      const updated = { ...this.currentRoom, players };
      this.notify(updated);
    }
  }
}

export const supabaseRace = new SupabaseRaceService();
