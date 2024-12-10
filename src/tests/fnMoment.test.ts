import { describe, expect, it } from 'vitest'
import {
    addDate,
    addHour,
    addMinute,
    addMonth,
    dateDiff,
    dateDiffToString,
    dateToCombine,
} from '../fnMoment'

describe('fnMoment', () => {
    // ทดสอบฟังก์ชัน dateDiff
    describe('dateDiff', () => {
        it('ควรคำนวณความแตกต่างระหว่างวันที่ได้ถูกต้อง', () => {
            const date1 = new Date('2024-01-01 10:00:00')
            const date2 = new Date('2024-01-02 12:30:45')

            const result = dateDiff(date1, date2)

            expect(result.days).toBe(1)
            expect(result.hours).toBe(2) // ชั่วโมงที่เหลือหลังจากหักวันออก
            expect(result.hoursTotal).toBe(26) // ชั่วโมงทั้งหมด
            expect(result.minutes).toBe(30) // นาทีที่เหลือหลังจากหักชั่วโมงออก
            expect(result.minutesTotal).toBe(1590) // นาทีทั้งหมด
            expect(result.seconds).toBe(45) // วินาทีที่เหลือหลังจากหักนาทีออก
        })

        it('ควรคำนวณความแตกต่างเมื่อวันที่ย้อนหลังได้ถูกต้อง', () => {
            const date1 = new Date('2024-01-02 12:30:45')
            const date2 = new Date('2024-01-01 10:00:00')

            const result = dateDiff(date1, date2)

            expect(result.days).toBe(1)
            expect(result.hours).toBe(2)
            expect(result.hoursTotal).toBe(26)
        })

        it('ควร throw error เมื่อ input ไม่ใช่ Date object', () => {
            expect(() => dateDiff('invalid date' as any)).toThrow(
                'Invalid date input'
            )
        })
    })

    // ทดสอบฟังก์ชัน dateDiffToString
    describe('dateDiffToString', () => {
        it('ควรแสดงผลเป็นภาษาไทยได้ถูกต้อง', () => {
            const now = new Date()
            const pastYear = new Date(
                now.getFullYear() - 1,
                now.getMonth(),
                now.getDate()
            )
            const pastMonth = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate()
            )
            const pastDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - 1
            )
            const pastHour = new Date(now.getTime() - 60 * 60 * 1000)
            const pastMinute = new Date(now.getTime() - 60 * 1000)

            expect(dateDiffToString(pastYear, now, 'th')).toBe('1 ปีที่แล้ว')
            expect(dateDiffToString(pastMonth, now, 'th')).toBe(
                '1 เดือนที่แล้ว'
            )
            expect(dateDiffToString(pastDay, now, 'th')).toBe('1 วันที่แล้ว')
            expect(dateDiffToString(pastHour, now, 'th')).toBe(
                '1 ชั่วโมงที่แล้ว'
            )
            expect(dateDiffToString(pastMinute, now, 'th')).toBe(
                '1 นาทีที่แล้ว'
            )
        })

        it('ควรแสดงผลเป็นภาษาอังกฤษได้ถูกต้อง', () => {
            const now = new Date()
            const pastYear = new Date(
                now.getFullYear() - 1,
                now.getMonth(),
                now.getDate()
            )

            expect(dateDiffToString(pastYear, now, 'en')).toBe('1 year ago')
        })

        it('ควรแสดงผล "เมื่อสักครู่" สำหรับเวลาน้อยกว่า 1 นาที', () => {
            const now = new Date()
            const justNow = new Date(now.getTime() - 30000) // 30 วินาที

            expect(dateDiffToString(justNow, now, 'th')).toBe('เมื่อสักครู่')
            expect(dateDiffToString(justNow, now, 'en')).toBe('just now')
        })
    })

    // ทดสอบฟังก์ชัน addDate
    describe('addDate', () => {
        it('ควรเพิ่มจำนวนวันได้ถูกต้อง', () => {
            const date = new Date('2024-01-01')
            const result = addDate(date, 5)

            expect(result.getDate()).toBe(6)
            expect(result.getMonth()).toBe(0) // January
            expect(result.getFullYear()).toBe(2024)
        })

        it('ควรเพิ่มวันข้ามเดือนได้ถูกต้อง', () => {
            const date = new Date('2024-01-30')
            const result = addDate(date, 5)

            expect(result.getDate()).toBe(4)
            expect(result.getMonth()).toBe(1) // February
        })

        it('ควรลบวันได้ถูกต้อง', () => {
            const date = new Date('2024-01-05')
            const result = addDate(date, -3)

            expect(result.getDate()).toBe(2)
        })
    })

    // ทดสอบฟังก์ชัน addMonth
    describe('addMonth', () => {
        it('ควรเพิ่มจำนวนเดือนได้ถูกต้อง', () => {
            const date = new Date('2024-01-15')
            const result = addMonth(date, 2)

            expect(result.getMonth()).toBe(2) // March
            expect(result.getDate()).toBe(15)
            expect(result.getFullYear()).toBe(2024)
        })

        it('ควรเพิ่มเดือนข้ามปีได้ถูกต้อง', () => {
            const date = new Date('2024-12-15')
            const result = addMonth(date, 2)

            expect(result.getMonth()).toBe(1) // February
            expect(result.getFullYear()).toBe(2025)
        })

        it('ควรจัดการวันที่เกินในเดือนที่มีวันน้อยกว่าได้ถูกต้อง', () => {
            const date = new Date('2024-01-15')
            const result = addMonth(date, 1)
            expect(result.getDate()).toBe(15)
            expect(result.getMonth()).toBe(1)
        })
    })

    // ทดสอบฟังก์ชัน addHour
    describe('addHour', () => {
        it('ควรเพิ่มจำนวนชั่วโมงได้ถูกต้อง', () => {
            const date = new Date('2024-01-01 10:00:00')
            const result = addHour(date, 5)

            expect(result.getHours()).toBe(15)
            expect(result.getDate()).toBe(1)
        })

        it('ควรเพิ่มชั่วโมงข้ามวันได้ถูกต้อง', () => {
            const date = new Date('2024-01-01 22:00:00')
            const result = addHour(date, 3)

            expect(result.getHours()).toBe(1)
            expect(result.getDate()).toBe(2)
        })
    })

    // ทดสอบฟังก์ชัน addMinute
    describe('addMinute', () => {
        it('ควรเพิ่มจำนวนนาทีได้ถูกต้อง', () => {
            const date = new Date('2024-01-01 10:00:00')
            const result = addMinute(date, 30)

            expect(result.getMinutes()).toBe(30)
            expect(result.getHours()).toBe(10)
        })

        it('ควรเพิ่มนาทีข้ามชั่วโมงได้ถูกต้อง', () => {
            const date = new Date('2024-01-01 10:45:00')
            const result = addMinute(date, 30)

            expect(result.getMinutes()).toBe(15)
            expect(result.getHours()).toBe(11)
        })
    })

    // ทดสอบฟังก์ชัน dateToCombine
    describe('dateToCombine', () => {
        it('ควรแปลงวันที่เป็น string format ต่างๆ ได้ถูกต้อง', () => {
            const date = new Date('2024-01-01 10:30:45')
            const result = dateToCombine(date)

            expect(result.year).toBe('2024')
            expect(result.month).toBe('01')
            expect(result.day).toBe('01')
            expect(result.hour).toBe('10')
            expect(result.minute).toBe('30')
            expect(result.second).toBe('45')
            expect(result.valueOfDate).toBe('2024-01-01')
            expect(result.valueOfTime).toBe('10:30:45')
            expect(result.valueOfValue).toBe('2024-01-01 10:30:45')
        })

        it('ควรแสดงวันที่ภาษาไทยได้ถูกต้อง', () => {
            const date = new Date('2024-01-01')
            const result = dateToCombine(date)

            // ตรวจสอบว่ามีการแสดงผลเป็นภาษาไทย
            expect(result.th).toContain('2567') // พ.ศ.
        })

        it('ควรจัดการกับเลขหลักเดียวโดยเติม 0 ข้างหน้าได้ถูกต้อง', () => {
            const date = new Date('2024-01-05 09:05:05')
            const result = dateToCombine(date)

            expect(result.month).toBe('01')
            expect(result.day).toBe('05')
            expect(result.hour).toBe('09')
            expect(result.minute).toBe('05')
            expect(result.second).toBe('05')
        })
    })
})
