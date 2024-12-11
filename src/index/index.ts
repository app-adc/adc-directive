import HTTP from '../http/ADC'
import GlobalPageStorage from '../http/GlobalPageStorage'

export * from '../fnArray'
export * from '../fnCheck'
export * from '../fnCi'
export * from '../fnCompose'
export * from '../fnMoment'
export * from '../fnObject'
export * from '../fnRun'
export * from '../fnService'
export * from '../fnTo'
export * from '../fnValidate'
export * from '../http/type-http'

/**
 * สร้าง Fetch API สำหรับใช้งาน HTTP requests
 * @example const adc = new adc<Req, Res>()
 * @example const response = adc.request(config)
 */
export const adc = HTTP

/**
 * สร้าง instance ของ GlobalPageStorage
 * สามารถใช้เรียกใช้งาน storage ได้ทุกที่ในโปรเจค
 * โดยไม่ต้องสร้าง instance ใหม่ และจะถูกล้างข้อมูลทั้งหมดเมื่อหน้าเว็บปิด
 */
export const GPS = GlobalPageStorage.getInstance()

// interface Req {
//     id?: number
//     name?: string
// }

// interface Res {
//     data?: {
//         id: number
//         name: string
//     }
//     error?: string
// }

// const config = {
//     baseURL: 'http://api.test.com',
//     method: 'GET',
//     storage: 'cache' as const,
//     variables: { id: 1 },
//     name: 'data',
//     timeToLive: 60000, // 1 minute
// } as const

// const api = new adc<Req, Res>()
// const firstResponse = api.request({
//     baseURL: 'http://api.test.com',
//     method: 'GET',
//     storage: 'cache' as const,
//     variables: { id: 1 },
//     name: 'data',
//     timeToLive: 60000, // 1 minute
// })
