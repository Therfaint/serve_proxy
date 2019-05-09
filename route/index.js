const fetch = require('node-fetch');
const Router = require('koa-router');
const router = new Router();
const stg = require('../tools/const').STAGING;

const getHTML = (ctx) => {
    return new Promise((resolve, reject) => {
        fetch(stg, {
            headers: {
                cookie: `locale=${ctx.cookies.get('locale')}; session=${ctx.cookies.get('session')}`
            }
        }).then(res => res.text())
            .then(body => resolve(body))
            .catch(err => reject(err))
    })
}

const transform = async (ctx) => {
    const _REG = new RegExp('https:\/\/s0.*?\/(js|css)\/(.*?)@.*?\.(js|css)', 'g');
    const format = (str) => `^^${str}^^`;
    const mapper = (source) => {
        let NAME,
            placeholder = [];
        while ((NAME = _REG.exec(source)) !== null) {
            placeholder.push(`${NAME[1]}/${NAME[2]}`);
        }
        return {
            source: source.replace(_REG, format('$1/$2')),
            placeholder
        };
    }
    const reducer = ({ source, placeholder }) => {
        let result = source;
        for (let i = 0; i < OUTPUT.length; i++) {
            for (let j = 0; j < placeholder.length; j++) {
                if (OUTPUT[i].indexOf(placeholder[j]) !== -1) {
                    result = result.replace(format(placeholder[j]), OUTPUT[i].slice(8));
                    break;
                }
            }
        }
        return result;
    }
    const _HTML = await getHTML(ctx);
    return reducer(mapper(_HTML));
}

const render = async (ctx) => {
    ctx.body = await transform(ctx);
}

router.get('/admin', async (ctx, next) => {
    await render(ctx);
});

module.exports = router;