const serveStatic = require('serve-static')
const favicon = require('serve-favicon')
const config = require('../config.json')
const path = require('path')

module.exports = function (folder = config.public) {
    let serve = serveStatic(config.build, {
        index: false,
        setHeaders: res => {
            res.statusCode = 200
        }
    })

    let read = ctx => new Promise((resolve,reject) =>
        serve(ctx.req, ctx.res, error => {
            if (error)
                reject(error)
            else
                resolve(res)
        })
    )

    let _favicon = favicon(path.join(__dirname,'../' + config.build, config.favicon))
    let getFavicon = ctx => new Promise((resolve,reject) =>
        _favicon(ctx.req,ctx.res,error => {
            if(error) reject(error)

        })
    )

    let regexStatic = new RegExp('(\/'+ config.public +'\/)(.+)?$')
    let regexFavicon = new RegExp('(.+)?' + config.favicon + '$')
    return async ctx => {
        if (regexStatic.test(ctx.url))
            await read(ctx)
        if(regexFavicon.test(ctx.url))
            await getFavicon(ctx)

    }
};