#!/usr/bin/env node

import arg from 'arg';
import { transScssVariables2CssVariables } from './index';

const main = () => {
    console.log('bin exec');
    transScssVariables2CssVariables({targetPath:"../semi-foundation",resultPath:""});
};

main();
