/**
 * คลาส Error สำหรับจัดการข้อผิดพลาดจาก HTTP Request
 */
export class HttpError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public data?: any
    ) {
        super(`HTTP Error: ${status} ${statusText}`)
        this.name = 'HttpError'
    }
}

export type StorageType = 'cache' | 'localStorage' | 'session' | 'store'
// ประเภทข้อมูลสำหรับ request
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type ContentType = 'application/json' | 'multipart/form-data'
export type Interceptor<Res> = (response: Res) => Res | Promise<Res>
export type RequestConfig<Req extends object, Res extends object> = {
    /**
     * GraphQL query ถ้ามี query แปลว่าเป็น graphql ถ้าไม่มีแปลว่าเป็น rest api
     */
    query?: string
    /**
     * ตัวแปรสำหรับ query หรือ body res api
     */
    variables?: Req // ตัวแปรสำหรับ query หรือ body res api
    baseURL?: string // URL เฉพาะสำหรับ request นี้
    method?: HttpMethod // HTTP method
    /**
     * headers สำหรับ api request
     */
    headers?: Record<string, string> // Headers เพิ่มเติม
    /**
     * ประเภทของข้อมูลที่จะส่งไป
     * (default 'application/json')
     */
    contentType?: ContentType // Content-Type
    /**
     * ชื่อของการเข้าถึง key จาก response
     * ex. name: 'data.employee' หมายถึง จะเข้าถึงข้อมูลจาก response ที่ชื่อ employee ใน data
     */
    name?: string // key สำหรับดึงข้อมูลจาก response ex. 'data.employee'
    /**
     * token สำหรับการ headers bearer token
     */
    token?: string
    /**
     * เวลาหมดเวลาสำหรับ call api นี้
     * (default 8000 หรือ 8 วินาที)
     */
    timeout?: number
    /**
     * จำนวนครั้งที่จะลองใหม่เมื่อเกิดข้อผิดพลาด
     */
    retries?: number // จำนวนครั้งที่จะลองใหม่เมื่อเกิดข้อผิดพลาด
    /**
     * สำหรับเพิ่ม interceptors สำหรับ response ที่จะถูกเพิ่มเข้ามา
     * ใช้สำหรับเปลี่ยนแปบงข้อมูล  response ก่อนที่จะถูก return
     */
    interceptors?: Array<Interceptor<Res>>
    /**
     * ข้อมูลเริ่มต้นสำหรับ response ที่จะถูก return ก่อนที่จะถูกประมวลผล
     */
    initialData?: Res // ข้อมูลเริ่มต้น
    /**
     * สำหรับเก็บข้อมูล context จาก response ที่ต้องการเก็บไว้ใช้งาน
     * ตัวอย่างเช่น การเก็บข้อผิดพลาดจาก response
     * ex. contextApi: 'errors.0.message'
     */
    contextApi?: string
    /**
     * ประเภทการเก็บข้อมูล
     * @type 'cache' | 'localStorage' | 'session'
     */
    storage?: 'cache' | 'store' | 'localStorage' | 'session' // ประเภทการเก็บข้อมูล
    /**
     * ชื่อกลุ่มของข้อมูล สำหรับค้นหา ลบ จัดการข้อมูลใน storage
     * @type string
     * @default 'anonymous'
     */
    // group?: string
    /**
     * เวลาที่ข้อมูลจะถูกเก็บไว้ใน storage
     * @type number | (() => number)
     */
    timeToLive?: TimeToLive
    beforeEach?: Array<(res: any) => void>
}

/**
 * การตั้งค่าสำหรับแต่ละ request
 */
export type TimeToLive = number | (() => number)

export type GroupKeyForStorage = {
    key: string
    group: string
}

// Type สำหรับ storage item
export type StorageItem<T> = Record<string, { data: T; expires: number }>

/**
 * 15 นาที เวลาที่ข้อมูลจะถูกเก็บไว้
 */

// 200 OK: การร้องขอสำเร็จทั่วไป
// 201 Created: สร้างข้อมูลใหม่สำเร็จ (เช่น POST success)
// 204 No Content: สำเร็จแต่ไม่มีข้อมูลส่งกลับ (เช่น DELETE success)
// 301 Moved Permanently: URL ถูกย้ายไปถาวร
// 302 Found: URL ถูกย้ายชั่วคราว
// 304 Not Modified: ข้อมูลไม่มีการเปลี่ยนแปลง (ใช้ cache ได้)
// 400 Bad Request: คำขอไม่ถูกต้อง (เช่น validation failed)
// 401 Unauthorized: ไม่ได้ authenticate หรือ token หมดอายุ
// 403 Forbidden: ไม่มีสิทธิ์เข้าถึง
// 404 Not Found: ไม่พบข้อมูลที่ร้องขอ
// 422 Unprocessable Entity: ข้อมูลไม่ถูกต้องตามเงื่อนไข
// 500 Internal Server Error: ข้อผิดพลาดภายใน server
// 502 Bad Gateway: Gateway หรือ proxy error
// 503 Service Unavailable: server ไม่พร้อมให้บริการชั่วคราว
// 504 Gateway Timeout: request timeout ที่ gateway/proxy
