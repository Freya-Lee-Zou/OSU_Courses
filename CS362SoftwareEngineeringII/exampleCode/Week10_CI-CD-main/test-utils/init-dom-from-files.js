const fs = require("fs")

/*
 * This function is used to render an HTML/JS application into the testing
 * DOM from a specified HTML file and a specified client-side JS file.  This
 * function can only be called from within a test running in the JSDOM Jest
 * testing environment.  It completely clears anything that was previously
 * rendered to the testing DOM.
 */
module.exports = function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
    jest.isolateModules(function () {
        require(jsPath)
    })
}
