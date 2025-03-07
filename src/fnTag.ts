import { TagParam, TagResult } from './type'

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

export function ciTag<A>(
    value: A,
    ...fns: Array<(a: any) => any>
): TagResult<any> {
    // ถ้าไม่มีฟังก์ชันที่ส่งมา ให้ return ค่า value เดิม
    if (fns.length === 0) {
        return { value, tag: '', logs: [] }
    }

    // สร้าง array สำหรับเก็บ logs
    const logs: Array<{
        index: number
        functionName: string
        input: any
        output: any
        hasError: boolean
        errorMessage?: string
    }> = []

    // ประกาศตัวแปรนอก try block เพื่อให้ catch block เข้าถึงได้
    let beforeValue: any = undefined

    try {
        // เริ่มต้นด้วยค่า value และ tag ว่าง
        let result: any = value
        let errorTag: string = ''

        // ทำ functional composition
        for (let i = 0; i < fns.length; i++) {
            // ถ้ามี error tag ก่อนหน้านี้ ให้หยุดการประมวลผลและ return เลย
            if (errorTag) {
                return { value: undefined, tag: errorTag, beforeValue, logs }
            }

            // เก็บค่าปัจจุบันก่อนประมวลผลฟังก์ชันถัดไป
            beforeValue = result

            try {
                // เรียกใช้ฟังก์ชัน
                const fn = fns[i]
                const nextResult = fn(result)

                // ตรวจสอบว่าผลลัพธ์เป็น TagResult หรือไม่
                if (
                    nextResult &&
                    typeof nextResult === 'object' &&
                    'tag' in nextResult
                ) {
                    // กรณีที่ผลลัพธ์เป็น TagResult
                    const tagResult = nextResult as TagResult<any>

                    // ถ้ามี tag error ให้บันทึกไว้และหยุดลูป
                    if (tagResult.tag) {
                        errorTag = tagResult.tag
                        result = undefined
                    } else {
                        // ถ้าไม่มี tag error ให้ใช้ value จาก TagResult
                        result = tagResult.value
                    }
                } else {
                    // กรณีที่ผลลัพธ์เป็นค่าปกติ
                    result = nextResult
                }

                // บันทึก log
                logs.push({
                    index: i,
                    functionName: fn.name || `anonymous(${i})`,
                    input: beforeValue,
                    output: result,
                    hasError: false,
                })
            } catch (error) {
                // กรณีเกิด error ระหว่างประมวลผลฟังก์ชัน
                errorTag =
                    error instanceof Error ? error.message : 'Unknown error'

                // บันทึก log ของ error
                logs.push({
                    index: i,
                    functionName: fns[i].name || `anonymous(${i})`,
                    input: beforeValue,
                    output: undefined,
                    hasError: true,
                    errorMessage: errorTag,
                })

                // หยุดการทำงานและคืนค่า error
                return {
                    value: undefined,
                    tag: errorTag,
                    beforeValue,
                    logs,
                }
            }
        }

        // ถ้าไม่มี error tag คืนค่าปกติพร้อม logs
        return { value: result, tag: errorTag, logs }
    } catch (error) {
        // กรณีเกิด error ในระหว่างการประมวลผล
        return {
            value: undefined,
            tag: error instanceof Error ? error.message : 'Unknown error',
            beforeValue,
            logs,
        }
    }
}

/**
 * ใช้กับ ciTag
 * @param callBackFunction
 * @param validateFunction
 * @example const withTagPositive = withTag(callbackFn)(validateFn)('TAG')(value)
 * @returns value และ tag เมื่อ tag มีค่า value จะเป็น undefined
 */
export const withTag =
    <Val, R>(cb: (arg: Val) => R) =>
    (_validate: (arg: Val) => boolean) =>
    <Tag extends string = string>(tag: Tag) =>
    (value: Val): TagResult<R> => {
        if (!_validate(value)) {
            return { value: undefined, tag }
        }
        try {
            return { value: cb(value), tag: '' }
        } catch (error) {
            return {
                value: undefined,
                tag:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error in callback',
            }
        }
    }

/**
 * ฟังก์ชันตรวจสอบค่าในรูปแบบ functional composition
 * โดยแบ่งการรับพารามิเตอร์เป็นขั้นตอน
 *
 * @param validate ฟังก์ชันตรวจสอบที่คืนค่า boolean
 * @example const isPositive = validateTag<number>(n => n > 0)('NUMBER_MUST_BE_POSITIVE');
 * @returns ฟังก์ชันที่รับค่า tag และคืนฟังก์ชันที่รับค่าที่ต้องการตรวจสอบ
 */
export const validateTag =
    <V>(validate: (value: V) => boolean) =>
    <Tag extends string = string>(tag: Tag) =>
    (value: V): TagResult<V> => {
        if (validate(value)) {
            return { value, tag: '' }
        } else {
            return { value: undefined, tag }
        }
    }
