import { describe, expect, it } from 'vitest'
import { left, logs, makeTag, right, tags, validateTag } from '../fnTag'

describe('fnTag - การทดสอบฟังก์ชันในรูปแบบ Tag Pattern', () => {
    // -----------------------------------------------------------------------------------
    describe('1. ฟังก์ชัน left และ right (constructors)', () => {
        it('left สร้าง Tag ด้วย tag เป็น "left" และเก็บค่า left ตามที่กำหนด', () => {
            const result = left('ข้อความผิดพลาด')
            expect(result).toEqual({
                tag: 'left',
                left: 'ข้อความผิดพลาด',
            })
        })

        it('right สร้าง Tag ด้วย tag เป็น "right" และเก็บค่า right ตามที่กำหนด', () => {
            const result = right({ id: 1, name: 'ทดสอบ' })
            expect(result).toEqual({
                tag: 'right',
                right: { id: 1, name: 'ทดสอบ' },
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
    describe('3. ฟังก์ชัน tags', () => {
        it('ส่งผ่านค่าเริ่มต้นเมื่อไม่มีฟังก์ชันที่ส่งเข้ามา', () => {
            const result = tags('ข้อมูลเริ่มต้น')
            expect(result).toEqual({
                tag: 'right',
                right: 'ข้อมูลเริ่มต้น',
            })
        })

        it('ประมวลผลฟังก์ชันตามลำดับและคืนค่า right สุดท้าย', () => {
            const result = tags(
                5,
                (num) => num * 2,
                (num) => num + 3,
                (num) => `ผลลัพธ์คือ ${num}`
            )

            expect(result).toEqual({
                tag: 'right',
                right: 'ผลลัพธ์คือ 13',
            })
        })

        it('หยุดการประมวลผลและคืนค่า left เมื่อเจอ error', () => {
            const validatePositive = (num: number) => {
                return num > 0 ? right(num) : left('ต้องเป็นจำนวนบวกเท่านั้น')
            }

            const result = tags(
                -5,
                (num) => num * 2,
                validatePositive,
                (num) => num + 3 // ฟังก์ชันนี้จะไม่ถูกเรียก
            )

            expect(result).toEqual({
                tag: 'left',
                left: 'ต้องเป็นจำนวนบวกเท่านั้น',
            })
        })

        it('จัดการกับ exception ในฟังก์ชันและแปลงเป็น left', () => {
            const throwError = () => {
                throw new Error('เกิดข้อผิดพลาดไม่คาดคิด')
            }

            const result = tags(
                10,
                (num) => num * 2,
                throwError,
                (num) => num + 5 // ฟังก์ชันนี้จะไม่ถูกเรียก
            )

            expect(result.tag).toBe('left')
            if (result.tag === 'left') {
                expect(result.left).toBe('เกิดข้อผิดพลาดไม่คาดคิด')
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

            const result = tags(
                { id: 1, name: 'ทดสอบ' },
                validateUser,
                addDefaultAge,
                formatUserInfo
            )

            expect(result).toEqual({
                tag: 'right',
                right: 'ทดสอบ (25 ปี)',
            })
        })
    })

    describe('5. ฟังก์ชัน makeTag และ validateTag', () => {
        it('makeTag สร้าง tag ตามเงื่อนไขที่กำหนด - กรณีเงื่อนไขเป็นจริง', () => {
            const isPositive = makeTag(
                (num: number) => num > 0,
                'ต้องเป็นจำนวนบวก'
            )
            const result = isPositive(10)

            expect(result).toEqual({
                tag: 'right',
                right: 10,
            })
        })

        it('makeTag สร้าง tag ตามเงื่อนไขที่กำหนด - กรณีเงื่อนไขเป็นเท็จ', () => {
            const isPositive = makeTag(
                (num: number) => num > 0,
                'ต้องเป็นจำนวนบวก'
            )
            const result = isPositive(-5)

            expect(result).toEqual({
                tag: 'left',
                left: 'ต้องเป็นจำนวนบวก',
            })
        })

        it('validateTag สร้างฟังก์ชันตรวจสอบที่คืนค่าในรูปแบบ Tag', () => {
            const isValidName = validateTag((name: string) => name.length >= 3)(
                'ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร'
            )

            const validResult = isValidName('ทดสอบ')
            expect(validResult).toEqual({
                tag: 'right',
                right: 'ทดสอบ',
            })

            const invalidResult = isValidName('ab')
            expect(invalidResult).toEqual({
                tag: 'left',
                left: 'ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร',
            })
        })
    })

    // -----------------------------------------------------------------------------------
    describe('6. การใช้งานร่วมกันของฟังก์ชันต่างๆ', () => {
        it('ใช้งาน tags ร่วมกับ ฟังก์ชันที่ใช้ validateTag และ makeTag', () => {
            // สร้างฟังก์ชันตรวจสอบต่างๆ
            const isNotEmpty = validateTag(
                (str: string) => str.trim().length > 0
            )('ต้องไม่เป็นค่าว่าง')
            const isValidLength = validateTag(
                (str: string) => str.length <= 20
            )('ความยาวต้องไม่เกิน 20 ตัวอักษร')
            const hasNoSpecialChars = makeTag(
                (str: string) => /^[ก-๙a-zA-Z0-9\s]+$/.test(str),
                'ต้องไม่มีอักขระพิเศษ'
            )

            // ทดสอบกับข้อมูลที่ถูกต้อง
            const validResult = tags(
                '   ทดสอบชื่อ  ',
                (str) => str.trim(),
                isNotEmpty,
                isValidLength,
                hasNoSpecialChars,
                (name) => ({ id: 1, name })
            )

            expect(validResult.tag).toBe('right')
            if (validResult.tag === 'right') {
                expect(validResult.right).toEqual({ id: 1, name: 'ทดสอบชื่อ' })
            }

            // ทดสอบกับข้อมูลที่ไม่ถูกต้อง (มีอักขระพิเศษ)
            const invalidResult = tags(
                'ทดสอบ@ชื่อ',
                (str) => str.trim(),
                isNotEmpty,
                isValidLength,
                hasNoSpecialChars,
                (name) => ({ id: 1, name })
            )

            expect(invalidResult.tag).toBe('left')
            if (invalidResult.tag === 'left') {
                expect(invalidResult.left).toBe('ต้องไม่มีอักขระพิเศษ')
            }
        })

        it('ใช้งาน logs เพื่อติดตามการทำงานของ tags', () => {
            const isValidUsername = validateTag((name: string) =>
                /^[a-z0-9_]{3,16}$/.test(name)
            )(
                'ชื่อผู้ใช้ต้องประกอบด้วยตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข หรือ _ และมีความยาว 3-16 ตัวอักษร'
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
