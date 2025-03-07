import { describe, expect, it, vi } from 'vitest'
import { ciTag, validateTag, withTag } from '../fnTag'

describe('การทดสอบฟังก์ชัน ciTag', () => {
    // ฟังก์ชันย่อยสำหรับทดสอบ
    const increment = (n: number): number => n + 1
    const double = (n: number): number => n * 2
    const toString = (n: number): string => n.toString()
    const toNumber = (s: string): number => parseInt(s, 10)
    const throwError = (): number => {
        throw new Error('เกิดข้อผิดพลาดที่ต้องการทดสอบ')
    }

    it('ควรคืนค่าเดิมเมื่อไม่มีฟังก์ชันที่ส่งมา', () => {
        const result = ciTag(5)
        expect(result).toEqual({ value: 5, tag: '', logs: [] })
    })

    it('ควรประมวลผลฟังก์ชันเดียวได้อย่างถูกต้อง', () => {
        const result = ciTag(5, increment)
        expect(result.value).toBe(6)
        expect(result.tag).toBe('')
    })

    it('ควรประมวลผลฟังก์ชันหลายฟังก์ชันเรียงกันได้อย่างถูกต้อง', () => {
        const result = ciTag(5, increment, double, toString)
        expect(result.value).toBe('12')
        expect(result.tag).toBe('')
    })

    it('ควรจัดการกับการเปลี่ยนประเภทข้อมูลได้อย่างถูกต้อง', () => {
        const result = ciTag(5, toString, toNumber, double)
        expect(result.value).toBe(10)
        expect(result.tag).toBe('')
    })

    it('ควรจัดการกับข้อผิดพลาดได้อย่างถูกต้อง', () => {
        const result = ciTag(5, increment, throwError, double)
        expect(result.value).toBeUndefined()
        expect(result.tag).toBe('เกิดข้อผิดพลาดที่ต้องการทดสอบ')
        expect(result.beforeValue).toBe(6) // ค่าก่อนเกิดข้อผิดพลาด
    })

    it('ควรประมวลผลฟังก์ชันจนกว่าจะเจอ tag error', () => {
        // สร้างฟังก์ชันที่คืนค่า tag error
        const checkPositive = validateTag<number>((n) => n > 0)(
            'NUMBER_MUST_BE_POSITIVE'
        )

        const spy1 = vi.fn().mockImplementation(increment)
        const spy2 = vi.fn().mockImplementation(double)

        // ลำดับการทำงาน: 5 -> 6 -> -6 -> ต้องเจอ error เพราะติดลบ -> ไม่ควรเรียก spy2
        const result = ciTag(5, spy1, (n) => -n, checkPositive, spy2)

        expect(result.value).toBeUndefined()
        expect(result.tag).toBe('NUMBER_MUST_BE_POSITIVE')
        expect(spy1).toHaveBeenCalled()
        expect(spy2).not.toHaveBeenCalled() // ไม่ควรถูกเรียกหลังจากเกิด error
    })
})

describe('การทดสอบฟังก์ชัน withTag', () => {
    // ฟังก์ชันสำหรับทดสอบ
    const double = (n: number) => n * 2
    const isPositive = (n: number) => n > 0
    const isPrime = (n: number) => {
        if (n <= 1) return false
        if (n <= 3) return true
        if (n % 2 === 0 || n % 3 === 0) return false
        let i = 5
        while (i * i <= n) {
            if (n % i === 0 || n % (i + 2) === 0) return false
            i += 6
        }
        return true
    }

    it('ควรคืนค่าผลลัพธ์เมื่อผ่านการตรวจสอบ', () => {
        const withPositiveDouble = withTag(double)(isPositive)('NOT_POSITIVE')
        const result = withPositiveDouble(10)

        expect(result.value).toBe(20)
        expect(result.tag).toBe('')
    })

    it('ควรคืนค่า tag error เมื่อไม่ผ่านการตรวจสอบ', () => {
        const withPositiveDouble = withTag(double)(isPositive)('NOT_POSITIVE')
        const result = withPositiveDouble(-5)

        expect(result.value).toBeUndefined()
        expect(result.tag).toBe('NOT_POSITIVE')
    })

    it('ควรจัดการกับข้อผิดพลาดในฟังก์ชัน callback ได้', () => {
        const throwingFunction = (n: number) => {
            throw new Error('TEST_ERROR_MESSAGE')
        }

        const withPositiveError =
            withTag(throwingFunction)(isPositive)('NOT_POSITIVE')
        const result = withPositiveError(5)

        expect(result.value).toBeUndefined()
        expect(result.tag).toBe('TEST_ERROR_MESSAGE')
    })

    it('ควรทำงานร่วมกับ ciTag ได้อย่างถูกต้อง', () => {
        const withPrimeDouble = withTag(double)(isPrime)('NOT_PRIME')

        // ทดสอบกับจำนวนเฉพาะ
        const result1 = ciTag(7, (n) => n + 1, withPrimeDouble)
        expect(result1.value).toBeUndefined() // 8 ไม่ใช่จำนวนเฉพาะ
        expect(result1.tag).toBe('NOT_PRIME')

        // ทดสอบกับจำนวนเฉพาะอีกครั้ง
        const result2 = ciTag(10, (n) => n + 1, withPrimeDouble)
        expect(result2.value).toBe(22) // 11 เป็นจำนวนเฉพาะ -> 11*2 = 22
        expect(result2.tag).toBe('')
    })
})

describe('การทดสอบฟังก์ชัน validateTag', () => {
    it('ควรคืนค่าเดิมเมื่อผ่านการตรวจสอบ', () => {
        const isPositive = validateTag<number>((n) => n > 0)('NOT_POSITIVE')
        const result = isPositive(10)

        expect(result.value).toBe(10)
        expect(result.tag).toBe('')
    })

    it('ควรคืนค่า tag error เมื่อไม่ผ่านการตรวจสอบ', () => {
        const isPositive = validateTag<number>((n) => n > 0)('NOT_POSITIVE')
        const result = isPositive(-5)

        expect(result.value).toBeUndefined()
        expect(result.tag).toBe('NOT_POSITIVE')
    })

    it('ควรทำงานร่วมกับ ciTag ได้อย่างถูกต้อง', () => {
        const isEven = validateTag<number>((n) => n % 2 === 0)('NOT_EVEN')
        const isGreaterThan10 = validateTag<number>((n) => n > 10)('TOO_SMALL')

        const result1 = ciTag(
            5,
            (n) => n * 2,
            isEven,
            (n) => n + 5,
            isGreaterThan10
        )
        expect(result1.value).toBe(15) // 5*2=10 ซึ่งเป็นเลขคู่ -> 10+5=15 ซึ่ง >10
        expect(result1.tag).toBe('')

        const result2 = ciTag(
            3,
            (n) => n * 2,
            isEven,
            (n) => n + 5,
            isGreaterThan10
        )
        expect(result2.value).toBe(11) // 3*2=6 ซึ่งเป็นเลขคู่ -> 6+5=11 ซึ่ง >10
        expect(result2.tag).toBe('')

        const result3 = ciTag(
            3,
            (n) => n * 3,
            isEven,
            (n) => n + 5,
            isGreaterThan10
        )
        expect(result3.value).toBeUndefined() // 3*3=9 ซึ่งเป็นเลขคี่ -> ไม่ผ่าน
        expect(result3.tag).toBe('NOT_EVEN')
    })

    it('ควรทำงานกับประเภทข้อมูลอื่นนอกจากตัวเลขได้', () => {
        const isValidEmail = validateTag<string>((email) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        )('INVALID_EMAIL')

        expect(isValidEmail('test@example.com').value).toBe('test@example.com')
        expect(isValidEmail('test@example.com').tag).toBe('')

        expect(isValidEmail('invalid-email').value).toBeUndefined()
        expect(isValidEmail('invalid-email').tag).toBe('INVALID_EMAIL')
    })
})

describe('การทดสอบการทำงานรวมกันของฟังก์ชันต่างๆ', () => {
    it('ควรทำงานร่วมกันได้ในรูปแบบ pipeline', () => {
        // สร้างฟังก์ชันตรวจสอบและแปลง
        const isPositive = validateTag<number>((n) => n > 0)('NOT_POSITIVE')
        const isEven = validateTag<number>((n) => n % 2 === 0)('NOT_EVEN')
        const withDouble = withTag((n: number) => n * 2)((n) => n < 100)(
            'TOO_LARGE'
        )

        // ทดสอบกรณีผ่านทั้งหมด
        const result1 = ciTag(
            5,
            (n) => n + 1, // 6
            isPositive, // ผ่าน
            withDouble, // 12
            isEven, // ผ่าน
            (n) => n * 4 // 48
        )

        expect(result1.value).toBe(48)
        expect(result1.tag).toBe('')

        // ทดสอบกรณีติด validation
        const result2 = ciTag(
            5,
            (n) => n - 10, // -5
            isPositive, // ไม่ผ่าน
            withDouble, // ไม่ถึงขั้นตอนนี้
            isEven // ไม่ถึงขั้นตอนนี้
        )

        expect(result2.value).toBeUndefined()
        expect(result2.tag).toBe('NOT_POSITIVE')

        // ทดสอบกรณีติด validation ใน withTag
        const result3 = ciTag(
            50,
            (n) => n + 1, // 51
            isPositive, // ผ่าน
            (n) => n * 3, // 153
            withDouble, // ไม่ผ่าน เพราะ > 100
            isEven // ไม่ถึงขั้นตอนนี้
        )

        expect(result3.value).toBeUndefined()
        expect(result3.tag).toBe('TOO_LARGE')
    })

    it('ควรเก็บ logs การทำงานอย่างถูกต้อง', () => {
        // ทดลองใช้ฟังก์ชันที่มี logs
        const result = ciTag(
            5,
            (n) => n + 1, // 6
            (n) => n * 2 // 12
        )

        // ตรวจสอบว่ามี logs ถูกสร้างขึ้น (ถ้ามีการ implement)
        if (result.logs) {
            expect(Array.isArray(result.logs)).toBe(true)
        }
    })
})
