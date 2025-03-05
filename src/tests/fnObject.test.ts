import { describe, expect, it } from 'vitest'
import {
    findObjectByKey,
    mapToKeys,
    mergeObject,
    mergeWithUndefined,
    payloadByMax,
    payloadByMin,
} from '../fnObject'

describe('mapToKeys', () => {
    it('ควรแปลงรูปแบบ dot notation เป็น array ได้ถูกต้อง', () => {
        expect(mapToKeys('profile.name')).toEqual(['profile', 'name'])
    })

    it('ควรแปลงรูปแบบ array notation เป็น array ได้ถูกต้อง', () => {
        expect(mapToKeys('colors[2]')).toEqual(['colors', '2'])
    })

    it('ควรแปลงรูปแบบผสมระหว่าง dot และ array notation ได้ถูกต้อง', () => {
        expect(mapToKeys('profile.name.colors[2].value')).toEqual([
            'profile',
            'name',
            'colors',
            '2',
            'value',
        ])
    })

    it('ควรกรอง property length ออกไป', () => {
        expect(mapToKeys('colors.length')).toEqual(['colors'])
    })

    it('ควรรับมือกับ key ที่เป็นสตริงว่างหรือมีแค่จุดได้', () => {
        expect(mapToKeys('')).toEqual([])
        expect(mapToKeys('.')).toEqual([])
    })
})

describe('findObjectByKey', () => {
    const testObj = {
        profile: {
            name: 'John',
            address: {
                city: 'Bangkok',
            },
        },
        saleOrderItems: [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
        ],
        tags: ['red', 'blue', 'green'],
    }

    it('ควรค้นหา key แบบปกติได้ถูกต้อง', () => {
        expect(findObjectByKey(testObj, ['profile.name'])).toBe(true)
        expect(findObjectByKey(testObj, ['profile.gender'])).toBe(false)
    })

    it('ควรค้นหา key แบบ nested ได้ถูกต้อง', () => {
        expect(findObjectByKey(testObj, ['profile.address.city'])).toBe(true)
        expect(findObjectByKey(testObj, ['profile.address.zipcode'])).toBe(
            false
        )
    })

    it('ควรค้นหา key ใน array ได้ถูกต้อง', () => {
        expect(findObjectByKey(testObj, ['saleOrderItems[0].id'])).toBe(true)
        expect(findObjectByKey(testObj, ['saleOrderItems[0].price'])).toBe(
            false
        )
        expect(findObjectByKey(testObj, ['saleOrderItems[2].id'])).toBe(false) // เกินขนาดของ array
    })

    it('ควรค้นหาค่าใน array ที่เป็นค่าพื้นฐานได้ถูกต้อง', () => {
        expect(findObjectByKey(testObj, ['tags[0]'])).toBe(true)
        expect(findObjectByKey(testObj, ['tags[3]'])).toBe(false) // เกินขนาดของ array
    })

    it('ควรจัดการกับกรณีที่ payload ไม่ใช่ object ได้ถูกต้อง', () => {
        expect(findObjectByKey('not an object' as any, ['name'])).toBe(false)
        expect(findObjectByKey(null as any, ['name'])).toBe(false)
        expect(findObjectByKey(undefined as any, ['name'])).toBe(false)
    })

    it('ควรทำงานกับหลาย key พร้อมกันได้ถูกต้อง', () => {
        expect(
            findObjectByKey(testObj, ['profile.name', 'saleOrderItems[0].id'])
        ).toBe(true)
        expect(
            findObjectByKey(testObj, ['profile.name', 'profile.gender'])
        ).toBe(false)
    })
})

describe('mergeObject', () => {
    it('ควรรวม object พื้นฐานได้ถูกต้อง', () => {
        const obj1 = { name: 'John', age: 30 }
        const obj2 = { city: 'Bangkok' }

        expect(mergeObject(obj1, obj2)).toEqual({
            name: 'John',
            age: 30,
            city: 'Bangkok',
        })
    })

    it('ควรรวมและทับซ้อนค่าเก่าด้วยค่าใหม่ได้ถูกต้อง', () => {
        const obj1 = { name: 'John', age: 30 }
        const obj2 = { name: 'Jane', city: 'Bangkok' }

        expect(mergeObject(obj1, obj2)).toEqual({
            name: 'Jane',
            age: 30,
            city: 'Bangkok',
        })
    })

    it('ควรรวม object ซ้อนกันได้ถูกต้อง', () => {
        const obj1 = {
            name: 'John',
            profile: { color: 'red' },
        }
        const obj2 = {
            profile: { email: 'john@example.com' },
        }

        expect(mergeObject(obj1, obj2)).toEqual({
            name: 'John',
            profile: {
                color: 'red',
                email: 'john@example.com',
            },
        })
    })

    it('ควรรวม array ด้วยการต่อกันได้ถูกต้อง', () => {
        const obj1 = { colors: ['red', 'blue'] }
        const obj2 = { colors: ['green', 'yellow'] }

        expect(mergeObject(obj1, obj2)).toEqual({
            colors: ['red', 'blue', 'green', 'yellow'],
        })
    })

    it('ควรรับมือกับกรณีที่ไม่ใช่ object ได้ถูกต้อง', () => {
        const obj1 = { name: 'John' }
        const notObj = 'Not an object'

        expect(mergeObject(obj1, notObj as any)).toEqual({ name: 'John' })
    })

    it('ควรจัดการกรณีที่ไม่มี input ได้ถูกต้อง', () => {
        expect(mergeObject()).toEqual({})
    })

    it('ควรรวมมากกว่า 2 object ได้ถูกต้อง', () => {
        const obj1 = { name: 'John' }
        const obj2 = { age: 30 }
        const obj3 = { city: 'Bangkok' }

        expect(mergeObject(obj1, obj2, obj3)).toEqual({
            name: 'John',
            age: 30,
            city: 'Bangkok',
        })
    })
})

describe('payloadByMax', () => {
    it('ควรหาค่าสูงสุดจาก property ที่กำหนดได้ถูกต้อง', () => {
        const items = [
            { id: 1, value: 10 },
            { id: 2, value: 30 },
            { id: 3, value: 20 },
        ]

        const result = payloadByMax(items, (item) => item.value)
        expect(result).toEqual({ id: 2, value: 30 })
    })

    it('ควรหาค่าสูงสุดกรณีที่มีค่าติดลบได้ถูกต้อง', () => {
        const items = [
            { id: 1, value: -10 },
            { id: 2, value: -5 },
            { id: 3, value: -20 },
        ]

        const result = payloadByMax(items, (item) => item.value)
        expect(result).toEqual({ id: 2, value: -5 })
    })

    it('ควรคืนค่า undefined เมื่อ array ว่าง', () => {
        const items: any[] = []
        const result = payloadByMax(items, (item) => item.value)
        expect(result).toBeUndefined()
    })

    it('ควรทำงานถูกต้องกับ property ซ้อนกัน', () => {
        const items = [
            { id: 1, stats: { points: 50 } },
            { id: 2, stats: { points: 80 } },
            { id: 3, stats: { points: 20 } },
        ]

        const result = payloadByMax(items, (item) => item.stats.points)
        expect(result).toEqual({ id: 2, stats: { points: 80 } })
    })

    it('ควรทำงานถูกต้องกับ array ที่มีสมาชิกเดียว', () => {
        const items = [{ id: 1, value: 10 }]
        const result = payloadByMax(items, (item) => item.value)
        expect(result).toEqual({ id: 1, value: 10 })
    })

    it('ควรคืนค่าแรกที่พบเมื่อมีค่าสูงสุดซ้ำกัน', () => {
        const items = [
            { id: 1, value: 30 },
            { id: 2, value: 30 },
            { id: 3, value: 20 },
        ]

        const result = payloadByMax(items, (item) => item.value)
        expect(result).toEqual({ id: 1, value: 30 })
    })
})

describe('payloadByMin', () => {
    it('ควรหาค่าต่ำสุดจาก property ที่กำหนดได้ถูกต้อง', () => {
        const items = [
            { id: 1, value: 10 },
            { id: 2, value: 30 },
            { id: 3, value: 5 },
        ]

        const result = payloadByMin(items, (item) => item.value)
        expect(result).toEqual({ id: 3, value: 5 })
    })

    it('ควรหาค่าต่ำสุดกรณีที่มีค่าติดลบได้ถูกต้อง', () => {
        const items = [
            { id: 1, value: -10 },
            { id: 2, value: -5 },
            { id: 3, value: -20 },
        ]

        const result = payloadByMin(items, (item) => item.value)
        expect(result).toEqual({ id: 3, value: -20 })
    })

    it('ควรคืนค่า undefined เมื่อ array ว่าง', () => {
        const items: any[] = []
        const result = payloadByMin(items, (item) => item.value)
        expect(result).toBeUndefined()
    })

    it('ควรทำงานถูกต้องกับ property ซ้อนกัน', () => {
        const items = [
            { id: 1, stats: { points: 50 } },
            { id: 2, stats: { points: 80 } },
            { id: 3, stats: { points: 20 } },
        ]

        const result = payloadByMin(items, (item) => item.stats.points)
        expect(result).toEqual({ id: 3, stats: { points: 20 } })
    })

    it('ควรทำงานถูกต้องกับ array ที่มีสมาชิกเดียว', () => {
        const items = [{ id: 1, value: 10 }]
        const result = payloadByMin(items, (item) => item.value)
        expect(result).toEqual({ id: 1, value: 10 })
    })

    it('ควรคืนค่าแรกที่พบเมื่อมีค่าต่ำสุดซ้ำกัน', () => {
        const items = [
            { id: 1, value: 5 },
            { id: 2, value: 5 },
            { id: 3, value: 20 },
        ]

        const result = payloadByMin(items, (item) => item.value)
        expect(result).toEqual({ id: 1, value: 5 })
    })
})

describe('mergeWithUndefined', () => {
    it('ควรรวม object โดยใช้ค่าใหม่แทนที่ค่า undefined ได้ถูกต้อง', () => {
        type User = {
            name: string
            age?: number
            city?: string
            country?: string
        }
        const newObj: User = { name: 'John', age: undefined, city: 'Bangkok' }
        const oldObj: User = { name: 'Jane', age: 30, country: 'Thailand' }

        expect(mergeWithUndefined(newObj, oldObj)).toEqual({
            name: 'John',
            age: 30,
            city: 'Bangkok',
            country: 'Thailand',
        })
    })

    it('ควรทำงานถูกต้องกับ property ซ้อนกัน', () => {
        type User = {
            user: {
                name: string
                profile: {
                    age?: number
                    email?: string
                    phone?: string
                }
            }
        }
        const newObj: User = {
            user: {
                name: 'John',
                profile: {
                    age: undefined,
                    email: 'john@example.com',
                },
            },
        }

        const oldObj: User = {
            user: {
                name: 'Jane',
                profile: {
                    age: 30,
                    phone: '1234567890',
                },
            },
        }

        expect(mergeWithUndefined(newObj, oldObj)).toEqual({
            user: {
                name: 'John',
                profile: {
                    age: 30,
                    email: 'john@example.com',
                    phone: '1234567890',
                },
            },
        })
    })

    it('ควรรักษาค่า array ไว้ตามต้นฉบับ', () => {
        type User = {
            tags: string[]
            categories?: string[]
        }
        const newObj: User = { tags: ['red', 'blue'], categories: undefined }
        const oldObj: User = { tags: ['green'], categories: ['A', 'B'] }

        expect(mergeWithUndefined(newObj, oldObj)).toEqual({
            tags: ['red', 'blue'],
            categories: ['A', 'B'],
        })
    })

    it('ควรรับมือกับการ input ที่ไม่ใช่ object ได้ถูกต้อง', () => {
        expect(mergeWithUndefined('string' as any, { name: 'John' })).toBe(
            'string'
        )
        expect(mergeWithUndefined({ name: 'John' }, 'string' as any)).toEqual({
            name: 'John',
        })
        expect(mergeWithUndefined(null as any, { name: 'John' })).toBe(null)
        expect(mergeWithUndefined({ name: 'John' }, null as any)).toEqual({
            name: 'John',
        })
    })

    it('ควรเก็บรักษาค่า null ไว้ (ไม่ถือว่า null เป็น undefined)', () => {
        type User = {
            name: string
            age: number | null
        }
        const newObj: User = { name: 'John', age: null }
        const oldObj: User = { name: 'Jane', age: 30 }

        expect(mergeWithUndefined(newObj, oldObj)).toEqual({
            name: 'John',
            age: null,
        })
    })

    it('ควรไม่เปลี่ยนแปลง object ต้นฉบับ', () => {
        type User = {
            name: string
            age: number | undefined
        }
        const newObj: User = { name: 'John', age: undefined }
        const oldObj: User = { name: 'Jane', age: 30 }

        const result = mergeWithUndefined(newObj, oldObj)

        expect(newObj).toEqual({ name: 'John', age: undefined })
        expect(oldObj).toEqual({ name: 'Jane', age: 30 })
        expect(result).toEqual({ name: 'John', age: 30 })
    })
})
