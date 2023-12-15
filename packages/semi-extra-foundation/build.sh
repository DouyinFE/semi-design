#!/usr/bin/env bash

set -e


cd ./src

tsc

esbuild `find . \( -name '*.ts' -o -name '*.tsx' \)` --outdir=../lib

find ../lib -type f -name "*.js" -exec sed -i 's/import\s*\("\.\/[^"]*\)\.scss"/import \1.css/g' {} +

sass --no-source-map .:../lib
