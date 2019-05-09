const httpProxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');

const getKey = (url, config) => {
    const keys = Object.keys(config);
    let key = '';
    keys.forEach(k => {
        if (url.startsWith(k)) {
            key = k;
        }
    })
    return key;
}

module.exports = {
    proxy: async (ctx, next) => {
        const config = {
            '/api/avatar': {
                target: 'https://file-staging.zjurl.cn',
                changeOrigin: true,
                onProxyReq(proxyReq, req, res) {
                    // set browser's cookie value
                    proxyReq.setHeader('cookie', `session=${devCookie.session}`);
                },
                onProxyRes(proxyRes, req, res) {
                    // proxyRes.statusCode = 400;
                }
            },
            '/suite/admin': {
                target: 'https://api-staging.zjurl.cn',
                changeOrigin: true,
                onProxyReq(proxyReq, req, res) {
                    const localhostCookie = ctx.req.headers.cookie;
                    const match = /locale=(en-US|zh-CN)/.exec(localhostCookie);
                    const locale = match ? match[1] : 'zh-CN';
                    // set browser's cookie value
                    proxyReq.setHeader('cookie', `session=${ctx.cookies.get('session')};locale=${locale}`);
                }
            },
            '/passport/users': {
                target: 'https://api-staging.zjurl.cn',
                changeOrigin: true,
                onProxyReq(proxyReq, req, res) {
                    // set browser's cookie valueååå
                    proxyReq.setHeader('cookie', `session=${devCookie.session}`);
                }
            }
        };
        const key = getKey(ctx.url, config);
        // 不需要proxy的request
        if (!key) {
            await next();
            return;
        }
        ctx.respond = false;
        await k2c(httpProxy(config[key]))(ctx, next);
    }
}