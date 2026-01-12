const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');


const compileWorker = async ()=>{
    const workerEntry = path.join(__dirname, "..", "src/worker/json.worker.ts");

    const result = await esbuild.build({
        entryPoints: [workerEntry],
        bundle: true,
        write: false,
        minify: true,
    });
    return result.outputFiles[0].text;
};


const buildMain = async (format)=>{
    const mainEntry = path.join(__dirname, "..", "src/index.ts");

    const result = await esbuild.build({
        entryPoints: [mainEntry],
        bundle: true,
        packages: 'external',
        write: false,
        format: format
    });
    return result.outputFiles[0].text;

};



const compile = async ()=>{
    const workerRaw = await compileWorker();

    // 编译 ESM 格式
    const mainRawESM = await buildMain('esm');
    const finalRawESM = mainRawESM.replaceAll("%WORKER_RAW%", encodeURIComponent(workerRaw));

    // 编译 CJS 格式
    const mainRawCJS = await buildMain('cjs');
    const finalRawCJS = mainRawCJS.replaceAll("%WORKER_RAW%", encodeURIComponent(workerRaw));

    const libDir = path.join(__dirname, "..", "lib");
    const esDir = path.join(libDir, "es");
    const cjsDir = path.join(libDir, "cjs");
    const workerSaveDir = path.join(__dirname, "..", "workerLib");

    // 创建必要的目录
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir);
    }
    if (!fs.existsSync(esDir)) {
        fs.mkdirSync(esDir, { recursive: true });
    }
    if (!fs.existsSync(cjsDir)) {
        fs.mkdirSync(cjsDir, { recursive: true });
    }
    if (!fs.existsSync(workerSaveDir)) {
        fs.mkdirSync(workerSaveDir);
    }

    // 保存文件
    fs.writeFileSync(path.join(workerSaveDir, "worker.js"), workerRaw, 'utf8');
    fs.writeFileSync(path.join(esDir, "index.js"), finalRawESM, 'utf8');
    fs.writeFileSync(path.join(cjsDir, "index.js"), finalRawCJS, 'utf8');
};

compile();
