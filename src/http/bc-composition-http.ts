import type { StorageItem, TimeToLive } from '@/ABC/ui/http/bc-type-http'
import { addMinute, ci } from 'adc-directive'

// set variable
const GROUP_DEFAULT = 'anonymous'
export const TIME_TO_LIVE_DEFAULT = 15 * 60 * 1000 // 15 นาที

// Pure functions สำหรับการทำงานย่อยๆ

/**
 * กำหนดค่า default key ถ้าไม่มีการระบุ
 */
export const getDefaultKey = (key?: string) => key || 'undefined'

/**
 * กำหนดค่า default group ถ้าไม่มีการระบุ
 */
export const getDefaultGroup = (group?: string) => group || GROUP_DEFAULT

/**
 * คำนวณเวลาหมดอายุของข้อมูลใน storage
 * สามารถกำหนดเป็น:
 * - ฟังก์ชันที่ return timestamp
 * - จำนวนมิลลิวินาทีที่จะบวกเพิ่ม
 * - ถ้าไม่ระบุจะใช้ค่า default (15 นาที)
 */
export const calculateExpiryTime = (
    timeToLive?: TimeToLive,
    minute: number = TIME_TO_LIVE_DEFAULT
): number =>
    ci(timeToLive, (ttl) => {
        if (typeof ttl === 'function') return ttl()
        if (typeof ttl === 'number') return Date.now() + ttl
        return addMinute(new Date(), minute).getTime()
    })

/**
 * สร้าง storage item object ตามโครงสร้างที่กำหนด
 * ประกอบด้วย data และเวลาหมดอายุ
 */
export const createStorageItem = <T>(
    key: string,
    value: T,
    expires: number
): StorageItem<T> => ({
    [key]: {
        data: value,
        expires,
    },
})
