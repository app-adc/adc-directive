/*------------------------------Title---------------------------------*/
// โหมด To แปลว่า fn จะมีค่า Default ที่ถูก return ออกไปเสมอเป็น type เดียว โดยไม่สนว่าจะจะเกิด error หรือไม่
/*-------------x----------------Title-----------------x---------------*/

import { checkNumber, checkObject } from './fnCheck'
import { copyDeep } from './service'
import { RegexKey, regexPatterns } from './type'

/**
 * @category combine Array ให้อยู่ในรูปแบบ string
 * @param prefix join dataตัวละตัวด้วย prefix /default = ' '
 * @example
 *
 * let text = toCombineText([brand, model,year],'/')
 */
export function toCombineText<T extends Array<unknown>>(
    items: Readonly<T>,
    prefix: string = ' '
): string {
    if (!Array.isArray(items)) return ''
    return items
        .filter((v) => (v && typeof v === 'string') || typeof v === 'number')
        .join(prefix)
}

/**
 * @category ลบ อักขระพิเศษ ช่องว่างออกให้เหลือ text number th . และกลายเป็นตัวเล็ก
 * @example
 *
 * dcHasKey('19-55 77_88*99 aBC') = '195577_8899abc'
 */
export function toHasKey(text: Readonly<string | number | null>): string {
    if (typeof text != 'string' && typeof text != 'number') return ''
    let str = String(text || '').replace(/[^a-zA-Z0-9_\u0E00-\u0E7F ]/g, '')
    return str.replace(/ /g, '').toLocaleLowerCase()
}

/**
 * @category เปลี่ยนจาก string เป็น number
 * @returns number | 0
 * @example
 * toNumber('123')
 */
export const toNumber = (v: unknown): number =>
    checkNumber(v) ? (Number(v) ? Number(v) : 0) : 0

/**
 * @category จัด format ตัวเลขให้แสดง comma และ decimal
 * @example
 *
 * toCurrency(3500.78,2)
 */
export function toCurrency(number: unknown, decimal: number = 0): string {
    let value = toNumber(number)
    return value.toLocaleString('en-US', {
        style: 'decimal',
        maximumFractionDigits: decimal,
        minimumFractionDigits: decimal,
    })
}

/**
 * @category random จำนวน ระหว่างจำนวน
 * @example
 *
 * dcRandom(1000,9999)
 * dcRandom(100) =  random 0 - 100
 */
export function toRandomNumber(
    number1: Readonly<number>,
    number2: Readonly<number> = 0
): number {
    const n1 = typeof number1 == 'number' ? number1 : 0
    const n2 = typeof number2 == 'number' ? number2 : 0
    const min = Math.min(n1, n2)
    const res = Math.abs(n1 - n2)
    const result = Math.round(Math.random() * res + min)
    return result || 0
}

/**
 * @category random word
 * @example
 *
 * toUid(8)
 *
 */
export function toUid(count: number = 13, character?: string): string {
    let result = ''
    let characters =
        character ||
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < count; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

/**
 * @category  สลับตำแหน่ง array  dcRandomItem(['A','B','C'])
 * @category ผลลัพธ์ ['B','C','A']
 * @example
 *
 * dcRandomItem(['A','B','C'])
 */
export function toChangePositionArray<T>(items: Readonly<T[]>): T[] {
    if (!Array.isArray(items)) return []
    for (
        let j, x, i = items.length;
        i;
        j = parseInt(Math.random() * i + ''),
            x = items[--i],
            items[i] = items[j],
            items[j] = x
    );
    return items
}

/**
 * @param content data ที่เอามาทำการ convert เป็น HasKey
 * @param allow อณุญาต(''/null/undefined)เป็นค่าเดียวกัน
 * @example
 * toConvertData(dataOriginal,true)
 */

export function toConvertData<T extends Array<T> | object>(
    content: Readonly<T>,
    allow: boolean = true
): string {
    function formatUndefined<T>(payload: T): T {
        // สร้างสำเนาข้อมูลเพื่อไม่ให้กระทบข้อมูลต้นฉบับ
        const data = copyDeep(payload)

        // ถ้าเป็น null หรือ undefined ให้แปลงเป็น string
        if (data === null) return 'null' as T
        if (data === undefined) return 'undefined' as T

        // ถ้าเป็น array ให้แปลงค่าทุกตัวใน array
        if (Array.isArray(data)) {
            return data.map((item) => formatUndefined(item)) as T
        }

        // ถ้าเป็น object ให้แปลงค่าทุก property
        if (checkObject(data)) {
            return Object.entries(data).reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [key]: formatUndefined(value),
                }),
                {}
            ) as T
        }

        // กรณีอื่นๆ ให้ return ค่าเดิม
        return data
    }
    const res = formatUndefined(content)
    if (allow) return JSON.stringify(res).replace(/'|"|null|undefined/g, '')
    else return JSON.stringify(res).replace(/'|"/g, '')
}

/**
 * จัดกลุ่ม array ตาม property ที่กำหนด
 * @param array - array ที่ต้องการจัดกลุ่ม
 * @param iteratee - ฟังก์ชันที่ใช้ดึงค่าที่ใช้จัดกลุ่ม
 * @returns object ที่จัดกลุ่มแล้ว
 */
export function toPayloadByGroup<T>(
    array: ReadonlyArray<T>,
    iteratee: (item: T) => string | number
): Record<string, T[]> {
    return array.reduce((acc: Record<string, T[]>, item) => {
        const key = String(iteratee(item))
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(item)
        return acc
    }, {})
}

/**
 * คำนวณค่าเฉลี่ยของ array ตาม property ที่กำหนด
 * @param array - array ที่ต้องการคำนวณ
 * @param iteratee - ฟังก์ชันที่ใช้ดึงค่าที่ต้องการคำนวณ
 * @returns ค่าเฉลี่ย
 */
export function toNumberByAverage<T>(
    array: ReadonlyArray<T>,
    iteratee: (item: T) => number
): number {
    if (!array.length) return 0

    const sum = array.reduce((acc, item) => acc + iteratee(item), 0)
    return sum / array.length
}

/**
 * รวมผลรวมของ array ตาม property ที่กำหนด
 * @param array - array ที่ต้องการหาผลรวม
 * @param iteratee - ฟังก์ชันที่ใช้ดึงค่าที่ต้องการหาผลรวม
 * @returns ผลรวม
 */
export function toNumberBySum<T>(
    array: ReadonlyArray<T>,
    iteratee: (item: T) => number
): number {
    return array.reduce((sum, item) => sum + iteratee(item), 0)
}

/**
 * สร้าง object จาก array โดยใช้ key ที่กำหนด
 * @param array - array ที่ต้องการแปลง
 * @param iteratee - ฟังก์ชันที่ใช้ดึงค่า key
 * @returns object ที่ใช้ key จาก iteratee
 * @description ถ้า key=>value ซ้ำ จะใช้ key=>valueล่าสุด
 */
export function toPayloadByKey<T>(
    array: ReadonlyArray<T>,
    iteratee: (item: T) => string | number
): Record<string, T> {
    return array.reduce((acc: Record<string, T>, item) => {
        acc[String(iteratee(item))] = item
        return acc
    }, {})
}

/**
 *
 * @param array
 * @param iteratee
 * @returns number
 * @description หาค่ามากสุดของ array ตาม property ที่กำหนด
 */
export function toNumberByMax<T>(
    array: ReadonlyArray<T>,
    iteratee: (item: T) => number
): number {
    if (!array.length) return 0
    return Math.max(...array.map(iteratee))
}

/**
 *
 * @param array
 * @param iteratee
 * @returns number
 * @description หาค่าน้อยสุดของ array ตาม property ที่กำหนด
 */
export function toNumberByMin<T>(
    array: ReadonlyArray<T>,
    iteratee: (item: T) => number
): number {
    if (!array.length) return 0
    return Math.min(...array.map(iteratee))
}

/**
 * สร้าง RegExp จากรูปแบบที่กำหนด
 * @param patterns รายการรูปแบบที่ต้องการ (th, en, space, number)
 * @param flag รูปแบบ flag สำหรับ RegExp (default: 'gi')
 * @returns RegExp ที่รวมรูปแบบทั้งหมด flag
 *
 * g: เหมาะสำหรับการค้นหาทั้งหมดในข้อความ
 *
 * i: เหมาะสำหรับการค้นหาโดยไม่สนใจตัวพิมพ์เล็ก/ใหญ่
 *
 * m: เหมาะสำหรับการทำงานกับข้อความหลายบรรทัด
 *
 * u: เหมาะสำหรับการทำงานกับ Unicode โดยเฉพาะภาษาไทย
 */
export const toRegExp = (
    patterns: Array<RegexKey | RegExp>,
    flags: string = 'g'
): RegExp => {
    const combinedPattern = patterns
        .map((pattern) => {
            if (pattern instanceof RegExp) {
                return pattern.source
            }
            return regexPatterns[pattern as RegexKey].source
        })
        .join('|')

    // สร้าง RegExp พร้อม flag ที่กำหนด
    return new RegExp(combinedPattern, flags)
}

/**
 * Replaces text based on specified regexp patterns
 * @param options Configuration options for text replacement
 * @returns Processed text with only allowed characters
 * @throws Error if invalid format key is provided
 */
export function toReplaceTextByRegExp(
    text: string,
    patterns: Array<RegexKey | RegExp>,
    flags: string = 'g'
): string {
    if (patterns.length === 0) return text

    // Early return for empty text
    if (!text) return ''

    try {
        // Create composite regex pattern
        const pattern = toRegExp(patterns, flags)

        // Match all allowed characters and join them
        const matches = text.match(pattern) || []
        return matches.join('')
    } catch (error) {
        console.error('Error in replaceTextByRegExp:', error)
        return text // Return original text in case of error
    }
}
