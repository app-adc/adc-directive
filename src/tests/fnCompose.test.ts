import { describe, expect, it } from 'vitest'
import {
    withAddDate,
    withAddHour,
    withAddMinute,
    withAddMonth,
    withCombineText,
    withDateDiff,
} from '../fnCompose'

describe('fnCompose.ts', () => {
    // ทดสอบฟังก์ชัน withDateDiff
    describe('withDateDiff', () => {
        it('คำนวณความแตกต่างระหว่างวันที่สองวัน', () => {
            const date1 = new Date('2024-01-01')
            const date2 = new Date('2024-01-02')

            const diff = withDateDiff(date1)(date2)

            expect(diff.days).toBe(1)
            expect(diff.hoursTotal).toBe(24)
            expect(diff.minutesTotal).toBe(24 * 60)
        })

        it('คำนวณความแตกต่างเมื่อวันที่แรกมากกว่าวันที่สอง', () => {
            const date1 = new Date('2024-01-02')
            const date2 = new Date('2024-01-01')

            const diff = withDateDiff(date1)(date2)

            expect(diff.days).toBe(1)
            expect(diff.hoursTotal).toBe(24)
        })
    })

    // ทดสอบฟังก์ชัน withAddMonth
    describe('withAddMonth', () => {
        it('เพิ่มเดือนเมื่อรับ Date และ number', () => {
            const date = new Date('2024-01-15')
            const monthsToAdd = 2

            const result = withAddMonth(date)(monthsToAdd)

            expect(result.getMonth()).toBe(2) // มีนาคม (0-based index)
            expect(result.getFullYear()).toBe(2024)
        })

        it('เพิ่มเดือนเมื่อรับ number และ Date', () => {
            const monthsToAdd = 3
            const date = new Date('2024-01-15')

            const result = withAddMonth(monthsToAdd)(date)

            expect(result.getMonth()).toBe(3) // เมษายน (0-based index)
            expect(result.getFullYear()).toBe(2024)
        })

        it('เพิ่มเดือนข้ามปี', () => {
            const date = new Date('2024-12-15')
            const monthsToAdd = 2

            const result = withAddMonth(date)(monthsToAdd)

            expect(result.getMonth()).toBe(1) // กุมภาพันธ์ปีถัดไป
            expect(result.getFullYear()).toBe(2025)
        })
    })

    // ทดสอบฟังก์ชัน withAddDate
    describe('withAddDate', () => {
        it('เพิ่มวันเมื่อรับ Date และ number', () => {
            const date = new Date('2024-01-15')
            const daysToAdd = 5

            const result = withAddDate(date)(daysToAdd)

            expect(result.getDate()).toBe(20)
            expect(result.getMonth()).toBe(0)
        })

        it('เพิ่มวันเมื่อรับ number และ Date', () => {
            const daysToAdd = 7
            const date = new Date('2024-01-28')

            const result = withAddDate(daysToAdd)(date)

            expect(result.getDate()).toBe(4)
            expect(result.getMonth()).toBe(1) // กุมภาพันธ์
        })

        it('เพิ่มวันข้ามเดือน', () => {
            const date = new Date('2024-01-30')
            const daysToAdd = 5

            const result = withAddDate(date)(daysToAdd)

            expect(result.getDate()).toBe(4)
            expect(result.getMonth()).toBe(1)
        })
    })

    // ทดสอบฟังก์ชัน withAddHour
    describe('withAddHour', () => {
        it('เพิ่มชั่วโมงเมื่อรับ Date และ number', () => {
            const date = new Date('2024-01-15T10:00:00')
            const hoursToAdd = 5

            const result = withAddHour(date)(hoursToAdd)

            expect(result.getHours()).toBe(15)
        })

        it('เพิ่มชั่วโมงเมื่อรับ number และ Date', () => {
            const hoursToAdd = 20
            const date = new Date('2024-01-15T20:00:00')

            const result = withAddHour(hoursToAdd)(date)

            expect(result.getHours()).toBe(16)
            expect(result.getDate()).toBe(16) // ข้ามวัน
        })
    })

    // ทดสอบฟังก์ชัน withAddMinute
    describe('withAddMinute', () => {
        it('เพิ่มนาทีเมื่อรับ Date และ number', () => {
            const date = new Date('2024-01-15T10:30:00')
            const minutesToAdd = 45

            const result = withAddMinute(date)(minutesToAdd)

            expect(result.getMinutes()).toBe(15)
            expect(result.getHours()).toBe(11)
        })

        it('เพิ่มนาทีเมื่อรับ number และ Date', () => {
            const minutesToAdd = 90
            const date = new Date('2024-01-15T23:00:00')

            const result = withAddMinute(minutesToAdd)(date)

            expect(result.getMinutes()).toBe(30)
            expect(result.getHours()).toBe(0)
            expect(result.getDate()).toBe(16)
        })
    })

    // ทดสอบฟังก์ชัน withCombineText
    describe('withCombineText', () => {
        it('รวมข้อความด้วยตัวคั่นเมื่อรับ array และ string', () => {
            const arr = ['Hello', 'World', '2024']
            const delimiter = '-'

            const result = withCombineText(arr)(delimiter)

            expect(result).toBe('Hello-World-2024')
        })

        it('รวมข้อความด้วยตัวคั่นเมื่อรับ string และ array', () => {
            const delimiter = '_'
            const arr = ['Test', 'Array', 'Combine']

            const result = withCombineText(delimiter)(arr)

            expect(result).toBe('Test_Array_Combine')
        })

        it('จัดการกับค่า null และ undefined ในอาร์เรย์', () => {
            const arr = ['First', null, 'Third', undefined, 'Last']
            const delimiter = ' '

            const result = withCombineText(arr)(delimiter)

            expect(result).toBe('First Third Last')
        })
    })
})
