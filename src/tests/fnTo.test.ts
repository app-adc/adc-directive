import { describe, expect, it } from 'vitest'
import {
    toChangePositionArray,
    toCombineText,
    toConvertData,
    toCurrency,
    toHasKey,
    toNumber,
    toNumberByAverage,
    toNumberByMax,
    toNumberByMin,
    toNumberBySum,
    toPayloadByGroup,
    toPayloadByKey,
    toRandomNumber,
    toReplaceTextByRegExp,
    toUid,
} from '../fnTo'

describe('fnTo - การทดสอบฟังก์ชันในไฟล์ fnTo.ts', () => {
    // ทดสอบฟังก์ชัน toCombineText
    describe('toCombineText - รวมข้อความจาก array', () => {
        it('ควรรวมข้อความปกติได้ถูกต้อง', () => {
            expect(toCombineText(['Hello', 'World'])).toBe('Hello World')
            expect(toCombineText(['Hello', 'World'], '-')).toBe('Hello-World')
        })

        it('ควรจัดการกับค่า null และ undefined ได้', () => {
            expect(toCombineText([null, 'World', undefined])).toBe('World')
            expect(toCombineText([null, undefined])).toBe('')
        })

        it('ควรจัดการกับตัวเลขได้', () => {
            expect(toCombineText([1, 2, 3])).toBe('1 2 3')
            expect(toCombineText([1, 'two', 3], '/')).toBe('1/two/3')
        })
    })

    // ทดสอบฟังก์ชัน toHasKey
    describe('toHasKey - ลบอักขระพิเศษและแปลงเป็นตัวพิมพ์เล็ก', () => {
        it('ควรลบอักขระพิเศษและเว้นวรรคได้ถูกต้อง', () => {
            expect(toHasKey('Hello World!')).toBe('helloworld')
            expect(toHasKey('Test@123')).toBe('test123')
        })

        it('ควรจัดการกับภาษาไทยได้', () => {
            expect(toHasKey('ทดสอบ-123')).toBe('ทดสอบ123')
            expect(toHasKey('ทด_สอบ')).toBe('ทด_สอบ')
        })

        it('ควรจัดการกับค่า null และตัวเลขได้', () => {
            expect(toHasKey(null)).toBe('')
            expect(toHasKey(123)).toBe('123')
        })
    })

    // ทดสอบฟังก์ชัน toNumber
    describe('toNumber - แปลงค่าเป็นตัวเลข', () => {
        it('ควรแปลงค่าตัวเลขปกติได้', () => {
            expect(toNumber('123')).toBe(123)
            expect(toNumber(456)).toBe(456)
        })

        it('ควรจัดการกับค่าไม่ถูกต้องได้', () => {
            expect(toNumber('abc')).toBe(0)
            expect(toNumber(null)).toBe(0)
            expect(toNumber(undefined)).toBe(0)
        })

        it('ควรจัดการกับค่าทศนิยมได้', () => {
            expect(toNumber('123.45')).toBe(123.45)
            expect(toNumber(-123.45)).toBe(-123.45)
        })
    })

    // ทดสอบฟังก์ชัน toCurrency
    describe('toCurrency - จัดรูปแบบตัวเลขเป็นสกุลเงิน', () => {
        it('ควรจัดรูปแบบตัวเลขปกติได้', () => {
            expect(toCurrency(1234567, 2)).toBe('1,234,567.00')
            expect(toCurrency(1234567, 0)).toBe('1,234,567')
        })

        it('ควรจัดการกับทศนิยมได้', () => {
            expect(toCurrency(1234.5678, 2)).toBe('1,234.57')
            expect(toCurrency(1234.5678, 0)).toBe('1,235')
        })

        it('ควรจัดการกับค่าไม่ถูกต้องได้', () => {
            expect(toCurrency('abc')).toBe('0')
            expect(toCurrency(null, 2)).toBe('0.00')
        })
    })

    // ทดสอบฟังก์ชัน toRandomNumber
    describe('toRandomNumber - สุ่มตัวเลขในช่วงที่กำหนด', () => {
        it('ควรสุ่มตัวเลขในช่วงที่กำหนดได้', () => {
            const result = toRandomNumber(1, 10)
            expect(result).toBeGreaterThanOrEqual(1)
            expect(result).toBeLessThanOrEqual(10)
        })

        it('ควรจัดการกับค่าเดียวได้', () => {
            const result = toRandomNumber(100)
            expect(result).toBeGreaterThanOrEqual(0)
            expect(result).toBeLessThanOrEqual(100)
        })

        it('ควรจัดการกับค่าลบได้', () => {
            const result = toRandomNumber(-10, 10)
            expect(result).toBeGreaterThanOrEqual(-10)
            expect(result).toBeLessThanOrEqual(10)
        })
    })

    // ทดสอบฟังก์ชัน toUid
    describe('toUid - สร้างรหัสสุ่ม', () => {
        it('ควรสร้างรหัสตามความยาวที่กำหนดได้', () => {
            expect(toUid(8)).toHaveLength(8)
            expect(toUid(16)).toHaveLength(16)
        })

        it('ควรสร้างรหัสที่ไม่ซ้ำกัน', () => {
            const uid1 = toUid(10)
            const uid2 = toUid(10)
            expect(uid1).not.toBe(uid2)
        })

        it('ควรใช้อักขระที่กำหนดได้', () => {
            const result = toUid(10, '123')
            expect(result).toMatch(/^[123]{10}$/)
        })
    })

    // ทดสอบฟังก์ชัน toChangePositionArray
    describe('toChangePositionArray - สลับตำแหน่งใน array', () => {
        it('ควรสลับตำแหน่งและคงจำนวนสมาชิกเดิม', () => {
            const original = [1, 2, 3, 4, 5]
            const result = toChangePositionArray([...original])
            expect(result).toHaveLength(original.length)
            expect(result.sort()).toEqual(original.sort())
        })

        it('ควรจัดการกับ array ว่างได้', () => {
            expect(toChangePositionArray([])).toEqual([])
        })

        it('ควรจัดการกับค่าที่ไม่ใช่ array ได้', () => {
            expect(toChangePositionArray(null as any)).toEqual([])
        })
    })

    // ทดสอบฟังก์ชัน toConvertData
    describe('toConvertData - แปลง object เป็น string', () => {
        it('ควรแปลง object ปกติได้', () => {
            const obj = { name: 'test', value: 123 }
            expect(toConvertData(obj)).toBe('{name:test,value:123}')
        })

        it('ควรจัดการกับค่า null และ undefined ได้', () => {
            const obj = { a: null, b: undefined, c: 'test' }
            expect(toConvertData(obj, true)).toBe('{a:,b:,c:test}')
            expect(toConvertData(obj, false)).toBe(
                '{a:null,b:undefined,c:test}'
            )
        })
    })

    // ทดสอบฟังก์ชัน toPayloadByGroup
    describe('toPayloadByGroup - จัดกลุ่มข้อมูลตาม key', () => {
        it('ควรจัดกลุ่มข้อมูลได้ถูกต้อง', () => {
            const data = [
                { type: 'A', value: 1 },
                { type: 'B', value: 2 },
                { type: 'A', value: 3 },
            ]
            const result = toPayloadByGroup(data, (item) => item.type)
            expect(result).toEqual({
                A: [
                    { type: 'A', value: 1 },
                    { type: 'A', value: 3 },
                ],
                B: [{ type: 'B', value: 2 }],
            })
        })
    })

    // ทดสอบฟังก์ชัน toNumberByAverage
    describe('toNumberByAverage - คำนวณค่าเฉลี่ย', () => {
        it('ควรคำนวณค่าเฉลี่ยได้ถูกต้อง', () => {
            const data = [{ value: 10 }, { value: 20 }, { value: 30 }]
            expect(toNumberByAverage(data, (item) => item.value)).toBe(20)
        })

        it('ควรจัดการกับ array ว่างได้', () => {
            expect(toNumberByAverage([], (item) => item)).toBe(0)
        })
    })

    // ทดสอบฟังก์ชัน toNumberBySum
    describe('toNumberBySum - คำนวณผลรวม', () => {
        it('ควรคำนวณผลรวมได้ถูกต้อง', () => {
            const data = [{ value: 10 }, { value: 20 }, { value: 30 }]
            expect(toNumberBySum(data, (item) => item.value)).toBe(60)
        })
    })

    // ทดสอบฟังก์ชัน toPayloadByKey
    describe('toPayloadByKey - แปลง array เป็น object โดยใช้ key', () => {
        it('ควรแปลงข้อมูลได้ถูกต้อง', () => {
            const data = [
                { id: 'a', value: 1 },
                { id: 'b', value: 2 },
            ]
            expect(toPayloadByKey(data, (item) => item.id)).toEqual({
                a: { id: 'a', value: 1 },
                b: { id: 'b', value: 2 },
            })
        })
    })

    // ทดสอบฟังก์ชัน toNumberByMax และ toNumberByMin
    describe('toNumberByMax และ toNumberByMin', () => {
        const data = [{ value: 10 }, { value: 20 }, { value: 30 }]

        it('ควรหาค่าสูงสุดได้ถูกต้อง', () => {
            expect(toNumberByMax(data, (item) => item.value)).toBe(30)
        })

        it('ควรหาค่าต่ำสุดได้ถูกต้อง', () => {
            expect(toNumberByMin(data, (item) => item.value)).toBe(10)
        })
    })

    // ทดสอบฟังก์ชัน toReplaceTextByRegExp
    describe('toReplaceTextByRegExp - แทนที่ข้อความด้วย RegExp', () => {
        it('ควรแทนที่ข้อความตาม pattern ได้ถูกต้อง', () => {
            expect(toReplaceTextByRegExp('abc123', ['number'])).toBe('123')
            expect(toReplaceTextByRegExp('abc123ไทย', ['th'])).toBe('ไทย')
        })

        it('ควรจัดการกับข้อความว่างได้', () => {
            expect(toReplaceTextByRegExp('', ['number'])).toBe('')
        })

        it('ควรจัดการกับ pattern ว่างได้', () => {
            expect(toReplaceTextByRegExp('test', [])).toBe('test')
        })
    })
})
