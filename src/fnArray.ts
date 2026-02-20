/**
 * @category แปลงให้ Array ทุกตัวอยู่ในระดับที่เท่ากัน
 * @example
 * mapArray([1, [2, 3, [4, 5, [6]]]])
 * @returns [1,2,3,4,5,6]
 */
export function mapArray(items: Readonly<any[]>): any[] {
    return items.reduce((pre, cur) => {
        if (Array.isArray(cur)) pre.push(...mapArray(cur))
        else pre.push(cur)
        return pre
    }, [])
}

/**
 * @category Array slice
 * @example
 * chunkArray([1,2,3,4,5],2)
 * @returns [[1,2],[3,4],[5]]
 */
export function chunkArray<T>(items: Readonly<T[]>, n: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i <= items.length; i += n) {
        result.push(items.slice(i, i + n))
    }
    return result.filter((v) => v.length)
}

/**
 * กรอง array ให้เหลือเฉพาะรายการที่ไม่ซ้ำกันตาม key function
 * รักษาลำดับของรายการแรกที่พบ
 *
 * @param items - array ที่ต้องการกรอง
 * @param fn - ฟังก์ชันที่ใช้สร้าง key สำหรับเปรียบเทียบ
 * @returns array ที่ไม่มีรายการซ้ำ
 *
 * @example
 * uniqueBy([{id:1},{id:2},{id:1}], i => i.id)
 * // → [{id:1},{id:2}]
 */
export const uniqueBy = <T>(
    items: ReadonlyArray<T>,
    fn: (item: T) => unknown
): T[] => {
    const seen = new Set()
    return items.filter((item) => {
        const key = fn(item)
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

/**
 * เรียงลำดับ array ตาม key function โดยไม่แก้ไข array ต้นฉบับ
 *
 * @param items - array ที่ต้องการเรียงลำดับ
 * @param fn - ฟังก์ชันที่ใช้ดึงค่าที่ต้องการเรียงลำดับ
 * @param order - ทิศทางการเรียง 'asc' หรือ 'desc' (default 'asc')
 * @returns array ใหม่ที่เรียงลำดับแล้ว
 *
 * @example
 * sortBy([{n:'b'},{n:'a'},{n:'c'}], i => i.n)       // → [{n:'a'},{n:'b'},{n:'c'}]
 * sortBy([{age:3},{age:1},{age:2}], i => i.age, 'desc') // → [{age:3},{age:2},{age:1}]
 */
export const sortBy = <T>(
    items: ReadonlyArray<T>,
    fn: (item: T) => number | string,
    order: 'asc' | 'desc' = 'asc'
): T[] => {
    return [...items].sort((a, b) => {
        const valA = fn(a)
        const valB = fn(b)
        let result: number
        if (typeof valA === 'string' && typeof valB === 'string') {
            result = valA.localeCompare(valB)
        } else {
            result = (valA as number) - (valB as number)
        }
        return order === 'desc' ? -result : result
    })
}

/**
 * หารายการใน array แรกที่ไม่มีอยู่ใน array ที่สอง
 *
 * @param a - array ต้นทาง
 * @param b - array ที่ใช้ตรวจสอบ
 * @returns array ที่มีเฉพาะรายการจาก a ที่ไม่มีใน b
 *
 * @example
 * arrayDifference([1,2,3,4], [2,4])  // → [1,3]
 * arrayDifference(['a','b'], ['b'])   // → ['a']
 */
export const arrayDifference = <T>(
    a: ReadonlyArray<T>,
    b: ReadonlyArray<T>
): T[] => {
    const bSet = new Set(b)
    return a.filter((item) => !bSet.has(item))
}

/**
 * @category สร้าง Array ของตัวเลขในช่วงที่กำหนด
 * @example
 * rangeArray(1, 5)
 * @returns [1, 2, 3, 4, 5]
 *
 * rangeArray(5, 1)
 * @returns [5, 4, 3, 2, 1]
 *
 * rangeArray(1, 10, 2)
 * @returns [1, 3, 5, 7, 9]
 */
export function range(start: number, end: number, step: number = 1): number[] {
    const isAscending = start <= end
    const result: number[] = []

    if (step <= 0) {
        throw new Error('Step must be a positive number')
    }

    if (isAscending) {
        for (let i = start; i <= end; i += step) {
            result.push(i)
        }
    } else {
        for (let i = start; i >= end; i -= step) {
            result.push(i)
        }
    }

    return result
}
