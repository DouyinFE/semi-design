const axios = require('axios');
const path = require('path');
const camelCase = require('camelcase');

const SEMI_ICON_PKG_FILE_PATH = path.resolve(__dirname, '../../packages/semi-icons/package.json');
const SEMI_ICON_META_FILE_PATH = path.resolve(__dirname, '../../packages/semi-icons/src/svgs/meta.json');

const instance = axios.create();
instance.interceptors.response.use(response => response.data);

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, configOptions) => {
    const { createNode } = actions;
    const pkgJson = require(SEMI_ICON_PKG_FILE_PATH);
    const svgData = require(SEMI_ICON_META_FILE_PATH);

    const iconData = svgData.map(svg => ({
        name: `Icon${camelCase(svg.name, { pascalCase: true })}`,
        category: svg.category
    }));

    const data = {
        iconData,
        pkgJson
    };

    const semiIconsNodeId = createNodeId('semiIcons');

    const nodeData = JSON.stringify(data);

    const nodeMeta = {
        id: semiIconsNodeId,
        parent: null,
        children: [],
        internal: {
            type: 'SemiIconNodeType',
            content: nodeData,
            contentDigest: createContentDigest(data),
        },
    };

    const node = Object.assign({}, data, nodeMeta);

    createNode(node);
};
