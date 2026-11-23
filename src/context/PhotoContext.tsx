import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  ADMIN_EMAIL,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  ensureDataUrlWithinLimit,
  loadAllLocalPhotos,
  saveLocalPhoto,
  type CustomImageMap,
} from '../utils/imageStorage';

import firebaseConfig from '../../firebase-applet-config.json';

interface PhotoContextValue {
  photos: CustomImageMap;
  cloudPhotos: CustomImageMap;
  cloudLoaded: boolean;
  user: User | null;
  isAdmin: boolean;
  unsyncedCount: number;
  syncing: boolean;
  syncProgress: string | null;
  syncSuccess: string | null;
  syncError: string | null;
  savePhoto: (slotId: string, dataUrl: string) => Promise<void>;
  syncLocalPhotosToCloud: () => Promise<void>;
  signInAsAdmin: () => Promise<User | null>;
  signOutAdmin: () => Promise<void>;
  clearSyncNotice: () => void;
}

const PhotoContext = createContext<PhotoContextValue | null>(null);

const VALID_SLOT_ID = /^[a-zA-Z0-9_-]{1,64}$/;

function checkIsAdmin(user: User | null): boolean {
  if (!user || !user.email || !user.emailVerified) return false;
  return user.email.toLowerCase() === ADMIN_EMAIL;
}

async function fetchPublicPhotosViaRest(): Promise<CustomImageMap> {
  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents:runQuery`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'site_photos' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'isPublic' },
            op: 'EQUAL',
            value: { booleanValue: true },
          },
        },
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`REST HTTP ${response.status}`);
  }
  const rows = (await response.json()) as Array<{
    document?: {
      fields?: {
        slotId?: { stringValue?: string };
        dataUrl?: { stringValue?: string };
      };
    };
  }>;
  const result: CustomImageMap = {};
  for (const row of rows) {
    const slotId = row.document?.fields?.slotId?.stringValue;
    const dataUrl = row.document?.fields?.dataUrl?.stringValue;
    if (
      slotId &&
      VALID_SLOT_ID.test(slotId) &&
      typeof dataUrl === 'string' &&
      dataUrl.startsWith('data:image/')
    ) {
      result[slotId] = dataUrl;
    }
  }
  return result;
}

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [localPhotos, setLocalPhotos] = useState<CustomImageMap>(() => loadAllLocalPhotos());
  const [pendingOverrides, setPendingOverrides] = useState<CustomImageMap>({});
  const [cloudPhotos, setCloudPhotos] = useState<CustomImageMap>({});
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const autoSyncedRef = useRef(false);

  const isAdmin = checkIsAdmin(user);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsubscribe();
  }, []);

  // Listen to public site_photos from Firestore + fast REST fallback so published app & all visitors always stay in sync
  useEffect(() => {
    let active = true;
    let snapshotReceived = false;

    void fetchPublicPhotosViaRest()
      .then((restPhotos) => {
        if (!active || snapshotReceived) return;
        if (Object.keys(restPhotos).length > 0) {
          setCloudPhotos((prev) => ({ ...restPhotos, ...prev }));
        }
        setCloudLoaded(true);
      })
      .catch(() => {
        // Real-time SDK listener below will still populate cloudPhotos.
      });

    const photosQuery = query(
      collection(db, 'site_photos'),
      where('isPublic', '==', true)
    );

    const unsubscribe = onSnapshot(
      photosQuery,
      (snapshot) => {
        if (!active) return;
        snapshotReceived = true;
        const nextCloud: CustomImageMap = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (typeof data.dataUrl === 'string' && data.dataUrl.startsWith('data:image/')) {
            nextCloud[docSnap.id] = data.dataUrl;
          }
        });
        setCloudPhotos(nextCloud);
        setCloudLoaded(true);
      },
      (error) => {
        if (!active) return;
        setCloudLoaded(true);
        try {
          handleFirestoreError(error, OperationType.LIST, 'site_photos');
        } catch {
          // Structured error already logged for diagnostics; REST fallback keeps UI resilient.
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Merged view: existing local photos stay visible, cloud photos take precedence, pending edits show immediately
  const photos = useMemo<CustomImageMap>(() => {
    return {
      ...localPhotos,
      ...cloudPhotos,
      ...pendingOverrides,
    };
  }, [localPhotos, cloudPhotos, pendingOverrides]);

  // Detect any local photos in browser localStorage (or pending edits) that are not yet saved in Firestore
  const unsyncedEntries = useMemo(() => {
    if (!cloudLoaded) return [] as [string, string][];
    const entries: [string, string][] = [];
    const seen = new Set<string>();

    for (const [slotId, dataUrl] of Object.entries(pendingOverrides)) {
      if (VALID_SLOT_ID.test(slotId) && dataUrl.startsWith('data:image/')) {
        entries.push([slotId, dataUrl]);
        seen.add(slotId);
      }
    }

    for (const [slotId, dataUrl] of Object.entries(localPhotos)) {
      if (seen.has(slotId)) continue;
      if (!VALID_SLOT_ID.test(slotId)) continue;
      if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) continue;
      if (!cloudPhotos[slotId]) {
        entries.push([slotId, dataUrl]);
      }
    }

    return entries;
  }, [localPhotos, cloudPhotos, pendingOverrides, cloudLoaded]);

  const writeSlotToFirestore = useCallback(
    async (slotId: string, rawDataUrl: string, currentUser: User) => {
      if (!VALID_SLOT_ID.test(slotId)) {
        throw new Error(`Slot ID tidak valid: ${slotId}`);
      }
      const safeDataUrl = await ensureDataUrlWithinLimit(rawDataUrl, 960);
      const docPath = `site_photos/${slotId}`;
      try {
        await setDoc(doc(db, 'site_photos', slotId), {
          slotId,
          dataUrl: safeDataUrl,
          isPublic: true,
          updatedBy: currentUser.uid,
          updatedAt: serverTimestamp(),
        });
        setCloudPhotos((prev) => ({ ...prev, [slotId]: safeDataUrl }));
        setPendingOverrides((prev) => {
          if (!(slotId in prev)) return prev;
          const next = { ...prev };
          delete next[slotId];
          return next;
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, docPath);
      }
    },
    []
  );

  const signInAsAdmin = useCallback(async (): Promise<User | null> => {
    setSyncError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!checkIsAdmin(result.user)) {
        setSyncError(
          `Akun ${result.user.email ?? ''} bukan admin. Silakan masuk dengan akun admin (${ADMIN_EMAIL}) agar foto tersimpan ke Cloud.`
        );
        return null;
      }
      return result.user;
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code ?? '')
          : '';
      const msg = err instanceof Error ? err.message : '';
      if (
        code.includes('popup-closed-by-user') ||
        code.includes('cancelled-popup-request') ||
        msg.includes('popup-closed-by-user')
      ) {
        return null;
      }
      if (code.includes('popup-blocked')) {
        setSyncError('Popup login diblokir browser. Klik tombol Simpan ke Cloud di bawah untuk login.');
        return null;
      }
      if (code.includes('unauthorized-domain')) {
        setSyncError(
          `Domain ${window.location.hostname} belum diizinkan untuk login Google di Firebase Auth.`
        );
        return null;
      }
      setSyncError(`Gagal masuk dengan Google (${code || 'unknown'}). Silakan coba lagi.`);
      return null;
    }
  }, []);

  const signOutAdmin = useCallback(async () => {
    await signOut(auth);
  }, []);

  const syncEntries = useCallback(
    async (entries: [string, string][], adminUser: User) => {
      if (entries.length === 0) return;
      setSyncing(true);
      setSyncError(null);
      setSyncSuccess(null);

      let saved = 0;
      try {
        for (const [slotId, dataUrl] of entries) {
          saved += 1;
          setSyncProgress(`Menyimpan foto ${saved} dari ${entries.length} ke Cloud...`);
          await writeSlotToFirestore(slotId, dataUrl, adminUser);
        }
        setSyncSuccess(
          `${entries.length} foto berhasil disimpan ke Cloud dan langsung tampil saat dipublish.`
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal menyimpan foto ke Cloud.';
        if (message.includes('Quota exceeded')) {
          setSyncError('Kuota harian Firestore tercapai. Silakan coba lagi besok.');
        } else {
          setSyncError(
            'Sebagian foto gagal disimpan ke Cloud. Pastikan Anda login dengan akun admin lalu coba lagi.'
          );
        }
      } finally {
        setSyncing(false);
        setSyncProgress(null);
      }
    },
    [writeSlotToFirestore]
  );

  const syncLocalPhotosToCloud = useCallback(async () => {
    if (syncing) return;
    const activeUser = isAdmin && user ? user : await signInAsAdmin();
    if (!activeUser) return;

    const latestLocal = loadAllLocalPhotos();
    const toSyncMap = new Map<string, string>();
    for (const [slotId, dataUrl] of Object.entries(latestLocal)) {
      if (
        VALID_SLOT_ID.test(slotId) &&
        typeof dataUrl === 'string' &&
        dataUrl.startsWith('data:image/') &&
        !cloudPhotos[slotId]
      ) {
        toSyncMap.set(slotId, dataUrl);
      }
    }
    for (const [slotId, dataUrl] of Object.entries(pendingOverrides)) {
      if (VALID_SLOT_ID.test(slotId) && dataUrl.startsWith('data:image/')) {
        toSyncMap.set(slotId, dataUrl);
      }
    }

    const toSync = Array.from(toSyncMap.entries());
    if (toSync.length === 0) {
      setSyncSuccess('Semua foto sudah tersimpan di Cloud.');
      return;
    }
    await syncEntries(toSync, activeUser);
  }, [syncing, isAdmin, user, signInAsAdmin, cloudPhotos, pendingOverrides, syncEntries]);

  // If admin is already signed in and there are unsynced local photos, auto-sync once smoothly!
  useEffect(() => {
    if (isAdmin && user && cloudLoaded && unsyncedEntries.length > 0 && !syncing && !autoSyncedRef.current) {
      autoSyncedRef.current = true;
      void syncEntries(unsyncedEntries, user);
    }
  }, [isAdmin, user, cloudLoaded, unsyncedEntries, syncing, syncEntries]);

  const savePhoto = useCallback(
    async (slotId: string, dataUrl: string) => {
      setSyncError(null);
      setSyncSuccess(null);

      // 1. Always preserve immediately in localStorage + UI state so nothing is ever lost
      saveLocalPhoto(slotId, dataUrl);
      setLocalPhotos((prev) => ({ ...prev, [slotId]: dataUrl }));
      setPendingOverrides((prev) => ({ ...prev, [slotId]: dataUrl }));

      // 2. If admin is already signed in, upload immediately to Firestore Cloud.
      // Otherwise let CloudSyncBar prompt direct-click login so browsers never block the popup.
      if (!isAdmin || !user) {
        return;
      }

      setSyncing(true);
      setSyncProgress('Menyimpan foto ke Cloud...');
      try {
        await writeSlotToFirestore(slotId, dataUrl, user);
        setSyncSuccess('Foto tersimpan permanen di Cloud.');
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        if (message.includes('Quota exceeded')) {
          setSyncError('Kuota harian Firestore tercapai. Foto tetap aman di perangkat ini.');
        } else {
          setSyncError('Foto tersimpan lokal, tetapi gagal sinkron ke Cloud. Klik Simpan ke Cloud untuk mencoba lagi.');
        }
      } finally {
        setSyncing(false);
        setSyncProgress(null);
      }
    },
    [isAdmin, user, writeSlotToFirestore]
  );

  const clearSyncNotice = useCallback(() => {
    setSyncSuccess(null);
    setSyncError(null);
  }, []);

  const value = useMemo<PhotoContextValue>(
    () => ({
      photos,
      cloudPhotos,
      cloudLoaded,
      user,
      isAdmin,
      unsyncedCount: unsyncedEntries.length,
      syncing,
      syncProgress,
      syncSuccess,
      syncError,
      savePhoto,
      syncLocalPhotosToCloud,
      signInAsAdmin,
      signOutAdmin,
      clearSyncNotice,
    }),
    [
      photos,
      cloudPhotos,
      cloudLoaded,
      user,
      isAdmin,
      unsyncedEntries.length,
      syncing,
      syncProgress,
      syncSuccess,
      syncError,
      savePhoto,
      syncLocalPhotosToCloud,
      signInAsAdmin,
      signOutAdmin,
      clearSyncNotice,
    ]
  );

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
}

export function usePhotos() {
  const ctx = useContext(PhotoContext);
  if (!ctx) {
    throw new Error('usePhotos must be used within PhotoProvider');
  }
  return ctx;
}
