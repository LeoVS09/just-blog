const Router = require('yeps-router');
const engine = require('../template')



const index = engine.compile('index.pug')
const lol = engine.compile('lol.pug')
const router = new Router();



router
    .get('/').then(async ctx => {
        console.log('start index')
        ctx.body = index({ name: 'troler'})
    })
    .get('/lol').then(async ctx => {
        console.log('start lol')
        ctx.body = lol()
        console.log(ctx.body)
    })
    // .get('/trol').then(async ctx => {
    //     console.log('start trol')
    //     ctx.body = "ahahahahahahhaha"
    // })

;

module.exports = router;