import { mapArray } from './fnArray'
import { checkObject } from './fnCheck'
import { NestedKeys } from './type'

type Payload = Record<string, unknown>

/**
 * @category แปลง profile.name.colors[2].length เป็น array
 * @return ['profile','name','colors','2']
 * @example
 * mapToKeys("profile.name.colors[2].length")
 */
export function mapToKeys(key: Readonly<string>) {
    return key
        .replace(/\[([^\[\]]*)\]/g, '.$1.')
        .split('.')
        .filter((t) => t)
        .filter((t) => t !== 'length')
}

/**
 * @category ตรวจ key[] ใน object
 * @return boolean
 * @example
 * findObjectByKey(payload, ['saleOrderItems[0]','profile.name',])
 */
export function findObjectByKey<T extends object, K extends NestedKeys<T>>(
    payload: Readonly<T>,
    keyNames: K[] | string[]
): boolean {
    if (typeof payload != 'object' || payload == null) return false
    const keys = keyNames.map((key) => mapToKeys(key))
    let isValue: boolean = false
    for (let k = 0; k < keys.length; k++) {
        let items = keys[k]
        let data: any = payload
        for (let i = 0; i < items.length; i++) {
            data = data[items[i]]
            isValue = data !== undefined
            if (isValue == false) {
                break
            }
        }
        if (isValue == false) {
            break
        }
    }
    return isValue
}

/**
 * ออกแบบเพื่อรวมวัตถุหลายๆ ตัวเข้าด้วยกัน (รองรับจำนวนวัตถุไม่จำกัด)
ค่าในวัตถุหลังจะมีความสำคัญมากกว่าและแทนที่ค่าในวัตถุก่อนหน้า โดยไม่สนใจว่าค่าในวัตถุแรกจะเป็น undefined หรือไม่
รวมอาร์เรย์เข้าด้วยกันโดยการต่อเข้าหากันด้วย concat
 * @category รวม object ระดับ nested ให้เข้ากันในทุกระดับ
 * @returns {name:'a',profile:{color:'red',email:'email'}}
 * @example
 * mergeObject({name:'a',profile:{color:'red'}},{profile:{email:'email'}})
 */
export function mergeObject(...objects: Readonly<object[]>): Payload {
    try {
        if (!objects.length) {
            throw new Error('At least one object is required')
        }
        return mapArray(objects).reduce((prev, obj) => {
            if (checkObject(obj)) {
                Object.keys(obj).forEach((key) => {
                    const preValue = obj[key]
                    const value = prev[key]

                    if (Array.isArray(value) && Array.isArray(preValue)) {
                        prev[key] = value.concat(...preValue)
                    } else if (checkObject(value) && checkObject(preValue)) {
                        prev[key] = mergeObject(value, preValue)
                    } else {
                        prev[key] = preValue
                    }
                })
            }

            return prev
        }, {})
    } catch (error) {
        console.error('Error in mergeObject:', error)
        return {}
    }
}

/**
 * หาค่าสูงสุดจาก array ตาม property ที่กำหนด
 * @param array - array ที่ต้องการหาค่าสูงสุด
 * @param iteratee - ฟังก์ชันที่ใช้ดึงค่าที่ต้องการเปรียบเทียบ
 * @returns payload ค่าสูงสุดของ array | undefined
 */
export const payloadByMax = <T>(
    array: ReadonlyArray<T>,
    iteratee: (item: T) => number
): T | undefined => {
    if (!array.length) return undefined

    return array.reduce((max, item) => {
        return iteratee(item) > iteratee(max) ? item : max
    }, array[0])
}

/**
 * หาค่าสูงสุดจาก array ตาม property ที่กำหนด
 * @param array - array ที่ต้องการหาค่าสูงสุด
 * @param iteratee - ฟังก์ชันที่ใช้ดึงค่าที่ต้องการเปรียบเทียบ
 * @returns payload ค่าน้อยสุดของ array | undefined
 */
export const payloadByMin = <T>(
    array: ReadonlyArray<T>,
    iteratee: (item: T) => number
): T | undefined => {
    if (!array.length) return undefined

    return array.reduce((max, item) => {
        return iteratee(item) < iteratee(max) ? item : max
    }, array[0])
}

/**
 * @template T - ประเภทของวัตถุที่กำลังรวมกัน
 * @param {T} newObj - วัตถุหลัก ซึ่งอาจมีค่า undefined
 * @param {T} oldObj - วัตถุรอง ซึ่งค่าจะถูกใช้เพื่อแทนที่ค่า undefined ในวัตถุแรก
 * @returns {T} วัตถุใหม่ที่มีค่ารวมกัน
 */
export function mergeWithUndefined<T>(newObj: T, oldObj: T): T {
    // ตรวจสอบว่าทั้งสองอาร์กิวเมนต์เป็นวัตถุหรือไม่
    if (
        typeof newObj !== 'object' ||
        newObj === null ||
        typeof oldObj !== 'object' ||
        oldObj === null
    ) {
        return newObj
    }

    // สร้างสำเนาของวัตถุแรก
    const result = { ...newObj } as any

    // วนลูปผ่านทุกคีย์ในวัตถุที่สอง
    Object.keys(oldObj as object).forEach((key) => {
        const firstValue = (newObj as any)[key]
        const secondValue = (oldObj as any)[key]

        // ถ้าคีย์ไม่มีอยู่ในวัตถุแรกหรือเป็น undefined ใช้ค่าจากวัตถุที่สอง
        if (!(key in (newObj as object)) || firstValue === undefined) {
            result[key] = secondValue
        }
        // ถ้าทั้งสองค่าเป็นวัตถุ (แต่ไม่ใช่อาร์เรย์หรือ null) ให้รวมกันแบบเรียกซ้ำ
        else if (
            typeof firstValue === 'object' &&
            firstValue !== null &&
            !Array.isArray(firstValue) &&
            typeof secondValue === 'object' &&
            secondValue !== null &&
            !Array.isArray(secondValue)
        ) {
            result[key] = mergeWithUndefined(firstValue, secondValue)
        }
        // สำหรับกรณีอื่นๆ (รวมถึงอาร์เรย์) ใช้ค่าจากวัตถุแรก
    })

    return result as T
}

/**
 * เลือก key จาก object เดิม สร้างเป็น object ใหม่
 * @param obj - วัตถุที่ต้องการเลือก key
 * @param keys - array ของ key ที่ต้องการเลือก
 * @returns Output: { profile: { job: { salary: 50000 } }, finance: { salary: 60000 } }
 * @example
 * selectObject(user, ['profile.job.salary', 'finance.salary'])
 */
export function selectObject<T extends object, K extends NestedKeys<T>>(
    payload: T,
    keys: K[] | string[]
): Partial<T> {
    if (typeof payload != 'object' || payload == null) return {}
    const result: Partial<T> = {}
    let hasError = false

    keys.forEach((key) => {
        const keyParts = mapToKeys(key)
        let current: any = payload
        let currentResult: any = result

        for (let i = 0; i < keyParts.length; i++) {
            const part = keyParts[i]

            // ตรวจสอบว่า current เป็น null หรือ undefined หรือไม่
            if (current === null || current === undefined) {
                hasError = true
                console.error(`!!Error key => ${key} is Not Found`)
                break // ออกจาก loop เมื่อเจอ null ระหว่างทาง
            }

            if (current[part] !== undefined) {
                if (i === keyParts.length - 1) {
                    currentResult[part] = current[part]
                } else {
                    currentResult[part] = currentResult[part] || {}
                    currentResult = currentResult[part]
                    current = current[part]
                }
            } else {
                hasError = true
                console.error(`!!Error key => ${key} is Not Found`)
                break // ออกจาก loop เมื่อไม่พบ property
            }
        }
    })

    return hasError ? {} : result
}
