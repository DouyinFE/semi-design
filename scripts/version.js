const semver = require('semver');


const findLatestVersion = (versionSet) => {
    return [...versionSet].find(v => v === semver.coerce(v).raw);
};

const getAlphaVersion = (versionSet) => {
    let latestVersion = findLatestVersion(versionSet);
    const nextBetaVersion = semver.inc(latestVersion, 'preminor', 'beta');
    // 如果已经有beta版本了，那么就得发下个版本的alpla版
    if (versionSet.has(nextBetaVersion)) {
        latestVersion = semver.inc(latestVersion, 'minor');
    }
    let nextVersion = semver.inc(latestVersion, 'preminor', 'alpha');
    while (versionSet.has(nextVersion)) {
        nextVersion = semver.inc(nextVersion, 'prerelease', 'alpha');
    }
    return nextVersion;
};

const getBetaVersion = (versionSet) => {
    const latestVersion = findLatestVersion(versionSet);
    let nextVersion = semver.inc(latestVersion, 'preminor', 'beta');
    while (versionSet.has(nextVersion)) {
        nextVersion = semver.inc(nextVersion, 'prerelease', 'beta');
    }
    return nextVersion;
};

const getHotfixVersion = (versionSet) => {
    const latestVersion = findLatestVersion(versionSet);
    let nextVersion = semver.inc(latestVersion, 'prepatch', 'beta');
    while (versionSet.has(nextVersion)) {
        nextVersion = semver.inc(nextVersion, 'prerelease', 'beta');
    }
    return nextVersion;
};

const getMinorVersion = (versionSet) => {
    const latestVersion = findLatestVersion(versionSet);
    const nextVersion = semver.inc(latestVersion, 'minor');
    return nextVersion;
};

const getPatchVersion = (versionSet) => {
    const latestVersion = findLatestVersion(versionSet);
    const nextVersion = semver.inc(latestVersion, 'patch');
    return nextVersion;
};


const generateVersions = (versionSet, releaseType) => {
    switch (releaseType) {
        case "minor":
            return getMinorVersion(versionSet);
        case "patch":
            return getPatchVersion(versionSet);
        case "alpha":
            return getAlphaVersion(versionSet);
        case "beta":
            return getBetaVersion(versionSet);
        case "hotfix":
            return getHotfixVersion(versionSet);
        default:
            return '';
    }
};


function main() {
    const versionList = JSON.parse(process.env.VERSION_LIST);
    const releaseType = process.env.RELEASE_TYPE;
    const sortedVersionList = versionList.sort(semver.rcompare);
    const sortedVersionSet = new Set(sortedVersionList);
    return generateVersions(sortedVersionSet, releaseType);
}

console.log(main());
