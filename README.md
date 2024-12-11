# ADC Directive

adc-directive คือ service utility ที่รวบรวมฟังก์ชันการทำงานที่ใช้บ่อยในการพัฒนาแอปพลิเคชัน ช่วยลดความซับซ้อนของโค้ดและทำให้ทีมสามารถพัฒนาโค้ดไปในทิศทางเดียวกัน ผ่านประสบการณ์การทำงานของผู้พัฒนามากกว่า 10 ปี

## ✨ จุดเด่น

-   ใช้งานง่าย เข้าใจได้ง่าย เหมาะสำหรับการทำงานเป็นทีม
-   รองรับทุก Framework: JavaScript, TypeScript, React, Vue, Angular และ PHP Laravel
-   เป็น Pure JavaScript ไม่มี Dependencies ทำให้ใช้งานได้อย่างยืดหยุ่น
-   ผ่านการทดสอบอย่างครบถ้วน มั่นใจได้ในความเสถียรและความปลอดภัย
-   มีระบบ Cache ในตัว รองรับทั้ง localStorage, sessionStorage และ memory cache

## 📦 การติดตั้ง

```bash
npm install adc-directive
```

## 🚀 การใช้งานเบื้องต้น

```typescript
import * as dc from 'adc-directive'

// ตัวอย่างการใช้งาน
const text = dc.toCombineText(['a', 'b', null, 'c'], '_')
console.log(text) // ผลลัพธ์: 'a_b_c'
```

## 📚 ฟังก์ชันที่สำคัญ

### 🔄 Transformations (dc.to)

ฟังก์ชันที่ขึ้นต้นด้วย `to` จะ return ค่าที่เป็น type เดียวกันเสมอ เหมาะสำหรับการใช้งานในรูปแบบ functional programming

```typescript
// แปลงข้อความเป็น HasKey
const key = dc.toHasKey('Product-Name 123') // 'productname123'

// รวม Array เป็น String
const text = dc.toCombineText(['Hello', 'World'], ' ') // 'Hello World'

// แปลงตัวเลขเป็นรูปแบบสกุลเงิน
const price = dc.toCurrency(1234.56, 2) // '1,234.56'

// สร้าง UID
const uid = dc.toUid(8) // เช่น 'aB3kP9mN'
```

### ✅ Validations (dc.validate)

ฟังก์ชันที่ขึ้นต้นด้วย `validate` จะตรวจสอบความถูกต้องและ return ผลลัพธ์ในรูปแบบ:

```typescript
{
    status: 1 | 0 | -1,  // 1 = ผ่าน, 0 = ไม่ผ่าน, -1 = error
    message: string
}
```

```typescript
// ตรวจสอบ Object Properties
const result = dc.validateObject(payload, ['id', 'user.name'], 'UserValidation')

// ตรวจสอบ Email
const emailCheck = dc.validateEmail('test@example.com', {
    allowEmpty: false,
    maxLength: 100,
})
```

### 🔍 Checks (dc.check)

ฟังก์ชันที่ขึ้นต้นด้วย `check` จะ return ค่า boolean

```typescript
// ตรวจสอบค่าว่าง
const isEmpty = dc.checkEmpty(value)

// ตรวจสอบ Object
const isObject = dc.checkObject(value)

// ตรวจสอบ Email
const isValidEmail = dc.checkEmail('user@example.com')
```

### ⏱️ Date & Time (dc.moment)

ฟังก์ชันจัดการเกี่ยวกับวันเวลา

```typescript
// คำนวณความต่างของเวลา
const diff = dc.dateDiff(date1, date2)

// เพิ่มวัน
const newDate = dc.addDate(currentDate, 7)

// แปลงวันเวลาเป็นข้อความ
const dateText = dc.dateDiffToString(date, new Date(), 'th')
```

### 🔄 HTTP Client (dc.ADC)

Class สำหรับจัดการ HTTP Requests พร้อมระบบ Cache

```typescript
const api = new dc.ADC()

// ตัวอย่างการใช้งาน
const response = await api.request({
    baseURL: 'https://api.example.com',
    method: 'POST',
    variables: { id: 1 },
    storage: 'cache',
    timeToLive: 5 * 60 * 1000, // 5 นาที
})
```

### 🏃 Process Functions (dc.run)

ฟังก์ชันที่ขึ้นต้นด้วย `run` ใช้สำหรับ loop process โดยไม่มีการ return ค่า

```typescript
// ทำงานกับ Array
dc.runProcess(items, (item, index) => {
    console.log(`Processing item ${index}:`, item)
})
```

## 🎯 Use Cases

1. **การจัดการข้อมูลฟอร์ม**

```typescript
// ตรวจสอบความถูกต้องของข้อมูล
const validation = dc.validateObject(formData, ['email', 'password'])
if (validation.status === 1) {
    // ดำเนินการต่อ
}
```

2. **การจัดการ Cache ใน HTTP Requests**

```typescript
const api = new dc.ADC()
const data = await api.request({
    baseURL: '/api/products',
    storage: 'localStorage',
    timeToLive: 30 * 60 * 1000, // 30 นาที
})
```

3. **การแปลงข้อมูล**

```typescript
const hashedKey = dc.toHasKey('Product Name 123')
const formattedPrice = dc.toCurrency(1234.56, 2)
const combinedText = dc.toCombineText(['Hello', 'World'], ' ')
```

## 📝 หมายเหตุ

-   ฟังก์ชันทั้งหมดรองรับ TypeScript
-   มีการ Validate Input ทุกฟังก์ชัน เพื่อป้องกันข้อผิดพลาด
-   ระบบ Cache มีให้เลือกใช้ทั้ง localStorage, sessionStorage และ memory
-   ทุกฟังก์ชันมีการทำ Unit Test ครบถ้วน

## 🔗 Links

-   [NPM Package](https://www.npmjs.com/package/adc-directive)
-   [GitHub Repository](https://github.com/secwind-dev/ADC-Directive)
-   [Issues](https://github.com/secwind-dev/ADC-Directive/issues)

## 📄 License

MIT License
