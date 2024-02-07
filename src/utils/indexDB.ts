function openDB(name: string, version: number, upgradeCallback: (db: IDBDatabase) => void): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version)
    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error)
    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result)
    request.onupgradeneeded = (event) => upgradeCallback((event.target as IDBOpenDBRequest).result)
  })
}

// 保存数据
async function saveToIndexedDB(key: string, model: any) {
  const db = await openDB('modelDB', 1, (db) => {
    if (!db.objectStoreNames.contains('models')) {
      db.createObjectStore('models')
    }
  })

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['models'], 'readwrite')
    transaction.oncomplete = () => resolve('success')
    transaction.onerror = (event) => reject((event.target as IDBRequest).error)
    const store = transaction.objectStore('models')
    store.put(model, key)
  })
}

// 从indexedDB获取数据
async function checkIndexedDB(key: string): Promise<any | undefined> {
  const db = await openDB('modelDB', 1, (db) => {
    if (!db.objectStoreNames.contains('models')) {
      db.createObjectStore('models')
    }
  })

  return new Promise((resolve) => {
    const transaction = db.transaction(['models'], 'readonly')
    const store = transaction.objectStore('models')
    const request = store.get(key)
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result)
    }
    request.onerror = () => {
      resolve(undefined) // 出错时返回undefined
    }
  })
}

export { saveToIndexedDB, checkIndexedDB }
