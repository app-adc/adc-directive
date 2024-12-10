import { describe, expect, it } from 'vitest'
import * as to from '../fnTo'

const res = to.toCombineText(['red', null, 'blue', undefined, 'green'], '@')
describe('ADC Data Transfer', () => {
    it('to.toCombineText expect red@blue@green', () => {
        expect(res).toBe('red@blue@green')
    })

    it('to.toHasKey expect redbluegreen', () => {
        const _res = to.toHasKey(res)
        expect(_res).toBe('redbluegreen')
    })
    it('to.toCurrency an decimal 2 expect 3,500.00', () => {
        const res = to.toCurrency(3500, 2)
        expect(res).toBe('3,500.00')
    })
    it('to.toCurrency an decimal 0 expect 3,500', () => {
        const res = to.toCurrency(3500, 0)
        expect(res).toBe('3,500')
    })
    it('to.toUid default count = 13 expect length = 13', () => {
        const res = to.toUid()
        expect(res.length).toBe(13)
    })

    it(`toRegExp expect 2023 12 05`, () => {
        const text = '2023-12*05'
        const res = to.toCombineText(text.split(to.toRegExp('notCharacter')))
        expect(res).toBe('2023 12 05')
    })
    it(`toRegExp expect hello word`, () => {
        const text = '23h3e33ll99o 77wo23r0d89'
        const res = text.replace(to.toRegExp('number', 'g'), '')
        expect(res).toBe('hello word')
    })
    it(`toNumber expect 789`, () => {
        const res = to.toNumber('789')
        expect(res).toBe(789)
    })
    it(`toNumber expect 89`, () => {
        const res = to.toNumber('0089')
        expect(res).toBe(89)
    })
    it(`toNumber expect 0`, () => {
        const res = to.toNumber('089X')
        expect(res).toBe(0)
    })
})
