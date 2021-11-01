#!/usr/bin/env node

import arg from "arg";
import {compile} from "./index";

const main = () => {
    const userArgs = arg({
        "--foundation": String,
        "--theme": String,
        "--output": String,
        "--min": Boolean,

        "-f": "--foundation",
        "-t": "--theme",
        "-o": "--output",
        "-m": "--min"
    }, {permissive: true});
    const {"--foundation": foundationPath, '--theme': themePath, '--output': outputPath, '--min': isMin} = userArgs;
    console.log(`foundationPath: ${foundationPath},\nthemePath: ${themePath},\noutputPath: ${outputPath}\n`);
    if (foundationPath && themePath && outputPath) {
        compile(foundationPath, themePath, outputPath, {
            isMin
        });
    } else {
        console.error('Error: lack of args.')
    }
}

main();
