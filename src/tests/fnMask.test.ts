import { describe, expect, it } from 'vitest'
import {
    maskCreditCard,
    maskEmail,
    maskPhone,
    maskText,
    maskThaiId,
} from '../fnMask'

describe('fnMask', () => {
    // -----------------------------------------------------------------------------------
    describe('maskText', () => {
        it('ซ่อนส่วนกลางโดยแสดงหน้าและหลังตามที่กำหนด', () => {
            expect(maskText('password123', 2, 2)).toBe('pa***23')
        })

        it('default keepStart=1, keepEnd=1', () => {
            expect(maskText('hello')).toBe('h***o')
        })

        it('mask ขั้นต่ำ 3 ตัว แม้ส่วนกลางจะสั้นกว่า', () => {
            expect(maskText('ab', 1, 1)).toBe('a***b')
        })

        it('รองรับภาษาไทย (Unicode)', () => {
            expect(maskText('สวัสดีครับ', 2, 2)).toBe('สว***ับ')
        })

        it('คืน empty string เมื่อ value ว่าง', () => {
            expect(maskText('')).toBe('')
        })
    })

    // -----------------------------------------------------------------------------------
    describe('maskEmail', () => {
        it('ซ่อน local part คงเหลืออักขระแรก', () => {
            expect(maskEmail('user@example.com')).toBe('u***@example.com')
        })

        it('local part ตัวเดียว — แสดงทั้งหมดและเพิ่ม mask', () => {
            expect(maskEmail('a@test.com')).toBe('a***@test.com')
        })

        it('local part 2 ตัว', () => {
            expect(maskEmail('ab@test.com')).toBe('a***@test.com')
        })

        it('ไม่มี @ — mask เหมือน maskText', () => {
            expect(maskEmail('notanemail')).toBe('n***email')
        })

        it('คืน empty string เมื่อ value ว่าง', () => {
            expect(maskEmail('')).toBe('')
        })
    })

    // -----------------------------------------------------------------------------------
    describe('maskPhone', () => {
        it('ซ่อนส่วนกลาง แสดง 3 หน้าและ 3 หลัง', () => {
            expect(maskPhone('0812345678')).toBe('081***678')
        })

        it('รองรับรูปแบบที่มีขีดคั่น', () => {
            expect(maskPhone('081-234-5678')).toBe('081***678')
        })

        it('เบอร์สั้นกว่า 6 หลัก — mask ทั้งหมด', () => {
            expect(maskPhone('12345')).toBe('***')
        })

        it('คืน empty string เมื่อ value ว่าง', () => {
            expect(maskPhone('')).toBe('')
        })
    })

    // -----------------------------------------------------------------------------------
    describe('maskThaiId', () => {
        it('ซ่อน 13 หลัก แสดง 4 หน้า 2 หลัง', () => {
            expect(maskThaiId('1234567890123')).toBe('1234***23')
        })

        it('รองรับรูปแบบที่มีขีดคั่น', () => {
            expect(maskThaiId('1-2345-67890-12-3')).toBe('1234***23')
        })

        it('ไม่ใช่ 13 หลัก — mask ทั้งหมด', () => {
            expect(maskThaiId('12345')).toBe('***')
        })

        it('คืน empty string เมื่อ value ว่าง', () => {
            expect(maskThaiId('')).toBe('')
        })
    })

    // -----------------------------------------------------------------------------------
    describe('maskCreditCard', () => {
        it('แสดง 4 หน้าและ 4 หลัง ซ่อนส่วนกลาง', () => {
            expect(maskCreditCard('4111111111111111')).toBe('4111********1111')
        })

        it('รองรับรูปแบบที่มีขีดคั่น', () => {
            expect(maskCreditCard('4111-1111-1111-1111')).toBe(
                '4111********1111'
            )
        })

        it('ตัวเลขน้อยกว่า 8 หลัก — mask ทั้งหมด', () => {
            expect(maskCreditCard('1234567')).toBe('***')
        })

        it('คืน empty string เมื่อ value ว่าง', () => {
            expect(maskCreditCard('')).toBe('')
        })
    })
})
