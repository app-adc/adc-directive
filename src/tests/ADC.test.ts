import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ADC from '../http/ADC'

// Type definitions...
interface TestRequest {
    id?: number
    name?: string
}

interface TestResponse {
    data?: {
        id: number
        name: string
    }
    error?: string
}

// MockStorage implementation
class MockStorage implements Storage {
    private store: { [key: string]: string } = {}

    get length(): number {
        return Object.keys(this.store).length
    }

    clear(): void {
        this.store = {}
    }

    getItem(key: string): string | null {
        return this.store[key] || null
    }

    key(index: number): string | null {
        return Object.keys(this.store)[index] || null
    }

    removeItem(key: string): void {
        delete this.store[key]
    }

    setItem(key: string, value: string): void {
        this.store[key] = value
    }

    [name: string]: any
}

describe('ADC Class', () => {
    let adc: ADC<TestRequest, TestResponse>

    beforeEach(() => {
        // Setup fake timers
        vi.useFakeTimers()

        // Set initial system time
        vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

        // Setup storage
        Object.defineProperty(global, 'localStorage', {
            value: new MockStorage(),
        })
        Object.defineProperty(global, 'sessionStorage', {
            value: new MockStorage(),
        })

        // Setup Headers
        global.Headers = class {
            constructor() {}
            append() {}
            get() {
                return null
            }
        } as any

        // Setup AbortController
        global.AbortController = class {
            signal = { aborted: false }
            abort() {
                this.signal.aborted = true
            }
        } as any

        adc = new ADC()
    })

    afterEach(() => {
        vi.clearAllMocks()
        vi.clearAllTimers()
        vi.useRealTimers()
    })

    describe('Storage Functionality', () => {
        it('ควรเก็บและดึงข้อมูลจาก cache storage ได้', async () => {
            const mockResponse = {
                data: {
                    id: 1,
                    name: 'Cached Data',
                },
            }

            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve(mockResponse),
            })
            global.fetch = fetchMock

            const config = {
                baseURL: 'http://api.test.com',
                method: 'GET',
                storage: 'cache' as const,
                variables: { id: 1 },
                name: 'data',
                timeToLive: 60000, // 1 minute
            } as const

            // First request
            const firstResponse = await adc.request(config)
            expect(firstResponse).toEqual(mockResponse.data)
            expect(fetchMock).toHaveBeenCalledTimes(1)

            // Advance time but stay within cache validity
            vi.advanceTimersByTime(30000) // 30 seconds

            // Second request with same config
            const secondResponse = await adc.request(config)
            expect(secondResponse).toEqual(mockResponse.data)
            expect(fetchMock).toHaveBeenCalledTimes(1) // Should still be 1
        })

        it('ควรทำ request ใหม่เมื่อ cache หมดอายุ', async () => {
            const mockResponse = {
                data: {
                    id: 1,
                    name: 'Cached Data',
                },
            }

            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve(mockResponse),
            })
            global.fetch = fetchMock

            const config = {
                baseURL: 'http://api.test.com',
                method: 'GET',
                storage: 'cache' as const,
                variables: { id: 1 },
                name: 'data',
                timeToLive: 5000, // 5 seconds
            } as const

            // First request
            await adc.request(config)
            expect(fetchMock).toHaveBeenCalledTimes(1)

            // Move time forward beyond cache expiration
            vi.advanceTimersByTime(6000) // 6 seconds

            // Second request should trigger new fetch
            await adc.request(config)
            expect(fetchMock).toHaveBeenCalledTimes(2)
        })

        it('ควรทำ request ใหม่เมื่อ parameters เปลี่ยน', async () => {
            const mockResponse = {
                data: {
                    id: 1,
                    name: 'Cached Data',
                },
            }

            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve(mockResponse),
            })
            global.fetch = fetchMock

            // Request with first set of parameters
            await adc.request({
                baseURL: 'http://api.test.com',
                method: 'GET',
                storage: 'cache' as const,
                variables: { id: 1 },
                name: 'data',
                timeToLive: 60000,
            })
            expect(fetchMock).toHaveBeenCalledTimes(1)

            // Request with different parameters
            await adc.request({
                baseURL: 'http://api.test.com',
                method: 'GET',
                storage: 'cache' as const,
                variables: { id: 2 }, // Different ID
                name: 'data',
                timeToLive: 60000,
            })
            expect(fetchMock).toHaveBeenCalledTimes(2)
        })

        it('ควรทำงานถูกต้องเมื่อไม่ได้ใช้ cache', async () => {
            const mockResponse = {
                data: {
                    id: 1,
                    name: 'No Cache Data',
                },
            }

            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve(mockResponse),
            })
            global.fetch = fetchMock

            const config = {
                baseURL: 'http://api.test.com',
                method: 'GET',
                variables: { id: 1 },
                name: 'data',
            } as const

            // Multiple requests without cache
            await adc.request(config)
            await adc.request(config)

            // Should make new request every time
            expect(fetchMock).toHaveBeenCalledTimes(2)
        })
    })
})
