// This scripts deletes keys from JSON files so that they can be translated
// again with the auto translator.
//
// Usage: node scripts/delete-keys.js XX.YY.ZZ <en,fr,de,...>
// <en,fr,de,...> are the locales that should be excluded from deletion, e.g.
// because they were translated manually.

const fsExtra = require('fs-extra');
const path = require('path');

const jsonPathRaw = process.argv[2].trim();
console.log('Removing path', jsonPathRaw);
const splitJsonPath = jsonPathRaw.split('.');

const excludedLocalesRaw = process.argv[3].trim();
console.log(`Excluding ${excludedLocalesRaw}`);
const excludedLocales = excludedLocalesRaw.split(',').map((l) => `${l}.json`);

const files = fsExtra.readdirSync(path.resolve(__dirname, '..', 'locales'));
for (const file of files) {
    console.log(`Parsing ${file}`);
    if (excludedLocales.includes(file)) {
        console.log(`Skipping ${file}`);
        continue;
    }
    const fullPath = path.resolve(__dirname, '..', 'locales', file);
    const js = fsExtra.readJsonSync(fullPath);
    let requestedObject = js;
    for (let depth = 0; depth < splitJsonPath.length - 1; depth++) {
        requestedObject = requestedObject[splitJsonPath[depth]];
        if (!requestedObject) {
            throw new Error(`Could not find path in ${file}. Aborting`);
        }
    }
    delete requestedObject[splitJsonPath[splitJsonPath.length - 1]];
    fsExtra.writeJSONSync(fullPath, js, { spaces: 4 });
}
