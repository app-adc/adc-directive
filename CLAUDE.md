# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test              # Run all tests once
npm run dev           # Run tests in watch mode
npm run build         # Build CJS + ESM + types → dist/
npm run validate      # tsc type-check + tests (parallel)
npm run ci            # validate + build (full pipeline)
npm run log           # Execute src/test.ts for manual testing
```

Run a single test file:
```bash
npx vitest run src/tests/fnTo.test.ts
```

## "start deploy" Command

เมื่อผู้ใช้พิมพ์ **"start deploy"** ให้ทำตามขั้นตอนนี้ตามลำดับ:

**1. ตรวจสอบ tests**
```bash
npm run validate
```
- ถ้ามี error → หยุดและแจ้งผู้ใช้ทันที ห้ามทำขั้นตอนต่อไป
- ถ้าผ่านทั้งหมด → ทำขั้นตอนถัดไป

**2. ทำ Changeset + Commit + Push ตามขั้นตอนด้านล่าง**

---

## Versioning with Changesets (ทำก่อน commit & push ทุกครั้ง)

### ขั้นตอน

**1. สร้าง changeset ใหม่**
```bash
npx changeset
```
CLI จะถามว่า:
- bump type: `patch` (bug fix) | `minor` (new feature) | `major` (breaking change)
- summary: อธิบายการเปลี่ยนแปลงสั้นๆ

ผลลัพธ์: ไฟล์ใหม่ใน `.changeset/` เช่น `.changeset/fuzzy-dogs-smile.md`

**2. อัปเดต version และ CHANGELOG**
```bash
npx changeset version
```
- อัปเดต `version` ใน `package.json` อัตโนมัติ
- สร้าง/อัปเดต `CHANGELOG.md`
- ลบไฟล์ changeset ที่สร้างในขั้นที่ 1

**3. Build**
```bash
npm run build
```

**4. Commit & Push**
```bash
git add .
git commit -m "feat: ..."
git push
```

**5. Publish to NPM (ถ้าพร้อม)**
```bash
npx changeset publish
```

### Bump type เลือกอย่างไร

| สถานการณ์ | Bump type | ตัวอย่าง version |
|---|---|---|
| Bug fix, refactor, perf | `patch` | 1.5.2 → 1.5.3 |
| Feature ใหม่, API ใหม่ | `minor` | 1.5.2 → 1.6.0 |
| Breaking change | `major` | 1.5.2 → 2.0.0 |

---

## Architecture

### โครงสร้าง src/

```
src/
├── index/index.ts        # barrel export ทุก module + GPS singleton
├── http/                 # HTTP client system
│   ├── ADC.ts            # class หลัก: request, cache, interceptors, retry
│   ├── StorageManager.ts # จัดการ cache/localStorage/session (ใช้ Map สำหรับ 'cache')
│   ├── PageStorageManager.ts
│   ├── GlobalPageStorage.ts  # Singleton สำหรับ page-level storage
│   ├── composition-http.ts   # pure helpers: createStorageItem, calculateExpiryTime
│   └── type-http.ts      # types: RequestConfig, HttpError, StorageType, Interceptor
├── fn*.ts                # functional modules (ทั้งหมด 11 ไฟล์)
└── type.ts               # shared types: NestedKeys<T>, CheckValue, RegExp patterns
```

### fn* Modules

| Module | หน้าที่ |
|---|---|
| `fnCi.ts` | pipe/composition function พร้อม 9+ overloads |
| `fnTag.ts` | Either/Tag monad pattern: `left()`, `right()`, `logs()` |
| `fnTo.ts` | data transform: currency, uid, hash key, text combine |
| `fnCheck.ts` | type guards: `checkEmpty`, `checkObject`, `checkNumber` |
| `fnValidate.ts` | schema validation: `validateObject`, `validateEmail` |
| `fnMoment.ts` | date utilities: diff, add (minute/hour/day/month) |
| `fnArray.ts` | array utilities: chunk, range, map |
| `fnObject.ts` | object utilities: findByKey, merge, mapToKeys |
| `fnCompose.ts` | domain-specific composition functions |
| `fnService.ts` | `copyDeep`, `delay` |
| `fnRun.ts` | controlled loop: `runProcess` |

### HTTP Client (ADC)

`ADC<Request, Response>` — generic class สำหรับ HTTP requests

**Request flow:**
1. `request()` → normalize storage type (server-side guard)
2. `handleStorage()` → ตรวจ cache ก่อน → ถ้ามีให้ return เลย
3. `fetch()` → run `beforeEach` → `processResponseConTextApi` → check HTTP error
4. `processResponse()` → dot-notation key extraction → run `config.interceptors`
5. `hasProperties()` → validate response keys → set `validateResponse`

**Storage types:**
- `'cache'` — in-memory `Map` ผูกกับ ADC instance → **ต้องใช้ singleton**
- `'localStorage'` / `'session'` — browser APIs (client-side only)
- `'store'` — `PageStorageManager` (page-session scoped)

**สำคัญ:** `ADC` instance มี mutable state (`status`, `HttpError`, `context`, `validateResponse`) — ไม่ thread-safe สำหรับ concurrent requests บน instance เดียวกัน

### Build Output

`tsup` build → `dist/`
- `index.js` (CJS)
- `index.mjs` (ESM)
- `index.d.ts` (types)

### Test Environment

Vitest + JSDOM — ทุก test รันใน DOM environment (`globals: true`)
