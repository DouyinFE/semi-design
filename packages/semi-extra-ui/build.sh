#!/usr/bin/env bash

set -e


cd ./src

tsc

esbuild `find . \( -name '*.ts' -o -name '*.tsx' \)` --outdir=../lib

