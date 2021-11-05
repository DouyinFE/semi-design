const { compile } = require('@douyinfe/semi-scss-compile');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '../..', dir);
}


compile(resolve('semi-foundation/'), resolve('semi-theme-default/'), resolve('semi-ui/dist/css/semi.min.css'), {isMin: true})
compile(resolve('semi-foundation/'), resolve('semi-theme-default/'), resolve('semi-ui/dist/css/semi.css'), {isMin: false})

