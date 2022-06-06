const slog = require("single-line-log").stdout

function Progress(bar_len, date){
    this.length = bar_len
    this.sd = date
    this.render = function (cur, total) {
        var percent = (cur / total).toFixed(4)
        var cell_num = Math.floor(percent * this.length)

        var cell = ''
        for (var i = 0; i < cell_num; i++) {
            cell += '█'
        }

        var empty = ''
        for (var i = 0; i < this.length - cell_num; i++) {
            empty += '░'
        }

        var cmdText = `${this.sd}:${(100*percent).toFixed(2)}% ${cell}${empty} ${cur}/${total}\n`
        slog(cmdText)
    }
}

module.exports = Progress