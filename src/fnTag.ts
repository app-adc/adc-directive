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
export function ciTag<A, B, C, D, E, F>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>
): TagResult<F>
export function ciTag<A, B, C, D, E, F, G>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>
): TagResult<G>
export function ciTag<A, B, C, D, E, F, G, H>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>
): TagResult<H>
export function ciTag<A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>,
    hi: (h: H) => TagParam<I>
): TagResult<I>
export function ciTag<A, B, C, D, E, F, G, H, I, J>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>,
    hi: (h: H) => TagParam<I>,
    ij: (i: I) => TagParam<J>
): TagResult<J>
export function ciTag<A, B, C, D, E, F, G, H, I, J, K>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>,
    hi: (h: H) => TagParam<I>,
    ij: (i: I) => TagParam<J>,
    jk: (j: J) => TagParam<K>
): TagResult<K>
export function ciTag<A, B, C, D, E, F, G, H, I, J, K, L>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>,
    hi: (h: H) => TagParam<I>,
    ij: (i: I) => TagParam<J>,
    jk: (j: J) => TagParam<K>,
    kl: (k: K) => TagParam<L>
): TagResult<L>
export function ciTag<A, B, C, D, E, F, G, H, I, J, K, L, M>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>,
    hi: (h: H) => TagParam<I>,
    ij: (i: I) => TagParam<J>,
    jk: (j: J) => TagParam<K>,
    kl: (k: K) => TagParam<L>,
    lm: (l: L) => TagParam<M>
): TagResult<M>
export function ciTag<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>,
    hi: (h: H) => TagParam<I>,
    ij: (i: I) => TagParam<J>,
    jk: (j: J) => TagParam<K>,
    kl: (k: K) => TagParam<L>,
    lm: (l: L) => TagParam<M>,
    mn: (m: M) => TagParam<N>
): TagResult<N>
export function ciTag<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>,
    hi: (h: H) => TagParam<I>,
    ij: (i: I) => TagParam<J>,
    jk: (j: J) => TagParam<K>,
    kl: (k: K) => TagParam<L>,
    lm: (l: L) => TagParam<M>,
    mn: (m: M) => TagParam<N>,
    no: (n: N) => TagParam<O>
): TagResult<O>

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

/**
 * ฟังก์ชัน tags สำหรับเรียงร้อยการทำงานของฟังก์ชันต่างๆ ตาม Tag pattern
 * คล้ายกับ pipe หรือ compose แต่มีการจัดการกับ error pattern แบบ Either monad
 *
 * จะดำเนินการต่อเนื่องเมื่อผลลัพธ์เป็น "right" และจะหยุดทันทีเมื่อเจอ "left"
 */

// Type Overloads สำหรับฟังก์ชัน tags
export function tags<A, E = string>(a: A): Tag<E, A>
export function tags<A, B, E = string>(a: A, ab: (a: A) => Tag<E, B>): Tag<E, B>
export function tags<A, B, C, E = string>(
    a: A,
    ab: (a: A) => Tag<E, B>,
    bc: (b: B) => Tag<E, C>
): Tag<E, C>
export function tags<A, B, C, D, E = string>(
    a: A,
    ab: (a: A) => Tag<E, B>,
    bc: (b: B) => Tag<E, C>,
    cd: (c: C) => Tag<E, D>
): Tag<E, D>
export function tags<A, B, C, D, F, E = string>(
    a: A,
    ab: (a: A) => Tag<E, B>,
    bc: (b: B) => Tag<E, C>,
    cd: (c: C) => Tag<E, D>,
    de: (d: D) => Tag<E, F>
): Tag<E, F>
export function tags<A, B, C, D, F, G, E = string>(
    a: A,
    ab: (a: A) => Tag<E, B>,
    bc: (b: B) => Tag<E, C>,
    cd: (c: C) => Tag<E, D>,
    de: (d: D) => Tag<E, F>,
    ef: (f: F) => Tag<E, G>
): Tag<E, G>
export function tags<A, B, C, D, F, G, H, E = string>(
    a: A,
    ab: (a: A) => Tag<E, B>,
    bc: (b: B) => Tag<E, C>,
    cd: (c: C) => Tag<E, D>,
    de: (d: D) => Tag<E, F>,
    ef: (f: F) => Tag<E, G>,
    fg: (g: G) => Tag<E, H>
): Tag<E, H>
export function tags<A, B, C, D, F, G, H, I, E = string>(
    a: A,
    ab: (a: A) => Tag<E, B>,
    bc: (b: B) => Tag<E, C>,
    cd: (c: C) => Tag<E, D>,
    de: (d: D) => Tag<E, F>,
    ef: (f: F) => Tag<E, G>,
    fg: (g: G) => Tag<E, H>,
    gh: (h: H) => Tag<E, I>
): Tag<E, I>
export function tags<A, B, C, D, F, G, H, I, J, E = string>(
    a: A,
    ab: (a: A) => Tag<E, B>,
    bc: (b: B) => Tag<E, C>,
    cd: (c: C) => Tag<E, D>,
    de: (d: D) => Tag<E, F>,
    ef: (f: F) => Tag<E, G>,
    fg: (g: G) => Tag<E, H>,
    gh: (h: H) => Tag<E, I>,
    hi: (i: I) => Tag<E, J>
): Tag<E, J>

// การเรียกใช้งานฟังก์ชันหลัก
export function tags<A, E = string>(
    a: A,
    ...fns: Array<(value: any) => Tag<E, any>>
): Tag<E, any> {
    // กรณีไม่มีฟังก์ชันที่ส่งเข้ามา ให้แปลงค่าเริ่มต้นเป็น right
    if (fns.length === 0) {
        return right(a)
    }

    try {
        // เริ่มต้นด้วยการแปลงค่าเริ่มต้นเป็น right
        let result: Tag<E, any> = right(a)

        // วนลูปผ่านทุกฟังก์ชัน
        for (let i = 0; i < fns.length; i++) {
            // ถ้าผลลัพธ์ปัจจุบันเป็น left ให้หยุดการประมวลผลและคืนค่า left นั้น
            if (result.tag === 'left') {
                return result
            }

            // ดึงค่า right ออกมาเพื่อส่งเข้าฟังก์ชันต่อไป
            const currentValue = result.right

            try {
                // เรียกฟังก์ชันปัจจุบัน
                result = fns[i](currentValue)

                // ตรวจสอบว่าผลลัพธ์เป็น Tag หรือไม่
                if (
                    !result ||
                    typeof result !== 'object' ||
                    !('tag' in result)
                ) {
                    // ถ้าไม่ใช่ Tag ให้แปลงเป็น right
                    result = right(result)
                }
            } catch (error) {
                // กรณีเกิด error ในการเรียกฟังก์ชัน ให้แปลงเป็น left
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
                return left(errorMessage as E)
            }
        }

        // คืนค่าผลลัพธ์สุดท้าย
        return result
    } catch (error) {
        // กรณีเกิด error ในภาพรวม
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
        return left(errorMessage as E)
    }
}

/**
 * helper function สำหรับแปลงค่าใน tag.right โดยไม่เปลี่ยนแปลงสถานะของ Tag
 *
 * @template E - ประเภทข้อมูลของ error (left)
 * @template A - ประเภทข้อมูลที่รับเข้ามา
 * @template B - ประเภทข้อมูลที่ส่งออก
 *
 * @param fn - ฟังก์ชันที่ใช้แปลงค่า
 * @example mapLeft((success) => `${success} สร้างnew value tag.right`)(tag)
 */
export const mapRight =
    <E, A, B>(fn: (a: A) => B) =>
    (tag: Tag<E, A>): Tag<E, B> => {
        // ถ้าเป็น left ให้คืนค่า left นั้นโดยตรง
        if (tag.tag === 'left') {
            return tag as Tag<E, B>
        }
        // ถ้าเป็น right ให้แปลงค่าและคืนค่า right ใหม่
        try {
            return right(fn(tag.right))
        } catch (error) {
            // กรณีเกิด error ขณะแปลงค่า
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'เกิดข้อผิดพลาดขณะแปลงค่า'
            return left(errorMessage as E)
        }
    }

/**
 * helper function สำหรับแปลงค่าใน tag.left โดยไม่เปลี่ยนแปลงสถานะของ Tag
 *
 * @template E - ประเภทข้อมูลของ error (left) ที่รับเข้ามา
 * @template F - ประเภทข้อมูลของ error (left) ที่ส่งออก
 * @template A - ประเภทข้อมูลใน right
 *
 * @param fn - ฟังก์ชันที่ใช้แปลงค่า error
 * @example mapLeft((err) => `${err} สร้างnew message tag.left`)(tag)
 */
export const mapLeft =
    <E, F, A>(fn: (e: E) => F) =>
    (tag: Tag<E, A>): Tag<F, A> => {
        // ถ้าเป็น right ให้คืนค่า right นั้นโดยตรง
        if (tag.tag === 'right') {
            return tag as Tag<F, A>
        }
        // ถ้าเป็น left ให้แปลงค่า error และคืนค่า left ใหม่
        try {
            return left(fn(tag.left))
        } catch (error) {
            // กรณีเกิด error ขณะแปลงค่า
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'เกิดข้อผิดพลาดขณะแปลงค่า error'
            return left(errorMessage as F)
        }
    }

/**
 * ฟังก์ชันสำหรับตรวจสอบค่าตามเงื่อนไขที่กำหนด และคืนค่า Tag
 *
 * @template A - ประเภทข้อมูลที่ตรวจสอบ
 * @template E - ประเภทข้อมูลของ error (left)
 *
 * @param predicate - ฟังก์ชันตรวจสอบเงื่อนไข
 * @param errorMsg - ข้อความ error || data error ที่จะแสดงเมื่อไม่ผ่านเงื่อนไข
 * @returns ฟังก์ชันที่รับค่าและตรวจสอบเงื่อนไข คืนค่า Tag
 */
export const makeTag =
    <A, E = string>(predicate: (a: A) => boolean, errorMsg: E) =>
    (value: A): Tag<E, A> => {
        return predicate(value) ? right(value) : left(errorMsg)
    }
