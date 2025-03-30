import { checkEmail, checkEmpty } from './fnCheck'
import {
    logs,
    left,
    makeTag,
    right,
    Tag,
    TagParam,
    tags,
    validateTag,
} from './fnTag'
import { toCombineText, toCurrency, toHasKey, toNumber } from './fnTo'

// ======== ตัวอย่างที่ 1: การตรวจสอบข้อมูลผู้สมัคร ========
interface Application {
    name: string
    email: string
    age: number
    income: number
}

// ฟังก์ชันตรวจสอบต่างๆ
const validateName = (app: Application): Tag<string, Application> => {
    if (checkEmpty(app.name)) return left('กรุณาระบุชื่อ')
    if (app.name.length < 3) return left('ชื่อต้องมีอย่างน้อย 3 ตัวอักษร')
    return right(app) // ไม่ต้องห่อด้วย right - สามารถคืนค่าปกติได้เลย
}

const validateEmail = (app: Application) => {
    if (!checkEmail(app.email)) return left('อีเมลไม่ถูกต้อง')
    return app
}

// ใช้ validateTag เพื่อสร้างฟังก์ชันตรวจสอบอายุ
const validateAge = validateTag<Application>(
    (app) => app.age >= 20 && app.age <= 60
)('อายุต้องอยู่ระหว่าง 20-60 ปี')

// ฟังก์ชันคำนวณวงเงินกู้ที่คืนค่าเพิ่มเติม
const calculateLoanAmount = (app: Application) => {
    const loanAmount = Math.min(app.income * 5, 1000000)
    return { ...app, loanAmount, approved: loanAmount > 0 }
}

// ฟังก์ชันฟอร์แมตข้อมูลสำหรับแสดงผล
const formatForDisplay = (
    data: Application & { loanAmount: number; approved: boolean }
) => {
    return {
        ...data,
        formattedIncome: toCurrency(data.income, 2),
        formattedLoan: toCurrency(data.loanAmount, 2),
        statusText: data.approved ? 'อนุมัติ' : 'ไม่อนุมัติ',
    }
}

// การใช้งาน tags
const processApplication = (application: Application) => {
    return tags(
        application,
        validateName,
        validateEmail,
        validateAge,
        calculateLoanAmount,
        formatForDisplay
    )
}

// ตัวอย่างข้อมูล
const validApplication: Application = {
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    age: 35,
    income: 30000,
}

const invalidApplication: Application = {
    name: 'นก',
    email: 'invalid-email',
    age: 17,
    income: 10000,
}

console.log('ผลลัพธ์แบบฟอร์มที่ถูกต้อง:', processApplication(validApplication))
// ผลลัพธ์: { tag: 'right', right: {..., formattedIncome: '30,000.00', formattedLoan: '150,000.00', statusText: 'อนุมัติ' } }

console.log(
    'ผลลัพธ์แบบฟอร์มที่ไม่ถูกต้อง:',
    processApplication(invalidApplication)
)
// ผลลัพธ์: { tag: 'left', left: 'ชื่อต้องมีอย่างน้อย 3 ตัวอักษร' }

// ======== ตัวอย่างที่ 2: การแปลงและตรวจสอบข้อมูลจากฟอร์ม ========

// makeTag สร้างฟังก์ชันตรวจสอบที่คืนค่า Tag
const isValidAmount = makeTag<number>(
    (amount) => amount > 0 && amount <= 1000000,
    'จำนวนเงินต้องอยู่ระหว่าง 1-1,000,000 บาท'
)

// แปลงข้อมูลจาก form string เป็น number และตรวจสอบ
const processAmount = (amountStr: string) => {
    return tags(
        amountStr,
        (str) => str.trim(), // ตัด whitespace
        (str) => (checkEmpty(str) ? left('กรุณาระบุจำนวนเงิน') : str), // ตรวจสอบค่าว่าง
        (str) => toNumber(str), // แปลงเป็นตัวเลข
        isValidAmount, // ตรวจสอบค่าตามเงื่อนไข
        (amount) => toCurrency(amount, 2) // จัดรูปแบบสกุลเงิน
    )
}

console.log(processAmount('5000')) // { tag: 'right', right: '5,000.00' }
console.log(processAmount('')) // { tag: 'left', left: 'กรุณาระบุจำนวนเงิน' }
console.log(processAmount('2000000')) // { tag: 'left', left: 'จำนวนเงินต้องอยู่ระหว่าง 1-1,000,000 บาท' }
console.log(processAmount('abc')) // { tag: 'left', left: 'จำนวนเงินต้องอยู่ระหว่าง 1-1,000,000 บาท' }

// ======== ตัวอย่างที่ 3: การรวมข้อมูลจากหลายส่วน ========

interface User {
    id: string
    firstName: string
    lastName: string
}

interface Address {
    province: string
    district: string
    zipcode: string
}

interface ContactInfo {
    email: string
    phone: string
}

// ฟังก์ชันสำหรับรวมข้อมูลต่างๆ
const combineUserInfo = (
    user: User,
    address: Address,
    contact: ContactInfo
) => {
    return tags(
        user,
        (u) => ({
            ...u,
            fullName: toCombineText([u.firstName, u.lastName], ' '),
        }),
        (u) => ({ ...u, ...address }),
        (u) => ({ ...u, ...contact }),
        (u) => ({
            ...u,
            displayAddress: toCombineText(
                [u.district, u.province, u.zipcode],
                ', '
            ),
        })
    )
}

const user: User = { id: 'U001', firstName: 'สมชาย', lastName: 'ใจดี' }
const address: Address = {
    province: 'กรุงเทพฯ',
    district: 'จตุจักร',
    zipcode: '10900',
}
const contact: ContactInfo = {
    email: 'somchai@example.com',
    phone: '0812345678',
}

console.log('ข้อมูลผู้ใช้รวม:', combineUserInfo(user, address, contact))
// ผลลัพธ์: { tag: 'right', right: { id: 'U001', firstName: 'สมชาย', lastName: 'ใจดี', fullName: 'สมชาย ใจดี', ...address, ...contact, displayAddress: 'จตุจักร, กรุงเทพฯ, 10900' } }

// กรณีใช้งานจริง: การตรวจสอบข้อมูล user
function validateUser() {
    // สมมติข้อมูล user ที่ต้องการตรวจสอบ
    const user = {
        name: 'ธนพล',
        email: 'thanaphol@example.com',
        age: 16,
    }

    // ตรวจสอบชื่อ
    const validateName = (user: any): TagParam<any> => {
        if (checkEmpty(user.name)) {
            return left('กรุณาระบุชื่อ')
        }
        return right(user)
    }

    // ตรวจสอบอีเมล
    const validateEmail = (user: any): TagParam<any> => {
        if (!checkEmail(user.email)) {
            return left('รูปแบบอีเมลไม่ถูกต้อง')
        }
        return right(user)
    }

    // ตรวจสอบอายุ
    const validateAge = (user: any): TagParam<any> => {
        if (user.age < 18) {
            return left('อายุต้องมากกว่าหรือเท่ากับ 18 ปี')
        }
        return right(user)
    }

    // ทำการแปลงชื่อให้เป็น HasKey (หากผ่านการตรวจสอบแล้ว)
    const transformName = (user: any): TagParam<any> => {
        user.hasKey = toHasKey(user.name)
        return right(user)
    }

    // เรียกใช้ logs เพื่อทำงานกับทุกฟังก์ชัน
    const result = logs(
        user,
        validateName,
        validateEmail,
        validateAge,
        transformName
    )

    // console.log('ผลลัพธ์การตรวจสอบข้อมูลผู้ใช้ logs:', result)
    console.log(
        'ผลลัพธ์การตรวจสอบข้อมูลผู้ใช้ logs:',
        JSON.stringify(result, null, 2)
    )
}

validateUser()
