import { describe, expect, it } from 'vitest'
import { paginationMeta, paginationResponse, toOffset } from '../fnPagination'

describe('fnPagination', () => {
    // -----------------------------------------------------------------------------------
    describe('toOffset', () => {
        it('หน้าแรก offset ต้องเป็น 0', () => {
            expect(toOffset(1, 10)).toBe(0)
        })

        it('คำนวณ offset ของหน้าถัดไปได้ถูกต้อง', () => {
            expect(toOffset(2, 10)).toBe(10)
            expect(toOffset(3, 10)).toBe(20)
            expect(toOffset(5, 20)).toBe(80)
        })

        it('ป้องกัน page < 1 ให้ใช้ 1 แทน', () => {
            expect(toOffset(0, 10)).toBe(0)
            expect(toOffset(-5, 10)).toBe(0)
        })

        it('ป้องกัน limit < 1 ให้ใช้ 1 แทน', () => {
            expect(toOffset(2, 0)).toBe(1)
            expect(toOffset(2, -10)).toBe(1)
        })
    })

    // -----------------------------------------------------------------------------------
    describe('paginationMeta', () => {
        it('คำนวณ meta ครบถ้วนสำหรับหน้ากลาง', () => {
            const meta = paginationMeta({ page: 2, limit: 10, total: 95 })
            expect(meta).toEqual({
                page: 2,
                limit: 10,
                total: 95,
                totalPages: 10,
                hasNext: true,
                hasPrev: true,
                offset: 10,
            })
        })

        it('hasNext เป็น false เมื่ออยู่หน้าสุดท้าย', () => {
            const meta = paginationMeta({ page: 10, limit: 10, total: 95 })
            expect(meta.hasNext).toBe(false)
            expect(meta.hasPrev).toBe(true)
        })

        it('hasPrev เป็น false เมื่ออยู่หน้าแรก', () => {
            const meta = paginationMeta({ page: 1, limit: 10, total: 95 })
            expect(meta.hasPrev).toBe(false)
            expect(meta.hasNext).toBe(true)
        })

        it('total เป็น 0 ให้ totalPages เป็น 0', () => {
            const meta = paginationMeta({ page: 1, limit: 10, total: 0 })
            expect(meta.totalPages).toBe(0)
            expect(meta.hasNext).toBe(false)
            expect(meta.hasPrev).toBe(false)
        })

        it('คำนวณ totalPages ปัดขึ้นเมื่อหารไม่ลงตัว', () => {
            const meta = paginationMeta({ page: 1, limit: 10, total: 91 })
            expect(meta.totalPages).toBe(10)
        })

        it('ป้องกัน page, limit, total ที่เป็นค่าไม่ถูกต้อง', () => {
            const meta = paginationMeta({ page: -1, limit: -5, total: -10 })
            expect(meta.page).toBe(1)
            expect(meta.limit).toBe(1)
            expect(meta.total).toBe(0)
        })
    })

    // -----------------------------------------------------------------------------------
    describe('paginationResponse', () => {
        it('ห่อข้อมูลพร้อม meta ได้ถูกต้อง', () => {
            const users = [{ id: 1 }, { id: 2 }]
            const result = paginationResponse(users, {
                page: 1,
                limit: 2,
                total: 10,
            })

            expect(result.data).toEqual(users)
            expect(result.meta.total).toBe(10)
            expect(result.meta.totalPages).toBe(5)
            expect(result.meta.hasNext).toBe(true)
            expect(result.meta.hasPrev).toBe(false)
        })

        it('รองรับ data array ว่าง', () => {
            const result = paginationResponse([], {
                page: 1,
                limit: 10,
                total: 0,
            })

            expect(result.data).toEqual([])
            expect(result.meta.totalPages).toBe(0)
            expect(result.meta.hasNext).toBe(false)
        })

        it('รองรับ generic type ต่างๆ', () => {
            const result = paginationResponse<string>(['a', 'b', 'c'], {
                page: 1,
                limit: 3,
                total: 3,
            })

            expect(result.data).toHaveLength(3)
            expect(result.meta.totalPages).toBe(1)
        })
    })
})
