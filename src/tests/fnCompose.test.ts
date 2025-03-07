import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
    withAddDate,
    withAddHour,
    withAddMinute,
    withAddMonth,
    withCombineText,
    withDateDiff,
} from '../fnCompose'
import * as momentFn from '../fnMoment'
import * as toFn from '../fnTo'

vi.mock('../fnMoment', () => ({
    dateDiff: vi.fn((a, b) => ({
        days: 5,
        hours: 2,
        minutes: 30,
        seconds: 15,
        milliseconds: 12345,
    })),
    addMonth: vi.fn((date, months) => {
        const result = new Date(date)
        result.setMonth(result.getMonth() + months)
        return result
    }),
    addDate: vi.fn((date, days) => {
        const result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
    }),
    addHour: vi.fn((date, hours) => {
        const result = new Date(date)
        result.setHours(result.getHours() + hours)
        return result
    }),
    addMinute: vi.fn((date, minutes) => {
        const result = new Date(date)
        result.setMinutes(result.getMinutes() + minutes)
        return result
    }),
}))

vi.mock('../fnTo', () => ({
    toCombineText: vi.fn((arr, delimiter) => {
        if (Array.isArray(arr)) {
            return arr.filter(Boolean).join(delimiter)
        }
        return ''
    }),
}))

describe('fnCompose.ts', () => {
    // สำหรับเตรียมข้อมูล date ที่ใช้ในการทดสอบ
    const baseDate = new Date('2023-01-01T00:00:00Z')

    describe('withDateDiff', () => {
        it('ควรส่งต่อพารามิเตอร์ไปยัง dateDiff ได้อย่างถูกต้อง', () => {
            const date1 = new Date('2023-01-01')
            const date2 = new Date('2023-01-06')

            const result = withDateDiff(date1)(date2)

            expect(momentFn.dateDiff).toHaveBeenCalledWith(date1, date2)
            expect(result).toEqual({
                days: 5,
                hours: 2,
                minutes: 30,
                seconds: 15,
                milliseconds: 12345,
            })
        })
    })

    describe('withAddMonth', () => {
        it('ควรเพิ่มเดือนได้เมื่อพารามิเตอร์แรกเป็น Date และพารามิเตอร์ที่สองเป็น number', () => {
            const result = withAddMonth(baseDate)(3)

            expect(momentFn.addMonth).toHaveBeenCalledWith(baseDate, 3)

            const expectedDate = new Date(baseDate)
            expectedDate.setMonth(expectedDate.getMonth() + 3)
            expect(result).toEqual(expectedDate)
        })

        it('ควรเพิ่มเดือนได้เมื่อพารามิเตอร์แรกเป็น number และพารามิเตอร์ที่สองเป็น Date', () => {
            const result = withAddMonth(3)(baseDate)

            expect(momentFn.addMonth).toHaveBeenCalledWith(baseDate, 3)

            const expectedDate = new Date(baseDate)
            expectedDate.setMonth(expectedDate.getMonth() + 3)
            expect(result).toEqual(expectedDate)
        })
    })

    describe('withAddDate', () => {
        it('ควรเพิ่มวันได้เมื่อพารามิเตอร์แรกเป็น Date และพารามิเตอร์ที่สองเป็น number', () => {
            const result = withAddDate(baseDate)(5)

            expect(momentFn.addDate).toHaveBeenCalledWith(baseDate, 5)

            const expectedDate = new Date(baseDate)
            expectedDate.setDate(expectedDate.getDate() + 5)
            expect(result).toEqual(expectedDate)
        })

        it('ควรเพิ่มวันได้เมื่อพารามิเตอร์แรกเป็น number และพารามิเตอร์ที่สองเป็น Date', () => {
            const result = withAddDate(5)(baseDate)

            expect(momentFn.addDate).toHaveBeenCalledWith(baseDate, 5)

            const expectedDate = new Date(baseDate)
            expectedDate.setDate(expectedDate.getDate() + 5)
            expect(result).toEqual(expectedDate)
        })
    })

    describe('withAddHour', () => {
        it('ควรเพิ่มชั่วโมงได้เมื่อพารามิเตอร์แรกเป็น Date และพารามิเตอร์ที่สองเป็น number', () => {
            const result = withAddHour(baseDate)(8)

            expect(momentFn.addHour).toHaveBeenCalledWith(baseDate, 8)

            const expectedDate = new Date(baseDate)
            expectedDate.setHours(expectedDate.getHours() + 8)
            expect(result).toEqual(expectedDate)
        })

        it('ควรเพิ่มชั่วโมงได้เมื่อพารามิเตอร์แรกเป็น number และพารามิเตอร์ที่สองเป็น Date', () => {
            const result = withAddHour(8)(baseDate)

            expect(momentFn.addHour).toHaveBeenCalledWith(baseDate, 8)

            const expectedDate = new Date(baseDate)
            expectedDate.setHours(expectedDate.getHours() + 8)
            expect(result).toEqual(expectedDate)
        })
    })

    describe('withAddMinute', () => {
        it('ควรเพิ่มนาทีได้เมื่อพารามิเตอร์แรกเป็น Date และพารามิเตอร์ที่สองเป็น number', () => {
            const result = withAddMinute(baseDate)(30)

            expect(momentFn.addMinute).toHaveBeenCalledWith(baseDate, 30)

            const expectedDate = new Date(baseDate)
            expectedDate.setMinutes(expectedDate.getMinutes() + 30)
            expect(result).toEqual(expectedDate)
        })

        it('ควรเพิ่มนาทีได้เมื่อพารามิเตอร์แรกเป็น number และพารามิเตอร์ที่สองเป็น Date', () => {
            const result = withAddMinute(30)(baseDate)

            expect(momentFn.addMinute).toHaveBeenCalledWith(baseDate, 30)

            const expectedDate = new Date(baseDate)
            expectedDate.setMinutes(expectedDate.getMinutes() + 30)
            expect(result).toEqual(expectedDate)
        })
    })

    describe('withCombineText', () => {
        beforeEach(() => {
            vi.clearAllMocks() // ล้างการเรียกใช้ฟังก์ชันเพื่อให้การเช็คการเรียกใช้ถูกต้อง
        })

        it('ควรรวมข้อความได้เมื่อพารามิเตอร์แรกเป็น array และพารามิเตอร์ที่สองเป็น string', () => {
            const array = ['Hello', 'World', 'Test']
            const delimiter = '-'

            const result = withCombineText(array)(delimiter)

            expect(toFn.toCombineText).toHaveBeenCalledWith(array, delimiter)
            expect(result).toBe('Hello-World-Test')
        })

        it('ควรรวมข้อความได้เมื่อพารามิเตอร์แรกเป็น string และพารามิเตอร์ที่สองเป็น array', () => {
            const array = ['Hello', 'World', 'Test']
            const delimiter = '-'

            const result = withCombineText(delimiter)(array)

            expect(toFn.toCombineText).toHaveBeenCalledWith(array, delimiter)
            expect(result).toBe('Hello-World-Test')
        })

        it('ควรใช้ delimiter เป็นค่าว่างเมื่อส่ง string ว่างเป็นพารามิเตอร์แรก', () => {
            vi.clearAllMocks() // ล้างการเรียกใช้ฟังก์ชันอีกครั้งเพื่อความแน่ใจ
            const array = ['Hello', 'World', 'Test']

            const result = withCombineText('')(array)

            // ตรวจสอบว่า toCombineText ถูกเรียกด้วย array และ string ว่าง
            expect(toFn.toCombineText).toHaveBeenCalledWith(array, '')
            expect(result).toBe('HelloWorldTest')
        })
    })
})
