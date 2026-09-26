import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { TestResult } from '../../types/typing';
import { CloudTypingService } from '../../services/cloudTypingService';

interface DataMigrationBannerProps {
  userId: string;
  localHistory: TestResult[];
  onMigrationComplete: () => void;
  onDismiss: () => void;
}

export const DataMigrationBanner: React.FC<DataMigrationBannerProps> = ({
  userId,
  localHistory,
  onMigrationComplete,
  onDismiss,
}) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const validTests = (localHistory || []).filter(h => h && h.wpm > 0 && h.wpm <= 280);
  if (validTests.length === 0) return null;

  const handleMigrate = async () => {
    setIsMigrating(true);
    setErrorMsg(null);

    const { success, migratedCount, error } = await CloudTypingService.migrateLocalHistory(
      userId,
      validTests
    );
    setIsMigrating(false);

    if (!success) {
      setErrorMsg(error || 'Failed to migrate records. Please try again.');
      return;
    }

    setSuccessMsg(`Successfully uploaded ${migratedCount} test record${migratedCount === 1 ? '' : 's'} to your cloud account.`);
    localStorage.setItem(`typerush_migrated_${userId}`, 'true');

    setTimeout(() => {
      onMigrationComplete();
    }, 1500);
  };

  return (
    <div className="w-full mb-6 p-4 rounded-xl border border-[#FF5A00]/40 bg-[#FF5A00]/5 font-mono select-none animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF5A00]/15 text-[#FF5A00] shrink-0">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#111111] dark:text-[#F5F5F5] block">
              Migrate local history to your account?
            </span>
            <p className="text-[11px] text-[#646669] dark:text-[#A1A1A1]">
              We found {validTests.length} existing typing test record{validTests.length === 1 ? '' : 's'} saved on this browser.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {successMsg ? (
            <span className="text-xs font-bold text-[#FF5A00] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </span>
          ) : (
            <>
              <button
                onClick={handleMigrate}
                disabled={isMigrating}
                className="flex-1 sm:flex-initial px-4 py-1.5 rounded bg-[#FF5A00] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
              >
                {isMigrating ? 'Migrating...' : 'Migrate'}
              </button>

              <button
                onClick={onDismiss}
                className="px-3 py-1.5 rounded border border-[#E5E5E5] dark:border-[#222222] text-[#646669] hover:text-[#111111] dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Not Now
              </button>
            </>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mt-2 text-xs text-[#FF3B5C] flex items-center gap-1.5 font-sans">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
