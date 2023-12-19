#!/usr/bin/env bash

set -e


cd "$(dirname "$0")"

./link.sh

cd ./storybook

yarn

yarn storybook
