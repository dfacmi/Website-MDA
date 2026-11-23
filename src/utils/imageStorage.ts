export const CUSTOM_IMAGES_KEY = 'mda_custom_images_v1';
export const TEACHER_PHOTOS_KEY = 'mda_teacher_photos_v1';
export const MAX_FIRESTORE_DATA_URL_LENGTH = 700000;

export type CustomImageMap = Record<string, string>;

export function loadCustomImages(): CustomImageMap {
  try {
    const raw = window.localStorage.getItem(CUSTOM_IMAGES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as CustomImageMap) : {};
  } catch {
    return {};
  }
}

export function loadTeacherPhotos(): CustomImageMap {
  try {
    const raw = window.localStorage.getItem(TEACHER_PHOTOS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as CustomImageMap) : {};
  } catch {
    return {};
  }
}

/**
 * Loads all locally saved photos (hero, about, gallery, and teacher slots)
 * into one unified slotId -> dataUrl map without modifying existing localStorage keys.
 */
export function loadAllLocalPhotos(): CustomImageMap {
  const custom = loadCustomImages();
  const teachers = loadTeacherPhotos();
  const merged: CustomImageMap = { ...custom };
  for (const [teacherId, dataUrl] of Object.entries(teachers)) {
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
      merged[`teacher_${teacherId}`] = dataUrl;
    }
  }
  return merged;
}

export function saveLocalPhoto(slotKey: string, dataUrl: string): void {
  try {
    if (slotKey.startsWith('teacher_')) {
      const teacherId = slotKey.slice('teacher_'.length);
      const current = loadTeacherPhotos();
      window.localStorage.setItem(
        TEACHER_PHOTOS_KEY,
        JSON.stringify({ ...current, [teacherId]: dataUrl })
      );
    } else {
      const current = loadCustomImages();
      window.localStorage.setItem(
        CUSTOM_IMAGES_KEY,
        JSON.stringify({ ...current, [slotKey]: dataUrl })
      );
    }
  } catch {
    // Keep in-memory state if localStorage quota is reached.
  }
}

export function saveCustomImage(slotKey: string, dataUrl: string): CustomImageMap {
  saveLocalPhoto(slotKey, dataUrl);
  return loadCustomImages();
}

export function removeCustomImage(slotKey: string): CustomImageMap {
  const current = loadCustomImages();
  const next = { ...current };
  delete next[slotKey];
  try {
    window.localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage error.
  }
  return next;
}

function renderDataUrlWithinLimit(sourceDataUrl: string, maxDimension: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('Format gambar tidak valid.'));
    img.onload = () => {
      let dimension = maxDimension;
      let quality = 0.8;
      let output = '';

      for (let attempt = 0; attempt < 5; attempt++) {
        const scale = Math.min(1, dimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Browser tidak mendukung pemrosesan gambar.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        output = canvas.toDataURL('image/jpeg', quality);
        if (output.length <= MAX_FIRESTORE_DATA_URL_LENGTH) {
          resolve(output);
          return;
        }
        dimension = Math.round(dimension * 0.8);
        quality = Math.max(0.55, quality - 0.08);
      }

      if (output.length <= MAX_FIRESTORE_DATA_URL_LENGTH) {
        resolve(output);
      } else {
        reject(new Error('Ukuran gambar terlalu besar setelah dikompresi.'));
      }
    };
    img.src = sourceDataUrl;
  });
}

export function ensureDataUrlWithinLimit(dataUrl: string, maxDimension = 960): Promise<string> {
  if (
    dataUrl.length >= 32 &&
    dataUrl.length <= MAX_FIRESTORE_DATA_URL_LENGTH &&
    (dataUrl.startsWith('data:image/jpeg;base64,') ||
      dataUrl.startsWith('data:image/png;base64,') ||
      dataUrl.startsWith('data:image/webp;base64,'))
  ) {
    return Promise.resolve(dataUrl);
  }
  return renderDataUrlWithinLimit(dataUrl, maxDimension);
}

export function compressImageFile(file: File, maxDimension = 960): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Mohon pilih file gambar (JPG, PNG, atau WebP).'));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(new Error('Ukuran gambar maksimal 12 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = () => {
      void renderDataUrlWithinLimit(String(reader.result), maxDimension)
        .then(resolve)
        .catch(reject);
    };
    reader.readAsDataURL(file);
  });
}
