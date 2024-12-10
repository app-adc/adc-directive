import { createStorageItem } from './bc-composition-http'
import type {
    GroupKeyForStorage,
    StorageItem,
    StorageType,
} from './bc-type-http'

// Storage Manager Class สำหรับจัดการ storage แต่ละประเภท
export default class StorageManager<T> {
    private readonly storageType?: StorageType
    private cache = new Map<string, StorageItem<T>>()

    constructor(storageType: StorageType) {
        this.storageType = storageType
    }

    // เก็บข้อมูลลง storage
    set(groupKey: GroupKeyForStorage, value: T, timeToLive: number): void {
        const { key, group } = groupKey
        const storageItem = createStorageItem(key, value, timeToLive)
        const newItemRecord = { ...this.getByGroup(group), ...storageItem }

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
        let item: StorageItem<T> | null = null
        const { key, group } = groupKey
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

        if (item && item[key]) {
            const expires = item[key].expires
            if (expires && Date.now() > expires) {
                // เมื่อข้อมูลหมดอายุ ให้ลบข้อมูลออกจาก storage ด้วน group
                this.remove(group)
                return null
            }
            return item[key].data
        }

        return null
    }

    // ลบข้อมูลออกจาก storage
    remove(group: string): void {
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

    // ล้างข้อมูลทั้งหมดใน storage
    clear(): void {
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
