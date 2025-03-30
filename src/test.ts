import { left, makeTag, mapLeft, right, tags, validateTag } from './fnTag'
import { toCurrency, toNumber } from './fnTo'

// ตัวอย่างการตรวจสอบข้อมูลลูกค้า
interface Customer {
    id: string
    name: string
    age: number
    creditScore?: number
}

// เวอร์ชันเดิม
const checkAge = (customer: Customer) =>
    customer.age >= 20
        ? right(customer)
        : left('อายุต้องมากกว่าหรือเท่ากับ 20 ปี')

const checkAgeUp = validateTag<Customer>((customer) => customer.age >= 20)(
    'อายุต้องมากกว่าหรือเท่ากับ 20 ปี'
)

const checkCreditScore = (customer: Customer) =>
    customer.creditScore && customer.creditScore >= 700
        ? right(customer)
        : left('คะแนนเครดิตต้องมากกว่าหรือเท่ากับ 700')

const calculateLoanAmount = (customer: Customer) => {
    // คำนวณวงเงินกู้ตามเกณฑ์
    const loanAmount = customer.age * 10000 + (customer.creditScore || 0) * 100
    return right({ ...customer, loanAmount })
}

const formatLoanAmount = (data: Customer & { loanAmount: number }) => {
    return right({
        ...data,
        formattedLoan: toCurrency(data.loanAmount, 2),
    })
}

// การใช้งาน tags
const processLoanApplication = (customer: Customer) => {
    return tags(
        customer,
        checkAge,
        checkCreditScore,
        calculateLoanAmount,
        formatLoanAmount
    )
}

// ตัวอย่างการใช้งาน
const goodCustomer: Customer = {
    id: 'C001',
    name: 'สมชาย ใจดี',
    age: 35,
    creditScore: 750,
}

const badCustomer: Customer = {
    id: 'C002',
    name: 'สมหญิง ทดสอบ',
    age: 18,
    creditScore: 680,
}

const goodResult = processLoanApplication(goodCustomer)
const badResult = processLoanApplication(badCustomer)

console.log('ผลลัพธ์ลูกค้าที่ผ่านเกณฑ์:', goodResult)
// ผลลัพธ์: { tag: 'right', right: { id: 'C001', name: 'สมชาย ใจดี', age: 35, creditScore: 750, loanAmount: 425000, formattedLoan: '425,000.00' } }

console.log('ผลลัพธ์ลูกค้าที่ไม่ผ่านเกณฑ์:', badResult)
// ผลลัพธ์: { tag: 'left', left: 'อายุต้องมากกว่าหรือเท่ากับ 20 ปี' }

// ตัวอย่างการใช้ makeTag สร้างฟังก์ชันตรวจสอบ
const isValidAmount = makeTag<number>(
    (amount) => amount > 0 && amount <= 1000000,
    'จำนวนเงินต้องอยู่ระหว่าง 1-1,000,000 บาท'
)

// ตัวอย่างการใช้งานร่วมกับ toNumber
const validateAmount = (input: string) => {
    const amount = toNumber(input)
    return isValidAmount(amount)
}

console.log(validateAmount('500')) // { tag: 'right', right: 500 }
console.log(validateAmount('2000000')) // { tag: 'left', left: 'จำนวนเงินต้องอยู่ระหว่าง 1-1,000,000 บาท' }

let a = validateAmount('abc')
console.log('mapLeft plus 555 => ', mapLeft((txt) => `${txt} 555`)(a))
