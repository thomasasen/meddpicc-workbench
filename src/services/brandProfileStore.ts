import { validateBrandProfile, type BrandProfile } from '../report/brandProfile'

const DB_NAME = 'meddpicc-document-branding'
const STORE_NAME = 'configuration'
const KEY = 'active'

export interface StoredBrandProfile {
  revision: number
  profile: BrandProfile | null
}

export class BrandConflictError extends Error {
  constructor() {
    super('Das CI-Profil wurde in einem anderen Tab geändert. Bitte neu laden, bevor Sie speichern.')
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB ist in diesem Browser nicht verfügbar.'))
      return
    }
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('CI-Speicher kann nicht geöffnet werden.'))
    request.onblocked = () => reject(new Error('CI-Speicher ist durch einen anderen Tab blockiert.'))
  })
}

export async function loadBrandProfile(): Promise<StoredBrandProfile> {
  const db = await openDatabase()
  try {
    return await new Promise<StoredBrandProfile>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const request = transaction.objectStore(STORE_NAME).get(KEY)
      request.onsuccess = () => {
        try {
          const row = request.result as StoredBrandProfile | undefined
          if (!row) {
            resolve({ revision: 0, profile: null })
            return
          }
          if (!Number.isSafeInteger(row.revision) || row.revision < 0) throw new Error('Ungültige CI-Speicherversion.')
          resolve({ revision: row.revision, profile: row.profile === null ? null : validateBrandProfile(row.profile) })
        } catch (error) {
          reject(error)
        }
      }
      request.onerror = () => reject(request.error ?? new Error('CI-Profil konnte nicht gelesen werden.'))
    })
  } finally {
    db.close()
  }
}

/** Lesen, Versionsvergleich und Schreiben in EINER readwrite-Transaktion. */
export async function saveBrandProfile(profile: BrandProfile | null, expectedRevision: number): Promise<number> {
  if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0) throw new Error('Ungültige Speicherversion.')
  const validated = profile === null ? null : validateBrandProfile(profile)
  const db = await openDatabase()
  try {
    return await new Promise<number>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(KEY)
      const revision = expectedRevision + 1
      let conflict = false
      request.onsuccess = () => {
        const current = request.result as StoredBrandProfile | undefined
        if ((current?.revision ?? 0) !== expectedRevision) {
          conflict = true
          tx.abort()
          return
        }
        store.put({ revision, profile: validated }, KEY)
      }
      tx.oncomplete = () => resolve(revision)
      tx.onabort = () =>
        reject(
          conflict ? new BrandConflictError() : (tx.error ?? new Error('CI-Profil konnte nicht gespeichert werden.')),
        )
      tx.onerror = () => {
        /* Ablehnung erfolgt beim Abbruch; kein falscher Erfolgsstatus. */
      }
    })
  } finally {
    db.close()
  }
}
