import { createStorageItem } from './composition-http'
import type { GroupKeyForStorage, StorageItem, StorageType } from './type-http'

// Storage Manager Class สำหรับจัดการ storage แต่ละประเภท
export default class StorageManager<T> {
    private readonly storageType: StorageType
    private readonly _isClient: boolean = typeof window !== 'undefined'
    private cache = new Map<string, StorageItem<T>>()

    constructor(storageType: StorageType) {
        this.storageType = storageType
    }

    // เก็บข้อมูลลง storage
    set(groupKey: GroupKeyForStorage, value: T, timeToLive: number): void {
        const { key, group } = groupKey
        const storageItem = createStorageItem(key, value, timeToLive)
        const newItemRecord = { ...this.getByGroup(group), ...storageItem }

        if (!this._isClient) {
            this.cache.set(group, newItemRecord)
            return
        }

        switch (this.storageType) {
            case 'localStorage':
                localStorage.setItem(group, JSON.stringify(newItemRecord))
                break
            case 'session':
                sessionStorage.setItem(group, JSON.stringify(newItemRecord))
                break
            default:
                this.cache.set(group, newItemRecord)
        }
    }

    private getByGroup(group: string): StorageItem<T> {
        if (!this._isClient) {
            return this.cache.get(group) || {}
        }

        let item: StorageItem<T> | null = null
        switch (this.storageType) {
            case 'localStorage': {
                const stored = localStorage.getItem(group)
                item = stored ? JSON.parse(stored) : null
                break
            }
            case 'session': {
                const stored = sessionStorage.getItem(group)
                item = stored ? JSON.parse(stored) : null
                break
            }
            default:
                item = this.cache.get(group) || null
        }
        return item || {}
    }

    // ดึงข้อมูลจาก storage
    get(groupKey: GroupKeyForStorage): T | null {
        const { key, group } = groupKey
        let item: StorageItem<T> | null = null

        if (!this._isClient) {
            item = this.cache.get(group) || null
        } else {
            switch (this.storageType) {
                case 'localStorage': {
                    const stored = localStorage.getItem(group)
                    item = stored ? JSON.parse(stored) : null
                    break
                }
                case 'session': {
                    const stored = sessionStorage.getItem(group)
                    item = stored ? JSON.parse(stored) : null
                    break
                }
                default:
                    item = this.cache.get(group) || null
            }
        }

        if (item && item[key]) {
            const expires = item[key].expires
            if (expires && Date.now() > expires) {
                // ลบเฉพาะ key ที่หมดอายุ ไม่ลบทั้ง group
                this.removeKey(group, key)
                return null
            }
            return item[key].data
        }

        return null
    }

    // ลบข้อมูลออกจาก storage ทั้ง group
    remove(group: string): void {
        if (!this._isClient) {
            this.cache.delete(group)
            return
        }

        switch (this.storageType) {
            case 'localStorage':
                localStorage.removeItem(group)
                break
            case 'session':
                sessionStorage.removeItem(group)
                break
            default:
                this.cache.delete(group)
        }
    }

    // ลบเฉพาะ key ที่ระบุออกจาก group โดยไม่กระทบ key อื่นใน group เดียวกัน
    private removeKey(group: string, key: string): void {
        if (!this._isClient) {
            const item = this.cache.get(group)
            if (item) {
                delete item[key]
                Object.keys(item).length === 0
                    ? this.cache.delete(group)
                    : this.cache.set(group, item)
            }
            return
        }

        switch (this.storageType) {
            case 'localStorage': {
                const stored = localStorage.getItem(group)
                if (!stored) break
                const item: StorageItem<T> = JSON.parse(stored)
                delete item[key]
                Object.keys(item).length === 0
                    ? localStorage.removeItem(group)
                    : localStorage.setItem(group, JSON.stringify(item))
                break
            }
            case 'session': {
                const stored = sessionStorage.getItem(group)
                if (!stored) break
                const item: StorageItem<T> = JSON.parse(stored)
                delete item[key]
                Object.keys(item).length === 0
                    ? sessionStorage.removeItem(group)
                    : sessionStorage.setItem(group, JSON.stringify(item))
                break
            }
            default: {
                const item = this.cache.get(group)
                if (item) {
                    delete item[key]
                    Object.keys(item).length === 0
                        ? this.cache.delete(group)
                        : this.cache.set(group, item)
                }
            }
        }
    }

    // ล้างข้อมูลทั้งหมดใน storage
    clear(): void {
        if (!this._isClient) {
            this.cache.clear()
            return
        }

        switch (this.storageType) {
            case 'localStorage':
                localStorage.clear()
                break
            case 'session':
                sessionStorage.clear()
                break
            default:
                this.cache.clear()
        }
    }
}
