import { describe, expect, test } from 'vitest'
import {
    checkEmail,
    checkEmpty,
    checkFormatDate,
    checkItemDuplicate,
    checkNumber,
    checkObject,
} from '../fnCheck'

describe('checkItemDuplicate (ตรวจสอบค่าที่ซ้ำกันใน Array)', () => {
    test('ตรวจสอบ Array ของ string ที่ซ้ำกัน', () => {
        const items = ['a', 'b', 'a', 'c']
        const result = checkItemDuplicate(items, (item) => item)
        expect(result).toBe(true)
    })

    test('ตรวจสอบ Array ของ object ที่มี property ซ้ำกัน', () => {
        const items = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 3, name: 'John' },
        ]
        const result = checkItemDuplicate(items, (item) => item.name)
        expect(result).toBe(true)
    })

    test('ตรวจสอบ Array ที่ไม่มีค่าซ้ำกัน', () => {
        const items = ['a', 'b', 'c']
        const result = checkItemDuplicate(items, (item) => item)
        expect(result).toBe(false)
    })

    test('ตรวจสอบ Array ว่างและ null', () => {
        expect(checkItemDuplicate([], (item) => item)).toBe(false)
        expect(checkItemDuplicate(null as any, (item) => item)).toBe(false)
    })

    test('ตรวจสอบการ ignore case', () => {
        const items = ['Test', 'test', 'TEST']
        const result = checkItemDuplicate(items, (item) => item, {
            ignoreCase: true,
        })
        expect(result).toBe(true)
    })

    test('ตรวจสอบการ trim space', () => {
        const items = ['test ', ' test', 'test']
        const result = checkItemDuplicate(items, (item) => item, { trim: true })
        expect(result).toBe(true)
    })
})

describe('checkEmpty (ตรวจสอบค่าว่าง)', () => {
    test('ตรวจสอบ string ว่าง', () => {
        expect(checkEmpty('')).toBe(true)
        expect(checkEmpty('  ')).toBe(true)
        expect(checkEmpty('test')).toBe(false)
    })

    test('ตรวจสอบ array ว่าง', () => {
        expect(checkEmpty([])).toBe(true)
        expect(checkEmpty([1, 2, 3])).toBe(false)
    })

    test('ตรวจสอบ object ว่าง', () => {
        expect(checkEmpty({})).toBe(true)
        expect(checkEmpty({ key: 'value' })).toBe(false)
    })

    test('ตรวจสอบค่า null และ undefined', () => {
        expect(checkEmpty(null)).toBe(true)
        expect(checkEmpty(undefined)).toBe(true)
    })

    test('ตรวจสอบค่าตัวเลขและ boolean', () => {
        expect(checkEmpty(0)).toBe(false)
        expect(checkEmpty(1)).toBe(false)
        expect(checkEmpty(false)).toBe(false)
        expect(checkEmpty(true)).toBe(false)
    })

    test('ตรวจสอบ Map และ Set ว่าง', () => {
        expect(checkEmpty(new Map())).toBe(true)
        expect(checkEmpty(new Set())).toBe(true)
        const map = new Map([['key', 'value']])
        const set = new Set([1, 2, 3])
        expect(checkEmpty(map)).toBe(false)
        expect(checkEmpty(set)).toBe(false)
    })
})

describe('checkObject (ตรวจสอบว่าเป็น object หรือไม่)', () => {
    test('ตรวจสอบ object ที่ถูกต้อง', () => {
        expect(checkObject({ key: 'value' })).toBe(true)
        expect(checkObject({ a: 1, b: 2 })).toBe(true)
    })

    test('ตรวจสอบค่าที่ไม่ใช่ object', () => {
        expect(checkObject(null)).toBe(false)
        expect(checkObject(undefined)).toBe(false)
        expect(checkObject([])).toBe(false)
        expect(checkObject('')).toBe(false)
        expect(checkObject(123)).toBe(false)
        expect(checkObject(true)).toBe(false)
    })

    test('ตรวจสอบ object ว่าง', () => {
        expect(checkObject({})).toBe(false)
    })
})

describe('checkEmail (ตรวจสอบรูปแบบอีเมล)', () => {
    test('ตรวจสอบอีเมลที่ถูกต้อง', () => {
        expect(checkEmail('test@example.com')).toBe(true)
        expect(checkEmail('user.name+tag@example.co.th')).toBe(true)
        expect(checkEmail('user123@subdomain.example.com')).toBe(true)
    })

    test('ตรวจสอบอีเมลที่ไม่ถูกต้อง', () => {
        expect(checkEmail('invalid.email')).toBe(false)
        expect(checkEmail('@example.com')).toBe(false)
        expect(checkEmail('test@')).toBe(false)
        expect(checkEmail('test@.com')).toBe(false)
        expect(checkEmail('test@exam ple.com')).toBe(false)
    })

    test('ตรวจสอบค่าที่ไม่ใช่ string', () => {
        expect(checkEmail(null)).toBe(false)
        expect(checkEmail(undefined)).toBe(false)
        expect(checkEmail(123)).toBe(false)
        expect(checkEmail({})).toBe(false)
        expect(checkEmail([])).toBe(false)
    })

    test('ตรวจสอบอีเมลที่มี whitespace', () => {
        expect(checkEmail(' test@example.com ')).toBe(true)
        expect(checkEmail('\ttest@example.com\n')).toBe(true)
    })
})

describe('checkNumber (ตรวจสอบว่าเป็นตัวเลขหรือไม่)', () => {
    test('ตรวจสอบตัวเลขที่ถูกต้อง', () => {
        expect(checkNumber(123)).toBe(true)
        expect(checkNumber('123')).toBe(true)
        expect(checkNumber(0)).toBe(true)
        expect(checkNumber('0')).toBe(true)
    })

    test('ตรวจสอบค่าที่ไม่ใช่ตัวเลข', () => {
        expect(checkNumber('abc')).toBe(false)
        expect(checkNumber('123abc')).toBe(false)
        expect(checkNumber('')).toBe(false)
        expect(checkNumber(null)).toBe(false)
        expect(checkNumber(undefined)).toBe(false)
        expect(checkNumber({})).toBe(false)
        expect(checkNumber([])).toBe(false)
    })
})

describe('checkFormatDate (ตรวจสอบรูปแบบวันที่)', () => {
    test('ตรวจสอบวันที่ในรูปแบบ YYYY-MM-DD', () => {
        expect(checkFormatDate('2024-01-01')).toBe(true)
        expect(checkFormatDate('2024-12-31')).toBe(true)
        expect(checkFormatDate('2024-02-29')).toBe(true) // leap year
    })

    test('ตรวจสอบวันที่ในรูปแบบอื่นๆ', () => {
        expect(checkFormatDate('01/01/2024', 'DD/MM/YYYY')).toBe(true)
        expect(checkFormatDate('31-12-2024', 'DD-MM-YYYY')).toBe(true)
        expect(checkFormatDate('2024.01.01', 'YYYY.MM.DD')).toBe(true)
    })

    test('ตรวจสอบวันที่ที่ไม่ถูกต้อง', () => {
        expect(checkFormatDate('2024-13-01')).toBe(false) // เดือนไม่ถูกต้อง
        expect(checkFormatDate('2024-04-31')).toBe(false) // วันที่ไม่ถูกต้อง
        expect(checkFormatDate('2023-02-29')).toBe(false) // ไม่ใช่ปีอธิกสุรทิน
    })

    test('ตรวจสอบรูปแบบที่ไม่ถูกต้อง', () => {
        expect(checkFormatDate('')).toBe(false)
        expect(checkFormatDate('invalid-date')).toBe(false)
        expect(checkFormatDate('2024/01/01', 'YYYY/MM/DD')).toBe(true) // ผิดรูปแบบ default
        expect(checkFormatDate(null as any)).toBe(false)
        expect(checkFormatDate(undefined as any)).toBe(false)
    })

    test('ตรวจสอบวันที่ที่มีเวลา', () => {
        expect(checkFormatDate('2024-01-01 12:00:00')).toBe(true)
        expect(checkFormatDate('2024-01-01T12:00:00')).toBe(true)
    })
})
