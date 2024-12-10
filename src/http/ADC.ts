import { isEmpty } from '@/ABC/ui/bc-functional'
import {
    calculateExpiryTime,
    getDefaultGroup,
    getDefaultKey,
} from '@/ABC/ui/http/bc-composition-http'
import PageStorageManager from '@/ABC/ui/http/PageStorageManager'
import { isObject } from '@vueuse/core'
import { toCombineText, toConvertData, toHasKey } from 'adc-directive'
import { GroupKeyForStorage, HttpError, RequestConfig } from './bc-type-http'
import StorageManager from './StorageManager'

const TIME_OUT = 8000 // 8 วินาที
// ประเภทของ response interceptor
type ResponseInterceptor = (response: any) => any | Promise<any>
/**
 * คลาสหลักสำหรับจัดการ HTTP requests
 */
export default class ADC<Req extends object, Res extends object> {
    private responseInterceptors: ResponseInterceptor[] = [] // interceptors สำหรับจัดการ response
    // สร้าง storage managers แยกตามประเภท
    private readonly storageManagers: {
        cache: StorageManager<Res>
        store: PageStorageManager<Res> // เพิ่ม store storage
        localStorage: StorageManager<Res>
        session: StorageManager<Res>
    }
    public HttpError: HttpError | null = null // ข้อผิดพลาดจาก request
    public context: any = undefined // สำหรับเก็บข้อมูล context จาก response ที่ต้องการเก็บไว้ใช้งาน

    constructor() {
        // สร้าง instance ของแต่ละประเภท storage ตั้งแต่ต้น
        this.storageManagers = {
            cache: new StorageManager<Res>('cache'),
            store: new PageStorageManager<Res>(), // สร้าง instance ของ PageStorageManager
            localStorage: new StorageManager<Res>('localStorage'),
            session: new StorageManager<Res>('session'),
        }
    }

    /**
     * ทำการแปลงข้อมูลเป็น string และ return เพื่อใช้เป็น key ในการเก็บ cache
     * group คือชื่อกลุ่มของข้อมูลประกอบไปด้วย storage baseURL, method, query default คือ 'anonymous'
     * key คือข้อมูลที่จะถูกเก็บ ประกอบไปด้วย variables ที่ถูกแปลงเป็น string default คือ 'undefined'
     */
    private getGroupAndKey(
        config: RequestConfig<Req, Res>
    ): GroupKeyForStorage {
        const check = !isEmpty(config.variables) && isObject(config.variables)
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
     */
    private addResponseInterceptor(
        interceptor: (response: Res) => Res | Promise<Res>
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
     */
    private createAbortController(timeout: number = TIME_OUT): AbortController {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), timeout)
        return controller
    }

    /**
     * ประมวลผล response ผ่าน interceptors ทั้งหมด
     */
    private async processResponse(
        response: any,
        nameKeys: string
    ): Promise<any> {
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
     * ประมวลผล response หา error และ return ข้อมูล
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

    private async handleStorage(
        config: RequestConfig<Req, Res>,
        fetcher: () => Promise<Res>
    ): Promise<Res> {
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
     * ส่ง HTTP request
     * @template T ประเภทข้อมูลที่คาดว่าจะได้รับกลับมา
     */
    async request(config: RequestConfig<Req, Res>): Promise<Res> {
        // ใช้ handleStorage ครอบการทำ request เพื่อจัดการ storage ให้โดยอัตโนมัติ
        return this.handleStorage(config, async () => {
            // กำหนดค่าเริ่มต้น จัดการ config ที่ส่งเข้ามา
            config.token = config.token || ''
            config.retries = config.retries || 0
            config.contentType = config.contentType || 'application/json'
            config.interceptors = config.interceptors || []
            config.query = config.query || ''
            config.variables = config.variables || ({} as Req)
            config.timeout = config.timeout || TIME_OUT
            config.name = config.name || ''
            config.baseURL = config.baseURL || ''
            config.method = config.method || 'POST'
            config.retries = config.retries || 0
            config.beforeEach = config.beforeEach || []
            config.contextApi = config.contextApi || ''
            const headersForApi = new Headers({
                ...config.headers,
                'Content-Type': config.contentType,
                ...(config.token && {
                    Authorization: `Bearer ${config.token}`,
                }),
            })

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
                const options: RequestInit = {
                    method: config.method,
                    headers: headersForApi,
                    signal: controller.signal,
                }
                if (!isEmpty(payload)) {
                    options.body = JSON.stringify(payload)
                }

                const response = await fetch(config.baseURL, options)

                const data = await response.json()
                // ตรวจสอบ auth error

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
                        response.statusText
                    )

                    throw new HttpError(response.status, response.statusText)
                }

                // ประมวลผลผ่าน interceptors
                const processedData = await this.processResponse(
                    data,
                    config.name
                )

                return processedData as Res
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
     * Shorthand methods สำหรับ HTTP methods ต่างๆ
     */
    async get(config: Omit<RequestConfig<Req, Res>, 'method'>): Promise<Res> {
        return this.request({ ...config, method: 'GET' })
    }

    async post(config: Omit<RequestConfig<Req, Res>, 'method'>): Promise<Res> {
        return this.request({ ...config, method: 'POST' })
    }

    async put(config: Omit<RequestConfig<Req, Res>, 'method'>): Promise<Res> {
        return this.request({ ...config, method: 'PUT' })
    }

    async delete(
        config: Omit<RequestConfig<Req, Res>, 'method'>
    ): Promise<Res> {
        return this.request({ ...config, method: 'DELETE' })
    }
}
