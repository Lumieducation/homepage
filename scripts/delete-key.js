const fsExtra = require('fs-extra');
const path = require ('path');

const p = process.argv[2].trim();
console.log('Removing path', p);
const split = p.split('.');

const files = fsExtra.readdirSync(path.resolve(__dirname, '..', 'locales'));
for (const file of files) {
    const fullPath = path.resolve(__dirname, '..', 'locales', file);
    const js = fsExtra.readJsonSync(fullPath);
    let requestedObject = js;
    for (let depth = 0; depth < split.length - 1; depth++) {
        requestedObject = requestedObject[split[depth]];
        if (!requestedObject) {
            throw new Error(`Could not find path in ${file}. Aborting`);
        }
    }
    delete requestedObject[split[split.length - 1]];
    fsExtra.writeJSONSync(fullPath, js, { spaces: 4 });
}
