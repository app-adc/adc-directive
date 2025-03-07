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
    if (fns.length === 0) {
        return {
            value,
            tag: '',
            beforeValue: undefined,
            logs: [],
            ci: { value, tag: '' },
        }
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

    // ประกาศตัวแปรนอก try block
    let beforeValue: any = value

    try {
        // เริ่มต้นด้วยค่า value และ tag ว่าง
        let result: any = value
        let errorTag: string = ''

        // ทำ functional composition
        for (let i = 0; i < fns.length; i++) {
            // เก็บค่าปัจจุบันก่อนประมวลผลฟังก์ชันถัดไป
            beforeValue = result

            // สร้าง log entry เบื้องต้น
            const logEntry = {
                index: i,
                functionName: fns[i].name || `function${i + 1}`,
                input: beforeValue,
                output: undefined as any,
                hasError: false,
                errorMessage: undefined as string | undefined,
            }

            try {
                // ประมวลผลฟังก์ชันถัดไป
                const currentResult = fns[i](result)

                // ตรวจสอบว่าผลลัพธ์เป็นรูปแบบ { value, tag } หรือไม่
                if (
                    currentResult &&
                    typeof currentResult === 'object' &&
                    'tag' in currentResult
                ) {
                    // ถ้าเป็นรูปแบบ { value, tag }
                    if (currentResult.tag) {
                        // ถ้ามี error tag
                        errorTag = currentResult.tag
                        logEntry.output = undefined
                        logEntry.hasError = true
                        logEntry.errorMessage = currentResult.tag
                        result = undefined
                    } else {
                        // ถ้าไม่มี error ให้เอาแค่ value ไปใช้ต่อ
                        logEntry.output = currentResult.value
                        result = currentResult.value
                    }
                } else {
                    // ถ้าเป็นรูปแบบปกติ
                    logEntry.output = currentResult
                    result = currentResult
                }
            } catch (error) {
                // กรณีเกิด error ในการเรียกฟังก์ชัน
                errorTag =
                    error instanceof Error ? error.message : 'Unknown error'
                logEntry.hasError = true
                logEntry.errorMessage = errorTag
                result = undefined
            }

            // เพิ่ม log entry
            logs.push(logEntry)

            // ถ้ามี error ให้หยุดการประมวลผล
            if (errorTag) {
                break
            }
        }

        // คืนค่าผลลัพธ์พร้อม logs
        return {
            value: result,
            tag: errorTag,
            beforeValue: errorTag ? beforeValue : undefined,
            logs: logs.map(({ index, input, output, errorMessage }) => ({
                index,
                input,
                output,
                errorMessage,
            })),
            ci: { value, tag: errorTag },
        }
    } catch (error) {
        // กรณีเกิด error ในระหว่างการประมวลผล
        const value = undefined
        const tag =
            error instanceof Error ? error.message : 'Unknown error in ciTag'
        return {
            value,
            tag,
            beforeValue,
            logs: logs.map(({ index, input, output, errorMessage }) => ({
                index,
                input,
                output,
                errorMessage,
            })),
            ci: {
                value,
                tag,
            },
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
    (value: Val): Pick<TagResult<R>, 'value' | 'tag'> => {
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
    (value: V): Pick<TagResult<V>, 'value' | 'tag'> => {
        if (validate(value)) {
            return { value, tag: '' }
        } else {
            return { value: undefined, tag }
        }
    }
