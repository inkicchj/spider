

exports.filter = (text) => {
    var count = text.match(/<a/g)
    if (count) {
        for (var i = 0; i < count.length; i++){
            var star = text.indexOf('<a')
            var tail = text.indexOf('</a>')
            var content = text.slice(star, tail+4)
            text = text.replace(content, '')
        }
    }

    var tszf = /[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s·“”《》‘’\-_【】~+🦕​✈～｜＞＝「」%〔〕🩰​�ε´∀｀🥕♀️🥳•͈˽•͈♡☁️🥰🪐🧸❗️🥺➡️🥇🦋🧩​🤓​​​🥳​✨​‍❤️]*/g
    var text1 = text.replace(/[\s\t\r\n\b\v]*/g, '').replace(/<br>/g, '').replace(/@(.*)的微博视频/, '').replace(/[A-Za-z0-9]*/g, "").replace(tszf, '').replace(/收起全文/g, '')
    var text2 = text1.replace(/转发微博/, '').replace(/[\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]*/g, '').replace(/[\\u0000-\\uFFFF]*/ig, '')
    var text3 = text2.replace(/来自(.*)的微博视频/, '')
    return text3
}

