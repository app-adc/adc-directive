// ประเภทข้อมูลสำหรับ Tag pattern
export type Tag<L, R> = Left<L> | Right<R>
type Left<L> = { tag: 'left'; error: L }
type Right<R> = { tag: 'right'; value: R }

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
export const left = <L, R = never>(error: L): Tag<L, R> => ({
    tag: 'left',
    error,
})

export const right = <R, L = never>(value: R): Tag<L, R> => ({
    tag: 'right',
    value,
})

// TagParam รองรับทั้งค่าปกติและค่า Tag
// type TagParam<V> = V | Tag<string, V>
// เพิ่ม TagParam รองรับทั้งค่าปกติและค่า Tag
export type TagParam<V, E = string> = V | Tag<E, V>

// ผลลัพธ์จากการเรียก logs เพิ่ม key message
type TagLog<V> = {
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

// ประกาศฟังก์ชัน logs ที่รองรับการ overloading
export function logs<A>(a: A): TagLog<A>
export function logs<A, B>(a: A, ab: (a: A) => TagParam<B>): TagLog<B>
export function logs<A, B, C>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>
): TagLog<C>
export function logs<A, B, C, D>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>
): TagLog<D>
export function logs<A, B, C, D, E>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>
): TagLog<E>
export function logs<A, B, C, D, E, F>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>
): TagLog<F>
export function logs<A, B, C, D, E, F, G>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>
): TagLog<G>
export function logs<A, B, C, D, E, F, G, H>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>
): TagLog<H>
export function logs<A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: (a: A) => TagParam<B>,
    bc: (b: B) => TagParam<C>,
    cd: (c: C) => TagParam<D>,
    de: (d: D) => TagParam<E>,
    ef: (e: E) => TagParam<F>,
    fg: (f: F) => TagParam<G>,
    gh: (g: G) => TagParam<H>,
    hi: (h: H) => TagParam<I>
): TagLog<I>
export function logs<A, B, C, D, E, F, G, H, I, J>(
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
): TagLog<J>

// การเรียกใช้ฟังก์ชันทั่วไป
export function logs<A>(value: A, ...fns: Array<(a: any) => any>): TagLog<any> {
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
        let errorTag: TagLog<any>['tag'] = 'right' // เพิ่มตัวแปรสำหรับเก็บ tag error
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
                        errorMessage = currentResult.error // เก็บข้อความ error
                        logEntry.output = undefined
                        logEntry.errorMessage = currentResult.error
                        result = undefined
                    } else if (currentResult.tag === 'right') {
                        // กรณีเป็น Right (สำเร็จ)
                        logEntry.output = currentResult.value
                        result = currentResult.value
                    } else if (currentResult.tag) {
                        // รองรับรูปแบบเดิมที่อาจมี tag อื่นๆ
                        errorTag = currentResult.tag
                        errorMessage = currentResult.error || currentResult.tag // เก็บ message ถ้ามี หรือใช้ tag แทน
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
            error instanceof Error ? error.message : 'Unknown error in logs'
        return {
            value: undefined,
            tag: 'error',
            message: errorMessage, // เพิ่ม message ในผลลัพธ์
            beforeValue,
            logs,
        }
    }
}

// ฟังก์ชันภายในสำหรับแปลงค่าให้เป็น Tag
const ensureTag = <V, E = string>(value: TagParam<V, E>): Tag<E, V> => {
    if (value && typeof value === 'object' && 'tag' in value) {
        return value as Tag<E, V>
    }
    return right(value as V)
}

/**
 * ฟังก์ชัน ciTag สำหรับเรียงร้อยการทำงานของฟังก์ชันต่างๆ ตาม Tag pattern
 * คล้ายกับ pipe หรือ compose แต่มีการจัดการกับ error pattern แบบ Either monad
 *
 * จะดำเนินการต่อเนื่องเมื่อผลลัพธ์เป็น "right" และจะหยุดทันทีเมื่อเจอ "left"
 */
export function ciTag<A, E = string>(a: TagParam<A, E>): Tag<E, A>
export function ciTag<A, B, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>
): Tag<E, B>
export function ciTag<A, B, C, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>
): Tag<E, C>
export function ciTag<A, B, C, D, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>
): Tag<E, D>
export function ciTag<A, B, C, D, F, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>
): Tag<E, F>
export function ciTag<A, B, C, D, F, G, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>,
    ef: (f: F) => TagParam<G, E>
): Tag<E, G>
export function ciTag<A, B, C, D, F, G, H, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>,
    ef: (f: F) => TagParam<G, E>,
    fg: (g: G) => TagParam<H, E>
): Tag<E, H>
export function ciTag<A, B, C, D, F, G, H, I, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>,
    ef: (f: F) => TagParam<G, E>,
    fg: (g: G) => TagParam<H, E>,
    gh: (h: H) => TagParam<I, E>
): Tag<E, I>
export function ciTag<A, B, C, D, F, G, H, I, J, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>,
    ef: (f: F) => TagParam<G, E>,
    fg: (g: G) => TagParam<H, E>,
    gh: (h: H) => TagParam<I, E>,
    hi: (i: I) => TagParam<J, E>
): Tag<E, J>
export function ciTag<A, B, C, D, F, G, H, I, J, K, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>,
    ef: (f: F) => TagParam<G, E>,
    fg: (g: G) => TagParam<H, E>,
    gh: (h: H) => TagParam<I, E>,
    hi: (i: I) => TagParam<J, E>,
    ij: (j: J) => TagParam<K, E>
): Tag<E, K>
export function ciTag<A, B, C, D, F, G, H, I, J, K, L, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>,
    ef: (f: F) => TagParam<G, E>,
    fg: (g: G) => TagParam<H, E>,
    gh: (h: H) => TagParam<I, E>,
    hi: (i: I) => TagParam<J, E>,
    ij: (j: J) => TagParam<K, E>,
    kl: (k: K) => TagParam<L, E>
): Tag<E, L>
export function ciTag<A, B, C, D, F, G, H, I, J, K, L, M, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>,
    ef: (f: F) => TagParam<G, E>,
    fg: (g: G) => TagParam<H, E>,
    gh: (h: H) => TagParam<I, E>,
    hi: (i: I) => TagParam<J, E>,
    ij: (j: J) => TagParam<K, E>,
    kl: (k: K) => TagParam<L, E>,
    lm: (l: L) => TagParam<M, E>
): Tag<E, M>
export function ciTag<A, B, C, D, F, G, H, I, J, K, L, M, N, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>,
    ef: (f: F) => TagParam<G, E>,
    fg: (g: G) => TagParam<H, E>,
    gh: (h: H) => TagParam<I, E>,
    hi: (i: I) => TagParam<J, E>,
    ij: (j: J) => TagParam<K, E>,
    kl: (k: K) => TagParam<L, E>,
    lm: (l: L) => TagParam<M, E>,
    mn: (m: M) => TagParam<N, E>
): Tag<E, N>
export function ciTag<A, B, C, D, F, G, H, I, J, K, L, M, N, O, E = string>(
    a: TagParam<A, E>,
    ab: (a: A) => TagParam<B, E>,
    bc: (b: B) => TagParam<C, E>,
    cd: (c: C) => TagParam<D, E>,
    de: (d: D) => TagParam<F, E>,
    ef: (f: F) => TagParam<G, E>,
    fg: (g: G) => TagParam<H, E>,
    gh: (h: H) => TagParam<I, E>,
    hi: (i: I) => TagParam<J, E>,
    ij: (j: J) => TagParam<K, E>,
    kl: (k: K) => TagParam<L, E>,
    lm: (l: L) => TagParam<M, E>,
    mn: (m: M) => TagParam<N, E>,
    no: (n: N) => TagParam<O, E>
): Tag<E, O>

// การเรียกใช้งานฟังก์ชันหลัก
export function ciTag<A, E = string>(
    a: TagParam<A, E>,
    ...fns: Array<(value: any) => TagParam<any, E>>
): Tag<E, any> {
    return fns.reduce((acc: Tag<E, any>, fn) => {
        if (acc.tag === 'left') return acc
        try {
            return ensureTag(fn(acc.value))
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
            return left(errorMessage as E)
        }
    }, ensureTag(a))
}

/**
 * ฟังก์ชันสำหรับตรวจสอบค่าตามเงื่อนไขที่กำหนด และคืนค่า Tag
 *
 * @param error - ข้อความ error || data error ที่จะแสดงเมื่อไม่ผ่านเงื่อนไข
 * @param predicate - ฟังก์ชันตรวจสอบเงื่อนไข
 * @returns ฟังก์ชันที่รับค่าและตรวจสอบเงื่อนไข คืนค่า Tag
 */
export const makeTag =
    <LEFT, RIGHT>(error: LEFT, predicate: (a: RIGHT) => boolean) =>
    (value: RIGHT): Tag<LEFT, RIGHT> => {
        return predicate(value) ? right(value) : left(error)
    }

/**
 * ดึงค่าออกจาก Tag โดยระบุวิธีจัดการทั้ง left และ right
 *
 * @example
 * const message = fold(
 *     (error) => `ผิดพลาด: ${error}`,
 *     (value) => `สำเร็จ: ${value.name}`
 * )(result)
 */
export const fold =
    <L, R, T>(onLeft: (error: L) => T, onRight: (value: R) => T) =>
    (tag: Tag<L, R>): T =>
        tag.tag === 'left' ? onLeft(tag.error) : onRight(tag.value)
