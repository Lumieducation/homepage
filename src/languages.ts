import * as fs from 'fs';
import * as path from 'path';

export default fs
    .readdirSync(path.resolve(__dirname, '../locales'))
    .map((f) => f.replace('.json', ''));
