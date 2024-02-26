const { readFile} = require('fs')
const { promisify } = require('util')
const path = require("path");
const readFileAsync = promisify(readFile)
const READ_OPTIONS = {encoding: 'UTF-8'}
module.exports = async() => {




    const contenu = await readFileAsync('./index.html' , READ_OPTIONS)

    return contenu
}