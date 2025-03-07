import { describe, expect, it, vi } from 'vitest'
import { ciTag, validateTag, withTag } from '../fnTag'

describe('fnTag', () => {
    describe('ciTag - เป็นฟังก์ชัน functional composition ที่มี tag สำหรับตรวจจับข้อผิดพลาด', () => {
        it('สามารถส่งค่าผ่านฟังก์ชันหลายตัวได้', () => {
            // ทดสอบ basic pipeline โดยไม่มี error
            const addOne = (n: number) => n + 1
            const multiplyByTwo = (n: number) => n * 2
            const subtractFive = (n: number) => n - 5

            const result = ciTag(10, addOne, multiplyByTwo, subtractFive)

            expect(result.value).toBe(17) // (10 + 1) * 2 - 5 = 17
            expect(result.tag).toBe('')
            expect(result.beforeValue).toBeUndefined()
            expect(result.logs).toHaveLength(3)
            expect(result.logs[0]).toMatchObject({
                index: 0,
                input: 10,
                output: 11,
            })
            expect(result.logs[1]).toMatchObject({
                index: 1,
                input: 11,
                output: 22,
            })
            expect(result.logs[2]).toMatchObject({
                index: 2,
                input: 22,
                output: 17,
            })
        })

        it('ทำงานได้ถูกต้องแม้มีเพียงค่าเริ่มต้นโดยไม่มี function', () => {
            const result = ciTag(10)

            expect(result.value).toBe(10)
            expect(result.tag).toBe('')
            expect(result.logs).toEqual([])
        })

        it('สามารถตรวจจับข้อผิดพลาดและระบุ tag ได้ถูกต้อง', () => {
            const addOne = (n: number) => n + 1
            const throwError = () => {
                throw new Error('TEST_ERROR')
            }
            const multiplyByTwo = (n: number) => n * 2 // จะไม่ถูกเรียกเนื่องจาก error ก่อนหน้า

            const result = ciTag(10, addOne, throwError, multiplyByTwo)

            expect(result.value).toBeUndefined()
            expect(result.tag).toBe('TEST_ERROR')
            expect(result.beforeValue).toBe(11) // ค่าก่อนเกิด error
            expect(result.logs).toHaveLength(2)
            expect(result.logs[1]).toMatchObject({
                index: 1,
                input: 11,
                errorMessage: 'TEST_ERROR',
            })
        })

        it('รับค่า object ที่มี tag property ได้ถูกต้อง', () => {
            const addOne = (n: number) => n + 1
            const validate = (n: number) => {
                if (n > 15) {
                    return { value: undefined, tag: 'NUMBER_TOO_LARGE' }
                }
                return n
            }
            const multiplyByTwo = (n: number) => n * 2

            const result = ciTag(10, addOne, validate, multiplyByTwo)

            // การ validate ไม่ได้ตรวจสอบค่าเกิน 15 จะส่งผ่านค่าไปฟังก์ชันถัดไป
            expect(result.value).toBe(22) // (10 + 1) * 2 = 22
            expect(result.tag).toBe('')

            // ทดสอบกรณีที่ validate ไม่ผ่าน
            const resultFail = ciTag(
                10,
                addOne,
                (n) => n * 5,
                validate,
                multiplyByTwo
            )

            expect(resultFail.value).toBeUndefined()
            expect(resultFail.tag).toBe('NUMBER_TOO_LARGE')
            expect(resultFail.beforeValue).toBe(55) // ค่าก่อนเกิด error
        })

        it('บันทึก logs ไว้ทุกขั้นตอนของ pipeline', () => {
            const addOne = (n: number) => n + 1
            const multiplyByTwo = (n: number) => n * 2
            const toString = (n: number) => `Number: ${n}`

            const result = ciTag(10, addOne, multiplyByTwo, toString)

            expect(result.logs).toHaveLength(3)
            expect(result.logs[0].input).toBe(10)
            expect(result.logs[0].output).toBe(11)
            expect(result.logs[1].input).toBe(11)
            expect(result.logs[1].output).toBe(22)
            expect(result.logs[2].input).toBe(22)
            expect(result.logs[2].output).toBe('Number: 22')

            // ไม่มี error message เนื่องจากไม่มี error
            expect(result.logs.every((log) => !log.errorMessage)).toBe(true)
        })

        it('จัดการกับ function ที่มี type ต่างกันในแต่ละขั้นของ pipeline ได้', () => {
            const addOne = (n: number) => n + 1
            const toString = (n: number) => `Number: ${n}`
            const getLength = (s: string) => s.length

            const result = ciTag(10, addOne, toString, getLength)

            expect(result.value).toBe(10) // "Number: 11".length = 10
            expect(result.tag).toBe('')

            // ตรวจสอบ logs ว่าเปลี่ยน type ไปตาม pipeline
            expect(typeof result.logs[0].input).toBe('number') // 10 is number
            expect(typeof result.logs[1].input).toBe('number') // 11 is number
            expect(typeof result.logs[1].output).toBe('string') // "Number: 11" is string
            expect(typeof result.logs[2].input).toBe('string') // "Number: 11" is string
            expect(typeof result.logs[2].output).toBe('number') // 10 is number
        })
    })

    describe('validateTag - ฟังก์ชันสำหรับตรวจสอบเงื่อนไขและสร้าง error tag', () => {
        it('สร้างฟังก์ชันตรวจสอบและตั้งค่า tag เมื่อไม่ผ่านเงื่อนไข', () => {
            const isPositive = validateTag<number>((n) => n > 0)(
                'NUMBER_MUST_BE_POSITIVE'
            )

            // ทดสอบกรณีผ่านเงื่อนไข
            const resultPass = isPositive(10)
            expect(resultPass.value).toBe(10)
            expect(resultPass.tag).toBe('')

            // ทดสอบกรณีไม่ผ่านเงื่อนไข
            const resultFail = isPositive(-5)
            expect(resultFail.value).toBeUndefined()
            expect(resultFail.tag).toBe('NUMBER_MUST_BE_POSITIVE')
        })

        it('ทำงานร่วมกับ ciTag ได้', () => {
            const addOne = (n: number) => n + 1
            const isLessThanTen = validateTag<number>((n) => n < 10)(
                'NUMBER_TOO_LARGE'
            )

            // ทดสอบกรณีผ่านเงื่อนไข
            const resultPass = ciTag(5, addOne, isLessThanTen)
            expect(resultPass.value).toBe(6)
            expect(resultPass.tag).toBe('')

            // ทดสอบกรณีไม่ผ่านเงื่อนไข
            const resultFail = ciTag(9, addOne, isLessThanTen)
            expect(resultFail.value).toBeUndefined()
            expect(resultFail.tag).toBe('NUMBER_TOO_LARGE')
        })

        it('สามารถใช้กับข้อมูลหลายประเภทได้', () => {
            const isNotEmpty = validateTag<string>((s) => s.length > 0)(
                'STRING_EMPTY'
            )
            const hasItems = validateTag<Array<any>>((arr) => arr.length > 0)(
                'ARRAY_EMPTY'
            )

            expect(isNotEmpty('hello').value).toBe('hello')
            expect(isNotEmpty('').value).toBeUndefined()
            expect(isNotEmpty('').tag).toBe('STRING_EMPTY')

            expect(hasItems([1, 2, 3]).value).toEqual([1, 2, 3])
            expect(hasItems([]).value).toBeUndefined()
            expect(hasItems([]).tag).toBe('ARRAY_EMPTY')
        })
    })

    describe('withTag - ฟังก์ชันที่ผสมการตรวจสอบและการทำงานเข้าด้วยกัน', () => {
        it('สร้างฟังก์ชันที่ทำงานเมื่อผ่านการตรวจสอบ', () => {
            const doubleIfPositive = withTag<number, number>((n) => n * 2)(
                (n) => n > 0
            )('NUMBER_MUST_BE_POSITIVE')

            // ทดสอบกรณีผ่านเงื่อนไข
            const resultPass = doubleIfPositive(10)
            expect(resultPass.value).toBe(20)
            expect(resultPass.tag).toBe('')

            // ทดสอบกรณีไม่ผ่านเงื่อนไข
            const resultFail = doubleIfPositive(-5)
            expect(resultFail.value).toBeUndefined()
            expect(resultFail.tag).toBe('NUMBER_MUST_BE_POSITIVE')
        })

        it('จัดการข้อผิดพลาดในฟังก์ชันที่ทำงานได้', () => {
            // สร้างฟังก์ชันที่อาจเกิด error
            const divideTenBy = withTag<number, number>((n) => {
                if (n === 0) throw new Error('DIVISION_BY_ZERO')
                return 10 / n
            })((n) => true)('INVALID_NUMBER') // เงื่อนไขผ่านเสมอ

            // ทดสอบกรณีปกติ
            const resultPass = divideTenBy(2)
            expect(resultPass.value).toBe(5)
            expect(resultPass.tag).toBe('')

            // ทดสอบกรณีเกิด error ในฟังก์ชัน
            const resultFail = divideTenBy(0)
            expect(resultFail.value).toBeUndefined()
            expect(resultFail.tag).toBe('DIVISION_BY_ZERO')
        })

        it('ทำงานร่วมกับ ciTag ได้', () => {
            const addOne = (n: number) => n + 1
            const doubleIfLessThanTen = withTag<number, number>((n) => n * 2)(
                (n) => n < 10
            )('NUMBER_TOO_LARGE')

            // ทดสอบกรณีผ่านเงื่อนไข
            const resultPass = ciTag(4, addOne, doubleIfLessThanTen)
            expect(resultPass.value).toBe(10) // (4 + 1) * 2 = 10
            expect(resultPass.tag).toBe('')

            // ทดสอบกรณีไม่ผ่านเงื่อนไข
            const resultFail = ciTag(9, addOne, doubleIfLessThanTen)
            expect(resultFail.value).toBeUndefined()
            expect(resultFail.tag).toBe('NUMBER_TOO_LARGE')
        })

        it('สามารถทำงานกับข้อมูลต่างประเภทได้', () => {
            // แปลงตัวเลขเป็นข้อความถ้าตัวเลขเป็นบวก
            const numberToStringIfPositive = withTag<number, string>(
                (n) => `Number is: ${n}`
            )((n) => n > 0)('NEGATIVE_NUMBER')

            expect(numberToStringIfPositive(5).value).toBe('Number is: 5')
            expect(numberToStringIfPositive(-1).value).toBeUndefined()
            expect(numberToStringIfPositive(-1).tag).toBe('NEGATIVE_NUMBER')

            // ใช้ใน pipeline
            const result = ciTag(
                3,
                (n) => n + 2,
                numberToStringIfPositive,
                (s) => s.length
            )

            // ตรวจสอบความยาวของ string ที่ถูกต้อง ("Number is: 5" --> 12 ตัวอักษร)
            expect(result.value).toBe(12)
        })
    })

    describe('การใช้งานร่วมกันในสถานการณ์เชิงปฏิบัติ', () => {
        it('ใช้ในการตรวจสอบและแปลงข้อมูลฟอร์มได้', () => {
            // จำลองการประมวลผลข้อมูลฟอร์ม
            type FormData = {
                username: string
                age: number
            }

            const validateUsername = validateTag<string>((s) => s.length >= 3)(
                'USERNAME_TOO_SHORT'
            )
            const validateAge = validateTag<number>((n) => n >= 18)(
                'AGE_UNDER_18'
            )

            const processForm = (data: FormData) => {
                const usernameResult = validateUsername(data.username)
                if (usernameResult.tag)
                    return { value: undefined, tag: usernameResult.tag }

                const ageResult = validateAge(data.age)
                if (ageResult.tag)
                    return { value: undefined, tag: ageResult.tag }

                return { value: { ...data, isValid: true }, tag: '' }
            }

            // ทดสอบข้อมูลที่ถูกต้อง
            const validForm = { username: 'john', age: 25 }
            expect(processForm(validForm).value).toEqual({
                ...validForm,
                isValid: true,
            })

            // ทดสอบข้อมูลที่ไม่ถูกต้อง
            const invalidUsername = { username: 'jo', age: 25 }
            expect(processForm(invalidUsername).tag).toBe('USERNAME_TOO_SHORT')

            const invalidAge = { username: 'john', age: 16 }
            expect(processForm(invalidAge).tag).toBe('AGE_UNDER_18')
        })

        it('ใช้ในการประมวลผลข้อมูลแบบซับซ้อนได้', () => {
            // สร้าง pipeline สำหรับประมวลผลข้อมูลราคาสินค้า
            const parsePrice = withTag<string, number>((s) => {
                const num = parseFloat(s)
                if (isNaN(num)) throw new Error('INVALID_PRICE_FORMAT')
                return num
            })((s) => s.trim().length > 0)('EMPTY_PRICE')

            const applyDiscount = (percent: number) =>
                withTag<number, number>((price) => price * (1 - percent / 100))(
                    (price) => price > 0
                )('PRICE_MUST_BE_POSITIVE')

            const applyTax = (taxRate: number) =>
                withTag<number, number>((price) => price * (1 + taxRate / 100))(
                    (price) => price > 0
                )('PRICE_MUST_BE_POSITIVE')

            const formatCurrency = (price: number) => `$${price.toFixed(2)}`

            // ทดสอบการประมวลผลสมบูรณ์
            const processPrice = (priceStr: string) => {
                return ciTag(
                    priceStr,
                    parsePrice,
                    applyDiscount(10), // 10% discount
                    applyTax(7), // 7% tax
                    formatCurrency
                )
            }

            const result = processPrice('100')
            expect(result.value).toBe('$96.30') // 100 - 10% = 90, + 7% = 96.30

            // ทดสอบกรณีข้อมูลไม่ถูกต้อง
            expect(processPrice('').tag).toBe('EMPTY_PRICE')
            expect(processPrice('abc').tag).toBe('INVALID_PRICE_FORMAT')
            expect(processPrice('-50').tag).toBe('PRICE_MUST_BE_POSITIVE')
        })

        it('ใช้สำหรับระบบ validation ที่มีความยืดหยุ่นได้', () => {
            // สร้างระบบ validation สำหรับข้อมูลผู้ใช้
            interface UserData {
                email: string
                password: string
                age: number
            }

            // Validation functions
            const validateEmail = validateTag<string>((email) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            )('INVALID_EMAIL_FORMAT')

            const validatePassword = validateTag<string>(
                (pwd) => pwd.length >= 8
            )('PASSWORD_TOO_SHORT')

            const validateAge = validateTag<number>(
                (age) => age >= 18 && age < 120
            )('INVALID_AGE')

            const validateUser = (user: UserData) => {
                // ใช้ ciTag เพื่อตรวจสอบแต่ละฟิลด์ตามลำดับ
                const emailResult = validateEmail(user.email)
                if (emailResult.tag)
                    return { value: undefined, tag: emailResult.tag }

                const passwordResult = validatePassword(user.password)
                if (passwordResult.tag)
                    return { value: undefined, tag: passwordResult.tag }

                const ageResult = validateAge(user.age)
                if (ageResult.tag)
                    return { value: undefined, tag: ageResult.tag }

                // ถ้าผ่านทุกเงื่อนไข
                return { value: { ...user, validated: true }, tag: '' }
            }

            // ทดสอบข้อมูลที่ถูกต้อง
            const validUser = {
                email: 'test@example.com',
                password: 'password123',
                age: 30,
            }
            expect(validateUser(validUser).value).toEqual({
                ...validUser,
                validated: true,
            })

            // ทดสอบข้อมูลที่ไม่ถูกต้อง
            const invalidEmail = { ...validUser, email: 'notEmail' }
            expect(validateUser(invalidEmail).tag).toBe('INVALID_EMAIL_FORMAT')

            const invalidPassword = { ...validUser, password: 'short' }
            expect(validateUser(invalidPassword).tag).toBe('PASSWORD_TOO_SHORT')

            const invalidAge = { ...validUser, age: 15 }
            expect(validateUser(invalidAge).tag).toBe('INVALID_AGE')
        })

        it('ใช้ในระบบที่มีการจัดการ error และ logging ได้', () => {
            // Spy logging function
            const logError = vi.fn()

            // สร้างฟังก์ชันที่มีการ handle error และทำ logging
            const fetchUserData = (userId: number) => {
                // จำลองการเรียก API
                const mockApiCall = (id: number) => {
                    if (id <= 0) throw new Error('INVALID_USER_ID')
                    if (id > 1000) return null // User not found
                    return { id, name: `User ${id}`, active: true }
                }

                const result = ciTag(
                    userId,
                    validateTag<number>((id) => id > 0)('INVALID_USER_ID'),
                    (id) => {
                        try {
                            const user = mockApiCall(id)
                            if (!user)
                                return {
                                    value: undefined,
                                    tag: 'USER_NOT_FOUND',
                                }
                            return user
                        } catch (error) {
                            throw error
                        }
                    },
                    validateTag<{ id: number; name: string; active: boolean }>(
                        (user) => user.active
                    )('USER_INACTIVE')
                )

                // ถ้ามี error ให้ทำ logging
                if (result.tag) {
                    logError(`Error fetching user ${userId}: ${result.tag}`, {
                        userId,
                        errorType: result.tag,
                        trace: result.logs,
                    })
                }

                return result
            }

            // ทดสอบกรณีปกติ
            const validResult = fetchUserData(1)
            expect(validResult.value).toEqual({
                id: 1,
                name: 'User 1',
                active: true,
            })
            expect(validResult.tag).toBe('')
            expect(logError).not.toHaveBeenCalled()

            // ทดสอบกรณี error
            logError.mockClear()
            const invalidIdResult = fetchUserData(-1)
            expect(invalidIdResult.value).toBeUndefined()
            expect(invalidIdResult.tag).toBe('INVALID_USER_ID')
            expect(logError).toHaveBeenCalledWith(
                'Error fetching user -1: INVALID_USER_ID',
                expect.objectContaining({
                    userId: -1,
                    errorType: 'INVALID_USER_ID',
                })
            )

            // ทดสอบกรณีไม่พบผู้ใช้
            logError.mockClear()
            const userNotFoundResult = fetchUserData(1001)
            expect(userNotFoundResult.value).toBeUndefined()
            expect(userNotFoundResult.tag).toBe('USER_NOT_FOUND')
            expect(logError).toHaveBeenCalledWith(
                'Error fetching user 1001: USER_NOT_FOUND',
                expect.objectContaining({
                    userId: 1001,
                    errorType: 'USER_NOT_FOUND',
                })
            )
        })
    })
})
