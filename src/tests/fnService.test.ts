import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { copyDeep, delayPromise } from '../fnService'

describe('copyDeep', () => {
    // ทดสอบการ copy ข้อมูลพื้นฐาน
    it('ควร copy primitive values ได้ถูกต้อง', () => {
        expect(copyDeep(123)).toBe(123)
        expect(copyDeep('test')).toBe('test')
        expect(copyDeep(true)).toBe(true)
        expect(copyDeep(null)).toBe(null)
        expect(copyDeep(undefined)).toBe(undefined)
    })

    // ทดสอบการ copy array
    it('ควร copy array ได้ถูกต้องและเป็น deep copy', () => {
        const original = [1, [2, 3], { a: 4 }]
        const copied = copyDeep(original)

        expect(copied).toEqual(original)
        expect(copied).not.toBe(original)
        expect(copied[1]).not.toBe(original[1])
        expect(copied[2]).not.toBe(original[2])
    })

    // ทดสอบการ copy object
    it('ควร copy object ได้ถูกต้องและเป็น deep copy', () => {
        const original = {
            a: 1,
            b: { c: 2 },
            d: [3, 4],
        }
        const copied = copyDeep(original)

        expect(copied).toEqual(original)
        expect(copied).not.toBe(original)
        expect(copied.b).not.toBe(original.b)
        expect(copied.d).not.toBe(original.d)
    })

    // ทดสอบการ copy Date object
    it('ควร copy Date object ได้ถูกต้อง', () => {
        const original = new Date()
        const copied = copyDeep(original)

        expect(copied).toEqual(original)
        expect(copied).not.toBe(original)
        expect(copied.getTime()).toBe(original.getTime())
    })

    // ทดสอบการ copy RegExp
    it('ควร copy RegExp ได้ถูกต้อง', () => {
        const original = /test/gi
        const copied = copyDeep(original)

        expect(copied).toEqual(original)
        expect(copied).not.toBe(original)
        expect(copied.source).toBe(original.source)
        expect(copied.flags).toBe(original.flags)
    })

    // ทดสอบการ copy Set
    it('ควร copy Set ได้ถูกต้อง', () => {
        const original = new Set([1, { a: 2 }, [3, 4]])
        const copied = copyDeep(original)

        expect(copied).toEqual(original)
        expect(copied).not.toBe(original)
        expect(Array.from(copied)[1]).toEqual(Array.from(original)[1])
        expect(Array.from(copied)[1]).not.toBe(Array.from(original)[1])
    })

    // ทดสอบการจัดการ circular reference
    it('ควรจัดการ circular reference ได้ถูกต้อง', () => {
        const original: any = { a: 1 }
        original.self = original

        const copied = copyDeep(original)
        expect(copied.a).toBe(1)
        expect(copied.self).toBe(copied)
        expect(copied.self.self).toBe(copied)
    })
})

describe('delayPromise', () => {
    // เพิ่ม fake timers สำหรับการทดสอบ
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    // ทดสอบการหน่วงเวลาพื้นฐาน
    it('ควรหน่วงเวลาตามที่กำหนด', async () => {
        const promise = delayPromise(1000)

        vi.advanceTimersByTime(999)
        const earlyResult = await Promise.race([
            promise,
            Promise.resolve('early'),
        ])
        expect(earlyResult).toBe('early')

        vi.advanceTimersByTime(1)
        const result = await promise
        expect(result).toBe(undefined)
    })

    // ทดสอบการใช้งานกับ callback function
    it('ควรทำงานกับ callback function ได้ถูกต้อง', async () => {
        const callback = (x: number) => x * 2
        const promise = delayPromise(1000, () => callback(5))

        vi.advanceTimersByTime(1000)
        const result = await promise
        expect(result).toBe(10)
    })
})
