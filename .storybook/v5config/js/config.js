import config from '../base/config';

// automatically import all files ending in *.stories.js
const req = require.context('../../packages/semi-ui', true, /.stories.js$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}
config(loadStories);
