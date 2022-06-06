const puppeteer = require("puppeteer");
const cookies = require("./loginstate.json");
const inquirer = require("inquirer")
const getdays = require("./middleware/dateSlipt")
const fs = require("fs")
const path = require("path")
const xlsx = require("xlsx")
const Progress = require("./middleware/progress")
const rlue = require("./middleware/rule")

// 获取所有页码
const getTotalPage = async (page) => {
    // 等待页码元素加载完成
    await page.waitForSelector(".s-scroll")
    // 定位所有页码元素并获取页码值
    const numList = await page.$$eval(".s-scroll li a", el => {
        const num = el.map(n => {
            return n.innerText.match(/\d+/)[0]
        })
        return num
    })
    return numList
}

// 获取每一页的文字内容
const getPage = async (page, url, sd, key_) => {
    await page.goto(url)
    await page.waitForSelector("#pl_feedlist_index")
    const cardWrap = await page.$$eval(".txt", el => {
        const ctn = el.map(v => {
            return v.innerHTML
        })
        return ctn
    })
    const data = []
    cardWrap.forEach(text => {
        let reg = new RegExp('^' + key_ + '$')
        let reg1 = /展开全文c|展开全文/
        if (!reg.test(text) && !reg1.test(text)) {
            const text_ = rlue.filter(text)
            console.log(text_)
            if (text_ !== '') {
                const row = [text_, sd]
                data.push(row)
            }
        }
    })
    return data
}


const run = async (key, sd, ed) => {
    // 启动puppeteer
    const browser = await puppeteer.launch({headless:true})
    const page = await browser.newPage()
    await page.setViewport({
        width:1360,
        height:640
    })
    // 加载cookies，用于登录
    for (let i = 0; i < cookies.length; i++){
        await page.setCookie(cookies[i])
    }
    const target = `https://s.weibo.com/weibo?q=${key}&typeall=1&suball=1&timescope=custom:${sd}:${ed}&Refer=g`
    await page.goto(target)
    const numList = await getTotalPage(page) // 页码集合
    const wb = xlsx.utils.book_new() // 创建workbook
    const datas = []
    const prog = new Progress(50, sd)
    for (let i = 0; i < numList.length; i++){
        const target_url = `${target}&page=${numList[i]}`
        const data = await getPage(page, target_url, sd, key)
        datas.push.apply(datas, data)
        prog.render(numList[i], numList.length)
        // console.log(`${sd} | 完成收集"${key}"第${numList[i]}页数据[${data.length}]`)
    }
    const ws = xlsx.utils.aoa_to_sheet(datas) // 添加数据到worksheet
    xlsx.utils.book_append_sheet(wb, ws, sd)
    const result = xlsx.write(wb, {
        bookType: 'xlsx', // 输出的文件类型
        type: 'buffer', // 输出的数据类型
    })
    fs.writeFile(path.join(__dirname, 'files', key, `${key}[${sd}].xlsx`), result, (err) => {
        if (err) return console.log(err.message)
        // console.log(`${sd} 完成,共${datas.length}条数据! `)
    })
    await browser.close()
}


const getData = (key, sd, ed) => {
    const days = getdays.getDayAll(sd, ed)
    for (var i = 0; i < days.length; i++){
        run(key, days[i][0], days[i][1])
    }
}

// 获取用户输入
const launch = async () => {
    const questions = [
        {
            type: 'input',
            name: 'key',
            message: `请输入搜索关键字：`
        },
        {
            type: 'input',
            name: 'startDay',
            message: `请输入开始时间(格式2021-10-02):`
        },
        {
            type: 'input',
            name: 'endDay',
            message: `请输入结束时间(格式2021-10-05):`
        }
    ]

    inquirer.prompt(questions).then(key => {
        const key_path = path.join(__dirname, 'files', key.key)
        if(!fs.existsSync(key_path)){
            fs.mkdir(key_path, (err) => {
                if (err) return console.log(err.message)
            })
        }
        console.log(`加载中...`)
        getData(key.key, key.startDay, key.endDay)
    })
    
}

// 启动程序
launch()