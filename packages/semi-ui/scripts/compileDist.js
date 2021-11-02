const webpack = require('webpack');
const config = require('../webpack.config');

function compile() {
    return new Promise((resolve, reject) => {
        console.log('compile jsx start');
        webpack(config({ minimize: false }), (err, stats) => {
            if (err) {
                reject(err);
                throw err;
            }
            
            const info = stats.toJson();
        
            if (stats.hasErrors()) {
                reject(info.errors);
                throw info.errors;
            }
            console.log('compile jsx success');
            resolve();
        });
    });
}

function compileMin() {
    return new Promise((resolve, reject) => {
        console.log('compile jsx with minimize start');
        webpack(config({ minimize: true }), (err, stats) => {
            if (err) {
                reject(err);
                throw err;
            }
            
            const info = stats.toJson();
        
            if (stats.hasErrors()) {
                reject(info.errors);
                throw info.errors;
            }
            console.log('compile jsx with minimize success');
            resolve();
        });
    });
}

compile().then(compileMin);