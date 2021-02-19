/**
 * 计算两段时间的相差时长
 * @param {Date} t1 
 * @param {Date} t2 
 * @returns {string}
 */
export function timeGap(t1, t2) {
    const gap = Math.abs(t1 - t2)
    const gapTime = new Date(gap)
    const yyyy = gapTime.getFullYear()
    const mm = gapTime.getMonth()
    const dd = gapTime.getDay()

    return {
        yyyy, mm, dd
    }
}
