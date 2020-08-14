// this file is for experimental purposes and needs more considerations for production.

const fs = require('fs');
const express = require('express');
const serveStatic = require('serve-static')
const rendertron = require('rendertron-middleware');
const app = express();
const httpPort = 8000;
const distDirectory = `${__dirname}/dist`;
const concat = (...args) => [...args].join('');

app.use(serveStatic(distDirectory, { index: 'index.html' }));

app.use(rendertron.makeMiddleware({
    proxyUrl: process.env.MFE_RENDERER,
    userAgentPattern: new RegExp(['GoogleBot', 'W3C_Validator'].join('|'), 'i'),
}));

app.use((req, res) => {
    fs.readFile(concat(distDirectory, '/index.html'), 'utf-8', (err, content) => {
        if (err) {
            console.log(err.message);
            res.writeHead(404).end(err.message);
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
        }).end(content);
    });
});

app.listen(httpPort);
