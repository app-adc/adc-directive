// GlobalPageStorage.ts
import { createStorageItem } from '@/ABC/ui/http/bc-composition-http'
import type { GroupKeyForStorage, StorageItem } from './bc-type-http'

export default class GlobalPageStorage {
    private static instance: GlobalPageStorage
    public cache: Map<string, StorageItem<any>>

    private constructor() {
        this.cache = new Map()
        window.addEventListener('beforeunload', () => {
            this.clear()
        })
    }

    static getInstance(): GlobalPageStorage {
        if (!GlobalPageStorage.instance) {
            GlobalPageStorage.instance = new GlobalPageStorage()
        }
        return GlobalPageStorage.instance
    }

    // เก็บข้อมูลตาม group และ key
    set(groupKey: GroupKeyForStorage, value: any, timeToLive: number): void {
        const { key, group } = groupKey

        // สร้าง storage item
        const storageItem = createStorageItem(key, value, timeToLive)

        // อัพเดทข้อมูลเดิมหรือสร้างใหม่
        const newItemRecord = { ...this.getByGroup(group), ...storageItem }

        this.cache.set(group, newItemRecord)
    }

    // ดึงข้อมูลตาม group
    private getByGroup(group: string): StorageItem<any> {
        return this.cache.get(group) || {}
    }

    // ดึงข้อมูลตาม group และ key
    get(groupKey: GroupKeyForStorage): { data: any; expires: number } | null {
        const { key, group } = groupKey
        const item = this.cache.get(group)

        if (item && item[key]) {
            return item[key]
        }
        return null
    }

    // ลบข้อมูลตาม group
    remove(group: string): void {
        this.cache.delete(group)
    }

    // ล้างข้อมูลทั้งหมด
    clear(): void {
        this.cache.clear()
    }
}
