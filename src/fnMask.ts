// mask character หลัก
const MASK = '*'
// default mask 3 ดาว สำหรับ fallback กรณี input ไม่ถูกต้อง
const DEFAULT_MASK = MASK.repeat(3)

/**
 * ซ่อนข้อความโดยแสดงเฉพาะส่วนหน้าและส่วนหลังที่กำหนด
 * ส่วนกลางจะถูกแทนด้วย '***' เสมอ (ไม่ว่าจะมีกี่ตัวอักษร)
 * รองรับ Unicode และภาษาไทย
 *
 * @param value - ข้อความที่ต้องการซ่อน
 * @param keepStart - จำนวนอักขระที่แสดงจากด้านหน้า (default 1)
 * @param keepEnd - จำนวนอักขระที่แสดงจากด้านหลัง (default 1)
 * @returns ข้อความที่ซ่อนส่วนกลางด้วย '***'
 *
 * @example
 * maskText('password123', 2, 2) // → 'pa***23'
 * maskText('hello')              // → 'h***o'
 * maskText('สวัสดีครับ', 2, 2)  // → 'สว***ับ'
 */
export const maskText = (
    value: string,
    keepStart: number = 1,
    keepEnd: number = 1,
    countMask: number = 3
): string => {
    if (!value) return ''
    const chars = [...value] // Unicode-safe split รองรับภาษาไทย
    const len = chars.length
    const safeStart = Math.max(0, Math.min(keepStart, len))
    const safeEnd = Math.max(0, Math.min(keepEnd, len - safeStart))

    const start = chars.slice(0, safeStart).join('')
    const end = safeEnd > 0 ? chars.slice(len - safeEnd).join('') : ''
    const mask = MASK.repeat(countMask)
    return `${start}${mask}${end}`
}

/**
 * ซ่อนที่อยู่อีเมล โดยแสดงอักขระแรกของ local part และ domain ทั้งหมด
 * กรณีไม่มี @ จะแสดงอักขระแรกและครึ่งหลังของข้อความ
 *
 * @param email - ที่อยู่อีเมล
 * @returns อีเมลที่ซ่อน local part บางส่วนด้วย '***'
 *
 * @example
 * maskEmail('user@example.com') // → 'u***@example.com'
 * maskEmail('a@test.com')       // → 'a***@test.com'
 * maskEmail('notanemail')       // → 'n***email'
 */
export const maskEmail = (email: string): string => {
    if (!email) return ''
    const atIndex = email.indexOf('@')

    if (atIndex === -1) {
        // ไม่มี @ — แสดงอักขระแรกและครึ่งหลัง
        const chars = [...email]
        return maskText(email, 1, Math.floor(chars.length / 2))
    }

    const local = email.slice(0, atIndex)
    const domain = email.slice(atIndex) // รวม @ ด้วย
    return `${maskText(local, 1, 0)}${domain}`
}

/**
 * ซ่อนหมายเลขโทรศัพท์ โดยแสดง 3 ตัวแรกและ 3 ตัวหลัง
 * รองรับทั้งรูปแบบมีขีดคั่นและไม่มีขีดคั่น
 * กรณีน้อยกว่า 6 หลัก คืนค่า '***'
 *
 * @param phone - หมายเลขโทรศัพท์
 * @returns หมายเลขโทรศัพท์ที่ซ่อนส่วนกลางด้วย '***'
 *
 * @example
 * maskPhone('0812345678')   // → '081***678'
 * maskPhone('081-234-5678') // → '081***678'
 */
export const maskPhone = (phone: string): string => {
    if (!phone) return ''
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 8) return DEFAULT_MASK

    return maskText(digits, 3, 3)
}

/**
 * ซ่อนเลขบัตรประชาชนไทย (13 หลัก)
 * แสดง 4 หลักแรกและ 2 หลักสุดท้าย
 * กรณีไม่ใช่ 13 หลัก คืนค่า '***'
 *
 * @param id - เลขบัตรประชาชน 13 หลัก
 * @returns เลขบัตรที่ซ่อนส่วนกลางด้วย '***'
 *
 * @example
 * maskThaiId('1234567890123')    // → '1234***23'
 * maskThaiId('1-2345-67890-12-3') // → '1234***23'
 */
export const maskThaiId = (id: string): string => {
    if (!id) return ''
    const digits = id.replace(/\D/g, '')
    if (digits.length !== 13) return DEFAULT_MASK

    return maskText(digits, 4, 2)
}

/**
 * ซ่อนหมายเลขบัตรเครดิต แสดง 4 หลักแรกและ 4 หลักสุดท้าย
 * ส่วนกลางใช้ '********' (8 ดาว) ตามมาตรฐาน PCI-DSS
 * กรณีน้อยกว่า 8 หลัก คืนค่า '***'
 *
 * @param card - หมายเลขบัตรเครดิต (รองรับมีขีดคั่น)
 * @returns หมายเลขบัตรที่ซ่อนส่วนกลางด้วย '********'
 *
 * @example
 * maskCreditCard('4111111111111111')    // → '4111********1111'
 * maskCreditCard('4111-1111-1111-1111') // → '4111********1111'
 */
export const maskCreditCard = (card: string): string => {
    if (!card) return ''
    const digits = card.replace(/\D/g, '')
    if (digits.length < 8) return DEFAULT_MASK

    return maskText(digits, 4, 4, 8)
}
