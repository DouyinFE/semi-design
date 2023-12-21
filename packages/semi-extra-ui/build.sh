#!/usr/bin/env bash

set -e


cd ./src


esbuild `find . \( -name '*.ts' -o -name '*.tsx' \)` --outdir=../lib

find ../lib -name "*.js" -exec sed -i 's/@douyinfe\/semi-extra-foundation\/src\//@douyinfe\/semi-extra-foundation\/lib\//g' {} +

tsc
