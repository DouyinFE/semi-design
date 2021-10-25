import config from '../base/config';

// automatically import all files ending in *.stories.tsx
const req = require.context('../../packages/semi-ui', true, /.stories.tsx$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}
config(loadStories);
