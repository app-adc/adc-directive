/*------------------------------Title---------------------------------*/
// function run of loop with improved control flow
/*-------------x----------------Title-----------------x---------------*/

/**
 * ฟังก์ชันสำหรับทำงานกับ array โดยสามารถกำหนดช่วงการทำงานได้
 * @category เสมือน forEach แต่สามารถกำหนดช่วง index ที่ต้องการ loop ได้
 * @param items Array ที่ต้องการวนลูป
 * @param callback ฟังก์ชันที่จะทำงานในแต่ละรอบ รับพารามิเตอร์คือ item และ index
 * @param startIndex index เริ่มต้นที่ต้องการเริ่มทำงาน
 * @param lastIndex index สุดท้ายที่ต้องการทำงาน (รวมตัวเอง) ถ้าไม่ระบุจะใช้ความยาวของ array
 * @example
 * // Loop ตั้งแต่ index 2 ถึง 4
 * runProcess(items, (item, index) => {
 *    console.log(`Processing item ${index}:`, item);
 * }, 2, 4);
 *
 * // Loop ทั้ง array
 * runProcess(items, (item, index) => {
 *    console.log(`Processing item ${index}:`, item);
 * });
 */
export function runProcess<T>(
    items: T[],
    callback: (item: T, index: number) => void,
    startIndex: number = 0,
    lastIndex?: number
): void {
    // ตรวจสอบพารามิเตอร์
    if (!Array.isArray(items) || items.length === 0) {
        return
    }

    // กำหนดค่า lastIndex ถ้าไม่ได้ระบุมา
    const endIndex =
        lastIndex !== undefined
            ? Math.min(lastIndex, items.length - 1)
            : items.length - 1

    // ปรับค่า startIndex ให้อยู่ในช่วงที่ถูกต้อง
    const validStartIndex = Math.max(0, Math.min(startIndex, items.length - 1))

    // ถ้า startIndex มากกว่า endIndex ให้จบการทำงาน
    if (validStartIndex > endIndex) {
        return
    }

    // วนลูปแบบ iterative แทน recursive เพื่อป้องกัน stack overflow
    for (let i = validStartIndex; i <= endIndex; i++) {
        callback(items[i], i)
    }
}
