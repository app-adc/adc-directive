import { toCombineText } from './fnTo'

/**
 * Calculates the time difference between two dates
 * @param a First date for comparison
 * @param b Second date for comparison (defaults to current date)
 * @returns Object containing various time difference measurements
 */
export function dateDiff(a: Readonly<Date>, b: Date = new Date()) {
    if (!(a instanceof Date) || !(b instanceof Date)) {
        throw new Error('Invalid date input')
    }

    const diffMs = Math.abs(a.valueOf() - b.valueOf())
    const secs = Math.floor(Math.abs(diffMs) / 1000)
    const mins = Math.floor(secs / 60)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)

    return {
        days,
        hours: hours % 24, // Hours within the same day
        hoursTotal: hours, // Total hours
        minutesTotal: mins, // Total minutes
        minutes: mins % 60, // Minutes within the same hour
        seconds: secs % 60, // Seconds within the same minute
        secondsTotal: secs, // Total seconds
        milliseconds: diffMs, // Total milliseconds
    }
}

/**
 * Converts a time difference to a human-readable string
 * @param a First date for comparison
 * @param b Second date for comparison (defaults to current date)
 * @param locale Language for output ('th' | 'en')
 * @returns Formatted string representing the time difference
 */
export function dateDiffToString(
    a: Readonly<Date>,
    b: Date = new Date(),
    locale: 'th' | 'en' = 'th'
): string {
    if (!(a instanceof Date) || !(b instanceof Date)) {
        throw new Error('Invalid date input')
    }

    const { days } = dateDiff(a, b)
    const isFuture = a.valueOf() > b.valueOf()
    const isThai = locale === 'th'

    // Calculate year difference using valueOf()
    const msPerYear = 1000 * 60 * 60 * 24 * 365.25 // Account for leap years
    const yearDiff = Math.floor(Math.abs(a.valueOf() - b.valueOf()) / msPerYear)

    // Calculate months between dates after subtracting years
    const remainingMs = Math.abs(a.valueOf() - b.valueOf()) % msPerYear
    const msPerMonth = msPerYear / 12
    const monthDiff = Math.floor(remainingMs / msPerMonth)

    const units = {
        year: isThai ? 'ปี' : 'year',
        month: isThai ? 'เดือน' : 'months',
        day: isThai ? 'วัน' : 'days',
        hour: isThai ? 'ชั่วโมง' : 'hours',
        minute: isThai ? 'นาที' : 'mins',
        recent: isThai ? 'เมื่อสักครู่' : 'just now',
    }

    const suffix = isFuture ? '' : isThai ? 'ที่แล้ว' : ' ago'

    if (yearDiff > 0) return `${yearDiff} ${units.year}${suffix}`
    if (monthDiff > 0) return `${monthDiff} ${units.month}${suffix}`
    if (days > 0) return `${days} ${units.day}${suffix}`

    const { hoursTotal, minutesTotal } = dateDiff(a, b)
    if (hoursTotal > 0) return `${hoursTotal} ${units.hour}${suffix}`
    if (minutesTotal > 0) return `${minutesTotal} ${units.minute}${suffix}`

    return units.recent
}

/**
 * Adds specified number of days to a date
 * @param value Base date
 * @param days Number of days to add
 * @returns New Date with added days
 */
export function addDate(value: Readonly<Date>, days: number): Date {
    if (!(value instanceof Date)) {
        throw new Error('Invalid date input')
    }

    const result = new Date(value.valueOf())
    result.setDate(result.getDate() + days)
    return result
}

/**
 * Adds specified number of months to a date
 * @param value Base date
 * @param months Number of months to add
 * @returns New Date with added months
 */
export function addMonth(value: Readonly<Date>, months: number): Date {
    if (!(value instanceof Date)) {
        throw new Error('Invalid date input')
    }

    const result = new Date(value.valueOf())
    result.setMonth(result.getMonth() + months)
    return result
}

/**
 * Adds specified number of hours to a date
 * @param value Base date
 * @param hours Number of hours to add
 * @returns New Date with added hours
 */
export function addHour(value: Readonly<Date>, hours: number): Date {
    if (!(value instanceof Date)) {
        throw new Error('Invalid date input')
    }

    const result = new Date(value.valueOf())
    result.setHours(result.getHours() + hours)
    return result
}

/**
 * Adds specified number of minutes to a date
 * @param value Base date
 * @param minutes Number of minutes to add
 * @returns New Date with added minutes
 */
export function addMinute(value: Readonly<Date>, minutes: number): Date {
    if (!(value instanceof Date)) {
        throw new Error('Invalid date input')
    }

    const result = new Date(value.valueOf())
    result.setMinutes(result.getMinutes() + minutes)
    return result
}

/**
 * Combines date components into various formatted strings
 * @param value Input date
 * @returns Object containing various date string formats
 */
export function dateToCombine(value: Readonly<Date>) {
    if (!(value instanceof Date)) {
        throw new Error('Invalid date input')
    }

    const year = value.getFullYear().toString()
    const month = (value.getMonth() + 1).toString().padStart(2, '0')
    const day = value.getDate().toString().padStart(2, '0')
    const hour = value.getHours().toString().padStart(2, '0')
    const minute = value.getMinutes().toString().padStart(2, '0')
    const second = value.getSeconds().toString().padStart(2, '0')

    const valueOfDate = toCombineText([year, month, day], '-')
    const valueOfTime = toCombineText([hour, minute, second], ':')
    const valueOfValue = `${valueOfDate} ${valueOfTime}`

    const thaiDate = value.toLocaleDateString('th', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    })

    return {
        year,
        month,
        day,
        hour,
        minute,
        second,
        valueOfDate, // YYYY-MM-DD
        valueOfTime, // HH:mm:ss
        valueOfValue, // YYYY-MM-DD HH:mm:ss
        th: thaiDate, // Thai date format
    }
}

// Helper functions for more accurate date differences
function getMonthDifference(date1: Date, date2: Date): number {
    const months = (date2.getFullYear() - date1.getFullYear()) * 12
    return Math.abs(months + date2.getMonth() - date1.getMonth())
}

function getYearDifference(date1: Date, date2: Date): number {
    return Math.abs(date2.getFullYear() - date1.getFullYear())
}
