import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ADC from '../http/ADC'

// Mock types for testing
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

// Mock Storage API with complete interface implementation
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

    // Additional required methods for Storage interface
    [name: string]: any
}

// Mock Headers
class MockHeaders {
    private headers: { [key: string]: string } = {}

    constructor(init?: { [key: string]: string }) {
        if (init) {
            Object.keys(init).forEach((key) => {
                this.headers[key.toLowerCase()] = init[key]
            })
        }
    }

    append(key: string, value: string): void {
        this.headers[key.toLowerCase()] = value
    }

    get(key: string): string | null {
        return this.headers[key.toLowerCase()] || null
    }
}

describe('ADC Class', () => {
    let adc: ADC<TestRequest, TestResponse>

    beforeEach(() => {
        // Mock global objects
        Object.defineProperty(global, 'localStorage', {
            value: new MockStorage(),
        })
        Object.defineProperty(global, 'sessionStorage', {
            value: new MockStorage(),
        })
        global.Headers = MockHeaders as any

        // Mock AbortController
        class MockAbortController {
            signal = { aborted: false }
            abort() {
                this.signal.aborted = true
            }
        }
        global.AbortController = MockAbortController as any

        // Create ADC instance
        adc = new ADC()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('Basic Request Functionality', () => {
        it('ควรส่ง request ได้สำเร็จและได้รับ response ที่ถูกต้อง', async () => {
            const mockResponse = {
                data: {
                    id: 1,
                    name: 'Test',
                },
            }

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve(mockResponse),
            })

            const response = await adc.request({
                baseURL: 'http://api.test.com',
                method: 'POST',
                variables: { id: 1 },
                name: 'data',
            })

            expect(response).toEqual(mockResponse.data)
            expect(fetch).toHaveBeenCalledWith(
                'http://api.test.com',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ id: 1 }),
                })
            )
        })
    })

    describe('Storage Functionality', () => {
        it('ควรเก็บและดึงข้อมูลจาก cache storage ได้', async () => {
            const mockResponse = {
                data: {
                    id: 1,
                    name: 'Cached Data',
                },
            }

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve(mockResponse),
            })

            const config = {
                baseURL: 'http://api.test.com',
                storage: 'cache' as const,
                variables: { id: 1 },
                name: 'data',
                timeToLive: 60000, // 1 minute
            }

            // First request
            const firstResponse = await adc.request(config)
            expect(firstResponse).toEqual(mockResponse.data)
            expect(fetch).toHaveBeenCalledTimes(1)

            // Second request - should use cache
            const secondResponse = await adc.request(config)
            expect(secondResponse).toEqual(mockResponse.data)
            expect(fetch).toHaveBeenCalledTimes(1) // Should not call fetch again

            // Verify storage functionality
            expect(secondResponse).toEqual(firstResponse)
        })

        it('ควรล้าง cache ได้', async () => {
            const mockResponse = {
                data: {
                    id: 1,
                    name: 'Test',
                },
            }

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                json: () => Promise.resolve(mockResponse),
            })

            const storage = new MockStorage()
            const key = 'test-key'
            const value = JSON.stringify({ data: mockResponse })

            storage.setItem(key, value)
            expect(storage.getItem(key)).toBe(value)

            storage.clear()
            expect(storage.length).toBe(0)
            expect(storage.getItem(key)).toBeNull()
        })
    })
})
