const fs = require('fs');

const recursive = function (dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(recursive(file));
        }
        else {
            results.push(file);
        }
    })
    return results
}

module.exports = {
    recursive
}