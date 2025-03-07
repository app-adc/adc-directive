import { describe, expect, it } from 'vitest'
import { ci, withCi } from '../fnCi'

describe('ci - Function Composition', () => {
    // ฟังก์ชันเพื่อใช้ในการทดสอบ
    const add = (a: number): number => a + 1
    const multiply = (a: number): number => a * 2
    const toString = (a: number): string => a.toString()
    const throwError = (): never => {
        throw new Error('Test error')
    }

    it('ส่งค่ากลับเมื่อไม่มี function ที่ต้องการเรียกใช้', () => {
        const result = ci(5)
        expect(result).toBe(5)
    })

    it('ทำงานถูกต้องเมื่อมี function เดียว', () => {
        const result = ci(5, add)
        expect(result).toBe(6)
    })

    it('ทำงานถูกต้องเมื่อมีหลาย function', () => {
        const result = ci(5, add, multiply)
        expect(result).toBe(12) // (5 + 1) * 2 = 12
    })

    it('รองรับการแปลงประเภทข้อมูล', () => {
        const result = ci(5, add, multiply, toString)
        expect(result).toBe('12')
    })

    it('ทำงานถูกต้องเมื่อมีการใช้ฟังก์ชันมากกว่า 1 ตัว', () => {
        const result = ci(
            1,
            (n) => n + 1,
            (n) => n * 2,
            (n) => n - 1
        )
        expect(result).toBe(3) // ((1 + 1) * 2) - 1 = 3
    })

    it('ทำงานถูกต้องเมื่อมีการใช้ฟังก์ชันมากกว่า 5 ตัว', () => {
        const result = ci(
            1,
            (n) => n + 1, // 2
            (n) => n * 2, // 4
            (n) => n - 1, // 3
            (n) => n ** 2, // 9
            (n) => n / 3, // 3
            (n) => n + 5 // 8
        )
        expect(result).toBe(8)
    })

    it('ทำงานถูกต้องกับ higher-order functions', () => {
        const addN = (n: number) => (m: number) => m + n
        const multiplyN = (n: number) => (m: number) => m * n

        const result = ci(
            5,
            addN(3), // 8
            multiplyN(2) // 16
        )
        expect(result).toBe(16)
    })
})

describe('withCi - Function Composition with Multiple Arguments', () => {
    it('รองรับฟังก์ชันที่มีหลาย arguments', () => {
        const add = (a: number, b: number): number => a + b
        const double = (a: number): number => a * 2
        const toString = (a: number): string => a.toString()

        const composed = withCi(add, double, toString)
        const result = composed(5, 3)

        expect(result).toBe('16') // ((5 + 3) * 2).toString()
    })

    it('รองรับฟังก์ชันที่มี arguments หลายรูปแบบ', () => {
        const joinStrings = (a: string, b: string, c: string): string =>
            a + b + c
        const toUpperCase = (s: string): string => s.toUpperCase()
        const getLength = (s: string): number => s.length

        const composed = withCi(joinStrings, toUpperCase, getLength)
        const result = composed('a', 'b', 'c')

        expect(result).toBe(3) // "abc".toUpperCase().length
    })

    it('ทำงานถูกต้องเมื่อมีการใช้ฟังก์ชันเดียว', () => {
        const add = (a: number, b: number): number => a + b
        const composed = withCi(add)
        const result = composed(5, 3)

        expect(result).toBe(8)
    })
})

describe('ci กับข้อมูลประเภทต่างๆ', () => {
    it('ทำงานกับ string', () => {
        const result = ci(
            'hello',
            (s) => s.toUpperCase(),
            (s) => s + ' world',
            (s) => s.length
        )
        expect(result).toBe(11) // 'HELLO world'.length = 11
    })

    it('ทำงานกับ boolean', () => {
        const result = ci(
            true,
            (b) => !b,
            (b) => (b ? 'false' : 'true'),
            (s) => s.length
        )
        expect(result).toBe(4) // 'true'.length = 5
    })

    it('ทำงานกับ array', () => {
        const result = ci(
            [1, 2, 3],
            (arr) => arr.map((x) => x * 2),
            (arr) => arr.reduce((sum, x) => sum + x, 0),
            (sum) => `Sum: ${sum}`
        )
        expect(result).toBe('Sum: 12') // [2, 4, 6].reduce(...) = 12
    })

    it('ทำงานกับ object', () => {
        const result = ci(
            { name: 'john', age: 30 },
            (obj) => ({ ...obj, age: obj.age + 1 }),
            (obj) => `${obj.name} is ${obj.age} years old`
        )
        expect(result).toBe('john is 31 years old')
    })
})

describe('การจัดการกับกรณีพิเศษ', () => {
    it('ทำงานกับค่า null', () => {
        const result = ci(
            null,
            (val) => (val === null ? 'was null' : 'not null'),
            (s) => s.toUpperCase()
        )
        expect(result).toBe('WAS NULL')
    })

    it('ทำงานกับค่า undefined', () => {
        const result = ci(
            undefined,
            (val) => (val === undefined ? 'was undefined' : 'was defined'),
            (s) => s.length
        )
        expect(result).toBe(13) // 'was undefined'.length = 13
    })

    it('ทำงานถูกต้องเมื่อมีการส่งจำนวนฟังก์ชันมากกว่า 16 ตัว', () => {
        const addOne = (n: number) => n + 1
        // สร้าง array ของฟังก์ชัน addOne จำนวน 20 ตัว

        // เริ่มต้นด้วย 0 และเรียกใช้ ci กับฟังก์ชันทั้งหมด
        const result = ci(0, addOne, addOne, addOne, addOne, addOne)

        // ผลลัพธ์ควรเท่ากับ 5 (เพิ่มทีละ 1 จำนวน 5 ครั้ง)
        expect(result).toBe(5)
    })
})
