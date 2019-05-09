const Koa = require('koa');
const serve = require('koa-static');
const logger = require('./middleware/logger');
const proxy = require('./middleware/proxy').proxy;
const route = require('./route');

const recursive = require('./tools/utils').recursive;

global.ROOT = __dirname;
global.OUTPUT = recursive('./output');

const app = new Koa();

app.use(serve('./output'));
app.use(logger);
app.use(proxy);
app.use(route.routes());

app.listen(8088, () => {
    console.log('Server Listening In Port 8088');
});