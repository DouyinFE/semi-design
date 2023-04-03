export default function semiSourceSuffixLoader(source: string) {
    return source.replace(/(import\s+)['"]([^'"]+)(\.css)['"]/g, '$1\'$2.scss\'');
}

