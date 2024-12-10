import { describe, expect, it } from 'vitest'
import {
    checkNestedValue,
    createObj,
    findObjectByKey,
    mapToKeys,
    mergeObject,
    payloadByMax,
    payloadByMin,
    selectObject,
} from '../fnObject'

describe('fnObject', () => {
    // ทดสอบฟังก์ชัน mapToKeys
    describe('mapToKeys', () => {
        it('แปลง string path เป็น array ของ keys', () => {
            // ทดสอบกรณีปกติ
            expect(mapToKeys('profile.name')).toEqual(['profile', 'name'])

            // ทดสอบกรณีมี array index
            expect(mapToKeys('items[0].name')).toEqual(['items', '0', 'name'])

            // ทดสอบกรณีซับซ้อน
            expect(mapToKeys('user.addresses[2].city.zipcode')).toEqual([
                'user',
                'addresses',
                '2',
                'city',
                'zipcode',
            ])

            // ทดสอบกรณีมี length (ควรถูกกรอง)
            expect(mapToKeys('items.length')).toEqual(['items'])
        })
    })

    // ทดสอบฟังก์ชัน findObjectByKey
    describe('findObjectByKey', () => {
        const testObj = {
            user: {
                name: 'John',
                addresses: [{ city: 'Bangkok' }, { city: 'London' }],
            },
            items: ['a', 'b', 'c'],
        }

        it('ค้นหา key ในอ็อบเจกต์และคืนค่า boolean', () => {
            // ทดสอบกรณีพบ key
            expect(findObjectByKey(testObj, ['user.name'])).toBe(true)
            expect(findObjectByKey(testObj, ['items[0]'])).toBe(true)
            expect(findObjectByKey(testObj, ['user.addresses[0].city'])).toBe(
                true
            )

            // ทดสอบกรณีไม่พบ key
            expect(findObjectByKey(testObj, ['user.age'])).toBe(false)
            expect(findObjectByKey(testObj, ['items[5]'])).toBe(false)
        })

        it('รองรับการค้นหาหลาย keys พร้อมกัน', () => {
            expect(findObjectByKey(testObj, ['user.name', 'items[0]'])).toBe(
                true
            )
            expect(findObjectByKey(testObj, ['user.name', 'notExist'])).toBe(
                false
            )
        })
    })

    // ทดสอบฟังก์ชัน mergeObject
    describe('mergeObject', () => {
        it('รวมอ็อบเจกต์หลายตัวเข้าด้วยกัน', () => {
            const obj1 = { name: 'John', age: 30 }
            const obj2 = { city: 'Bangkok' }
            const obj3 = { age: 31, country: 'Thailand' }

            expect(mergeObject(obj1, obj2, obj3)).toEqual({
                name: 'John',
                age: 31,
                city: 'Bangkok',
                country: 'Thailand',
            })
        })

        it('รวมอ็อบเจกต์ซ้อนระดับ (nested objects)', () => {
            const obj1 = {
                user: { name: 'John', age: 30 },
                settings: { theme: 'dark' },
            }
            const obj2 = {
                user: { age: 31, city: 'Bangkok' },
                settings: { language: 'th' },
            }

            expect(mergeObject(obj1, obj2)).toEqual({
                user: {
                    name: 'John',
                    age: 31,
                    city: 'Bangkok',
                },
                settings: {
                    theme: 'dark',
                    language: 'th',
                },
            })
        })

        it('รวม arrays', () => {
            const obj1 = { items: [1, 2] }
            const obj2 = { items: [3, 4] }

            expect(mergeObject(obj1, obj2)).toEqual({
                items: [1, 2, 3, 4],
            })
        })
    })

    // ทดสอบฟังก์ชัน createObj
    describe('createObj', () => {
        const testData = {
            user: {
                name: 'John',
                address: {
                    city: 'Bangkok',
                    country: 'Thailand',
                },
            },
            items: ['a', 'b', 'c'],
        }

        it('สร้างอ็อบเจกต์ใหม่จาก path', () => {
            expect(createObj(testData, 'user.name')).toEqual({
                user: { name: 'John' },
            })

            expect(createObj(testData, 'user.address.city')).toEqual({
                user: { address: { city: 'Bangkok' } },
            })
        })

        it('รองรับ array index', () => {
            const res = createObj(testData, 'items')
            expect(res).toEqual({
                items: ['a', 'b', 'c'],
            })
        })
    })

    // ทดสอบฟังก์ชัน selectObject
    describe('selectObject', () => {
        const testData = {
            user: {
                name: 'John',
                age: 30,
                address: {
                    city: 'Bangkok',
                    country: 'Thailand',
                },
            },
            settings: {
                theme: 'dark',
            },
        }

        it('เลือกข้อมูลตาม paths ที่กำหนด', () => {
            expect(
                selectObject(testData, ['user.name', 'settings.theme'])
            ).toEqual({
                user: { name: 'John' },
                settings: { theme: 'dark' },
            })
        })

        it('ข้าม paths ที่ไม่มีอยู่', () => {
            expect(selectObject(testData, ['user.name', 'notExist'])).toEqual({
                user: { name: 'John' },
            })
        })
    })

    // ทดสอบฟังก์ชัน checkNestedValue
    describe('checkNestedValue', () => {
        const testData = {
            user: {
                name: 'John',
                hobbies: ['reading', 'gaming'],
                address: {
                    city: 'Bangkok',
                    code: 10400,
                },
            },
        }

        it('ตรวจสอบค่าใน nested object', () => {
            // ทดสอบค่าปกติ
            expect(checkNestedValue(testData, { name: 'John' })).toBe(true)

            // ทดสอบ array
            expect(
                checkNestedValue(testData, {
                    hobbies: ['reading', 'gaming'],
                })
            ).toBe(true)

            // ทดสอบ nested object
            expect(
                checkNestedValue(testData, {
                    address: { city: 'Bangkok', code: 10400 },
                })
            ).toBe(true)
        })

        it('คืนค่า false เมื่อไม่พบหรือค่าไม่ตรงกัน', () => {
            expect(checkNestedValue(testData, { name: 'Jane' })).toBe(false)
            expect(
                checkNestedValue(testData, {
                    hobbies: ['reading'],
                })
            ).toBe(false)
        })
    })

    // ทดสอบฟังก์ชัน payloadByMax และ payloadByMin
    describe('payloadByMax and payloadByMin', () => {
        const items = [
            { id: 1, value: 10 },
            { id: 2, value: 5 },
            { id: 3, value: 15 },
            { id: 4, value: 8 },
        ]

        it('หาค่าสูงสุดตาม property ที่กำหนด', () => {
            const max = payloadByMax(items, (item) => item.value)
            expect(max).toEqual({ id: 3, value: 15 })
        })

        it('หาค่าต่ำสุดตาม property ที่กำหนด', () => {
            const min = payloadByMin(items, (item) => item.value)
            expect(min).toEqual({ id: 2, value: 5 })
        })

        it('คืนค่า undefined เมื่อ array ว่าง', () => {
            expect(payloadByMax([], (item) => item)).toBeUndefined()
            expect(payloadByMin([], (item) => item)).toBeUndefined()
        })
    })
})
