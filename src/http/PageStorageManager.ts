// PageStorageManager.ts
import type { GroupKeyForStorage } from './bc-type-http'
import GlobalPageStorage from './GlobalPageStorage'
import StorageManager from './StorageManager'

export default class PageStorageManager<T> extends StorageManager<T> {
    private pageStore: GlobalPageStorage

    constructor() {
        super('store')
        this.pageStore = GlobalPageStorage.getInstance()
    }

    // เก็บข้อมูลแบบเดียวกับ StorageManager
    set(groupKey: GroupKeyForStorage, value: T, timeToLive: number): void {
        this.pageStore.set(groupKey, value, timeToLive)
    }

    // ดึงข้อมูลพร้อมตรวจสอบ expires
    get(groupKey: GroupKeyForStorage): T | null {
        const item = this.pageStore.get(groupKey)

        if (!item) return null

        if (item.expires && Date.now() > item.expires) {
            this.remove(groupKey.group)
            return null
        }

        return item.data
    }

    // ลบข้อมูลตาม group
    remove(group: string): void {
        this.pageStore.remove(group)
    }

    // ล้างข้อมูลทั้งหมด
    clear(): void {
        this.pageStore.clear()
    }
}
