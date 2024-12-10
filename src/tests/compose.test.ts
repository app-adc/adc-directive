import { describe, expect, it } from 'vitest'
import {
    withAddDate,
    withAddHour,
    withAddMinute,
    withAddMonth,
    withDateDiff,
} from '../fnCompose'
import { addDate, dateToCombine } from '../fnMoment'

describe('ADC Compose For Test', () => {
    const date = new Date('15-01-2024 10:00:00')
    it('withDateDiff to -5day expect 5 days', () => {
        const res = withDateDiff(new Date())
        const dif = addDate(new Date(), -5)
        expect(res(dif).days).toBe(5)
    })

    it('withAddMonth to 4m expect 2024-05-15 10:00:00', () => {
        const res = withAddMonth(date)
        expect(dateToCombine(res(4)).valueOfValue).toBe('2024-05-15 10:00:00')
    })
    it('withAddMonth to -24m expect 2022-05-15 10:00:00', () => {
        const res = withAddMonth(date)
        expect(dateToCombine(res(-24)).valueOfValue).toBe('2022-01-15 10:00:00')
    })
    it('withAddDate to 5 expect 20', () => {
        const res = withAddDate(date)

        expect(res(5).getDate()).toBe(20)
    })
    it('withAddDate to 5 expect 20', () => {
        const res = withAddDate(5)
        expect(res(date).getDate()).toBe(20)
    })
    it('withAddHour to 5 expect 15:00:00', () => {
        const res = withAddHour(date)
        expect(dateToCombine(res(5)).valueOfTime).toBe('15:00:00')
    })
    it('withAddHour to 48 expect 2024-01-17 10:00:00', () => {
        const res = withAddHour(date)
        expect(dateToCombine(res(48)).valueOfValue).toBe('2024-01-17 10:00:00')
    })
    it('withAddMinute to 17 expect 10:17:00', () => {
        const res = withAddMinute(date)
        expect(dateToCombine(res(17)).valueOfTime).toBe('10:17:00')
    })
})
