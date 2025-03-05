import { beforeEach, describe, expect, it } from 'vitest'
import {
    addDate,
    addHour,
    addMinute,
    addMoment,
    addMonth,
    addYear,
    dateDiff,
    dateDiffToString,
    dateToCombine,
} from '../fnMoment'

describe('fnMoment', () => {
    let baseDate: Date

    beforeEach(() => {
        // กำหนดวันที่พื้นฐานที่จะใช้ในการทดสอบ
        baseDate = new Date('2023-01-15T12:30:45')
    })

    describe('dateDiff', () => {
        it('คำนวณความแตกต่างระหว่างวันที่ได้ถูกต้อง', () => {
            const date1 = new Date('2023-01-15T12:30:45')
            const date2 = new Date('2023-01-16T14:32:47')

            const diff = dateDiff(date1, date2)

            expect(diff.days).toBe(1)
            expect(diff.hours).toBe(2)
            expect(diff.minutes).toBe(2)
            expect(diff.seconds).toBe(2)
            expect(diff.hoursTotal).toBe(26)
            expect(diff.minutesTotal).toBe(1562)
            expect(diff.secondsTotal).toBe(93722)
        })

        it('คำนวณความแตกต่างระหว่างวันที่ที่ห่างกันหลายวัน', () => {
            const date1 = new Date('2023-01-01T00:00:00')
            const date2 = new Date('2023-01-31T00:00:00')

            const diff = dateDiff(date1, date2)

            expect(diff.days).toBe(30)
            expect(diff.hours).toBe(0)
            expect(diff.hoursTotal).toBe(720)
        })

        it('คำนวณความแตกต่างได้ถูกต้องเมื่อวันที่แรกมากกว่าวันที่สอง', () => {
            const date1 = new Date('2023-01-31T00:00:00')
            const date2 = new Date('2023-01-01T00:00:00')

            const diff = dateDiff(date1, date2)

            expect(diff.days).toBe(30)
        })

        it('คืนค่า milliseconds ได้ถูกต้อง', () => {
            const date1 = new Date('2023-01-15T12:30:45.000')
            const date2 = new Date('2023-01-15T12:30:46.500')

            const diff = dateDiff(date1, date2)

            expect(diff.milliseconds).toBe(1500)
        })

        it('โยนข้อผิดพลาดเมื่อระบุค่าที่ไม่ใช่วันที่', () => {
            // @ts-ignore - ทดสอบกรณีส่งค่าผิดประเภท
            expect(() => dateDiff('not a date')).toThrow('Invalid date input')
        })

        it('ใช้วันที่ปัจจุบันเป็นค่าเริ่มต้นถ้าไม่ได้ระบุพารามิเตอร์ที่สอง', () => {
            const now = new Date()
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

            const diff = dateDiff(yesterday)

            expect(diff.days).toBe(1)
        })
    })

    describe('dateDiffToString', () => {
        it('แสดงผลเป็นหน่วยปีเมื่อเกิน 1 ปี', () => {
            const date1 = new Date('2022-01-15')
            const date2 = new Date('2023-01-20')

            expect(dateDiffToString(date1, date2, 'th')).toBe('1 ปีที่แล้ว')
            expect(dateDiffToString(date1, date2, 'en')).toBe('1 year ago')
        })

        it('แสดงผลเป็นหน่วยเดือนเมื่อเกิน 1 เดือนแต่ไม่ถึง 1 ปี', () => {
            const date1 = new Date('2023-01-15')
            const date2 = new Date('2023-03-20')

            expect(dateDiffToString(date1, date2, 'th')).toBe('2 เดือนที่แล้ว')
            expect(dateDiffToString(date1, date2, 'en')).toBe('2 months ago')
        })

        it('แสดงผลเป็นหน่วยวันเมื่อเกิน 1 วันแต่ไม่ถึง 1 เดือน', () => {
            const date1 = new Date('2023-01-15')
            const date2 = new Date('2023-01-25')

            expect(dateDiffToString(date1, date2, 'th')).toBe('10 วันที่แล้ว')
            expect(dateDiffToString(date1, date2, 'en')).toBe('10 days ago')
        })

        it('แสดงผลเป็นหน่วยชั่วโมงเมื่อเกิน 1 ชั่วโมงแต่ไม่ถึง 1 วัน', () => {
            const date1 = new Date('2023-01-15T12:00:00')
            const date2 = new Date('2023-01-15T15:00:00')

            expect(dateDiffToString(date1, date2, 'th')).toBe(
                '3 ชั่วโมงที่แล้ว'
            )
            expect(dateDiffToString(date1, date2, 'en')).toBe('3 hours ago')
        })

        it('แสดงผลเป็นหน่วยนาทีเมื่อเกิน 1 นาทีแต่ไม่ถึง 1 ชั่วโมง', () => {
            const date1 = new Date('2023-01-15T12:00:00')
            const date2 = new Date('2023-01-15T12:30:00')

            expect(dateDiffToString(date1, date2, 'th')).toBe('30 นาทีที่แล้ว')
            expect(dateDiffToString(date1, date2, 'en')).toBe('30 mins ago')
        })

        it('แสดงผลเป็น "เมื่อสักครู่" หรือ "just now" เมื่อน้อยกว่า 1 นาที', () => {
            const date1 = new Date('2023-01-15T12:00:00')
            const date2 = new Date('2023-01-15T12:00:45')

            expect(dateDiffToString(date1, date2, 'th')).toBe('เมื่อสักครู่')
            expect(dateDiffToString(date1, date2, 'en')).toBe('just now')
        })

        it('รองรับการคำนวณเวลาในอนาคต (ไม่มีคำว่า "ที่แล้ว" หรือ "ago")', () => {
            const now = new Date()
            const future = new Date(now.getTime() + 24 * 60 * 60 * 1000)

            const resultTh = dateDiffToString(future, now, 'th')
            const resultEn = dateDiffToString(future, now, 'en')

            expect(resultTh).toBe('1 วัน')
            expect(resultEn).toBe('1 days')
        })

        it('โยนข้อผิดพลาดเมื่อระบุค่าที่ไม่ใช่วันที่', () => {
            // @ts-ignore - ทดสอบกรณีส่งค่าผิดประเภท
            expect(() => dateDiffToString('not a date')).toThrow(
                'Invalid date input'
            )
        })
    })

    describe('addDate', () => {
        it('เพิ่มจำนวนวันได้ถูกต้อง', () => {
            const result = addDate(baseDate, 5)
            expect(result.getDate()).toBe(20)
            expect(result.getMonth()).toBe(0) // มกราคม
            expect(result.getFullYear()).toBe(2023)
        })

        it('จัดการการเปลี่ยนเดือนได้ถูกต้องเมื่อเพิ่มวันเกินเดือนปัจจุบัน', () => {
            const result = addDate(new Date('2023-01-29'), 3)
            expect(result.getDate()).toBe(1)
            expect(result.getMonth()).toBe(1) // กุมภาพันธ์
            expect(result.getFullYear()).toBe(2023)
        })

        it('จัดการการเปลี่ยนปีได้ถูกต้องเมื่อเพิ่มวันเกินปีปัจจุบัน', () => {
            const result = addDate(new Date('2023-12-30'), 3)
            expect(result.getDate()).toBe(2)
            expect(result.getMonth()).toBe(0) // มกราคม
            expect(result.getFullYear()).toBe(2024)
        })

        it('รองรับการลบวันโดยใช้ค่าลบ', () => {
            const result = addDate(baseDate, -5)
            expect(result.getDate()).toBe(10)
            expect(result.getMonth()).toBe(0) // มกราคม
            expect(result.getFullYear()).toBe(2023)
        })

        it('ไม่เปลี่ยนแปลงวันที่ต้นฉบับ', () => {
            const originalDate = new Date(baseDate)
            addDate(baseDate, 5)
            expect(baseDate.getTime()).toBe(originalDate.getTime())
        })

        it('โยนข้อผิดพลาดเมื่อระบุค่าที่ไม่ใช่วันที่', () => {
            // @ts-ignore - ทดสอบกรณีส่งค่าผิดประเภท
            expect(() => addDate('not a date', 5)).toThrow('Invalid date input')
        })
    })

    describe('addMonth', () => {
        it('เพิ่มจำนวนเดือนได้ถูกต้อง', () => {
            const result = addMonth(baseDate, 3)
            expect(result.getDate()).toBe(15)
            expect(result.getMonth()).toBe(3) // เมษายน
            expect(result.getFullYear()).toBe(2023)
        })

        it('จัดการการเปลี่ยนปีได้ถูกต้องเมื่อเพิ่มเดือนเกินปีปัจจุบัน', () => {
            const result = addMonth(baseDate, 13)
            expect(result.getDate()).toBe(15)
            expect(result.getMonth()).toBe(1) // กุมภาพันธ์
            expect(result.getFullYear()).toBe(2024)
        })

        it('จัดการวันที่ไม่มีในเดือนถัดไป (เช่น 31 มกราคมไปกุมภาพันธ์)', () => {
            const result = addMonth(new Date('2023-01-31'), 1)
            // เมื่อเพิ่ม 1 เดือนจาก 31 มกราคม 2023 จะได้ 3 มีนาคม 2023
            // (เนื่องจากกุมภาพันธ์ 2023 มี 28 วัน เมื่อตั้งวันที่ 31 จะล้นไปเป็น 3 มีนาคม)
            expect(result.getMonth()).toBe(2) // มีนาคม
            expect(result.getDate()).toBe(3) // วันที่ 3
        })

        it('รองรับการลบเดือนโดยใช้ค่าลบ', () => {
            const result = addMonth(baseDate, -2)
            expect(result.getDate()).toBe(15)
            expect(result.getMonth()).toBe(10) // พฤศจิกายน
            expect(result.getFullYear()).toBe(2022)
        })

        it('ไม่เปลี่ยนแปลงวันที่ต้นฉบับ', () => {
            const originalDate = new Date(baseDate)
            addMonth(baseDate, 3)
            expect(baseDate.getTime()).toBe(originalDate.getTime())
        })

        it('โยนข้อผิดพลาดเมื่อระบุค่าที่ไม่ใช่วันที่', () => {
            // @ts-ignore - ทดสอบกรณีส่งค่าผิดประเภท
            expect(() => addMonth('not a date', 3)).toThrow(
                'Invalid date input'
            )
        })
    })

    describe('addYear', () => {
        it('เพิ่มจำนวนปีได้ถูกต้อง', () => {
            const result = addYear(baseDate, 5)
            expect(result.getDate()).toBe(15)
            expect(result.getMonth()).toBe(0) // มกราคม
            expect(result.getFullYear()).toBe(2028)
        })

        it('รองรับการลบปีโดยใช้ค่าลบ', () => {
            const result = addYear(baseDate, -3)
            expect(result.getDate()).toBe(15)
            expect(result.getMonth()).toBe(0) // มกราคม
            expect(result.getFullYear()).toBe(2020)
        })

        it('จัดการวันที่ 29 กุมภาพันธ์เมื่อเพิ่มปีไปยังปีที่ไม่ใช่ปีอธิกสุรทิน', () => {
            // 2020 เป็นปีอธิกสุรทิน
            const leapDate = new Date('2020-02-29')

            // เพิ่ม 1 ปี ไปเป็น 2021 ซึ่งไม่ใช่ปีอธิกสุรทิน
            const result = addYear(leapDate, 1)

            // ในปี 2021 ไม่มีวันที่ 29 กุมภาพันธ์ ดังนั้นจะล้นไปเป็นวันที่ 1 มีนาคม 2021
            expect(result.getMonth()).toBe(2) // มีนาคม (เดือนที่ 2)
            expect(result.getDate()).toBe(1) // วันที่ 1
            expect(result.getFullYear()).toBe(2021)
        })

        it('ไม่เปลี่ยนแปลงวันที่ต้นฉบับ', () => {
            const originalDate = new Date(baseDate)
            addYear(baseDate, 5)
            expect(baseDate.getTime()).toBe(originalDate.getTime())
        })

        it('โยนข้อผิดพลาดเมื่อระบุค่าที่ไม่ใช่วันที่', () => {
            // @ts-ignore - ทดสอบกรณีส่งค่าผิดประเภท
            expect(() => addYear('not a date', 5)).toThrow('Invalid date input')
        })
    })

    describe('addHour', () => {
        it('เพิ่มจำนวนชั่วโมงได้ถูกต้อง', () => {
            const result = addHour(baseDate, 5)
            expect(result.getHours()).toBe(17)
            expect(result.getDate()).toBe(15)
            expect(result.getMonth()).toBe(0) // มกราคม
        })

        it('จัดการการเปลี่ยนวันได้ถูกต้องเมื่อเพิ่มชั่วโมงเกินวันปัจจุบัน', () => {
            const result = addHour(new Date('2023-01-15T22:00:00'), 3)
            expect(result.getHours()).toBe(1)
            expect(result.getDate()).toBe(16)
            expect(result.getMonth()).toBe(0) // มกราคม
        })

        it('จัดการการเปลี่ยนเดือนได้ถูกต้องเมื่อเพิ่มชั่วโมงเกินเดือนปัจจุบัน', () => {
            const result = addHour(new Date('2023-01-31T22:00:00'), 5)
            expect(result.getHours()).toBe(3)
            expect(result.getDate()).toBe(1)
            expect(result.getMonth()).toBe(1) // กุมภาพันธ์
        })

        it('รองรับการลบชั่วโมงโดยใช้ค่าลบ', () => {
            const result = addHour(baseDate, -5)
            expect(result.getHours()).toBe(7)
            expect(result.getDate()).toBe(15)
            expect(result.getMonth()).toBe(0) // มกราคม
        })

        it('ไม่เปลี่ยนแปลงวันที่ต้นฉบับ', () => {
            const originalDate = new Date(baseDate)
            addHour(baseDate, 5)
            expect(baseDate.getTime()).toBe(originalDate.getTime())
        })

        it('โยนข้อผิดพลาดเมื่อระบุค่าที่ไม่ใช่วันที่', () => {
            // @ts-ignore - ทดสอบกรณีส่งค่าผิดประเภท
            expect(() => addHour('not a date', 5)).toThrow('Invalid date input')
        })
    })

    describe('addMinute', () => {
        it('เพิ่มจำนวนนาทีได้ถูกต้อง', () => {
            const result = addMinute(baseDate, 15)
            expect(result.getMinutes()).toBe(45)
            expect(result.getHours()).toBe(12)
            expect(result.getDate()).toBe(15)
        })

        it('จัดการการเปลี่ยนชั่วโมงได้ถูกต้องเมื่อเพิ่มนาทีเกินชั่วโมงปัจจุบัน', () => {
            const result = addMinute(new Date('2023-01-15T12:45:00'), 20)
            expect(result.getMinutes()).toBe(5)
            expect(result.getHours()).toBe(13)
            expect(result.getDate()).toBe(15)
        })

        it('จัดการการเปลี่ยนวันได้ถูกต้องเมื่อเพิ่มนาทีเกินวันปัจจุบัน', () => {
            const result = addMinute(new Date('2023-01-15T23:45:00'), 20)
            expect(result.getMinutes()).toBe(5)
            expect(result.getHours()).toBe(0)
            expect(result.getDate()).toBe(16)
        })

        it('รองรับการลบนาทีโดยใช้ค่าลบ', () => {
            const result = addMinute(baseDate, -15)
            expect(result.getMinutes()).toBe(15)
            expect(result.getHours()).toBe(12)
            expect(result.getDate()).toBe(15)
        })

        it('ไม่เปลี่ยนแปลงวันที่ต้นฉบับ', () => {
            const originalDate = new Date(baseDate)
            addMinute(baseDate, 15)
            expect(baseDate.getTime()).toBe(originalDate.getTime())
        })

        it('โยนข้อผิดพลาดเมื่อระบุค่าที่ไม่ใช่วันที่', () => {
            // @ts-ignore - ทดสอบกรณีส่งค่าผิดประเภท
            expect(() => addMinute('not a date', 15)).toThrow(
                'Invalid date input'
            )
        })
    })

    describe('addMoment', () => {
        it('เพิ่มหลายหน่วยเวลาพร้อมกันได้', () => {
            const result = addMoment(baseDate, {
                years: 1,
                months: 2,
                days: 3,
                hours: 4,
                minutes: 5,
            })

            expect(result.getFullYear()).toBe(2024)
            expect(result.getMonth()).toBe(2) // มีนาคม
            expect(result.getDate()).toBe(18)
            expect(result.getHours()).toBe(16)
            expect(result.getMinutes()).toBe(35)
        })

        it('ทำงานได้ถูกต้องเมื่อเพิ่มเพียงบางหน่วยเวลา', () => {
            const result = addMoment(baseDate, { years: 1, days: 10 })

            expect(result.getFullYear()).toBe(2024)
            expect(result.getMonth()).toBe(0) // มกราคม
            expect(result.getDate()).toBe(25)
            expect(result.getHours()).toBe(12)
            expect(result.getMinutes()).toBe(30)
        })

        it('รองรับการใช้ค่าลบเพื่อลดค่าเวลา', () => {
            const result = addMoment(baseDate, {
                years: -1,
                months: -1,
                days: -5,
            })

            expect(result.getFullYear()).toBe(2021)
            expect(result.getMonth()).toBe(11) // ธันวาคม
            expect(result.getDate()).toBe(10)
            expect(result.getHours()).toBe(12)
            expect(result.getMinutes()).toBe(30)
        })

        it('ไม่เปลี่ยนแปลงวันที่ต้นฉบับ', () => {
            const originalDate = new Date(baseDate)
            addMoment(baseDate, { years: 1, months: 2 })
            expect(baseDate.getTime()).toBe(originalDate.getTime())
        })

        it('โยนข้อผิดพลาดเมื่อระบุค่าที่ไม่ใช่วันที่', () => {
            // @ts-ignore - ทดสอบกรณีส่งค่าผิดประเภท
            expect(() => addMoment('not a date', { days: 5 })).toThrow(
                'Invalid date input'
            )
        })
    })

    describe('dateToCombine', () => {
        it('สร้างรูปแบบวันที่ต่างๆ ได้ถูกต้อง', () => {
            const date = new Date('2023-05-08T14:30:45')
            const result = dateToCombine(date)

            expect(result.year).toBe('2023')
            expect(result.month).toBe('05')
            expect(result.day).toBe('08')
            expect(result.hour).toBe('14')
            expect(result.minute).toBe('30')
            expect(result.second).toBe('45')
            expect(result.valueOfDate).toBe('2023-05-08')
            expect(result.valueOfTime).toBe('14:30:45')
            expect(result.valueOfValue).toBe('2023-05-08 14:30:45')
        })

        it('จัดการเลขหลักเดียวโดยเติม 0 ข้างหน้า', () => {
            const date = new Date('2023-01-05T09:05:07')
            const result = dateToCombine(date)

            expect(result.month).toBe('01')
            expect(result.day).toBe('05')
            expect(result.hour).toBe('09')
            expect(result.minute).toBe('05')
            expect(result.second).toBe('07')
        })

        it('มีรูปแบบภาษาไทย', () => {
            const date = new Date('2023-05-08T14:30:45')
            const result = dateToCombine(date)

            // ตรวจสอบว่ามีคีย์ th และมีค่าไม่ว่าง
            expect(result.th).toBeTruthy()

            // รูปแบบของวันที่ภาษาไทยอาจแตกต่างกันตามระบบ
            // จึงตรวจสอบเพียงว่ามีปี พ.ศ. อยู่ในสตริง
            expect(
                result.th.includes('พฤษภาคม') || result.th.includes('พ.ค.')
            ).toBe(true)
        })

        it('โยนข้อผิดพลาดเมื่อระบุค่าที่ไม่ใช่วันที่', () => {
            // @ts-ignore - ทดสอบกรณีส่งค่าผิดประเภท
            expect(() => dateToCombine('not a date')).toThrow(
                'Invalid date input'
            )
        })
    })
})
