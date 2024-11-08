#!/bin/bash

# 定义要删除的路径
BASE_DIR="/Users/bytedance/workspace/semi-design/packages/semi-ui"

# 删除 index.md 和 index-en-US.md
for dir in "$BASE_DIR"/*; do
    if [ -d "$dir" ]; then
        rm -f "$dir/index.md"
        rm -f "$dir/index-en-US.md"
    fi
done

# 删除根目录下的 index-en-US.md
rm -f "$BASE_DIR/index-en-US.md"

echo "已删除指定的 index.md 和 index-en-US.md 文件。"