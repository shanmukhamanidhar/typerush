import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { RaceRoom, RacePlayer, TestDuration, Difficulty, Category } from '../types/typing';
import { getRandomPassage } from '../data/passages';

type RoomCallback = (room: RaceRoom | null) => void;

class SupabaseRaceService {
  private supabase: ReturnType<typeof createClient> | null = null;
  private channel: RealtimeChannel | null = null;
  private localBroadcast: BroadcastChannel | null = null;
  private currentRoom: RaceRoom | null = null;
  private localPlayerId: string = `player_${Math.random().toString(36).substr(2, 8)}`;
  private listener: RoomCallback | null = null;

  constructor() {
    this.initSupabase();
  }

  public initSupabase(customUrl?: string, customKey?: string) {
    const url = "https://wnxernklvvfujytddprc.supabase.co";
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueGVybmtsdnZmdWp5dGRkcHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMzU3NjAsImV4cCI6MjEwNTcxMTc2MH0.Yk3jyIe0jigpdEnjFyHJ87qpLCzPtia-Ubdx1GTroBQ";

    if (url && key && url.startsWith('http')) {
      try {
        this.supabase = createClient(url, key);
      } catch (err) {
        console.warn('Supabase client initialization fallback to local broadcast channel:', err);
        this.supabase = null;
      }
    } else {
      this.supabase = null;
    }
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
   * Creates a new 1v1 Race Room as Host
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
    }
  ): string {
    const roomCode = this.generateRoomCode();
    const passage = getRandomPassage(config.category, config.difficulty).text;

    const hostPlayer: RacePlayer = {
      id: this.localPlayerId,
      name: hostName || 'Player 1 (Host)',
      avatarStyle,
      isHost: true,
      isReady: true,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      isFinished: false,
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
      players: {
        [this.localPlayerId]: hostPlayer,
      },
    };

    this.setupChannel(roomCode, true, newRoom);
    this.notify(newRoom);
    return roomCode;
  }

  /**
   * Joins an existing 1v1 Room
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
        name: playerName || 'Player 2',
        avatarStyle,
        isHost: false,
        isReady: false,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        isFinished: false,
      };

      this.broadcast('player_join', { player: guestPlayer, roomCode: code });

      // Timeout fallback if host is unreachable
      const timeout = setTimeout(() => {
        if (!this.currentRoom) {
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
  public updateProgress(progress: number, wpm: number, accuracy: number) {
    if (!this.currentRoom) return;
    const player = this.currentRoom.players[this.localPlayerId];
    if (!player) return;

    player.progress = progress;
    player.wpm = wpm;
    player.accuracy = accuracy;

    this.broadcast('progress_update', {
      playerId: this.localPlayerId,
      progress,
      wpm,
      accuracy,
    });
  }

  /**
   * Broadcasts finished state
   */
  public finishRace(wpm: number, accuracy: number) {
    if (!this.currentRoom) return;
    const player = this.currentRoom.players[this.localPlayerId];
    if (!player) return;

    player.isFinished = true;
    player.finishTime = Date.now();
    player.wpm = wpm;
    player.accuracy = accuracy;
    player.progress = 100;

    // Determine rank
    const finishedCount = Object.values(this.currentRoom.players).filter(p => p.isFinished).length;
    player.rank = finishedCount;

    // Check if both finished
    const allFinished = Object.values(this.currentRoom.players).every(p => p.isFinished);
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
        isReady: p.isHost, // host stays ready
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

    // 2. Browser BroadcastChannel fallback for zero-latency local multi-tab 1v1
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
      const players = { ...this.currentRoom.players, [player.id]: player };
      const updated: RaceRoom = { ...this.currentRoom, players };
      this.broadcast('state_sync', updated);
      this.notify(updated);
    }
  }

  private handleProgressUpdate({ playerId, progress, wpm, accuracy }: { playerId: string; progress: number; wpm: number; accuracy: number }) {
    if (!this.currentRoom) return;
    const player = this.currentRoom.players[playerId];
    if (player) {
      player.progress = progress;
      player.wpm = wpm;
      player.accuracy = accuracy;
      this.notify({ ...this.currentRoom });
    }
  }

  private handlePlayerLeave({ playerId }: { playerId: string }) {
    if (!this.currentRoom) return;
    const players = { ...this.currentRoom.players };
    delete players[playerId];
    const updated = { ...this.currentRoom, players };
    this.notify(updated);
  }
}

export const supabaseRace = new SupabaseRaceService();
