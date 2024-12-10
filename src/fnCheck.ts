/*------------------------------Title---------------------------------*/
//เป็น function ที่ใช้สำหรับตรวจสอบและจะ return boolean เท่านั้น

import { toCombineText, toRegExp } from './fnTo'
import { copyDeep } from './service'

/*-------------x----------------Title-----------------x---------------*/

/**
 * @category Find Array ค้นหาค่าซ้ำ 1>ซ้ำ | 0>ไม่ซ้ำ
 * @example
 * let isCheck = checkDuplicates(items, (v) => v.name)
 * let isCheck = checkDuplicates(item, (v) => toCombineText([v.id,v.name]))
 */
export function checkItemDuplicate<T>(
    items: Readonly<T[]>,
    next: (arg: T) => any
): boolean {
    const mapItems = items.map(next)
    const uniqueValues = new Set(mapItems)

    return uniqueValues.size !== items.length
}

/**
 * ตรวจสอบว่าค่าเป็น empty string หรือไม่
 * @description array, object, map, set ที่มีข้อมูลเป็น empty จะถือว่าเป็น empty
 */
export const checkEmpty = (value: unknown): boolean => {
    const _value = copyDeep(value)
    if (_value === null || _value === undefined) {
        return true
    }

    if (typeof _value === 'string') {
        return _value.trim().length === 0
    }

    if (Array.isArray(_value)) {
        return _value.length === 0
    }

    if (_value instanceof Map || _value instanceof Set) {
        return _value.size === 0
    }

    if (typeof _value === 'object') {
        return Object.keys(_value as object).length === 0
    }

    // Numbers (including 0) and booleans are never considered empty
    if (typeof _value === 'number' || typeof _value === 'boolean') {
        return false
    }

    // For any other types, consider them non-empty
    return false
}

/**
 * ตรวจสอบว่าเป็น plain object หรือไม่
 */
export const checkObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value as object).length > 0

/**
 * ตรวจสอบว่าเป็นอีเมลหรือไม่
 * @param email - อีเมลที่ต้องการตรวจสอบ
 */
export const checkEmail = (email: Readonly<unknown>): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(toCombineText([email]))
}

export const checkNumber = (v: unknown): boolean =>
    toRegExp('number').test(String(v))

/**
 * ฟังก์ชันตรวจสอบรูปแบบวันที่ว่าถูกต้องตามที่กำหนดหรือไม่
 * @param {string} dateStr - สตริงวันที่ที่ต้องการตรวจสอบ
 * @param {string} format - รูปแบบวันที่ที่ต้องการ (ค่าเริ่มต้น: 'YYYY-MM-DD')
 * @returns {boolean} คืนค่า true ถ้าวันที่ตรงตามรูปแบบ, false ถ้าไม่ตรง
 */
export const checkFormatDate = (
    dateStr: string,
    format = 'YYYY-MM-DD'
): boolean => {
    // ตรวจสอบข้อมูลเบื้องต้น
    if (!dateStr || typeof dateStr !== 'string') {
        return false
    }
    let data = dateStr
    let regExp = /[^0-9\-\/\.]/
    // ตัดเวลาออก
    if (data.split(regExp).length > 1) {
        data = data.split(regExp)[0]
    }
    // กำหนดรูปแบบ regex สำหรับส่วนประกอบต่างๆ ของวันที่
    const patterns = {
        YYYY: '^\\d{4}$', // ปี 4 หลัก
        YY: '^\\d{2}$', // ปี 2 หลัก
        MM: '^(0[1-9]|1[0-2])$', // เดือน 01-12
        DD: '^(0[1-9]|[12]\\d|3[01])$', // วันที่ 01-31
        M: '^([1-9]|1[0-2])$', // เดือน 1-12
        D: '^([1-9]|[12]\\d|3[01])$', // วันที่ 1-31
    }

    // แยกส่วนของวันที่และรูปแบบด้วยตัวคั่น (-/.)
    const dateParts = data.split(/[-/.]/)
    const formatParts = format.toLocaleUpperCase().split(/[-/.]/)

    // ตรวจสอบว่าจำนวนส่วนประกอบตรงกันหรือไม่
    if (dateParts.length !== formatParts.length) {
        return false
    }

    // ตรวจสอบแต่ละส่วนว่าตรงตามรูปแบบที่กำหนดหรือไม่
    for (let i = 0; i < formatParts.length; i++) {
        const part = dateParts[i]
        const formatPart = formatParts[i]
        const pattern = patterns[formatPart as keyof typeof patterns]

        // ถ้าไม่มีรูปแบบที่ตรงกันหรือข้อมูลไม่ตรงตาม regex
        if (!pattern || !new RegExp(pattern).test(part)) {
            return false
        }

        // ตรวจสอบเพิ่มเติมสำหรับวันที่ โดยคำนึงถึงเดือนและปี
        if (formatPart === 'DD' || formatPart === 'D') {
            const year = parseInt(
                dateParts[formatParts.indexOf('YYYY')] ||
                    dateParts[formatParts.indexOf('YY')]
            )
            const month = parseInt(
                dateParts[formatParts.indexOf('MM')] ||
                    dateParts[formatParts.indexOf('M')]
            )
            const day = parseInt(part)

            // ตรวจสอบจำนวนวันในแต่ละเดือน
            const daysInMonth = new Date(year, month, 0).getDate()
            if (day > daysInMonth) {
                return false
            }
        }
    }

    return true
}
