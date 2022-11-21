/* eslint-disable max-lines-per-function */
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const fs = require('fs');
const items = ['basic', 'chart'];
const sha1 = require('sha1');
const hash = sha1(`${new Date().getTime()}${Math.random()}`);
const glob = require('glob');


function resolve(dir) {
    return path.resolve(__dirname, dir);
}
const getLocale = path => {
    let pathname = path || window.location.pathname;
    let locale = 'zh-CN';
    if (/en-US/.test(pathname)) {
        locale = 'en-US';
    }
    return locale;
};

exports.onCreateWebpackConfig = ({ stage, rules, loaders, plugins, actions }) => {
    const isSSR = stage.includes('html');
    const sassLoader = () => 'sass-loader';
    const miniCssExtract = (...args) => loaders.miniCssExtract(...args);
    const cssLoader = (options = {}) => ({
        loader: 'css-loader',
        options: {
            ...options,
        },
    });

    const semiOptions = { esbuild: true };
    const srcScssModuleUse = [];
    const srcScssUse = [];
    const srcCssUse = [];
    const semiDvScssUse = [];

    const semiDvJsxRule = [];

    // for semi
    semiOptions.scssUse = [
        loaders.css({
            importLoaders: 3,
        }),
        loaders.postcss(),
        sassLoader(),
    ];
    semiOptions.cssUse = [loaders.css({ importLoaders: 1 }), loaders.postcss()];
    semiOptions.scssPaths = [resolve('packages/semi-foundation'), resolve('packages/semi-ui'), resolve('packages/semi-icons')],
    semiOptions.paths = [
        function check(path) {
            return (
                (/packages\/semi-foundation/i.test(path) ||
                     /packages\/semi-ui/i.test(path) ||
                     /packages\/semi-icons/i.test(path)) &&
                 !(/packages\/semi-foundation\/node_modules/i.test(path) || /packages\/semi-ui\/node_modules/i.test(path))
            );
        },
    ];
    semiOptions.extract = isSSR
        ? {
            loader: { loader: MiniCssExtractPlugin.loader, options: {} },
        }
        : false;
    // for src
    srcScssModuleUse.push(
        cssLoader({
            importLoaders: 2,
            modules: {
                localIdentName: '[local]--[hash:base64:5]',
            },
            onlyLocals: isSSR,
            localsConvention: 'camelCase',
        }),
        loaders.postcss(),
        sassLoader()
    );
    srcScssUse.push(cssLoader({ importLoaders: 2 }), loaders.postcss(), sassLoader());
    srcCssUse.push(cssLoader({ importLoaders: 1 }), loaders.postcss());
    if (!isSSR) {
        [semiOptions.scssUse, semiOptions.cssUse, srcScssModuleUse, srcScssUse, srcCssUse, semiDvScssUse].forEach(
            arr => {
                arr.unshift(miniCssExtract());
            }
        );
    }

    actions.setWebpackConfig({
        resolve: {
            alias: {
                'semi-site-header': process.env.SEMI_SITE_HEADER || '@douyinfe/semi-site-header',
                'semi-site-banner': process.env.SEMI_SITE_BANNER || '@douyinfe/semi-site-banner',
                '@douyinfe/semi-ui': resolve('packages/semi-ui'),
                '@douyinfe/semi-foundation': resolve('packages/semi-foundation'),
                '@douyinfe/semi-icons': resolve('packages/semi-icons/src/'),
                '@douyinfe/semi-theme-default': resolve('packages/semi-theme-default'),
                '@douyinfe/semi-illustrations': resolve('packages/semi-illustrations/src/'),
                '@douyinfe/semi-animation-react': resolve('packages/semi-animation-react/'),
                '@douyinfe/semi-animation-styled': resolve('packages/semi-animation-styled/'),
                'services': resolve('src/services'),
                'utils': resolve('src/utils'),
                'context': resolve('src/context'),
                'components': resolve('src/components'),
                'locale': resolve('src/locale'),
                'src': resolve('src')
            },
        },
        module: {
            rules: [
                ...semiDvJsxRule,
                {
                    include: [path.resolve(__dirname, 'src')],
                    oneOf: [
                        {
                            test: /\.module\.s(a|c)ss$/,
                            use: [...srcScssModuleUse],
                        },
                        {
                            test: /\.s(a|c)ss$/,
                            use: [...srcScssUse],
                        },
                        {
                            test: /\.css$/,
                            use: [...srcCssUse],
                        },
                    ],
                },
                {
                    test: /\.s(a|c)ss$/,
                    include: [resolve('packages/semi-ui'), resolve('packages/semi-foundation'), resolve('packages/semi-icons')],
                    use: [...srcScssUse, resolve('packages/semi-webpack/lib/semi-theme-loader.js')],
                },
                {
                    test: [/\.jsx?$/],
                    include: [path.resolve(__dirname, 'src')],
                    use: {
                        loader: 'esbuild-loader',
                        options: {
                            loader: 'jsx', // Remove this if you're not using JSX
                            target: 'esnext' // Syntax to compile to (see options below for possible values)
                        },
                    },
                },
                {
                    test: [/\.tsx?$/],
                    include: [path.resolve(__dirname, 'src')],
                    use: {
                        loader: 'esbuild-loader',
                        options: {
                            loader: 'tsx', // Remove this if you're not using JSX
                            target: 'esnext' // Syntax to compile to (see options below for possible values)
                        },
                    },
                }
            ],
        },
        plugins: [plugins.extractText(),plugins.define({
            "THEME_SWITCHER_URL":JSON.stringify(process.env['THEME_SWITCHER_URL']),
            "SEMI_SEARCH_URL":JSON.stringify(process.env['SEMI_SEARCH_URL']),
            "DSM_URL":JSON.stringify(process.env['DSM_URL']),
            'process.env.SEMI_SITE_HEADER':JSON.stringify(process.env.SEMI_SITE_HEADER),
            'process.env.SEMI_SITE_BANNER':JSON.stringify(process.env.SEMI_SITE_BANNER),
            'process.env.D2C_URL': JSON.stringify(process.env.D2C_URL),
        })],
    });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;

    if (node.internal.type === 'Mdx') {
        const mdxNode = getNode(node.parent);
        const levels = mdxNode.relativePath.split(path.sep);

        const locale = getLocale(mdxNode.name);

        createNodeField({
            node,
            name: 'slug',
            value: `${locale}/${levels[0]}/${levels[1]}`, // eg: zh-CN/chart/area
        });

        createNodeField({
            node,
            name: 'type',
            value: `${levels[0]}`,
        });

        createNodeField({
            node,
            name: 'typeOrder',
            value: items.indexOf(levels[0]),
        });

        createNodeField({
            node,
            name: 'locale',
            value: locale,
        });
    }
};

exports.onPreBootstrap = ({ Joi }) => {
    let orderFunc = require('./content/order');
    console.log('starting order mdx');
    orderFunc();
};

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions;

    const blogPostTemplate = path.resolve('src/templates/postTemplate.js');

    const result = await graphql(`
         query {
             allMdx(
                 filter: { fields: { type: { nin: ["principles", "concepts"] } } }
                 sort: { order: ASC, fields: [frontmatter___order, fields___locale, fields___typeOrder, fields___slug] }
             ) {
                 edges {
                     previous {
                         fields {
                             slug
                         }
                         id
                         frontmatter {
                             title
                             localeCode
                             icon
                         }
                     }
                     node {
                         fields {
                             slug
                         }
                         id
                         frontmatter {
                             localeCode
                             order
                             icon
                         }
                     }
                     next {
                         fields {
                             slug
                         }
                         id
                         frontmatter {
                             title
                             localeCode
                             icon
                         }
                     }
                 }
             }
         }
     `);
    // Handle errors
    if (result.errors) {
        reporter.panicOnBuild('Error while running GraphQL query.');
        return;
    }

    result.data.allMdx.edges.forEach(({ next, previous, node }) => {
        createPage({
            path: node.fields.slug,
            // path: node.frontmatter.localeCode ? node.frontmatter.localeCode + '/' +  node.fields.slug : 'zh-CN/' + node.fields.slug,
            component: blogPostTemplate,
            context: {
                slug: node.fields.slug,
                next,
                previous,
                // id: node.id,
            },
        });
    });
};


exports.onPostBuild = async () => {
    const publicPath = path.join(__dirname, 'public');

    const pageDataFiles = glob.sync(`${publicPath}/page-data/**/page-data.json`);
    for (let file of pageDataFiles) {
        console.log(file);
        const newFilename = file.replace(`page-data.json`, `page-data.${hash}.json`);
        fs.renameSync(file, newFilename);
    }

    const appDataFiles = glob.sync(`${publicPath}/page-data/**/app-data.json`);
    for (let file of appDataFiles) {
        console.log(file);
        const newFilename = file.replace(`app-data.json`, `app-data.${hash}.json`);
        fs.renameSync(file, newFilename);
    }

    const htmlAndJSFiles = glob.sync(`${publicPath}/**/*.{html,js}`);
    for (let file of htmlAndJSFiles) {
        const stats = fs.statSync(file);
        if (stats.isFile()) {
            console.log(`Adding version to page-data.json app-data.json designToken.json in ${file}..`);
            let content = fs.readFileSync(file, 'utf8');
            const result = content.replace(
                /page-data.json(\?v=[a-f0-9]*)?/g,
                `page-data.${hash}.json`
            ).replace(/app-data.json(\?v=[a-f0-9]*)?/g,
                `app-data.${hash}.json`
            ).replace(/designToken.json(\?v=[a-f0-9]*)?/g,
                `designToken.json?v=${hash}`);
            fs.writeFileSync(file, result, 'utf8');
        }
    }


};
