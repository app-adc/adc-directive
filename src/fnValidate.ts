/*------------------------------Title---------------------------------*/
//   function จะ return {
//     type: 1 |  0  | 01
//     message: string
//  } เสมอ ใช้ในกรณีที่มีการตรวจสอบเข้มข้น และยังเอาไปใช้กับ dcMode()
/*-------------x----------------Title-----------------x---------------*/

import { checkEmpty, checkObject } from './fnCheck'
import { findObjectByKey } from './fnObject'
import { copyDeep } from './fnService'
import { NestedKeys } from './type'

type TypeValidate = {
    status: 1 | 0 | -1
    message: string
}

/**
 * @category ตรวจ key ใน payload เมื่อไม่พบ โปรแกรมจะหยุดการทำงาน throw new Error
 * @param payload  Object ที่ทำการตรวจสอบ
 * @param keys Array ที่ระบุ keyที่ต้องการตรวจสอบ
 * @param msgError  คำหรือ title ที่จะแสดง msgError
 * @example
 *
 * return validateObject(payload, ['id', 'distributor.id'], 'NameTitle')
 */
export function validateObject<T extends object, K extends NestedKeys<T>>(
    payload: Readonly<T>,
    keys: K[] | string[],
    msgError: string = ''
): TypeValidate {
    if (typeof payload != 'object' || !Array.isArray(keys)) {
        return {
            status: -1,
            message: 'Error Data is Invalid!!',
        }
    }
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (!findObjectByKey(payload, [key])) {
            return {
                status: 0,
                message: `!!${msgError} (${key as string} is undefined)`,
            }
        }
    }

    return {
        status: 1,
        message: '',
    }
}

// ประเภทข้อมูลสำหรับผลลัพธ์การตรวจสอบอีเมล
type ValidationEmailResult = {
    isValid: boolean
    message: string
}

/**
 * ฟังก์ชันตรวจสอบอีเมลแบบพื้นฐานด้วย regex
 * @param email - อีเมลที่ต้องการตรวจสอบ
 * @returns boolean ที่บ่งบอกว่าอีเมลถูกต้องหรือไม่
 */

/**
 * ฟังก์ชันตรวจสอบอีเมลแบบละเอียดพร้อมข้อความแจ้งเตือน
 * @param email - อีเมลที่ต้องการตรวจสอบ
 * @param options - ตัวเลือกการตรวจสอบเพิ่มเติม
 * @returns ValidationEmailResult ผลลัพธ์การตรวจสอบและข้อความ
 */
export const validateEmail = (
    email: string,
    options: {
        allowEmpty?: boolean // อนุญาตให้เป็นค่าว่างได้หรือไม่
        maxLength?: number // ความยาวสูงสุดที่ยอมรับ
        allowedDomains?: string[] // โดเมนที่อนุญาต
        blockDisposable?: boolean // บล็อกอีเมลชั่วคราวหรือไม่
    } = {}
): ValidationEmailResult => {
    // ค่าเริ่มต้นของตัวเลือก
    const {
        allowEmpty = false,
        maxLength = 254, // ตามมาตรฐาน RFC 5321
        allowedDomains = [],
        blockDisposable = false,
    } = options

    // ตรวจสอบค่าว่าง
    if (!email) {
        return {
            isValid: allowEmpty,
            message: allowEmpty ? '' : 'กรุณากรอกอีเมล',
        }
    }

    // ตรวจสอบความยาวอีเมล
    if (email.length > maxLength) {
        return {
            isValid: false,
            message: `อีเมลต้องไม่เกิน ${maxLength} ตัวอักษร`,
        }
    }

    // ตรวจสอบรูปแบบอีเมลด้วย regex ตามมาตรฐาน RFC 5322
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: 'รูปแบบอีเมลไม่ถูกต้อง',
        }
    }

    // ตรวจสอบโดเมนที่อนุญาต (ถ้ามีการระบุ)
    if (allowedDomains.length > 0) {
        const domain = email.split('@')[1]
        if (!allowedDomains.includes(domain)) {
            return {
                isValid: false,
                message: `อีเมลต้องลงท้ายด้วย ${allowedDomains.join(' หรือ ')}`,
            }
        }
    }

    // ตรวจสอบและบล็อกอีเมลชั่วคราว
    if (blockDisposable) {
        const disposableDomains = [
            'fake.com',
            'hack.com',
            'block.org',
            // เพิ่มโดเมนอีเมลชั่วคราวอื่นๆ ตามต้องการ
        ]
        const domain = email.split('@')[1]
        if (disposableDomains.includes(domain)) {
            return {
                isValid: false,
                message: 'ไม่อนุญาตให้ใช้อีเมลชั่วคราว',
            }
        }
    }

    // ผ่านการตรวจสอบทั้งหมด
    return {
        isValid: true,
        message: '',
    }
}

/**
 * ตัวอย่างการใช้งานใน Vue Component:
 *
 * import { ref, computed } from 'vue';
 * import { validateEmail } from '@/utils/validators';
 *
 * // ใน setup:
 * const email = ref('');
 * const emailError = ref('');
 *
 * // ตรวจสอบอีเมลพร้อมตัวเลือกเพิ่มเติม
 * const validateEmailInput = () => {
 *   const result = validateEmail(email.value, {
 *     allowEmpty: false, // ไม่อนุญาตให้เป็นค่าว่าง
 *     maxLength: 100,    // จำกัดความยาวสูงสุด 100 ตัวอักษร
 *     allowedDomains: ['company.com'],  // อนุญาตเฉพาะอีเมลจากโดเมนที่กำหนด
 *     blockDisposable: true  // บล็อกอีเมลชั่วคราว
 *   });
 *
 *   emailError.value = result.message;
 *   return result.isValid;
 * };
 */

/**
 * แปลงค่า empty string เป็น null ใน object
 * @param obj - Object ที่ต้องการแปลงค่า
 * @returns Object ใหม่ที่แปลงค่า empty string เป็น null แล้ว
 */
export function validatePayloadEmptyToNull<T>(obj: T): T {
    // ถ้าเป็น empty string ให้ return null

    const data = copyDeep(obj)
    if (checkEmpty(data)) return null as T

    // ถ้าเป็น array ให้ทำการ map แต่ละ item

    if (Array.isArray(data)) {
        data.map((item) => validatePayloadEmptyToNull(item)) as T
    }
    // ถ้าเป็น object ให้ทำการแปลงค่าใน properties
    if (checkObject(data)) {
        return Object.entries(data).reduce(
            (acc, [key, value]) => ({
                ...acc,
                [key]: validatePayloadEmptyToNull(value),
            }),
            {}
        ) as T
    }

    // ถ้าเป็น type อื่นๆ ให้ return ค่าเดิม
    return data
}
