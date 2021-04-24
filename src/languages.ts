import * as fs from 'fs';
import * as path from 'path';
import languageCodes from './languageCodes.json';

const localeMatcher = /^([a-z]{2,3})\-[a-z]{2,6}$/i;

export const languages = fs
    .readdirSync(path.resolve(__dirname, '../locales'))
    .map((f) => f.replace('.json', ''));

export const getCurrentLanguageCode = (browserLocale: string) => {
    const lowerCaseBrowserLocale = browserLocale.toLocaleLowerCase();
    if (languageCodes[lowerCaseBrowserLocale]) {
        return lowerCaseBrowserLocale;
    }
    const match = lowerCaseBrowserLocale.match(localeMatcher);
    if (match) {
        return match[1];
    }
    return 'en';
};

export const getNativeName = (code: string) => {
    const codeLowercase = code.toLocaleLowerCase();
    let name = languageCodes[codeLowercase]?.nativeName as string;
    if (!name) {
        const match = codeLowercase.match(localeMatcher);
        if (match) {
            name = languageCodes[match[1]]?.nativeName as string;
        }
    }
    return name ?? 'English';
};

export const getListWithNativeNames = (options?: { includeOriginal: true }) => {
    return (options?.includeOriginal
        ? languages
        : languages.filter((code) => code !== 'en')
    ).map((code) => ({ code, native: getNativeName(code) }));
};
