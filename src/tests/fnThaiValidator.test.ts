import { describe, expect, it } from 'vitest'
import {
    validateThaiId,
    validateThaiPhone,
    validateThaiTaxId,
} from '../fnThaiValidator'

describe('fnThaiValidator', () => {
    // -----------------------------------------------------------------------------------
    describe('validateThaiId', () => {
        it('เลขบัตรประชาชนถูกต้อง', () => {
            expect(validateThaiId('1101401098891')).toEqual({
                isValid: true,
                message: '',
            })
        })

        it('รองรับรูปแบบมีขีดคั่น', () => {
            expect(validateThaiId('1-1014-01098-89-1')).toEqual({
                isValid: true,
                message: '',
            })
        })

        it('คืน error เมื่อว่าง', () => {
            expect(validateThaiId('')).toEqual({
                isValid: false,
                message: 'กรุณากรอกเลขบัตรประชาชน',
            })
        })

        it('คืน error เมื่อไม่ครบ 13 หลัก', () => {
            expect(validateThaiId('12345')).toEqual({
                isValid: false,
                message: 'เลขบัตรประชาชนต้องมี 13 หลัก',
            })
        })

        it('คืน error เมื่อขึ้นต้นด้วย 0', () => {
            expect(validateThaiId('0101401098891')).toEqual({
                isValid: false,
                message: 'เลขบัตรประชาชนไม่ถูกต้อง',
            })
        })

        it('คืน error เมื่อ checksum ไม่ถูกต้อง', () => {
            expect(validateThaiId('1234567890123')).toEqual({
                isValid: false,
                message: 'เลขบัตรประชาชนไม่ถูกต้อง',
            })
        })
    })

    // -----------------------------------------------------------------------------------
    describe('validateThaiPhone', () => {
        it('เบอร์โทรศัพท์มือถือถูกต้อง', () => {
            expect(validateThaiPhone('0812345678')).toEqual({
                isValid: true,
                message: '',
            })
        })

        it('เบอร์โทรศัพท์บ้านถูกต้อง', () => {
            expect(validateThaiPhone('0212345678')).toEqual({
                isValid: true,
                message: '',
            })
        })

        it('รองรับรูปแบบมีขีดคั่น', () => {
            expect(validateThaiPhone('081-234-5678')).toEqual({
                isValid: true,
                message: '',
            })
        })

        it('คืน error เมื่อว่าง', () => {
            expect(validateThaiPhone('')).toEqual({
                isValid: false,
                message: 'กรุณากรอกหมายเลขโทรศัพท์',
            })
        })

        it('คืน error เมื่อไม่ครบ 10 หลัก', () => {
            expect(validateThaiPhone('081234')).toEqual({
                isValid: false,
                message: 'หมายเลขโทรศัพท์ต้องมี 10 หลัก',
            })
        })

        it('คืน error เมื่อไม่ขึ้นต้นด้วย 0', () => {
            expect(validateThaiPhone('1812345678')).toEqual({
                isValid: false,
                message: 'หมายเลขโทรศัพท์ต้องขึ้นต้นด้วย 0',
            })
        })

        it('คืน error เมื่อหลักที่ 2 เป็น 0 หรือ 1', () => {
            expect(validateThaiPhone('0012345678')).toEqual({
                isValid: false,
                message: 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง',
            })
        })

        it('คืน error เมื่อหลักที่ 2 เป็น 1', () => {
            expect(validateThaiPhone('0112345678')).toEqual({
                isValid: false,
                message: 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง',
            })
        })
    })

    // -----------------------------------------------------------------------------------
    describe('validateThaiTaxId', () => {
        it('เลขประจำตัวผู้เสียภาษีนิติบุคคลถูกต้อง', () => {
            // 0105556091152 — ตรวจสอบด้วย checksum
            expect(validateThaiTaxId('0105556091152')).toEqual({
                isValid: true,
                message: '',
            })
        })

        it('ใช้ได้กับเลขบัตรประชาชน (บุคคลธรรมดา)', () => {
            expect(validateThaiTaxId('1101401098891')).toEqual({
                isValid: true,
                message: '',
            })
        })

        it('รองรับรูปแบบมีขีดคั่น', () => {
            expect(validateThaiTaxId('1-1014-01098-89-1')).toEqual({
                isValid: true,
                message: '',
            })
        })

        it('คืน error เมื่อว่าง', () => {
            expect(validateThaiTaxId('')).toEqual({
                isValid: false,
                message: 'กรุณากรอกเลขประจำตัวผู้เสียภาษี',
            })
        })

        it('คืน error เมื่อไม่ครบ 13 หลัก', () => {
            expect(validateThaiTaxId('012345')).toEqual({
                isValid: false,
                message: 'เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก',
            })
        })

        it('คืน error เมื่อ checksum ไม่ถูกต้อง', () => {
            expect(validateThaiTaxId('0105556091153')).toEqual({
                isValid: false,
                message: 'เลขประจำตัวผู้เสียภาษีไม่ถูกต้อง',
            })
        })
    })
})
