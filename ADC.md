# ADC.md

> องค์ความรู้จาก `adc-directive` — Functional Programming library (TypeScript)
> ใช้เป็น reference สำหรับ refactor code ในสไตล์ ADC

Source: https://github.com/app-adc/adc-directive

---

## ภาพรวม

`adc-directive` เป็น library ที่เขียนด้วยแนวคิด Functional Programming อย่างเคร่งครัด
ไม่มี class ไม่มี OOP — ทุกอย่างเป็น pure function และ composition

หลักการสำคัญ:
- ข้อมูลไหลจากซ้ายไปขวาผ่าน `ci` (pipe operator)
- error จัดการด้วย `Tag` pattern (Either monad) — ไม่ใช้ try/catch ใน business logic
- function ทุกตัวเป็น pure — ไม่มี side effect, ไม่ mutate input
- ใช้ currying สำหรับ partial application

---

## `ci` — Pipe Operator (fnCi.ts)

ฟังก์ชันหลักของ library คือ `ci` — รับค่าเริ่มต้น + ลำดับ function แล้วส่งผลลัพธ์ผ่านทีละขั้น

```typescript
// signature: ci(value, fn1, fn2, fn3, ...) : finalResult
// ทำงานเหมือน: fn3(fn2(fn1(value)))

ci(
    rawData,
    validate,       // rawData → validData
    transform,      // validData → transformedData
    formatOutput    // transformedData → result
)
```

**เมื่อไรควรใช้ `ci`**
- แทน nested function calls ที่อ่านยาก
- เมื่อมี step การแปลงข้อมูล 3 ขั้นขึ้นไป
- เมื่อต้องการให้อ่าน flow ได้จากบนลงล่าง

```typescript
// ❌ nested ที่อ่านยาก
const result = formatOutput(transform(validate(rawData)))

// ✅ ci ที่อ่านง่าย
const result = ci(rawData, validate, transform, formatOutput)
```

**`withCi`** — เวอร์ชัน curry สำหรับ function ที่มีหลาย parameter

```typescript
// สร้าง function ใหม่ที่รอรับ argument แล้วค่อย run pipeline
const processUser = withCi(
    (id: string, role: string) => fetchUser(id, role),
    normalizeUser,
    formatDisplay
)

processUser('123', 'admin') // ส่ง argument ทีหลัง
```

---

## `Tag` Pattern — Error Handling (fnTag.ts)

แทนที่จะ throw/catch — ใช้ `Tag<Left, Right>` ซึ่งเป็น Either monad

```
Right<R> = สำเร็จ มีค่า value
Left<L>  = ล้มเหลว มี error message
```

### Constructor

```typescript
right(value)    // สร้าง Right — success
left(error)     // สร้าง Left  — failure
```

### `ciTag` — Pipeline ที่หยุดทันทีเมื่อเจอ Left

```typescript
const result = ciTag(
    userData,
    validateAge,        // ถ้า return left('ไม่มีสิทธิ์') → หยุดทันที
    checkPremium,       // ข้าม (ถ้าขั้นก่อนเป็น left)
    applyDiscount       // ข้าม (ถ้าขั้นก่อนเป็น left)
)

// result จะเป็น Left('ไม่มีสิทธิ์') หรือ Right(discountedData)
```

### `makeTag` — สร้าง validator จาก predicate

```typescript
const checkAge = makeTag(
    'อายุน้อยเกินไป',           // error message
    (user: User) => user.age >= 18  // predicate
)
// checkAge(user) → Right(user) หรือ Left('อายุน้อยเกินไป')
```

### `fold` — ดึงค่าออกจาก Tag

```typescript
const message = fold(
    (error) => `ผิดพลาด: ${error}`,
    (value) => `สำเร็จ: ${value.name}`
)(result)
```

### `logs` — Pipeline พร้อม debug log ทุก step

```typescript
const debug = logs(
    rawInput,
    step1,
    step2,
    step3
)
// debug.value    = ค่าสุดท้าย (หรือ undefined ถ้าผิดพลาด)
// debug.tag      = 'right' | 'left' | 'error'
// debug.message  = error message (ถ้ามี)
// debug.logs     = [{index, input, output, errorMessage}]
```

**เมื่อไรใช้ `ciTag` vs `logs`**
- `ciTag` → production code (ไม่ต้องการ debug info)
- `logs` → development / testing / debugging

---

## Array Utilities (fnArray.ts)

ทุกฟังก์ชันเป็น pure — ไม่แก้ไข array ต้นฉบับ

```typescript
// flatten nested array ทุกระดับ
mapArray([1, [2, [3, [4]]]])
// → [1, 2, 3, 4]

// แบ่ง array เป็น chunk ขนาด n
chunkArray([1,2,3,4,5], 2)
// → [[1,2], [3,4], [5]]

// deduplicate โดย key function
uniqueBy([{id:1},{id:2},{id:1}], i => i.id)
// → [{id:1}, {id:2}]

// sort โดยไม่แก้ต้นฉบับ
sortBy([{age:3},{age:1}], i => i.age)           // asc → [{age:1},{age:3}]
sortBy([{age:3},{age:1}], i => i.age, 'desc')   // desc → [{age:3},{age:1}]

// set difference: หา element ใน a ที่ไม่มีใน b
arrayDifference([1,2,3,4], [2,4])
// → [1, 3]

// สร้าง range ของตัวเลข
range(1, 5)        // → [1,2,3,4,5]
range(5, 1)        // → [5,4,3,2,1]
range(1, 10, 2)    // → [1,3,5,7,9]
```

---

## Object Utilities (fnObject.ts)

```typescript
// parse dot-notation path → array of keys
mapToKeys('profile.name.colors[2]')
// → ['profile', 'name', 'colors', '2']

// ตรวจสอบว่า nested key มีอยู่ใน object
findObjectByKey(user, ['profile.name', 'address.city'])
// → true | false

// deep merge หลาย object (ค่าหลังทับค่าก่อน, array จะ concat)
mergeObject({a: 1, b: {x: 1}}, {b: {y: 2}})
// → {a: 1, b: {x: 1, y: 2}}

// pick nested key จาก object
selectObject(user, ['profile.job.salary', 'finance.salary'])
// → {profile: {job: {salary: 50000}}, finance: {salary: 60000}}

// หา max/min จาก array by iteratee
payloadByMax([{score:3},{score:7},{score:1}], i => i.score)
// → {score: 7}
```

---

## Service Utilities (fnService.ts)

```typescript
// deep clone ที่ป้องกัน circular reference
const cloned = copyDeep(originalObject)
// รองรับ: object, array, Date, RegExp, Map, Set

// delay + optional callback
await delayPromise(1000)
await delayPromise(1000, () => console.log('done'))
const result = await delayPromise(1000, (x: number) => x * 2, 5)
// → 10
```

---

## Compose Utilities (fnCompose.ts)

Curried wrappers สำหรับ date/string ที่ใช้ใน pipeline

```typescript
// curried date functions สำหรับใช้ใน ci pipeline
withDateDiff(dateA)(dateB)       // → number (diff)
withAddMonth(3)(date)            // → Date + 3 months
withAddDate(7)(date)             // → Date + 7 days
withAddHour(2)(date)             // → Date + 2 hours
withCombineText(['a','b'])('-')  // → 'a-b'
```

---

## Pattern: วิธีเขียน ADC Style

### ตัวอย่าง: ตรวจสอบ user และคำนวณราคา

```typescript
// กำหนด validators ด้วย makeTag
const validateAge = makeTag(
    'ต้องอายุ 18 ปีขึ้นไป',
    (user: User) => user.age >= 18
)
const validateActive = makeTag(
    'บัญชีถูกระงับ',
    (user: User) => user.isActive
)

// business logic เป็น pure function
const applyDiscount = (user: User): Tag<string, User> =>
    user.isPremium
        ? right({ ...user, discount: 0.2 })
        : right({ ...user, discount: 0 })

const calculateFinalPrice = (price: number) => (user: User) =>
    right({ ...user, finalPrice: price * (1 - user.discount) })

// compose ด้วย ciTag
const processOrder = (user: User, price: number) =>
    ciTag(
        user,
        validateAge,
        validateActive,
        applyDiscount,
        calculateFinalPrice(price)
    )

// ดึงผลลัพธ์ด้วย fold
const message = fold(
    (err) => `ไม่สามารถดำเนินการได้: ${err}`,
    (result) => `ราคาสุดท้าย: ${result.finalPrice}`
)(processOrder(user, 1000))
```

---

## สิ่งที่ควรทำเมื่อ Refactor ด้วย ADC Style

| พบใน code เดิม | แนะนำให้เปลี่ยนเป็น |
|----------------|---------------------|
| `fn3(fn2(fn1(x)))` | `ci(x, fn1, fn2, fn3)` |
| `try/catch` ใน business logic | `ciTag` + `left`/`right` |
| `if (err) return err` ซ้อนหลายชั้น | `ciTag` pipeline |
| `arr.sort(...)` (mutate) | `sortBy(arr, ...)` |
| `[...new Set(arr.map(fn))]` | `uniqueBy(arr, fn)` |
| `JSON.parse(JSON.stringify(obj))` | `copyDeep(obj)` |
| `Object.assign({}, a, b)` deep | `mergeObject(a, b)` |
| loop หลายชั้นเพื่อ validate | `makeTag` + `ciTag` |
