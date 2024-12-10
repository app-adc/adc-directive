import { describe, expect, it } from 'vitest'
import { chunkArray, mapArray } from '../fnArray'

describe('mapArray', () => {
    it('ควรแปลง array ซ้อนกันหลายชั้นให้เป็น array ชั้นเดียว', () => {
        // เตรียมข้อมูลทดสอบ
        const input = [1, [2, 3, [4, 5, [6]]]]
        const expected = [1, 2, 3, 4, 5, 6]

        // เรียกใช้ฟังก์ชันและตรวจสอบผลลัพธ์
        const result = mapArray(input)
        expect(result).toEqual(expected)
    })

    it('ควรจัดการกับ array ที่มีข้อมูลหลายประเภท', () => {
        const input = ['a', [1, true, ['b', [null, undefined]]]]
        const expected = ['a', 1, true, 'b', null, undefined]
        expect(mapArray(input)).toEqual(expected)
    })

    it('ควรคืนค่า array ว่างเมื่อ input เป็น array ว่าง', () => {
        expect(mapArray([])).toEqual([])
    })

    it('ควรจัดการกับ array ที่มีแต่ array ว่างซ้อนกัน', () => {
        const input = [[], [[]], [[], []]]
        expect(mapArray(input)).toEqual([])
    })

    it('ควรรักษาลำดับของข้อมูลตาม input', () => {
        const input = [1, [2, [3]], 4, [5, [6, [7]]]]
        const expected = [1, 2, 3, 4, 5, 6, 7]
        expect(mapArray(input)).toEqual(expected)
    })
})

describe('chunkArray', () => {
    it('ควรแบ่ง array เป็นกลุ่มตามขนาดที่กำหนด', () => {
        const input = [1, 2, 3, 4, 5]
        const size = 2
        const expected = [[1, 2], [3, 4], [5]]

        const result = chunkArray(input, size)
        expect(result).toEqual(expected)
    })

    it('ควรจัดการกับขนาดกลุ่มที่เท่ากับความยาว array', () => {
        const input = [1, 2, 3]
        const size = 3
        const expected = [[1, 2, 3]]
        expect(chunkArray(input, size)).toEqual(expected)
    })

    it('ควรจัดการกับขนาดกลุ่มที่มากกว่าความยาว array', () => {
        const input = [1, 2, 3]
        const size = 5
        const expected = [[1, 2, 3]]
        expect(chunkArray(input, size)).toEqual(expected)
    })

    it('ควรคืนค่า array ว่างเมื่อ input เป็น array ว่าง', () => {
        expect(chunkArray([], 2)).toEqual([])
    })

    it('ควรจัดการกับข้อมูลหลายประเภท', () => {
        const input = [1, 'a', true, null, undefined]
        const size = 2
        const expected = [[1, 'a'], [true, null], [undefined]]
        expect(chunkArray(input, size)).toEqual(expected)
    })

    it('ควรจัดการกับขนาดกลุ่มเป็น 1', () => {
        const input = [1, 2, 3]
        const size = 1
        const expected = [[1], [2], [3]]
        expect(chunkArray(input, size)).toEqual(expected)
    })
})
