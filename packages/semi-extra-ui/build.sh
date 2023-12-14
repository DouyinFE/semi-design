#!/usr/bin/env bash

set -e


cd ./src


esbuild `find . \( -name '*.ts' -o -name '*.tsx' \)` --outdir=../lib

