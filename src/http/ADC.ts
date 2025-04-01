import { checkEmpty, checkObject } from '../fnCheck'
import { toCombineText, toConvertData, toHasKey } from '../fnTo'
import { validateObject } from '../fnValidate'
import PageStorageManager from './PageStorageManager'
import StorageManager from './StorageManager'
import {
    calculateExpiryTime,
    getDefaultGroup,
    getDefaultKey,
} from './composition-http'
import { GroupKeyForStorage, HttpError, RequestConfig } from './type-http'

const TIME_OUT = 8000 // 8 วินาที
// ประเภทของ response interceptor
type ResponseInterceptor<T = any> = (response: T) => T | Promise<T>
/**
 * คลาสหลักสำหรับจัดการ HTTP requests
 */
class ADC<Request extends object, Response = any> {
    private responseInterceptors: ResponseInterceptor[] = [] // interceptors สำหรับจัดการ response
    // สร้าง storage managers แยกตามประเภท
    private readonly storageManagers: {
        cache: StorageManager<Response>
        store: PageStorageManager<Response> | StorageManager<Response> // เพิ่ม store storage
        localStorage: StorageManager<Response>
        session: StorageManager<Response>
    }
    public HttpError: HttpError | null = null // ข้อผิดพลาดจาก request
    /**
     * context สำหรับเก็บข้อมูล context จาก response ที่ต้องการเก็บไว้ใช้งาน
     */
    public context: any = undefined
    /**
     * status code ของ response
     */
    public status: number = 0 // เก็บค่า status code จาก endpoint

    public validateResponse: string = '' // เก็บค่า validateResponse ที่ส่งเข้ามา

    constructor() {
        this.storageManagers = this.initializeStorageManagers()
    }

    /**
     * ตรวจสอบคุณสมบัติที่จำเป็นของ payload (variables) ตาม keys ที่ระบุ
     * @param payload - ข้อมูล payload ที่ต้องการตรวจสอบ
     * @param keys - รายการ keys ที่ต้องการตรวจสอบ
     * @param errorMessage - ข้อความแสดงข้อผิดพลาดเมื่อตรวจสอบไม่ผ่าน
     * @returns ผลลัพธ์การตรวจสอบ {status: 1|0|-1, message: string} โดย 1=ผ่าน, 0=ไม่ผ่าน, -1=error
     */
    private hasProperties(
        keys: RequestConfig<Request, Response>['validateResponse'],
        response: Response
    ) {
        // ใช้ validateObject เพื่อตรวจสอบคุณสมบัติที่จำเป็น
        // ถ้า keys ไม่ว่างและ response เป็น object
        if (!checkEmpty(keys) && checkObject(response)) {
            const error = validateObject(response, keys)
            this.validateResponse = error.message
            if (error.status !== 1) {
                this.HttpError = new HttpError(
                    400, // Bad Request
                    'Validation Error',
                    { message: error.message }
                )
                throw this.HttpError
            }
        }
    }

    /**
     * สร้าง instance ของแต่ละประเภท storage managers
     * @returns object ที่มี storage managers แต่ละประเภท
     */
    private initializeStorageManagers() {
        if (this.isClient()) {
            return {
                cache: new StorageManager<Response>('cache'),
                store: new PageStorageManager<Response>(),
                localStorage: new StorageManager<Response>('localStorage'),
                session: new StorageManager<Response>('session'),
            }
        }

        // Server-side fallback - ใช้ cache storage สำหรับทุกประเภท
        const cacheStorage = new StorageManager<Response>('cache')
        return {
            cache: cacheStorage,
            store: cacheStorage,
            localStorage: cacheStorage,
            session: cacheStorage,
        }
    }

    /**
     * ทำการแปลงข้อมูลเป็น string และ return เพื่อใช้เป็น key ในการเก็บ cache
     * group คือชื่อกลุ่มของข้อมูลประกอบไปด้วย storage baseURL, method, query default คือ 'anonymous'
     * key คือข้อมูลที่จะถูกเก็บ ประกอบไปด้วย variables ที่ถูกแปลงเป็น string default คือ 'undefined'
     * @param config - ค่า config ที่ใช้ในการสร้าง request
     * @returns GroupKeyForStorage ที่มี group และ key
     */
    private getGroupAndKey(
        config: RequestConfig<Request, Response>
    ): GroupKeyForStorage {
        const check =
            !checkEmpty(config.variables) && checkObject(config.variables)
        const group = toCombineText(
            [config.storage, config.baseURL, config.method, config.query],
            ''
        )
        const key = check
            ? toHasKey(toConvertData(config.variables || {}, true))
            : ''
        return {
            group: toHasKey(getDefaultGroup(group)),
            key: getDefaultKey(key),
        }
    }

    /**
     * เพิ่ม interceptor สำหรับจัดการ response
     *  สามารถ เพิ่ม ลบ แก้ไข หรือปรับปรุงข้อมูล  response ก่อนที่จะถูก return
     * คืนค่าฟังก์ชันสำหรับลบ interceptor
     * @param interceptor - ฟังก์ชันที่จะประมวลผล response
     * @returns ฟังก์ชันสำหรับบ interceptor
     */
    private addResponseInterceptor(
        interceptor: (response: Response) => Response | Promise<Response>
    ): () => void {
        // เขียน function ดีสามารถเพิ่มซ้ำได้ และ ลบ interceptor ที่ซ้ำออกได้
        this.responseInterceptors.push(interceptor)

        return () => {
            const index = this.responseInterceptors.indexOf(interceptor)
            // ลบ interceptor ที่ซ้ำ ออกจาก array
            if (index !== -1) {
                this.responseInterceptors.splice(index, 1)
            }
        }
    }

    /**
     * สร้าง AbortController สำหรับจัดการ timeout
     * @param timeout - เวลาที่จะยกเลิก request (ms)
     * @returns AbortController instance
     */
    private createAbortController(timeout: number = TIME_OUT): AbortController {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), timeout)
        return controller
    }

    /**
     * ประมวลผล response ผ่าน interceptors ทั้งหมด
     * @param response - ข้อมูล response ที่ได้รับจาก API
     * @param nameKeys - ชื่อ key ที่ต้องการดึงจาก response (dot notation)
     * @returns ข้อมูลที่ผ่านการประมวลผลแล้ว
     */
    private async processResponse(
        response: any,
        nameKeys: string
    ): Promise<Response> {
        const names = nameKeys.split('.')
        let result = response
        for (const name of names) {
            result = result[name] || result
        }

        // ประมวลผล แปลงข้อมูลต่างๆผ่าน response ผ่าน interceptors ทั้งหมด
        for (const interceptor of this.responseInterceptors) {
            result = await interceptor(result)
        }
        return result
    }

    /**
     * ประมวลผล response เพื่อหา context ตาม path ที่กำหนด
     * @param response - ข้อมูล response ที่ได้รับจาก API
     * @param errorKeys - path ที่ใช้ในการเข้าถึงข้อมูล context (dot notation)
     */
    private processResponseConTextApi(response: any, errorKeys: string) {
        if (!errorKeys) return
        const names = errorKeys.split('.')
        let result = response
        for (const name of names) {
            if (result[name] === undefined) return
            result = result[name]
        }
        if (result) {
            this.context = result
        }
    }

    /**
     * จัดการ storage สำหรับ response
     * @param config - ค่า config ที่ใช้ในการสร้าง request
     * @param fetcher - ฟังก์ชันที่ใช้ในการดึงข้อมูลจาก API
     * @returns ข้อมูลที่ได้จาก storage หรือ API
     */
    private async handleStorage(
        config: RequestConfig<Request, Response>,
        fetcher: () => Promise<Response>
    ): Promise<Response> {
        // ถ้าอยู่บน server และมีการใช้ client-side storage
        if (
            !this.isClient() &&
            config.storage &&
            ['localStorage', 'session', 'store'].includes(config.storage)
        ) {
            // ทำ request โดยตรงไม่ผ่าน storage
            return fetcher()
        }

        // สร้าง group และ key สำหรับเก็บข้อมูล และ มีการจัดการค่า default ให้แล้ว
        const groupKey = this.getGroupAndKey(config)
        const timeToLive = calculateExpiryTime(config.timeToLive)

        // ถ้ามีการใช้ Get Storage ให้ดึงข้อมูลจาก storage ก่อน
        if (config.storage) {
            const responseStorage =
                this.storageManagers[config.storage].get(groupKey)
            if (responseStorage) {
                return responseStorage
            }
        }

        const response = await fetcher()

        // ถ้ามีการใช้ Set Storage ให้เก็บข้อมูลลง storage
        if (config.storage) {
            this.storageManagers[config.storage].set(
                groupKey,
                response,
                timeToLive
            )
        }

        return response
    }

    /**
     * ตรวจสอบว่ากำลังทำงานอยู่บน client หรือไม่
     * @returns true ถ้ากำลังทำงานอยู่บน client, false ถ้าเป็น server
     */
    private isClient(): boolean {
        return typeof window !== 'undefined'
    }

    /**
     * สร้าง headers สำหรับ request
     * @param config - ค่า config ที่ใช้ในการสร้าง request
     * @returns Headers หรือ Record<string, string>
     */
    private createHeaders(
        config: RequestConfig<Request, Response>
    ): Headers | Record<string, string> {
        const headers = {
            'Content-Type': config.contentType || 'application/json',
            ...(config.token && { Authorization: `Bearer ${config.token}` }),
            ...config.headers,
        }

        return this.isClient() ? new Headers(headers) : headers
    }

    /**
     * ส่ง HTTP request
     * @param config - ค่า config ที่ใช้ในการสร้าง request
     * @returns Promise ที่คืนค่าเป็นข้อมูลที่ได้รับจาก API
     */
    async request(config: RequestConfig<Request, Response>): Promise<Response> {
        // ถ้ามีการใช้ storage ที่ต้องการ browser APIs แต่รันบน server / config.storage จะถูกเปลี่ยนเป็น cache แทน
        if (
            !this.isClient() && // เพิ่มวงเล็บเพื่อเรียกใช้ method
            config.storage &&
            ['localStorage', 'session', 'store'].includes(config.storage)
        ) {
            config.storage = 'cache'
        }

        // ใช้ handleStorage ครอบการทำ request เพื่อจัดการ storage ให้โดยอัตโนมัติ
        return this.handleStorage(config, async () => {
            // กำหนดค่าเริ่มต้น จัดการ config ที่ส่งเข้ามา
            config.token = config.token || ''
            config.retries = config.retries || 0
            config.contentType = config.contentType || 'application/json'
            config.interceptors = config.interceptors || []
            config.query = config.query || ''
            config.variables = config.variables || ({} as Request)
            config.timeout = config.timeout || TIME_OUT
            config.name = config.name || ''
            config.baseURL = config.baseURL || ''
            config.method = config.method || 'POST'
            config.retries = config.retries || 0
            config.beforeEach = config.beforeEach || []
            config.contextApi = config.contextApi || ''

            // สร้าง interceptors สำหรับ response ที่ถูกเพิ่มเข้ามา
            for (const interceptor of config.interceptors) {
                this.addResponseInterceptor(interceptor)
            }

            const payload = config.query
                ? { query: config.query, variables: config.variables }
                : config.variables

            const controller = this.createAbortController(config.timeout)

            try {
                // ก่อน call api ต้อง clear error ก่อน
                this.context = null
                this.HttpError = null
                this.status = 0
                this.validateResponse = ''
                // สร้าง options สำหรับ fetch
                const options: RequestInit = {
                    method: config.method,
                    headers: this.createHeaders(config),
                    signal: controller.signal,
                }

                // เพิ่ม body ถ้ามี payload
                if (!checkEmpty(payload)) {
                    options.body = JSON.stringify(payload)
                }

                // ทำ fetch request
                const response = await fetch(config.baseURL, options)

                // บันทึก status code
                this.status = response.status

                const data = await response.json()
                // ตรวจสอบ auth error

                // ตรวจสอบ validateResponse ที่ส่งเข้ามาเพื่อประมวลผลก่อนที่จะไปต่อ
                this.hasProperties(config.validateResponse, data)

                // ตรวจสอบ beforeEach ที่ส่งเข้ามาเพื่อประมวลผลก่อนที่จะไปต่อ
                for (const before of config.beforeEach) {
                    before(data)
                }
                // ตรวจสอบ contextApi จาก response
                this.processResponseConTextApi(data, config.contextApi)

                // จำเป็นต้องอยู่หลังการตรวจสอบ beforeEach & contextApi
                if (!response.ok || response.status >= 400) {
                    this.HttpError = new HttpError(
                        response.status,
                        response.statusText,
                        data // เพิ่มข้อมูล data เข้าไปในข้อความผิดพลาด
                    )

                    throw new HttpError(
                        response.status,
                        response.statusText,
                        data
                    )
                }

                // ประมวลผลผ่าน interceptors
                const processedData = await this.processResponse(
                    data,
                    config.name
                )

                return processedData as Response
            } catch (error) {
                if (error instanceof HttpError && config.retries > 0) {
                    return this.request({
                        ...config,
                        retries: config.retries - 1,
                    })
                }
                throw error
            }
        })
    }

    /**
     * Shorthand method สำหรับ HTTP GET
     * @param config - ค่า config ที่ใช้ในการสร้าง request
     * @returns Promise ที่คืนค่าเป็นข้อมูลที่ได้รับจาก API
     */
    async get(
        config: Omit<RequestConfig<Request, Response>, 'method'>
    ): Promise<Response> {
        return this.request({ ...config, method: 'GET' })
    }

    /**
     * Shorthand method สำหรับ HTTP POST
     * @param config - ค่า config ที่ใช้ในการสร้าง request
     * @returns Promise ที่คืนค่าเป็นข้อมูลที่ได้รับจาก API
     */
    async post(
        config: Omit<RequestConfig<Request, Response>, 'method'>
    ): Promise<Response> {
        return this.request({ ...config, method: 'POST' })
    }

    /**
     * Shorthand method สำหรับ HTTP PUT
     * @param config - ค่า config ที่ใช้ในการสร้าง request
     * @returns Promise ที่คืนค่าเป็นข้อมูลที่ได้รับจาก API
     */
    async put(
        config: Omit<RequestConfig<Request, Response>, 'method'>
    ): Promise<Response> {
        return this.request({ ...config, method: 'PUT' })
    }

    /**
     * Shorthand method สำหรับ HTTP DELETE
     * @param config - ค่า config ที่ใช้ในการสร้าง request
     * @returns Promise ที่คืนค่าเป็นข้อมูลที่ได้รับจาก API
     */
    async delete(
        config: Omit<RequestConfig<Request, Response>, 'method'>
    ): Promise<Response> {
        return this.request({ ...config, method: 'DELETE' })
    }

    /**
     * Shorthand method สำหรับ HTTP PATCH
     * @param config - ค่า config ที่ใช้ในการสร้าง request
     * @returns Promise ที่คืนค่าเป็นข้อมูลที่ได้รับจาก API
     */
    async patch(
        config: Omit<RequestConfig<Request, Response>, 'method'>
    ): Promise<Response> {
        return this.request({ ...config, method: 'PATCH' })
    }
}

export { ADC }
