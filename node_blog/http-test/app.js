const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0] //重点：split('?'[0])语法弄清楚
    const query = querystring.parse(url.split('?')[1])

    //设置返回值格式为 JSON
    res.setHeader('Content-type', 'application/json')

    //返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }

    //返回
    if (method === 'GET') {
        res.end(
            JSON.stringify(req.query)
        )
    }

    if (req.method === 'POST'){
        let postData = ''
        //res.on('data')指每次发送的数据
        //chunk 接收数据 req绑定一个data方法 chunk是变量
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        //req.on(end)数据发送完成；
        req.on('end', () => {
            console.log('postData:', postData)
            console.log('resData:', resData)
            resData.postData = postData
            //返回
            res.end(
                JSON.stringify(resData)
            )
        })
    }

})

server.listen(300)
console.log('Servers is running at port:300 ...')