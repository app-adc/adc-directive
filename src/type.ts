export type CheckValue = 1 | 0 | -1

export type AddType<T, N> = T extends object
    ? {
          [K in keyof T]: T[K] | N
      }
    : T extends string | number
    ? T | N
    : never

export type SwPrefix<T extends string> = T extends '' ? '' : `.${T}`

export type NestedKeys<T> = (
    T extends object
        ? {
              [K in Exclude<keyof T, symbol>]: `${K}${SwPrefix<
                  NestedKeys<T[K]>
              >}`
          }[Exclude<keyof T, symbol>]
        : ''
) extends infer D
    ? Extract<D, string>
    : never

export const EnumRegExp = {
    character: /\w/,
    notCharacter: /\W/,
    number: /\d/,
    notNumber: /\D/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    thai: /\u0E00-\u0E7F/,
} as const

export type KeyRegExp = keyof typeof EnumRegExp

/**
 * Regular expressions สำหรับตรวจสอบและจัดรูปแบบข้อมูล
 * แต่ละ pattern กำหนดเป็น readonly เพื่อป้องกันการแก้ไข
 */
export const regexPatterns = {
    /** รูปแบบตัวอักษรภาษาอังกฤษ (a-z, A-Z) */
    en: /[a-zA-Z]/,

    /** รูปแบบตัวอักษรภาษาไทย (ก-ฮ, สระ, วรรณยุกต์) */
    th: /[\u0E00-\u0E7F]/,

    /** รูปแบบตัวเลข (0-9) */
    number: /\d/,

    /** รูปแบบที่ไม่ใช่ตัวเลข */
    notNumber: /\D/,

    /** รูปแบบตัวอักษรและตัวเลข (a-z, A-Z, 0-9, _) */
    character: /\w/,

    /** รูปแบบตัวเลขและจุดทศนิยม สำหรับข้อมูลการเงิน */
    finance: /^\d*\.?\d{0,2}$/,

    space: /\s/,
    /**
     * รูปแบบผสมที่อนุญาตทั้งหมด ประกอบด้วย:
     * - ตัวอักษรภาษาอังกฤษ (a-z, A-Z)
     * - ตัวอักษรภาษาไทย
     * - ตัวเลข (0-9)
     * - อักขระพิเศษ (-, /, _, ช่องว่าง)
     */
    mixed: /[a-zA-Z0-9\u0E00-\u0E7F\s\-\/_]/,
} as const

/** ประเภทของ key ที่อยู่ใน regexPatterns */
export type RegexKey = keyof typeof regexPatterns

// ตัวอย่างการใช้งาน:
// const ทดสอบ = regexPatterns.mixed.test('Hello-World/2023_ทดสอบ') // true

export type TagParam<V> = V | { value: V | undefined; tag: string }
export type TagResult<V> = { value: V | undefined; tag: string }
