import { describe, expect, it } from 'vitest'
import { ciTag, validateTag, withTag } from '../fnTag'

describe('fnTag', () => {
    // ฟังก์ชันช่วยสำหรับการทดสอบ
    const increment = (n: number) => n + 1
    const double = (n: number) => n * 2
    const toString = (n: number) => n.toString()
    const throwError = () => {
        throw new Error('Mock error')
    }

    describe('ciTag', () => {
        it('ควรส่งคืนค่าเดิมและ tag ว่างเมื่อไม่มีการเรียกใช้ฟังก์ชันใดๆ', () => {
            const result = ciTag(10)
            expect(result).toEqual({ value: 10, tag: '' })
        })

        it('ควรประมวลผลผ่านฟังก์ชันหลายตัวและส่งคืนผลลัพธ์สุดท้าย', () => {
            // ทดสอบการเรียกใช้ฟังก์ชันหลายตัว
            const result = ciTag(5, increment, double)
            // (5 + 1) * 2 = 12
            expect(result).toEqual({ value: 12, tag: '' })
        })

        it('ควรจัดการกับฟังก์ชันที่ส่งคืนผลลัพธ์ในรูปแบบ { value, tag }', () => {
            // สร้างฟังก์ชันที่ส่งคืนผลลัพธ์ในรูปแบบ { value, tag }
            const validatePositive = (n: number) => {
                return n > 0
                    ? { value: n, tag: '' }
                    : { value: undefined, tag: 'NOT_POSITIVE' }
            }

            // ทดสอบกรณีที่ผ่านการตรวจสอบ
            const successResult = ciTag(5, increment, validatePositive)
            expect(successResult).toEqual({ value: 6, tag: '' })

            // ทดสอบกรณีที่ไม่ผ่านการตรวจสอบ
            const failResult = ciTag(-5, increment, validatePositive)
            expect(failResult).toEqual({
                value: undefined,
                tag: 'NOT_POSITIVE',
            })
        })

        it('ควรหยุดการประมวลผลเมื่อพบ tag และส่งคืน tag นั้น', () => {
            // สร้างฟังก์ชันที่ส่งคืน tag
            const validateGreaterThan = (min: number) => (n: number) => {
                return n > min
                    ? { value: n, tag: '' }
                    : { value: undefined, tag: `NOT_GREATER_THAN_${min}` }
            }

            // ทดสอบการหยุดประมวลผลเมื่อพบ tag
            const result = ciTag(
                5,
                increment, // 5 + 1 = 6
                validateGreaterThan(10), // 6 ไม่มากกว่า 10 จึงส่ง tag
                double // ฟังก์ชันนี้ไม่ถูกเรียกเนื่องจากมี tag แล้ว
            )

            expect(result).toEqual({
                value: undefined,
                tag: 'NOT_GREATER_THAN_10',
            })
        })

        it('ควรจัดการกับข้อผิดพลาดที่เกิดจากฟังก์ชันในการประมวลผล', () => {
            // ทดสอบการจัดการข้อผิดพลาด
            const result = ciTag(10, increment, throwError, double)
            expect(result).toEqual({ value: undefined, tag: 'Mock error' })
        })

        it('ควรทำงานกับฟังก์ชันที่ส่งคืนค่าตามปกติและฟังก์ชันที่ส่งคืน { value, tag } ผสมกัน', () => {
            // สร้างฟังก์ชันที่ตรวจสอบเงื่อนไข
            const validateEven = (n: number) => {
                return n % 2 === 0
                    ? { value: n, tag: '' }
                    : { value: undefined, tag: 'NOT_EVEN' }
            }

            // ทดสอบกรณีที่มีการผสมฟังก์ชันทั้งสองแบบ
            const result = ciTag(
                5,
                increment, // 5 + 1 = 6
                validateEven, // 6 เป็นเลขคู่ ผ่าน
                double, // 6 * 2 = 12
                toString // 12 -> "12"
            )

            expect(result).toEqual({ value: '12', tag: '' })
        })
    })

    describe('withTag', () => {
        it('ควรส่งคืนผลลัพธ์และ tag ว่างเมื่อผ่านการตรวจสอบ', () => {
            // สร้างฟังก์ชันที่ใช้ withTag
            const isPositive = (n: number) => n > 0
            const double = (n: number) => n * 2
            const withTagPositive = withTag(double)(isPositive)('NOT_POSITIVE')

            // ทดสอบกรณีผ่านการตรวจสอบ
            const result = withTagPositive(5)
            expect(result).toEqual({ value: 10, tag: '' })
        })

        it('ควรส่งคืน undefined และ tag เมื่อไม่ผ่านการตรวจสอบ', () => {
            // สร้างฟังก์ชันที่ใช้ withTag
            const isPositive = (n: number) => n > 0
            const double = (n: number) => n * 2
            const withTagPositive = withTag(double)(isPositive)('NOT_POSITIVE')

            // ทดสอบกรณีไม่ผ่านการตรวจสอบ
            const result = withTagPositive(-5)
            expect(result).toEqual({ value: undefined, tag: 'NOT_POSITIVE' })
        })
    })

    describe('validateTag', () => {
        it('ควรส่งคืนค่าเดิมและ tag ว่างเมื่อผ่านการตรวจสอบ', () => {
            // สร้างฟังก์ชันที่ใช้ validateTag
            const isPositive = validateTag<number>((n) => n > 0)('NOT_POSITIVE')

            // ทดสอบกรณีผ่านการตรวจสอบ
            const result = isPositive(5)
            expect(result).toEqual({ value: 5, tag: '' })
        })

        it('ควรส่งคืน undefined และ tag เมื่อไม่ผ่านการตรวจสอบ', () => {
            // สร้างฟังก์ชันที่ใช้ validateTag
            const isPositive = validateTag<number>((n) => n > 0)('NOT_POSITIVE')

            // ทดสอบกรณีไม่ผ่านการตรวจสอบ
            const result = isPositive(-5)
            expect(result).toEqual({ value: undefined, tag: 'NOT_POSITIVE' })
        })

        it('ควรทำงานร่วมกับ ciTag ได้อย่างถูกต้อง', () => {
            // สร้างฟังก์ชันที่ใช้ validateTag
            const isEven = validateTag<number>((n) => n % 2 === 0)('NOT_EVEN')
            const isPositive = validateTag<number>((n) => n > 0)('NOT_POSITIVE')

            // ทดสอบการใช้งานร่วมกับ ciTag - กรณีผ่านทั้งหมด
            const successResult = ciTag(
                6, // เริ่มต้นด้วย 6
                isEven, // 6 เป็นเลขคู่ ผ่าน
                increment, // 6 + 1 = 7
                double, // 7 * 2 = 14
                isEven // 14 เป็นเลขคู่ ผ่าน
            )
            expect(successResult).toEqual({ value: 14, tag: '' })

            // ทดสอบการใช้งานร่วมกับ ciTag - กรณีไม่ผ่านตรงกลาง
            const failResult = ciTag(
                5, // เริ่มต้นด้วย 5
                isPositive, // 5 เป็นบวก ผ่าน
                isEven, // 5 ไม่เป็นเลขคู่ ไม่ผ่าน
                double // ไม่ถูกเรียกเนื่องจากมี tag แล้ว
            )
            expect(failResult).toEqual({ value: undefined, tag: 'NOT_EVEN' })
        })
    })

    // ทดสอบการใช้งานร่วมกันทั้งหมด
    describe('การใช้งานร่วมกัน', () => {
        it('ควรทำงานร่วมกันได้ระหว่าง withTag, validateTag และ ciTag', () => {
            // สร้างฟังก์ชันที่ใช้ validateTag
            const isEven = validateTag<number>((n) => n % 2 === 0)('NOT_EVEN')

            // สร้างฟังก์ชันที่ใช้ withTag
            const isPositive = (n: number) => n > 0
            const safeDouble = withTag(double)(isPositive)('NOT_POSITIVE')

            // ทดสอบการใช้งานร่วมกัน
            const result = ciTag(
                4, // เริ่มต้นด้วย 4
                isEven, // 4 เป็นเลขคู่ ผ่าน
                increment, // 4 + 1 = 5
                safeDouble, // 5 เป็นบวก * 2 = 10
                isEven // 10 เป็นเลขคู่ ผ่าน
            )
            expect(result).toEqual({ value: 10, tag: '' })
        })

        it('ควรหยุดกระบวนการที่ validateTag ตัวแรกที่ไม่ผ่าน', () => {
            const isEven = validateTag<number>((n) => n % 2 === 0)('NOT_EVEN')
            const isGreaterThan = (min: number) =>
                validateTag<number>((n) => n > min)(`NOT_GREATER_THAN_${min}`)

            const result = ciTag(
                3, // เริ่มต้นด้วย 3
                isEven, // 3 ไม่เป็นเลขคู่ ไม่ผ่าน
                isGreaterThan(10), // ไม่ถูกเรียกเนื่องจากมี tag แล้ว
                double // ไม่ถูกเรียกเนื่องจากมี tag แล้ว
            )
            expect(result).toEqual({ value: undefined, tag: 'NOT_EVEN' })
        })

        it('ควรหยุดกระบวนการที่ withTag ตัวแรกที่ไม่ผ่าน', () => {
            const isPositive = (n: number) => n > 0
            const isGreaterThan = (min: number) => (n: number) => n > min

            const safeDouble = withTag(double)(isPositive)('NOT_POSITIVE')
            const safeIncrement = withTag(increment)(isGreaterThan(10))(
                'NOT_GREATER_THAN_10'
            )

            const result = ciTag(
                5, // เริ่มต้นด้วย 5
                safeDouble, // 5 เป็นบวก * 2 = 10
                safeIncrement, // 10 ไม่มากกว่า 10 ไม่ผ่าน
                double // ไม่ถูกเรียกเนื่องจากมี tag แล้ว
            )
            expect(result).toEqual({
                value: undefined,
                tag: 'NOT_GREATER_THAN_10',
            })
        })
    })
})
