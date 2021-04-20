import * as fs from 'fs';
import * as path from 'path';
import languageCodes from './languageCodes.json';

const localeMatcher = /^([a-z]{2,3})\-[a-z]{2,6}$/i;

export const languages = fs
    .readdirSync(path.resolve(__dirname, '../locales'))
    .map((f) => f.replace('.json', ''));

export const getCurrentLanguageCode = (browserLocale: string) => {
    if (languageCodes[browserLocale]) {
        return browserLocale;
    }
    const match = browserLocale.match(localeMatcher);
    if (match) {
        return match[1];
    }
    return 'en';
};

export const getNativeName = (code: string) => {
    let name = languageCodes[code]?.nativeName as string;
    if (!name) {
        const match = code.match(localeMatcher);
        if (match) {
            name = languageCodes[match[1]]?.nativeName as string;
        }
    }
    return name ?? 'English';
};

export const getListWithNativeNames = () => {
    return languages.map((code) => ({ code, native: getNativeName(code) }));
};
