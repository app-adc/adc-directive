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
