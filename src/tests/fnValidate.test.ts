import { describe, expect, it } from 'vitest'
import {
    validateEmail,
    validateObject,
    validatePayloadEmptyToNull,
} from '../fnValidate'

// ทดสอบฟังก์ชัน validateObject
describe('validateObject', () => {
    // เตรียมข้อมูลทดสอบ
    const testPayload = {
        id: 1,
        name: 'test',
        distributor: {
            id: 100,
            name: 'dist',
        },
        details: {
            color: 'red',
            size: {
                width: 100,
            },
        },
    }

    it('ควรคืนค่า status 1 เมื่อพบ key ทั้งหมดที่ระบุ', () => {
        const result = validateObject(testPayload, ['id', 'distributor.id'])
        expect(result.status).toBe(1)
        expect(result.message).toBe('')
    })

    it('ควรคืนค่า status 0 เมื่อไม่พบ key ที่ระบุ', () => {
        const result = validateObject(testPayload, ['notExist'])
        expect(result.status).toBe(0)
        expect(result.message).toContain('notExist is undefined')
    })

    it('ควรคืนค่า status -1 เมื่อ input ไม่ถูกต้อง', () => {
        const result = validateObject('not an object' as any, ['key'])
        expect(result.status).toBe(-1)
        expect(result.message).toBe('Error Data is Invalid!!')
    })

    it('ควรสามารถตรวจสอบ nested key ได้', () => {
        const result = validateObject(testPayload, ['details.size.width'])
        expect(result.status).toBe(1)
    })

    it('ควรแสดง message error ที่กำหนดเมื่อไม่พบ key', () => {
        const result = validateObject(testPayload, ['missing'], 'ValidateTest')
        expect(result.message).toBe('!!ValidateTest (missing is undefined)')
    })
})

// ทดสอบฟังก์ชัน validateEmail
describe('validateEmail', () => {
    it('ควรยอมรับอีเมลที่ถูกต้อง', () => {
        const result = validateEmail('test@example.com')
        expect(result.isValid).toBe(true)
        expect(result.message).toBe('')
    })

    it('ควรปฏิเสธอีเมลที่ไม่ถูกต้อง', () => {
        const result = validateEmail('invalid-email')
        expect(result.isValid).toBe(false)
        expect(result.message).toBe('รูปแบบอีเมลไม่ถูกต้อง')
    })

    it('ควรจัดการกรณีค่าว่างตามที่กำหนด', () => {
        const resultAllowEmpty = validateEmail('', { allowEmpty: true })
        expect(resultAllowEmpty.isValid).toBe(true)

        const resultNotAllowEmpty = validateEmail('', { allowEmpty: false })
        expect(resultNotAllowEmpty.isValid).toBe(false)
        expect(resultNotAllowEmpty.message).toBe('กรุณากรอกอีเมล')
    })

    it('ควรตรวจสอบความยาวอีเมล', () => {
        const longEmail = 'a'.repeat(255) + '@example.com'
        const result = validateEmail(longEmail, { maxLength: 254 })
        expect(result.isValid).toBe(false)
        expect(result.message).toBe('อีเมลต้องไม่เกิน 254 ตัวอักษร')
    })

    it('ควรตรวจสอบโดเมนที่อนุญาต', () => {
        const result = validateEmail('test@example.com', {
            allowedDomains: ['gmail.com', 'hotmail.com'],
        })
        expect(result.isValid).toBe(false)
        expect(result.message).toContain('อีเมลต้องลงท้ายด้วย')
    })

    it('ควรบล็อกอีเมลชั่วคราว', () => {
        const result = validateEmail('test@fake.com', { blockDisposable: true })
        expect(result.isValid).toBe(false)
        expect(result.message).toBe('ไม่อนุญาตให้ใช้อีเมลชั่วคราว')
    })
})

// ทดสอบฟังก์ชัน validatePayloadEmptyToNull
describe('validatePayloadEmptyToNull', () => {
    it('ควรแปลง empty string เป็น null', () => {
        const input = { name: '', age: 30 }
        const result = validatePayloadEmptyToNull(input)
        expect(result).toEqual({ name: null, age: 30 })
    })

    it('ควรจัดการ nested objects', () => {
        const input = {
            user: {
                name: '',
                details: {
                    address: '',
                },
            },
        }
        const result = validatePayloadEmptyToNull(input)
        expect(result).toEqual({
            user: {
                name: null,
                details: {
                    address: null,
                },
            },
        })
    })

    it('ควรคืนค่า null เมื่อ input เป็น empty string', () => {
        const result = validatePayloadEmptyToNull('')
        expect(result).toBeNull()
    })

    it('ควรเก็บค่าที่ไม่ใช่ empty string ไว้', () => {
        const input = {
            name: 'John',
            age: 30,
            email: '',
            details: {
                address: 'Bangkok',
                note: '',
            },
        }
        const result = validatePayloadEmptyToNull(input)
        expect(result).toEqual({
            name: 'John',
            age: 30,
            email: null,
            details: {
                address: 'Bangkok',
                note: null,
            },
        })
    })
})
