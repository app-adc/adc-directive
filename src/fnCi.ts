export function ci<A>(a: A): A
export function ci<A, B>(a: A, ab: (a: A) => B): B
export function ci<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C
export function ci<A, B, C, D>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D
): D
export function ci<A, B, C, D, E>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E
): E
export function ci<A, B, C, D, E, F>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F
): F
export function ci<A, B, C, D, E, F, G>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G
): G
export function ci<A, B, C, D, E, F, G, H>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H
): H
export function ci<A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I
): I
export function ci<A, B, C, D, E, F, G, H, I, J>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J
): J
export function ci<A, B, C, D, E, F, G, H, I, J, K>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K
): K
export function ci<A, B, C, D, E, F, G, H, I, J, K, L>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L
): L
export function ci<A, B, C, D, E, F, G, H, I, J, K, L, M>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M
): M
export function ci<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N
): N
export function ci<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O
): O
export function ci<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P
): P

export function ci<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
    a: A,
    ab?: (a: A) => B,
    bc?: (b: B) => C,
    cd?: (c: C) => D,
    de?: (d: D) => E,
    ef?: (e: E) => F,
    fg?: (f: F) => G,
    gh?: (g: G) => H,
    hi?: (h: H) => I,
    ij?: (i: I) => J,
    jk?: (j: J) => K,
    kl?: (k: K) => L,
    lm?: (l: L) => M,
    mn?: (m: M) => N,
    no?: (n: N) => O,
    op?: (o: O) => P
) {
    switch (arguments.length) {
        case 1:
            return a
        case 2:
            return ab!(a)
        case 3:
            return bc!(ab!(a))!
        case 4:
            return cd!(bc!(ab!(a)))
        case 5:
            return de!(cd!(bc!(ab!(a))))
        case 6:
            return ef!(de!(cd!(bc!(ab!(a)))))
        case 7:
            return fg!(ef!(de!(cd!(bc!(ab!(a))))))
        case 8:
            return gh!(fg!(ef!(de!(cd!(bc!(ab!(a)))))))
        case 9:
            return hi!(gh!(fg!(ef!(de!(cd!(bc!(ab!(a))))))))
        case 10:
            return ij!(hi!(gh!(fg!(ef!(de!(cd!(bc!(ab!(a)))))))))
        case 11:
            return jk!(ij!(hi!(gh!(fg!(ef!(de!(cd!(bc!(ab!(a))))))))))
        case 12:
            return kl!(jk!(ij!(hi!(gh!(fg!(ef!(de!(cd!(bc!(ab!(a)))))))))))
        case 13:
            return lm!(kl!(jk!(ij!(hi!(gh!(fg!(ef!(de!(cd!(bc!(ab!(a))))))))))))
        case 14:
            return mn!(
                lm!(kl!(jk!(ij!(hi!(gh!(fg!(ef!(de!(cd!(bc!(ab!(a))))))))))))
            )
        case 15:
            return no!(
                mn!(
                    lm!(
                        kl!(jk!(ij!(hi!(gh!(fg!(ef!(de!(cd!(bc!(ab!(a)))))))))))
                    )
                )
            )
        case 16:
            return op!(
                no!(
                    mn!(
                        lm!(
                            kl!(
                                jk!(
                                    ij!(
                                        hi!(
                                            gh!(fg!(ef!(de!(cd!(bc!(ab!(a)))))))
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )

        default: {
            var ret = arguments[0]
            for (var i = 1; i < arguments.length; i++) {
                ret = arguments[i](ret)
            }
            return ret
        }
    }
}

export function withCi<A extends ReadonlyArray<unknown>, B>(
    ab: (...a: A) => B
): (...a: A) => B
export function withCi<A extends ReadonlyArray<unknown>, B, C>(
    ab: (...a: A) => B,
    bc: (b: B) => C
): (...a: A) => C
export function withCi<A extends ReadonlyArray<unknown>, B, C, D>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D
): (...a: A) => D
export function withCi<A extends ReadonlyArray<unknown>, B, C, D, E>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E
): (...a: A) => E
export function withCi<A extends ReadonlyArray<unknown>, B, C, D, E, F>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F
): (...a: A) => F
export function withCi<A extends ReadonlyArray<unknown>, B, C, D, E, F, G>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G
): (...a: A) => G
export function withCi<A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H
): (...a: A) => H
export function withCi<
    A extends ReadonlyArray<unknown>,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I
>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I
): (...a: A) => I
export function withCi<
    A extends ReadonlyArray<unknown>,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J
>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J
): (...a: A) => J
export function withCi<
    A extends ReadonlyArray<unknown>,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J
>(
    ab: (...a: A) => B,
    bc?: (b: B) => C,
    cd?: (c: C) => D,
    de?: (d: D) => E,
    ef?: (e: E) => F,
    fg?: (f: F) => G,
    gh?: (g: G) => H,
    hi?: (h: H) => I,
    ij?: (i: I) => J
) {
    switch (arguments.length) {
        case 1:
            return ab
        case 2:
            return function () {
                return bc!(ab!.apply!(null, arguments)!)
            }
        case 3:
            return function () {
                return cd!(bc!(ab!.apply(null, arguments)))
            }
        case 4:
            return function () {
                return de!(cd!(bc!(ab!.apply(null, arguments))))
            }
        case 5:
            return function () {
                return ef!(de!(cd!(bc!(ab!.apply(null, arguments)))))
            }
        case 6:
            return function () {
                return fg!(ef!(de!(cd!(bc!(ab!.apply(null, arguments))))))
            }
        case 7:
            return function () {
                return gh!(fg!(ef!(de!(cd!(bc!(ab!.apply(null, arguments)))))))
            }
        case 8:
            return function () {
                return hi!(
                    gh!(fg!(ef!(de!(cd!(bc!(ab!.apply(null, arguments)))))))
                )
            }
        case 9:
            return function () {
                return ij!(
                    hi!(
                        gh!(fg!(ef!(de!(cd!(bc!(ab!.apply(null, arguments)))))))
                    )
                )
            }
    }
    return
}
