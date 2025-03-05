import { describe, expect, it } from 'vitest'
import { chunkArray, mapArray, range } from '../fnArray'

describe('mapArray', () => {
    it('ควรทำการ flatten array หลายระดับให้เป็นระดับเดียว', () => {
        // Test case 1: flatten array ที่มีหลายระดับ
        const input = [1, [2, 3, [4, 5, [6]]]]
        const expected = [1, 2, 3, 4, 5, 6]
        expect(mapArray(input)).toEqual(expected)

        // Test case 2: array ที่มีระดับเดียวควรเหมือนเดิม
        const flatInput = [1, 2, 3, 4, 5]
        expect(mapArray(flatInput)).toEqual(flatInput)

        // Test case 3: array ที่มีหลายระดับและมีค่าซ้ำ
        const duplicateInput = [1, [2, 3], [3, [4, 5]], [5, 6]]
        const duplicateExpected = [1, 2, 3, 3, 4, 5, 5, 6]
        expect(mapArray(duplicateInput)).toEqual(duplicateExpected)

        // Test case 4: array ว่าง
        expect(mapArray([])).toEqual([])

        // Test case 5: array ที่มีค่าว่างหรือ null
        const withEmptyValues = [1, [2, null, [3, undefined, [4, '', [5]]]]]
        const withEmptyValuesExpected = [1, 2, null, 3, undefined, 4, '', 5]
        expect(mapArray(withEmptyValues)).toEqual(withEmptyValuesExpected)
    })
})

describe('chunkArray', () => {
    it('ควรแบ่ง array เป็นกลุ่มตามขนาดที่กำหนด', () => {
        // Test case 1: แบ่งเป็นกลุ่มละ 2
        const input = [1, 2, 3, 4, 5]
        const expected = [[1, 2], [3, 4], [5]]
        expect(chunkArray(input, 2)).toEqual(expected)

        // Test case 2: แบ่งเป็นกลุ่มละ 3
        const input2 = [1, 2, 3, 4, 5, 6, 7, 8]
        const expected2 = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8],
        ]
        expect(chunkArray(input2, 3)).toEqual(expected2)

        // Test case 3: กรณีที่ขนาดกลุ่มใหญ่กว่าจำนวนสมาชิก
        const input3 = [1, 2, 3]
        const expected3 = [[1, 2, 3]]
        expect(chunkArray(input3, 5)).toEqual(expected3)

        // Test case 4: กรณี array ว่าง
        expect(chunkArray([], 2)).toEqual([])

        // Test case 5: กรณีที่ขนาดกลุ่มเท่ากับ 1
        const input5 = [1, 2, 3]
        const expected5 = [[1], [2], [3]]
        expect(chunkArray(input5, 1)).toEqual(expected5)

        // Test case 6: กรณีที่มีทั้งตัวเลขและข้อความ
        const mixedInput = [1, 'a', 2, 'b', 3]
        const mixedExpected = [[1, 'a'], [2, 'b'], [3]]
        expect(chunkArray(mixedInput, 2)).toEqual(mixedExpected)
    })
})

describe('range', () => {
    it('ควรสร้าง array ของตัวเลขในช่วงที่กำหนด (แบบปกติ)', () => {
        // Test case 1: ช่วงเลขจากน้อยไปมาก
        expect(range(1, 5)).toEqual([1, 2, 3, 4, 5])

        // Test case 2: ช่วงเลขจากมากไปน้อย
        expect(range(5, 1)).toEqual([5, 4, 3, 2, 1])

        // Test case 3: กรณีที่ start และ end เท่ากัน
        expect(range(5, 5)).toEqual([5])

        // Test case 4: กรณีที่ start และ end เป็นเลขลบ
        expect(range(-3, -1)).toEqual([-3, -2, -1])
        expect(range(-1, -3)).toEqual([-1, -2, -3])
    })

    it('ควรสร้าง array กรณีใช้ step', () => {
        // Test case 1: ช่วงเลขจากน้อยไปมากพร้อมกำหนด step
        expect(range(1, 10, 3)).toEqual([1, 4, 7, 10])

        // Test case 2: ช่วงเลขจากมากไปน้อยพร้อมกำหนด step
        expect(range(10, 1, 3)).toEqual([10, 7, 4, 1])
    })

    it('ควรส่ง error กรณี step ไม่ถูกต้อง', () => {
        // ทดสอบกรณี step=0 ซึ่งควร throw error
        expect(() => range(1, 5, 0)).toThrow()

        // ทดสอบกรณี step<0 ซึ่งควร throw error
        expect(() => range(1, 5, -1)).toThrow()
    })
})
