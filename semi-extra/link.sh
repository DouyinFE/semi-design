#!/usr/bin/env bash

set -e


storybookPath="$(realpath "$(dirname "$0")")"

foundationPath="$storybookPath/../packages/semi-extra-foundation"
uiPath="$storybookPath/../packages/semi-extra-ui"


cd "$foundationPath"
npm link

cd "$uiPath"
npm link @douyinfe/semi-extra-foundation

