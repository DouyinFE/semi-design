const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// 设置 target，转换 `?.`(optional chaining) 
const ESBUILD_TARGET = process.env.ESBUILD_TARGET || 'es2018';

const compileWorker = async ()=>{
    const workerEntry = path.join(__dirname, "..", "src/worker/json.worker.ts");

    const result = await esbuild.build({
        entryPoints: [workerEntry],
        bundle: true,
        write: false,
        minify: true,
        target: ESBUILD_TARGET,
    });
    return result.outputFiles[0].text;
};


const buildMain = async ()=>{
    const mainEntry = path.join(__dirname, "..", "src/index.ts");

    const result = await esbuild.build({
        entryPoints: [mainEntry],
        bundle: true,
        packages: 'external',
        write: false,
        format: 'esm',
        target: ESBUILD_TARGET,
    });
    return result.outputFiles[0].text;

};



const compile = async ()=>{
    const workerRaw = await compileWorker();

    const mainRaw = await buildMain();

    const finalRaw = mainRaw.replaceAll("%WORKER_RAW%", encodeURIComponent(workerRaw));

    const saveDir = path.join(__dirname, "..", "lib");
    const workerSaveDir = path.join(__dirname, "..", "workerLib");

    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir);
    }
    if (!fs.existsSync(workerSaveDir)) {
        fs.mkdirSync(workerSaveDir);
    }
    fs.writeFileSync(path.join(workerSaveDir, "worker.js"), workerRaw, 'utf8');
    fs.writeFileSync(path.join(saveDir, "index.js"), finalRaw, 'utf8');
};

compile();
