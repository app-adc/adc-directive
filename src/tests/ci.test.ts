import { describe, expect, it } from 'vitest'
import { ci, withCi } from '../fnCi'
import { withAddDate, withAddHour, withAddMinute } from '../fnCompose'
import { dateToCombine } from '../fnMoment'

describe('ADC Ci', () => {
    it('ci expect 2024-05-13 17:30:00', () => {
        const res = ci(
            new Date(),
            withAddDate(10),
            withAddHour(5),
            withAddMinute(30),
            dateToCombine
        )

        expect(res.valueOfValue).toBe('2024-05-13 17:30:00')
    })
    it('withCi expect 2024-05-13 17:30:00', () => {
        const res = withCi(
            withAddDate(10),
            withAddHour(5),
            withAddMinute(30),
            dateToCombine
        )

        expect(res(new Date('03-05-2024 12:00')).valueOfValue).toBe(
            '2024-05-13 17:30:00'
        )
    })
})
