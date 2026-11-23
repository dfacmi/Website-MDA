import { AlertCircle, CheckCircle2, CloudUpload, Loader2, X } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

export function CloudSyncBar() {
  const {
    unsyncedCount,
    syncing,
    syncProgress,
    syncSuccess,
    syncError,
    syncLocalPhotosToCloud,
    clearSyncNotice,
  } = usePhotos();

  const shouldShow = unsyncedCount > 0 || syncing || Boolean(syncSuccess) || Boolean(syncError);
  if (!shouldShow) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-40 max-w-sm w-[calc(100vw-2rem)] bg-[#0F1F1C] text-white border border-white/15 rounded-xl shadow-lg p-4 space-y-3"
    >
      {syncing && (
        <div className="flex items-start gap-3">
          <Loader2 className="w-4 h-4 text-[#7AD3B8] animate-spin shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs leading-relaxed text-[#E6ECE9]">
            <p className="font-semibold text-white">Menyinkronkan ke Cloud</p>
            <p className="text-[#B8C7C1]">{syncProgress ?? 'Menyimpan foto ke Cloud...'}</p>
          </div>
        </div>
      )}

      {!syncing && syncError && (
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-[#F5EDE1]">{syncError}</p>
          </div>
          <button
            type="button"
            onClick={clearSyncNotice}
            aria-label="Tutup pemberitahuan"
            className="text-white/70 hover:text-white p-0.5 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!syncing && !syncError && syncSuccess && unsyncedCount === 0 && (
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#7AD3B8] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-[#E6ECE9]">{syncSuccess}</p>
          </div>
          <button
            type="button"
            onClick={clearSyncNotice}
            aria-label="Tutup pemberitahuan"
            className="text-white/70 hover:text-white p-0.5 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!syncing && unsyncedCount > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <CloudUpload className="w-4 h-4 text-[#7AD3B8] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs leading-relaxed">
              <p className="font-semibold text-white">
                {unsyncedCount} foto lokal belum tersimpan di Cloud
              </p>
              <p className="text-[#B8C7C1] mt-0.5">
                Simpan ke Cloud agar semua foto yang sudah dipasang tetap muncul saat dipublish.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void syncLocalPhotosToCloud()}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#0B6B53] hover:bg-[#0E7E62] text-white transition-colors"
          >
            <CloudUpload className="w-3.5 h-3.5" aria-hidden="true" />
            Simpan {unsyncedCount} Foto ke Cloud
          </button>
        </div>
      )}
    </div>
  );
}
