// ประเภทข้อมูล input สำหรับ pagination
export type PaginationParams = {
    /** หน้าปัจจุบัน (เริ่มจาก 1) */
    page: number
    /** จำนวนรายการต่อหน้า */
    limit: number
    /** จำนวนรายการทั้งหมด */
    total: number
}

// ข้อมูล meta ที่คำนวณได้จาก pagination
export type PaginationMeta = {
    page: number
    limit: number
    total: number
    /** จำนวนหน้าทั้งหมด */
    totalPages: number
    /** มีหน้าถัดไปหรือไม่ */
    hasNext: boolean
    /** มีหน้าก่อนหน้าหรือไม่ */
    hasPrev: boolean
    /** ค่า offset สำหรับ query ฐานข้อมูล */
    offset: number
}

// ผลลัพธ์จาก paginationResponse
export type PaginationResult<T> = {
    data: T[]
    meta: PaginationMeta
}

/**
 * คำนวณค่า offset สำหรับใช้กับ query ฐานข้อมูล
 *
 * @param page - หน้าปัจจุบัน (เริ่มจาก 1)
 * @param limit - จำนวนรายการต่อหน้า
 * @returns offset ที่ใช้กับ SKIP / OFFSET ใน SQL หรือ ORM
 *
 * @example
 * toOffset(1, 10) // → 0
 * toOffset(3, 10) // → 20
 */
export const toOffset = (page: number, limit: number): number => {
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, limit)
    return (safePage - 1) * safeLimit
}

/**
 * คำนวณข้อมูล pagination meta จาก page, limit, total
 *
 * @param params - { page, limit, total }
 * @returns PaginationMeta ที่มี totalPages, hasNext, hasPrev, offset
 *
 * @example
 * paginationMeta({ page: 2, limit: 10, total: 95 })
 * // → { page: 2, limit: 10, total: 95, totalPages: 10, hasNext: true, hasPrev: true, offset: 10 }
 */
export const paginationMeta = (params: PaginationParams): PaginationMeta => {
    const page = Math.max(1, params.page)
    const limit = Math.max(1, params.limit)
    const total = Math.max(0, params.total)
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit)

    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        offset: toOffset(page, limit),
    }
}

/**
 * ห่อข้อมูลรายการพร้อม pagination meta สำหรับ API response
 *
 * @template T - ประเภทของข้อมูลในรายการ
 * @param data - รายการข้อมูลในหน้าปัจจุบัน
 * @param params - { page, limit, total }
 * @returns { data, meta } พร้อมใช้ส่งจาก controller
 *
 * @example
 * paginationResponse(users, { page: 1, limit: 10, total: 50 })
 * // → { data: [...], meta: { page: 1, limit: 10, total: 50, totalPages: 5, hasNext: true, hasPrev: false, offset: 0 } }
 */
export const paginationResponse = <T>(
    data: T[],
    params: PaginationParams
): PaginationResult<T> => ({
    data,
    meta: paginationMeta(params),
})
