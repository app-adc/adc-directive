import { describe, expect, it, vi } from 'vitest'
import { runProcess } from '../fnRun'

describe('runProcess', () => {
    // ทดสอบการใช้งานพื้นฐาน - ทำงานกับ array ปกติ
    it('ควรทำงานกับ array ปกติได้อย่างถูกต้อง', () => {
        const items = [1, 2, 3, 4, 5]
        const result: number[] = []

        runProcess(items, (item) => {
            result.push(item)
        })

        expect(result).toEqual([1, 2, 3, 4, 5])
    })

    // ทดสอบการใช้ index
    it('ควรส่ง index ที่ถูกต้องในแต่ละรอบ', () => {
        const items = ['a', 'b', 'c']
        const indexes: number[] = []

        runProcess(items, (_, index) => {
            indexes.push(index as number)
        })

        expect(indexes).toEqual([0, 1, 2])
    })

    // ทดสอบการกำหนดจุดเริ่มต้น
    it('ควรเริ่มทำงานจากตำแหน่งที่กำหนดได้', () => {
        const items = [1, 2, 3, 4, 5]
        const result: number[] = []

        runProcess(
            items,
            (item) => {
                result.push(item)
            },
            2
        )

        expect(result).toEqual([3, 4, 5])
    })

    // ทดสอบการกำหนดช่วง
    it('ควรทำงานในช่วงที่กำหนดได้', () => {
        const items = [1, 2, 3, 4, 5]
        const result: number[] = []

        runProcess(
            items,
            (item) => {
                result.push(item)
            },
            [1, 3]
        )

        expect(result).toEqual([2, 3, 4])
    })

    // ทดสอบกับ array ว่าง
    it('ควรจัดการกรณี array ว่างได้', () => {
        const items: number[] = []
        const mockFn = vi.fn()

        runProcess(items, mockFn)

        expect(mockFn).not.toHaveBeenCalled()
    })

    // ทดสอบการส่งค่า startIndex เกินขนาด array
    it('ไม่ควรทำงานเมื่อ startIndex เกินขนาด array', () => {
        const items = [1, 2, 3]
        const mockFn = vi.fn()

        runProcess(items, mockFn, 5)

        expect(mockFn).not.toHaveBeenCalled()
    })

    // ทดสอบการทำงานกับข้อมูลประเภทต่างๆ
    it('ควรทำงานกับข้อมูลหลายประเภทได้', () => {
        const items = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' },
        ]
        const result: any[] = []

        runProcess(items, (item) => {
            result.push(item)
        })

        expect(result).toEqual(items)
    })

    // ทดสอบการส่งช่วงที่ไม่ถูกต้อง
    it('ควรจัดการกรณีส่งช่วงที่ไม่ถูกต้องได้', () => {
        const items = [1, 2, 3, 4, 5]
        const result: number[] = []

        runProcess(
            items,
            (item) => {
                result.push(item)
            },
            [3, 1]
        ) // ส่งช่วงที่ start มากกว่า end

        expect(result).toEqual([])
    })
})
