const http = require('http');
const fs = require('fs');
const url = require('url');
const zlib = require('zlib');

http.createServer((req, res) => {
    let { pathname } = url.parse(req.url, true);
    console.log(pathname);

    let rs = fs.createReadStream('.' + pathname);

    // 如果不写错误处理函数，那么fs在找不到文件的时候，会直接抛出异常，导致程序中断
    rs.on('error', () => {
        res.writeHead(404);
        res.write('404 not found');
        res.end()
    });

    /*
    response.setHeader(name, value) / response.setHeader(name) / response.removeHeader(name)
    设置头部,获取和删除头部信息的，这个不同于 response.writeHead方法，这两个方法并没有真的把头部信息发送出去，发送头部信息只能通过调用
    response.writeHead或response.write才会发送出去。
    */

    // 设置响应头，在浏览器network 的Response Header中可以看到设置的响应头
    res.setHeader('content-encoding', 'gzip');

    // 前台页面每1秒刷新一次
    // res.setHeader('refresh', '1');

    // 二秒跳到其它页面 response.setHeader("refresh","2;URL=otherPagename");
    // 这里跳转只能本域跳转,后面的URL是拼接在域名后面的，而不是直接外部跳转
    // res.setHeader("refresh","2;URL=login");

    // 没有缓存：
    // res.setHeader("Pragma", "No-cache");
    // res.setHeader("Cache-Control", "no-cache");

    //设置过期的时间期限
    // res.setDateHeader("Expires", System.currentTimeMillis()+自己设置的时间期限);

    // 訪问别的页面
    // res.setStatus（302）;
    // res.setHeader("location","url");

    // 通知浏览器数据採用的压缩格式
    // res.setHeader("Content-Encoding","压缩后的数据格式");

    // 快速浏览器压缩数据的长度
    // res.setHeader("Content-Length",压缩后的数据.length+"");

    // 快速浏览器图片或视频
    // res.setHeader("Content-type","这个參数在tomcat里conf下的web.xml里面找");

    // 快速浏览器已下载的形式
    // res.setHeader("Content-disposition","attachment;filename=2.jpg");

    let gz = zlib.createGzip();
    rs.pipe(gz).pipe(res)
}).listen(3000);