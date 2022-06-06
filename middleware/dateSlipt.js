// 日期范围分割处理
// 将两个日期范围分割为两天之间的范围
// 输出二维数组
exports.getDayAll = (startDay, endDay) => {
    var arr = []
    var dates = []
    var dateRanges = []

    var ds = new Date(startDay)
    var de = new Date(endDay)

    var s = ds.getTime() - 24 * 60 * 60 * 1000
    var e = de.getTime() - 24 * 60 * 60 * 1000
    for (var i = s; i <= e;) {
        i = i + 24 * 60 * 60 * 1000
        arr.push(parseInt(i))
    }

    for (var j in arr) {
        var time = new Date(arr[j])
        var year = time.getFullYear(time);
        var month = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
        var day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
        var ydm = `${year}-${month}-${day}-0`
        dates.push(ydm)
    }

    for (var j = 0; j < dates.length - 1; j++) {
        var sd = dates[j]
        var ed = dates[j+1]
        dateRanges.push([sd, ed])
    }

    return dateRanges
}