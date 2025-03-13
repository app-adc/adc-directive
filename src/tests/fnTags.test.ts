import { describe, expect, it } from 'vitest'
import { ciTag, left, right, validateTag } from '../fnTag'

describe('Tagged Union Pattern ใน fnTag', () => {
    // ทดสอบฟังก์ชัน left และ right constructors
    describe('ฟังก์ชันสร้าง left และ right', () => {
        it('ฟังก์ชัน left ควรสร้าง object ที่มี tag เป็น "left" และ left ตามที่กำหนด', () => {
            const result = left('มีข้อผิดพลาด')
            expect(result).toEqual({
                tag: 'left',
                left: 'มีข้อผิดพลาด',
            })
        })

        it('ฟังก์ชัน right ควรสร้าง object ที่มี tag เป็น "right" และ value ตามที่กำหนด', () => {
            const value = { name: 'test', id: 1 }
            const result = right(value)
            expect(result).toEqual({
                tag: 'right',
                right: value,
            })
        })
    })

    // ทดสอบฟังก์ชัน ciTag กรณีพื้นฐาน
    describe('ฟังก์ชัน ciTag - กรณีพื้นฐาน', () => {
        it('ควรคืนค่าเริ่มต้นเมื่อไม่มีฟังก์ชันที่ส่งเข้ามา', () => {
            const initialValue = 10
            const result = ciTag(initialValue)

            expect(result).toEqual({
                value: initialValue,
                tag: 'right',
                message: '',
                beforeValue: undefined,
                logs: [],
            })
        })

        it('ควรประมวลผลฟังก์ชันเดียวที่คืนค่าปกติได้ถูกต้อง', () => {
            const initialValue = 10
            const double = (x: number) => x * 2

            const result = ciTag(initialValue, double)

            expect(result.value).toBe(20)
            expect(result.tag).toBe('right')
            expect(result.logs.length).toBe(1)
            expect(result.logs[0].input).toBe(initialValue)
            expect(result.logs[0].output).toBe(20)
        })

        it('ควรประมวลผลหลายฟังก์ชันที่ต่อเนื่องกันได้ถูกต้อง', () => {
            const initialValue = 5
            const double = (x: number) => x * 2
            const addFive = (x: number) => x + 5
            const square = (x: number) => x * x

            const result = ciTag(initialValue, double, addFive, square)

            // (5 * 2) + 5 = 15, 15 * 15 = 225
            expect(result.value).toBe(225)
            expect(result.tag).toBe('right')
            expect(result.logs.length).toBe(3)
            expect(result.logs[0].output).toBe(10) // double(5)
            expect(result.logs[1].output).toBe(15) // addFive(10)
            expect(result.logs[2].output).toBe(225) // square(15)
        })
    })

    // ทดสอบฟังก์ชัน ciTag กับ Tag pattern
    describe('ฟังก์ชัน ciTag - การใช้งานกับ Tag pattern', () => {
        it('ควรหยุดการประมวลผลเมื่อเจอ left tag และคืนค่า undefined', () => {
            const initialValue = 10
            const checkPositive = (x: number) =>
                x > 0 ? right(x) : left('ต้องเป็นค่าบวกเท่านั้น')
            const checkLessThan20 = (x: number) =>
                x < 20 ? right(x) : left('ต้องน้อยกว่า 20')
            const double = (x: number) => x * 2

            // กรณีที่ผ่านการตรวจสอบทั้งหมด
            const result1 = ciTag(10, checkPositive, checkLessThan20, double)
            expect(result1.value).toBe(20)
            expect(result1.tag).toBe('right')

            // กรณีที่ไม่ผ่านการตรวจสอบแรก
            const result2 = ciTag(-5, checkPositive, checkLessThan20, double)
            expect(result2.value).toBeUndefined()
            expect(result2.tag).toBe('left')
            expect(result2.message).toBe('ต้องเป็นค่าบวกเท่านั้น')
            expect(result2.logs.length).toBe(1)

            // กรณีที่ไม่ผ่านการตรวจสอบที่สอง
            const result3 = ciTag(25, checkPositive, checkLessThan20, double)
            expect(result3.value).toBeUndefined()
            expect(result3.tag).toBe('left')
            expect(result3.message).toBe('ต้องน้อยกว่า 20')
            expect(result3.logs.length).toBe(2)
        })

        it('ควรเก็บค่าสุดท้ายก่อนเกิด error ในฟิลด์ beforeValue', () => {
            const initialValue = 10
            const double = (x: number) => x * 2
            const checkLessThan30 = (x: number) =>
                x < 30 ? right(x) : left('ค่าต้องน้อยกว่า 30')

            const result = ciTag(initialValue, double, checkLessThan30)

            expect(result.value).toBe(20)
            expect(result.beforeValue).toBe(20) // ไม่มี error beforeValue จะเท่ากับ value

            const result2 = ciTag(20, double, checkLessThan30)
            expect(result2.value).toBeUndefined()
            expect(result2.beforeValue).toBe(40) // double(20) = 40 ซึ่งเกิน 30
        })
    })

    // ทดสอบฟังก์ชัน validateTag
    describe('ฟังก์ชัน validateTag', () => {
        it('ควรสร้างฟังก์ชันตรวจสอบที่คืนค่าในรูปแบบ Tag ได้ถูกต้อง', () => {
            // สร้างฟังก์ชันตรวจสอบว่าเป็นตัวเลขบวกหรือไม่
            const isPositive = validateTag<number>((n) => n > 0)(
                'ต้องเป็นจำนวนบวกเท่านั้น'
            )

            // ทดสอบกับค่าที่ถูกต้อง
            const resultPositive = isPositive(10)
            expect(resultPositive.tag).toBe('right')
            if (resultPositive.tag === 'right')
                expect(resultPositive.right).toBe(10)

            // ทดสอบกับค่าที่ไม่ถูกต้อง
            const resultNegative = isPositive(-5)
            expect(resultNegative.tag).toBe('left')
            if (resultNegative.tag === 'left')
                expect(resultNegative.left).toBe('ต้องเป็นจำนวนบวกเท่านั้น')
        })

        it('ควรสามารถใช้ validateTag ร่วมกับ ciTag ได้', () => {
            const isPositive = validateTag<number>((n) => n > 0)(
                'ต้องเป็นจำนวนบวกเท่านั้น'
            )
            const isEven = validateTag<number>((n) => n % 2 === 0)(
                'ต้องเป็นเลขคู่เท่านั้น'
            )
            const isLessThan100 = validateTag<number>((n) => n < 100)(
                'ต้องน้อยกว่า 100'
            )

            // ทดสอบกับชุดฟังก์ชันตรวจสอบ
            const result1 = ciTag(10, isPositive, isEven, isLessThan100)
            expect(result1.value).toBe(10)
            expect(result1.tag).toBe('right')

            const result2 = ciTag(-5, isPositive, isEven, isLessThan100)
            expect(result2.value).toBeUndefined()
            expect(result2.tag).toBe('left')
            expect(result2.message).toBe('ต้องเป็นจำนวนบวกเท่านั้น')

            const result3 = ciTag(15, isPositive, isEven, isLessThan100)
            expect(result3.value).toBeUndefined()
            expect(result3.tag).toBe('left')
            expect(result3.message).toBe('ต้องเป็นเลขคู่เท่านั้น')
        })
    })

    // ทดสอบกรณีซับซ้อน
    describe('กรณีทดสอบซับซ้อน', () => {
        it('ควรสามารถใช้งานกับ object ได้', () => {
            type User = { id: number; name: string; age: number }

            const initialUser: User = { id: 1, name: 'John', age: 25 }

            const validateName = (user: User) =>
                user.name.length > 0
                    ? right(user)
                    : left('ชื่อต้องไม่เป็นค่าว่าง')

            const validateAge = (user: User) =>
                user.age >= 18
                    ? right(user)
                    : left('อายุต้องมากกว่าหรือเท่ากับ 18')

            const incrementAge = (user: User) => ({
                ...user,
                age: user.age + 1,
            })

            const result = ciTag(
                initialUser,
                validateName,
                validateAge,
                incrementAge
            )

            expect(result.value).toEqual({ id: 1, name: 'John', age: 26 })
            expect(result.tag).toBe('right')

            // ทดสอบกับค่าที่ไม่ผ่านการตรวจสอบ
            const invalidUser: User = { id: 2, name: '', age: 16 }
            const result2 = ciTag(
                invalidUser,
                validateName,
                validateAge,
                incrementAge
            )

            expect(result2.value).toBeUndefined()
            expect(result2.tag).toBe('left')
            expect(result2.message).toBe('ชื่อต้องไม่เป็นค่าว่าง')
        })

        it('ควรสามารถใช้งานกับข้อมูลที่มีการเปลี่ยนแปลงประเภท', () => {
            // สร้างชุดฟังก์ชันที่เปลี่ยนประเภทข้อมูล
            const toString = (num: number) => num.toString()
            const appendText = (str: string) => str + ' บาท'
            const countLength = (str: string) => str.length

            // ทดสอบการเปลี่ยนประเภทข้อมูล
            const result = ciTag(1000, toString, appendText, countLength)

            expect(result.value).toBe(8) // "1000 บาท" มีความยาว 9 ตัวอักษร
            expect(result.tag).toBe('right')
            expect(result.logs.length).toBe(3)
            expect(result.logs[0].output).toBe('1000')
            expect(result.logs[1].output).toBe('1000 บาท')
            expect(result.logs[2].output).toBe(8)
        })

        it('ควรตรวจสอบการตั้งค่า tag และ message ที่เหมาะสม', () => {
            const checkValue = (value: number) => {
                if (value < 0) return left('ค่าน้อยกว่า 0')
                if (value === 0) return left('ค่าเป็น 0')
                if (value > 100) return left('ค่ามากกว่า 100')
                return right(value)
            }

            const result1 = ciTag(-10, checkValue)
            expect(result1.tag).toBe('left')
            expect(result1.message).toBe('ค่าน้อยกว่า 0')

            const result2 = ciTag(0, checkValue)
            expect(result2.tag).toBe('left')
            expect(result2.message).toBe('ค่าเป็น 0')

            const result3 = ciTag(50, checkValue)
            expect(result3.tag).toBe('right')
            expect(result3.value).toBe(50)

            const result4 = ciTag(150, checkValue)
            expect(result4.tag).toBe('left')
            expect(result4.message).toBe('ค่ามากกว่า 100')
        })

        it('ควรตรวจสอบการติดตามประวัติการประมวลผลที่ถูกต้อง', () => {
            const double = (x: number) => x * 2
            const addFive = (x: number) => x + 5
            const validatePositive = (x: number) =>
                x > 0 ? right(x) : left('ต้องเป็นค่าบวก')

            // กรณีประมวลผลสำเร็จทั้งหมด
            const result = ciTag(10, double, addFive, validatePositive)

            expect(result.logs.length).toBe(3)
            expect(result.logs[0].input).toBe(10)
            expect(result.logs[0].output).toBe(20)
            expect(result.logs[1].input).toBe(20)
            expect(result.logs[1].output).toBe(25)
            expect(result.logs[2].input).toBe(25)
            expect(result.logs[2].output).toBe(25)

            // กรณีประมวลผลไม่สำเร็จในขั้นตอนสุดท้าย
            const result2 = ciTag(10, double, addFive, (x) =>
                left('error at the end')
            )

            expect(result2.logs.length).toBe(3)
            expect(result2.logs[0].input).toBe(10)
            expect(result2.logs[0].output).toBe(20)
            expect(result2.logs[1].input).toBe(20)
            expect(result2.logs[1].output).toBe(25)
            expect(result2.logs[2].input).toBe(25)
            expect(result2.logs[2].output).toBeUndefined()
            expect(result2.logs[2].errorMessage).toBe('error at the end')
        })
    })
})
