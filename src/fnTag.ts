// ประเภทข้อมูลสำหรับ Tag pattern
export type Tag<L, R> = Left<L> | Right<R>
type Left<L> = { tag: 'left'; left: L }
type Right<R> = { tag: 'right'; right: R }

// Example
// const checkPremiumEligibility = (
//     user: typeof userData & { retirementAge?: number }
// ) => {
//     if (user.age > 30) {
//         return left('ไม่มีสิทธิ์รับส่วนลดสำหรับคนอายุน้อย')
//     } else {
//         return right({
//             ...user,
//             isPremium: true,
//             discountCode: 'YOUNG30',
//         })
//     }
// }

// คอนสตรัคเตอร์สำหรับสร้าง Left และ Right
export const left = <L, R = never>(left: L): Tag<L, R> => ({
    tag: 'left',
    left,
})

export const right = <R, L = never>(right: R): Tag<L, R> => ({
    tag: 'right',
    right,
})

// TagParam รองรับทั้งค่าปกติและค่า Tag
type TagParam<V> = V | Tag<string, V>

// ผลลัพธ์จากการเรียก ciTag เพิ่ม key message
type TagResult<V> = {
    value: V | undefined
    tag: 'left' | 'right' | 'error' // เพิ่ม tag 'error' เพื่อระบุว่าเกิด error
    message: string // เพิ่ม key message เพื่อเก็บข้อความเพิ่มเติม
    beforeValue: any // เก็บค่าสุดท้ายก่อนที่จะเกิด error
    logs: Array<{
        index: number // ลำดับของฟังก์ชัน
        input: any // ค่า input ของฟังก์ชัน
        output: any // ค่า output ของฟังก์ชัน
        errorMessage?: string // ข้อความ error (ถ้ามี)
    }>
}

// ประกาศฟังก์ชัน ciTag ที่รองรับการ overloading
export function ciTag<A>(a: A): TagResult<A>
export function ciTag<A, B>(a: A, ab: (a: A) => TagParam<B>): TagResult<B>
export function ciTag<A, B, C>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>
): TagResult<C>
export function ciTag<A, B, C, D>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>
): TagResult<D>
export function ciTag<A, B, C, D, E>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>
): TagResult<E>
// ... สามารถเพิ่ม overloading เพิ่มเติมได้ตามต้องการ

// การเรียกใช้ฟังก์ชันทั่วไป
export function ciTag<A>(
    value: A,
    ...fns: Array<(a: any) => any>
): TagResult<any> {
    // กรณีไม่มีฟังก์ชันที่ส่งเข้ามา
    if (fns.length === 0) {
        return {
            value,
            tag: 'right',
            message: '', // เพิ่ม message เป็นค่าว่างโดยค่าเริ่มต้น
            beforeValue: undefined,
            logs: [],
        }
    }

    // สร้าง array สำหรับเก็บ logs
    const logs: Array<{
        index: number
        input: any
        output: any
        errorMessage?: string
    }> = []

    // ประกาศตัวแปรนอก try block
    let beforeValue: any = value

    try {
        // เริ่มต้นด้วยค่า value และ tag ว่าง
        let result: any = value
        let errorTag: TagResult<any>['tag'] = 'right' // เพิ่มตัวแปรสำหรับเก็บ tag error
        let errorMessage: string = '' // เพิ่มตัวแปรสำหรับเก็บข้อความ error message

        // ทำ functional composition
        for (let i = 0; i < fns.length; i++) {
            // เก็บค่าปัจจุบันก่อนประมวลผลฟังก์ชันถัดไป
            beforeValue = result

            // สร้าง log entry เบื้องต้น
            const logEntry = {
                index: i,
                input: beforeValue,
                output: undefined as any,
                errorMessage: undefined as string | undefined,
            }

            try {
                // ประมวลผลฟังก์ชันถัดไป
                const currentResult = fns[i](result)

                // ตรวจสอบว่าผลลัพธ์เป็น Tag pattern หรือไม่
                if (
                    currentResult &&
                    typeof currentResult === 'object' &&
                    'tag' in currentResult
                ) {
                    if (currentResult.tag === 'left') {
                        // กรณีเป็น Left (มี error)
                        errorTag = 'left'
                        errorMessage = currentResult.left // เก็บข้อความ error
                        logEntry.output = undefined
                        logEntry.errorMessage = currentResult.left
                        result = undefined
                    } else if (currentResult.tag === 'right') {
                        // กรณีเป็น Right (สำเร็จ)
                        logEntry.output = currentResult.right
                        result = currentResult.right
                    } else if (currentResult.tag) {
                        // รองรับรูปแบบเดิมที่อาจมี tag อื่นๆ
                        errorTag = currentResult.tag
                        errorMessage = currentResult.left || currentResult.tag // เก็บ message ถ้ามี หรือใช้ tag แทน
                        logEntry.output = undefined
                        logEntry.errorMessage = errorMessage
                        result = undefined
                    }
                } else {
                    // กรณีผลลัพธ์เป็นค่าปกติ
                    logEntry.output = currentResult
                    result = currentResult
                }
            } catch (error) {
                // กรณีเกิด error ในการเรียกฟังก์ชัน
                errorTag = 'error'
                errorMessage =
                    error instanceof Error ? error.message : 'Unknown error'
                logEntry.errorMessage = errorMessage
                result = undefined
            }

            // เพิ่ม log entry
            logs.push(logEntry)

            // ถ้ามี error ให้หยุดการประมวลผล
            if (errorTag !== 'right') {
                break
            }
        }

        // คืนค่าผลลัพธ์พร้อม logs
        return {
            value: result,
            tag: errorTag,
            message: errorMessage, // เพิ่ม message ในผลลัพธ์
            beforeValue: errorTag ? beforeValue : undefined,
            logs,
        }
    } catch (error) {
        // กรณีเกิด error ในระหว่างการประมวลผล
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error in ciTag'
        return {
            value: undefined,
            tag: 'error',
            message: errorMessage, // เพิ่ม message ในผลลัพธ์
            beforeValue,
            logs,
        }
    }
}

/**
 * สร้างฟังก์ชันตรวจสอบที่คืนค่าในรูปแบบ Tag
 *
 * @param validate ฟังก์ชันตรวจสอบที่คืนค่า boolean
 * @returns ฟังก์ชันที่รับค่า error message และค่าที่ต้องการตรวจสอบ
 */
export const validateTag =
    <V, T = string>(validate: (value: V) => boolean) =>
    (errorMessage: T) =>
    (value: V): Tag<T, V> => {
        return validate(value) ? right(value) : left(errorMessage)
    }
