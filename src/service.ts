/**
 * ฟังก์ชันสร้างสำเนาเชิงลึกของข้อมูล (Deep Copy)
 * - รองรับข้อมูลประเภท object, array, primitive types
 * - ป้องกัน circular reference
 * - รองรับ Date, RegExp, Map, Set
 * - ประสิทธิภาพสูงด้วยการใช้ WeakMap สำหรับเก็บ reference
 *
 * @template T - ประเภทของข้อมูลที่จะทำสำเนา
 * @param {T} source - ข้อมูลต้นฉบับที่ต้องการทำสำเนา
 * @returns {T} สำเนาของข้อมูลที่ถูกคัดลอกแบบเชิงลึก
 */
export const copyDeep = <T>(source: T): T => {
    // WeakMap สำหรับเก็บ reference เพื่อป้องกัน circular reference
    const refs = new WeakMap()

    // ฟังก์ชันภายในสำหรับทำ deep copy แบบ recursive
    const copy = (value: any): any => {
        // กรณีเป็น primitive types หรือ null/undefined
        if (value === null || typeof value !== 'object') {
            return value
        }

        // ตรวจสอบ circular reference
        if (refs.has(value)) {
            return refs.get(value)
        }

        // จัดการกรณี Date object
        if (value instanceof Date) {
            return new Date(value)
        }

        // จัดการกรณี RegExp
        if (value instanceof RegExp) {
            return new RegExp(value.source, value.flags)
        }

        // จัดการกรณี Map
        if (value instanceof Map) {
            const mapCopy = new Map()
            refs.set(value, mapCopy)
            value.forEach((val, key) => {
                mapCopy.set(copy(key), copy(val))
            })
            return mapCopy
        }

        // จัดการกรณี Set
        if (value instanceof Set) {
            const setCopy = new Set()
            refs.set(value, setCopy)
            value.forEach((val) => {
                setCopy.add(copy(val))
            })
            return setCopy
        }

        // สร้าง object หรือ array ใหม่
        const cloned = Array.isArray(value) ? [] : {}

        // เก็บ reference ของ object ที่กำลังคัดลอก
        refs.set(value, cloned)

        // คัดลอก properties ทั้งหมดแบบ recursive
        return Object.keys(value).reduce((obj: any, key: string) => {
            obj[key] = copy(value[key])
            return obj
        }, cloned)
    }

    return copy(source)
}

/**
 * สร้าง Promise ที่จะ resolve หลังจากเวลาที่กำหนด พร้อมรองรับ callback function
 *
 * @template T - ประเภทข้อมูลที่จะส่งคืน (return type)
 * @template P - ประเภทข้อมูลที่จะส่งให้ callback function
 *
 * @param ms - ระยะเวลาที่ต้องการหน่วง (มิลลิวินาที)
 * @param callbackFn - ฟังก์ชันที่จะทำงานหลังจาก delay
 * @param value - ค่าที่จะส่งให้ callback function (optional)
 *
 * @returns Promise<T | undefined> - Promise ที่จะ resolve หลังจากเวลาที่กำหนดพร้อมค่าที่ได้จาก callback
 *
 * @example
 * // การใช้งานพื้นฐาน
 * await delayPromise(1000, () => console.log('Done!'))
 *
 * // การใช้งานพร้อมส่งค่าให้ callback และรับค่ากลับ
 * const result = await delayPromise(
 *   1000,
 *   (x: number) => x * 2,
 *   5
 * ) // result = 10
 *
 * // การใช้งานใน Vue Composition API
 * const loading = ref(true)
 * await delayPromise(1000, () => {
 *   loading.value = false
 * })
 *
 * // การใช้งานกับ async callback
 * const data = await delayPromise(1000, async () => {
 *   const response = await fetch('...')
 *   return response.json()
 * })
 */
export async function delayPromise<T = void, P = void>(
    ms: number,
    callbackFn?: (value?: P) => T | Promise<T>,
    value?: P
): Promise<T | undefined> {
    // รอให้ครบเวลาที่กำหนด
    await new Promise<void>((resolve) => {
        setTimeout(resolve, ms)
    })

    try {
        // ถ้ามี callback function ให้เรียกใช้และส่งค่ากลับ
        if (callbackFn) {
            // รองรับทั้ง sync และ async callback
            return await callbackFn(value)
        }

        // ถ้าไม่มี callback ให้ return undefined
        return undefined
    } catch (error) {
        // จัดการ error จาก callback function
        console.error('Error in delay callback:', error)
        throw error // ส่ง error ต่อเพื่อให้ผู้ใช้จัดการได้
    }
}
