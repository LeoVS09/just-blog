const pug = require('pug')
const path = require('path')
const fs = require('fs')
const config = require('../config.json')

module.exports = {
    compile: file => {
        let fileName = path.resolve(__dirname,'../' + config.build + '/' + file)
        let template = pug.compileFile(fileName)
        fs.watch(fileName, (eventType, newFileName) => {
            // console.log(eventType,newFileName)
            // if(eventType == 'rename')
            //     fileName = newFileName;
            template = pug.compileFile(fileName)
        });
        return locals => template(locals)
    }
}