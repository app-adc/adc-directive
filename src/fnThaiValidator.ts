// ประเภทผลลัพธ์การตรวจสอบ (เหมือนกับ validateEmail)
type ValidationResult = {
    isValid: boolean
    message: string
}

/**
 * คำนวณ checksum ของเลข 13 หลักตามอัลกอริทึมมาตรฐานไทย
 * ใช้กับทั้งเลขบัตรประชาชนและเลขประจำตัวผู้เสียภาษี
 */
const calcChecksum = (digits: string): boolean => {
    let sum = 0
    for (let i = 0; i < 12; i++) {
        sum += parseInt(digits[i]) * (13 - i)
    }
    const checkDigit = (11 - (sum % 11)) % 10
    return checkDigit === parseInt(digits[12])
}

/**
 * ตรวจสอบเลขบัตรประชาชนไทย 13 หลัก
 * - ต้องมี 13 หลัก
 * - หลักแรกต้องไม่เป็น 0
 * - ผ่าน checksum algorithm มาตรฐาน
 *
 * @param id - เลขบัตรประชาชน (รองรับรูปแบบมีขีดคั่น)
 * @returns { isValid, message }
 *
 * @example
 * validateThaiId('1101401098891')  // → { isValid: true, message: '' }
 * validateThaiId('1234567890123')  // → { isValid: false, message: 'เลขบัตรประชาชนไม่ถูกต้อง' }
 */
export const validateThaiId = (id: string): ValidationResult => {
    if (!id) return { isValid: false, message: 'กรุณากรอกเลขบัตรประชาชน' }

    const digits = id.replace(/\D/g, '')
    if (digits.length !== 13)
        return { isValid: false, message: 'เลขบัตรประชาชนต้องมี 13 หลัก' }
    if (digits[0] === '0')
        return { isValid: false, message: 'เลขบัตรประชาชนไม่ถูกต้อง' }
    if (!calcChecksum(digits))
        return { isValid: false, message: 'เลขบัตรประชาชนไม่ถูกต้อง' }

    return { isValid: true, message: '' }
}

/**
 * ตรวจสอบหมายเลขโทรศัพท์ไทย
 * - ต้องมี 10 หลัก
 * - ต้องขึ้นต้นด้วย 0
 * - หลักที่ 2 ต้องเป็น 2-9
 *
 * @param phone - หมายเลขโทรศัพท์ (รองรับรูปแบบมีขีดคั่น เช่น 081-234-5678)
 * @returns { isValid, message }
 *
 * @example
 * validateThaiPhone('0812345678')  // → { isValid: true, message: '' }
 * validateThaiPhone('1234567890')  // → { isValid: false, message: '...' }
 */
export const validateThaiPhone = (phone: string): ValidationResult => {
    if (!phone) return { isValid: false, message: 'กรุณากรอกหมายเลขโทรศัพท์' }

    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10)
        return { isValid: false, message: 'หมายเลขโทรศัพท์ต้องมี 10 หลัก' }
    if (digits[0] !== '0')
        return {
            isValid: false,
            message: 'หมายเลขโทรศัพท์ต้องขึ้นต้นด้วย 0',
        }
    if (!/^0[2-9]/.test(digits))
        return { isValid: false, message: 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง' }

    return { isValid: true, message: '' }
}

/**
 * ตรวจสอบเลขประจำตัวผู้เสียภาษีไทย 13 หลัก
 * ใช้ได้กับทั้งบุคคลธรรมดา (เลขบัตรประชาชน) และนิติบุคคล
 * - ต้องมี 13 หลัก
 * - ผ่าน checksum algorithm มาตรฐาน
 *
 * @param taxId - เลขประจำตัวผู้เสียภาษี (รองรับรูปแบบมีขีดคั่น)
 * @returns { isValid, message }
 *
 * @example
 * validateThaiTaxId('0105556123458')  // → { isValid: true/false, message: '' }
 */
export const validateThaiTaxId = (taxId: string): ValidationResult => {
    if (!taxId)
        return { isValid: false, message: 'กรุณากรอกเลขประจำตัวผู้เสียภาษี' }

    const digits = taxId.replace(/\D/g, '')
    if (digits.length !== 13)
        return {
            isValid: false,
            message: 'เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก',
        }
    if (!calcChecksum(digits))
        return { isValid: false, message: 'เลขประจำตัวผู้เสียภาษีไม่ถูกต้อง' }

    return { isValid: true, message: '' }
}
