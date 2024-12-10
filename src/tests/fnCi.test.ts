import { describe, expect, it } from 'vitest'
import { chunkArray, mapArray } from '../fnArray'
import { checkEmpty, checkObject } from '../fnCheck'
import { ci, withCi } from '../fnCi'
import { addDate, addHour, addMinute, dateToCombine } from '../fnMoment'
import { toCombineText, toCurrency } from '../fnTo'

describe('ทดสอบฟังก์ชัน ci (Compose/Chain functions)', () => {
    describe('การทดสอบพื้นฐาน', () => {
        const addOne = (x: number) => x + 1
        const multiplyByTwo = (x: number) => x * 2
        const toString = (x: number) => `Number is ${x}`

        it('ควรส่งคืนค่าเดิมเมื่อมีแค่ค่าเดียว', () => {
            expect(ci(5)).toBe(5)
            expect(ci('test')).toBe('test')
        })

        it('ควรทำงานกับฟังก์ชันเดียวได้ถูกต้อง', () => {
            expect(ci(5, addOne)).toBe(6)
            expect(ci(5, multiplyByTwo)).toBe(10)
        })
    })

    describe('การทดสอบกับฟังก์ชัน fnTo', () => {
        it('ควรทำงานกับ toCurrency ได้ถูกต้อง', () => {
            expect(ci(1234.56, (n) => toCurrency(n, 2))).toBe('1,234.56')
            expect(
                ci(
                    1234.56,
                    (n) => toCurrency(n, 0),
                    (s) => `Price: ${s}`
                )
            ).toBe('Price: 1,235')
        })

        it('ควรทำงานกับ toCombineText ได้ถูกต้อง', () => {
            const items = ['Hello', 'World', '2024']
            const res = ci(
                items,
                (arr) => toCombineText(arr, '-'),
                (s) => s.toLocaleLowerCase()
            )
            expect(res).toBe('hello-world-2024')
        })
    })

    describe('การทดสอบกับฟังก์ชัน fnMoment', () => {
        it('ควรทำงานกับฟังก์ชันจัดการวันที่ได้ถูกต้อง', () => {
            const testDate = new Date('2024-01-01 00:00:00')

            const result = ci(
                testDate,
                (d) => addHour(d, 2),
                (d) => addMinute(d, 30),
                (d) => addDate(d, 1),
                dateToCombine
            )
            expect(result.valueOfDate).toBe('2024-01-02')
            expect(result.hour).toBe('02')
            expect(result.minute).toBe('30')
        })
    })

    describe('การทดสอบกับฟังก์ชัน fnArray', () => {
        it('ควรทำงานกับ mapArray และ chunkArray ได้ถูกต้อง', () => {
            const nestedArray = [1, [2, 3, [4, 5]], 6]

            const result = ci(nestedArray, mapArray, (arr) =>
                chunkArray(arr, 2)
            )

            expect(result).toEqual([
                [1, 2],
                [3, 4],
                [5, 6],
            ])
        })
    })

    describe('การทดสอบกับฟังก์ชันตรวจสอบ (Check functions)', () => {
        it('ควรทำงานกับ checkEmpty และ checkObject ได้ถูกต้อง', () => {
            const testObj = { name: 'John', age: 30 }

            expect(ci(testObj, checkObject)).toBe(true)
            expect(ci({}, checkEmpty)).toBe(true)
            expect(ci(testObj, checkEmpty)).toBe(false)
        })
    })
})

describe('ทดสอบฟังก์ชัน withCi กับฟังก์ชันในโปรเจค', () => {
    describe('การทดสอบกับการจัดการข้อความ', () => {
        it('ควรสร้างฟังก์ชันจัดการข้อความที่ซับซ้อนได้', () => {
            const formatPrice = withCi(
                (price: number) => toCurrency(price, 2),
                (formatted) => `${formatted} บาท`
            )

            expect(formatPrice(1234.567)).toBe('1,234.57 บาท')
        })

        it('ควรจัดการกับการรวมข้อความและแปลงรูปแบบได้', () => {
            const formatUserInfo = withCi(
                (firstName: string, lastName: string, age: number) =>
                    toCombineText([firstName, lastName, age.toString()], ' '),
                (s) => `User: ${s}`,
                (s) => s.toLocaleLowerCase()
            )
            expect(formatUserInfo('John', 'Doe', 30)).toBe('user: john doe 30')
        })
    })

    describe('การทดสอบกับการจัดการวันที่', () => {
        it('ควรสร้างฟังก์ชันจัดการวันที่ที่ซับซ้อนได้', () => {
            const formatFutureDate = withCi(
                (date: Date) => addDate(date, 7),
                (d) => addHour(d, 12),
                dateToCombine,
                (d) => d.valueOfValue
            )

            const testDate = new Date('2024-01-01T00:00:00')
            expect(formatFutureDate(testDate)).toBe('2024-01-08 12:00:00')
        })
    })

    describe('การทดสอบกับการจัดการ Array', () => {
        it('ควรจัดการกับการแปลง Array ที่ซับซ้อนได้', () => {
            const processArray = withCi(
                (arr: any[]) => mapArray(arr),
                (arr) => chunkArray(arr, 3),
                (chunks) => chunks.map((chunk) => toCombineText(chunk, '-'))
            )

            const input = [1, [2, 3], [4, [5, 6]]]
            expect(processArray(input)).toEqual(['1-2-3', '4-5-6'])
        })
    })
})
