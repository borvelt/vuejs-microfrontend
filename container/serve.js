// this file is for experimental purposes and needs more considerations for production.

const http = require('http')
const fs = require('fs')
const httpPort = 8000
const distDirectory = `${__dirname}/dist`;
const concat = (...args) => [...args].join('');

http.createServer((req, res) => {
    if (RegExp('^/js/', 'g').test(req.url)) {
        fs.readFile(concat(distDirectory, req.url), (err, content) => {
            if (err) {
                res.writeHead(404).end(err.message);
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'text/javascript; charset=utf-8'
            }).end(content)
        });
        return;
    }
    fs.readFile(concat(distDirectory, '/index.html'), 'utf-8', (err, content) => {
        if (err) {
            console.log(err.message);
            res.writeHead(404).end(err.message);
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        }).end(content)
    })
}).listen(httpPort, () => {
    console.log('Server listening on: http://localhost:%s', httpPort)
})
