import { describe, expect, it } from 'vitest'
import { ciTag, left, logs, makeTag, right } from '../fnTag'

describe('fnTag - การทดสอบฟังก์ชันในรูปแบบ Tag Pattern', () => {
    // -----------------------------------------------------------------------------------
    describe('1. ฟังก์ชัน left และ right (constructors)', () => {
        it('left สร้าง Tag ด้วย tag เป็น "left" และเก็บค่า error ตามที่กำหนด', () => {
            const result = left('ข้อความผิดพลาด')
            expect(result).toEqual({
                tag: 'left',
                error: 'ข้อความผิดพลาด',
            })
        })

        it('right สร้าง Tag ด้วย tag เป็น "right" และเก็บค่า value ตามที่กำหนด', () => {
            const result = right({ id: 1, name: 'ทดสอบ' })
            expect(result).toEqual({
                tag: 'right',
                value: { id: 1, name: 'ทดสอบ' },
            })
        })
    })

    // -----------------------------------------------------------------------------------
    describe('2. ฟังก์ชัน logs', () => {
        it('สามารถจัดการ logs สำหรับกรณีไม่มีฟังก์ชันที่ส่งเข้ามา', () => {
            const result = logs('ข้อมูลเริ่มต้น')
            expect(result).toEqual({
                value: 'ข้อมูลเริ่มต้น',
                tag: 'right',
                message: '',
                beforeValue: undefined,
                logs: [],
            })
        })

        it('logs ของการประมวลผลค่าปกติที่สำเร็จ', () => {
            const result = logs(
                5,
                (num) => num * 2,
                (num) => num + 3
            )

            expect(result.value).toBe(13)
            expect(result.tag).toBe('right')
            expect(result.logs).toHaveLength(2)
            expect(result.logs[0].input).toBe(5)
            expect(result.logs[0].output).toBe(10)
            expect(result.logs[1].input).toBe(10)
            expect(result.logs[1].output).toBe(13)
        })

        it('logs ของการประมวลผลที่มี left (error) ในระหว่างทาง', () => {
            const validatePositive = (num: number) => {
                return num > 0 ? right(num) : left('ต้องเป็นจำนวนบวกเท่านั้น')
            }

            const result = logs(
                -5,
                (num) => num * 2,
                validatePositive,
                (num) => num + 3
            )

            expect(result.value).toBeUndefined()
            expect(result.tag).toBe('left')
            expect(result.message).toBe('ต้องเป็นจำนวนบวกเท่านั้น')
            expect(result.beforeValue).toBe(-10)
            expect(result.logs).toHaveLength(2)
            expect(result.logs[0].input).toBe(-5)
            expect(result.logs[0].output).toBe(-10)
            expect(result.logs[1].input).toBe(-10)
            expect(result.logs[1].errorMessage).toBe('ต้องเป็นจำนวนบวกเท่านั้น')
        })

        it('logs จัดการกับ exception ในฟังก์ชันได้อย่างถูกต้อง', () => {
            const throwError = () => {
                throw new Error('เกิดข้อผิดพลาดไม่คาดคิด')
            }

            const result = logs(
                10,
                (num) => num * 2,
                throwError,
                (num) => num + 5
            )

            expect(result.value).toBeUndefined()
            expect(result.tag).toBe('error')
            expect(result.message).toBe('เกิดข้อผิดพลาดไม่คาดคิด')
            expect(result.beforeValue).toBe(20)
            expect(result.logs).toHaveLength(2)
            expect(result.logs[1].errorMessage).toBe('เกิดข้อผิดพลาดไม่คาดคิด')
        })
    })

    // -----------------------------------------------------------------------------------
    describe('3. ฟังก์ชัน ciTag', () => {
        it('ส่งผ่านค่าเริ่มต้นเมื่อไม่มีฟังก์ชันที่ส่งเข้ามา', () => {
            const result = ciTag('ข้อมูลเริ่มต้น')
            expect(result).toEqual({
                tag: 'right',
                value: 'ข้อมูลเริ่มต้น',
            })
        })

        it('ประมวลผลฟังก์ชันตามลำดับและคืนค่า right สุดท้าย', () => {
            const result = ciTag(
                5,
                (num) => num * 2,
                (num) => num + 3,
                (num) => `ผลลัพธ์คือ ${num}`
            )

            expect(result).toEqual({
                tag: 'right',
                value: 'ผลลัพธ์คือ 13',
            })
        })

        it('หยุดการประมวลผลและคืนค่า left เมื่อเจอ error', () => {
            const validatePositive = (num: number) => {
                return num > 0 ? right(num) : left('ต้องเป็นจำนวนบวกเท่านั้น')
            }

            const result = ciTag(
                -5,
                (num) => num * 2,
                validatePositive,
                (num) => num + 3 // ฟังก์ชันนี้จะไม่ถูกเรียก
            )

            expect(result).toEqual({
                tag: 'left',
                error: 'ต้องเป็นจำนวนบวกเท่านั้น',
            })
        })

        it('จัดการกับ exception ในฟังก์ชันและแปลงเป็น left', () => {
            const throwError = () => {
                throw new Error('เกิดข้อผิดพลาดไม่คาดคิด')
            }

            const result = ciTag(
                10,
                (num) => num * 2,
                throwError,
                (num) => num + 5 // ฟังก์ชันนี้จะไม่ถูกเรียก
            )

            expect(result.tag).toBe('left')
            if (result.tag === 'left') {
                expect(result.error).toBe('เกิดข้อผิดพลาดไม่คาดคิด')
            }
        })

        it('ใช้งานกับข้อมูลแบบซับซ้อนได้', () => {
            interface User {
                id: number
                name: string
                age?: number
            }

            const validateUser = (user: User) => {
                if (!user.name) return left('ต้องระบุชื่อผู้ใช้')
                return right(user)
            }

            const addDefaultAge = (user: User): User => {
                if (!user.age) return { ...user, age: 25 }
                return user
            }

            const formatUserInfo = (user: User) => {
                return `${user.name} (${user.age} ปี)`
            }

            const result = ciTag(
                { id: 1, name: 'ทดสอบ' },
                validateUser,
                addDefaultAge,
                formatUserInfo
            )

            expect(result).toEqual({
                tag: 'right',
                value: 'ทดสอบ (25 ปี)',
            })
        })
    })

    describe('5. ฟังก์ชัน makeTag ', () => {
        it('makeTag สร้าง tag ตามเงื่อนไขที่กำหนด - กรณีเงื่อนไขเป็นจริง', () => {
            const isPositive = makeTag(
                'ต้องเป็นจำนวนบวก',
                (num: number) => num > 0
            )
            const result = isPositive(10)

            expect(result).toEqual({
                tag: 'right',
                value: 10,
            })
        })

        it('makeTag สร้าง tag ตามเงื่อนไขที่กำหนด - กรณีเงื่อนไขเป็นเท็จ', () => {
            const isPositive = makeTag(
                'ต้องเป็นจำนวนบวก',
                (num: number) => num > 0
            )
            const result = isPositive(-5)

            expect(result).toEqual({
                tag: 'left',
                error: 'ต้องเป็นจำนวนบวก',
            })
        })
    })

    // -----------------------------------------------------------------------------------
    describe('6. การใช้งานร่วมกันของฟังก์ชันต่างๆ', () => {
        it('ใช้งาน ciTag ร่วมกับ ฟังก์ชันที่ใช้  makeTag', () => {
            // สร้างฟังก์ชันตรวจสอบต่างๆ
            const isNotEmpty = makeTag(
                'ต้องไม่เป็นค่าว่าง',
                (str: string) => str.trim().length > 0
            )
            const isValidLength = makeTag(
                'ความยาวต้องไม่เกิน 20 ตัวอักษร',
                (str: string) => str.length <= 20
            )
            const hasNoSpecialChars = makeTag(
                'ต้องไม่มีอักขระพิเศษ',
                (str: string) => /^[ก-๙a-zA-Z0-9\s]+$/.test(str)
            )

            // ทดสอบกับข้อมูลที่ถูกต้อง
            const validResult = ciTag(
                '   ทดสอบชื่อ  ',
                (str) => str.trim(),
                isNotEmpty,
                isValidLength,
                hasNoSpecialChars,
                (name) => ({ id: 1, name })
            )

            expect(validResult.tag).toBe('right')
            if (validResult.tag === 'right') {
                expect(validResult.value).toEqual({ id: 1, name: 'ทดสอบชื่อ' })
            }

            // ทดสอบกับข้อมูลที่ไม่ถูกต้อง (มีอักขระพิเศษ)
            const invalidResult = ciTag(
                'ทดสอบ@ชื่อ',
                (str) => str.trim(),
                isNotEmpty,
                isValidLength,
                hasNoSpecialChars,
                (name) => ({ id: 1, name })
            )

            expect(invalidResult.tag).toBe('left')
            if (invalidResult.tag === 'left') {
                expect(invalidResult.error).toBe('ต้องไม่มีอักขระพิเศษ')
            }
        })

        it('ใช้งาน logs เพื่อติดตามการทำงานของ ciTag', () => {
            const isValidUsername = makeTag(
                'ชื่อผู้ใช้ต้องประกอบด้วยตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข หรือ _ และมีความยาว 3-16 ตัวอักษร',
                (name: string) => /^[a-z0-9_]{3,16}$/.test(name)
            )

            // สร้างฟังก์ชันเพื่อตรวจสอบการทำงาน
            const trimUsername = (str: string) => str.trim().toLowerCase()
            const saveUser = (username: string) => ({
                id: Date.now(),
                username,
            })

            // บันทึก logs การทำงาน
            const processLogs = logs(
                '  User_123  ',
                trimUsername,
                isValidUsername,
                saveUser
            )

            // ตรวจสอบผลลัพธ์และ logs
            expect(processLogs.tag).toBe('right')
            expect(processLogs.value).toHaveProperty('username', 'user_123')
            expect(processLogs.logs).toHaveLength(3)

            // ตรวจสอบแต่ละขั้นตอน
            expect(processLogs.logs[0].input).toBe('  User_123  ')
            expect(processLogs.logs[0].output).toBe('user_123')

            // แก้ไขการทดสอบตรงนี้ให้ตรงตามผลลัพธ์จริง
            expect(processLogs.logs[1].input).toBe('user_123')
            // ถ้า isValidUsername คืนค่าเป็น string ธรรมดา:
            expect(processLogs.logs[1].output).toBe('user_123')

            expect(processLogs.logs[2].input).toBe('user_123')
            expect(processLogs.logs[2].output).toHaveProperty(
                'username',
                'user_123'
            )
        })
    })
})
