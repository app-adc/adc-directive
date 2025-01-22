# 🚀 ADC Directive

adc-directive เป็น JavaScript/TypeScript utility library ที่รวบรวมฟังก์ชันการทำงานที่จำเป็นในการพัฒนาแอปพลิเคชันสมัยใหม่ ออกแบบมาเพื่อช่วยลดความซับซ้อนของโค้ดและสร้างมาตรฐานในการพัฒนา ผ่านการกลั่นกรองจากประสบการณ์การทำงานกว่า 10 ปี

## 🌟 Documentation & Resources

-   📚 [Official Documentation](https://app-adc.github.io/directive-docs)
-   💻 [GitHub Repository](https://github.com/app-adc/adc-directive)
-   📦 [NPM Package](https://www.npmjs.com/package/adc-directive)

## ✨ จุดเด่น

-   **🎯 ใช้งานง่าย**: API ที่เรียบง่าย เข้าใจได้ทันที เหมาะสำหรับการทำงานเป็นทีม
-   **🔄 Cross-Framework**: รองรับทุก Framework ยอดนิยม (JavaScript, TypeScript, React, Vue, Angular, PHP Laravel)
-   **⚡️ Zero Dependencies**: เป็น Pure JavaScript ไม่มี Dependencies ภายนอก ทำให้ใช้งานได้อย่างยืดหยุ่น
-   **✅ Production-Ready**: ผ่านการทดสอบอย่างครบถ้วน พร้อมใช้งานในระบบ Production
-   **💾 Built-in Caching**: ระบบ Cache ในตัว รองรับ localStorage, sessionStorage และ memory cache

## 📦 การติดตั้ง

```bash
npm install adc-directive
# หรือ
yarn add adc-directive
```

## 🚀 เริ่มต้นใช้งาน

```typescript
import * as dc from 'adc-directive'

// ตัวอย่างการใช้งานพื้นฐาน
const text = dc.toCombineText(['Hello', 'World', '2024'], ' ')
console.log(text) // 'Hello World 2024'

// การจัดการข้อความ
const key = dc.toHasKey('Product-Name 123')

// การจัดการตัวเลข
const price = dc.toCurrency(1234.56, 2) // '1,234.56'

// การตรวจสอบข้อมูล
const validation = dc.validateObject(
    formData,
    ['email', 'password'],
    'UserForm'
)
```

## 🛠️ Core Features

### 1. Data Transformation (`dc.to`)

-   แปลงข้อมูลระหว่างรูปแบบต่างๆ
-   รองรับการทำงานแบบ Functional Programming
-   ผลลัพธ์เป็น Type เดียวกันเสมอ

### 2. Validation System (`dc.validate`)

-   ตรวจสอบความถูกต้องของข้อมูล
-   รายงานผลแบบละเอียดพร้อมข้อความ
-   รองรับการตรวจสอบแบบ Nested Object

### 3. HTTP Client (`dc.ADC`)

-   จัดการ HTTP Requests อย่างมีประสิทธิภาพ
-   ระบบ Cache อัตโนมัติ
-   รองรับ REST และ GraphQL

### 4. Date & Time Management (`dc.moment`)

-   จัดการวันเวลาอย่างยืดหยุ่น
-   รองรับภาษาไทยและอังกฤษ
-   คำนวณความต่างของเวลา

## 🎯 ตัวอย่างการใช้งาน

### การจัดการ HTTP Requests พร้อม Cache

```typescript
const api = new dc.ADC()

const getProducts = async () => {
    const response = await api.request({
        baseURL: 'https://api.example.com/products',
        method: 'GET',
        storage: 'localStorage',
        timeToLive: 30 * 60 * 1000, // 30 นาที
    })
    return response.data
}
```

### การตรวจสอบข้อมูลฟอร์ม

```typescript
const validateForm = (formData) => {
    const result = dc.validateObject(
        formData,
        ['email', 'password', 'user.profile.name'],
        'RegistrationForm'
    )

    if (result.status === 1) {
        console.log('การตรวจสอบผ่าน!')
    } else {
        console.error(result.message)
    }
}
```

## 🔧 การพัฒนาและการมีส่วนร่วม

เราเปิดรับการมีส่วนร่วมจากชุมชน! หากคุณพบปัญหาหรือมีข้อเสนอแนะ:

1. 🐛 [รายงานปัญหา](https://github.com/app-adc/adc-directive/issues)
2. 🔀 [ส่ง Pull Request](https://github.com/app-adc/adc-directive/pulls)
3. 💡 [แบ่งปันไอเดีย](https://github.com/app-adc/adc-directive/discussions)

## 📄 License

MIT License - คุณสามารถใช้งานได้อย่างอิสระทั้งในโครงการส่วนตัวและเชิงพาณิชย์

---

⭐️ หากคุณชอบ ADC Directive อย่าลืมให้ดาวที่ [GitHub Repository](https://github.com/app-adc/adc-directive) ของเรา!
