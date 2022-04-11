import * as express from 'express';
import { limit } from 'express-limit';

import {
    getListWithNativeNames,
    getNativeName,
    getCurrentLanguageCode
} from '../languages';

function getCurrentLocationWithoutLanguage(req: express.Request): string {
    return req.baseUrl.replace(
        `/${getCurrentLanguageCode(req.language)}/`,
        '/'
    );
}
const router = express.Router();

if (process.env.NODE_ENV !== 'development') {
    const rateLimiter = limit({
        period: 5 * 60 * 1000,
        max: 1000
    });
    router.use(rateLimiter);
}

router.use(
    '/app/privacy-policy',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.render('app/privacy-policy', {
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language),
                languageIsNotEnglish:
                    getCurrentLanguageCode(req.language) !== 'en',
                languageHasNoManualTranslation:
                    getCurrentLanguageCode(req.language) !== 'en' &&
                    getCurrentLanguageCode(req.language) !== 'de',
                currentWindowLocation: getCurrentLocationWithoutLanguage(req)
            });
        } catch (error) {
            res.redirect('/');
        }
    }
);

router.use(
    '/app-player/privacy-policy',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.render('app-player/privacy-policy', {
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language),
                languageIsNotEnglish:
                    getCurrentLanguageCode(req.language) !== 'en',
                languageHasNoManualTranslation:
                    getCurrentLanguageCode(req.language) !== 'en' &&
                    getCurrentLanguageCode(req.language) !== 'de',
                currentWindowLocation: getCurrentLocationWithoutLanguage(req)
            });
        } catch (error) {
            res.redirect('/');
        }
    }
);

router.use(
    '/privacy-policy',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.render('privacy-policy', {
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language),
                languageIsNotEnglish:
                    getCurrentLanguageCode(req.language) !== 'en',
                languageHasNoManualTranslation:
                    getCurrentLanguageCode(req.language) !== 'en' &&
                    getCurrentLanguageCode(req.language) !== 'de',
                currentWindowLocation: getCurrentLocationWithoutLanguage(req)
            });
        } catch (error) {
            res.redirect('/');
        }
    }
);

router.use(
    '/run/terms-and-conditions',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.render('run/terms-and-conditions', {
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language),
                languageIsNotEnglish:
                    getCurrentLanguageCode(req.language) !== 'en',
                languageHasNoManualTranslation:
                    getCurrentLanguageCode(req.language) !== 'en' &&
                    getCurrentLanguageCode(req.language) !== 'de',
                currentWindowLocation: getCurrentLocationWithoutLanguage(req)
            });
        } catch (error) {
            res.redirect('/');
        }
    }
);

router.use(
    '/support',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.render('support', {
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language),
                currentWindowLocation: getCurrentLocationWithoutLanguage(req)
            });
        } catch (error) {
            res.redirect('/');
        }
    }
);

router.use(
    '/run/privacy-policy',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.render('run/privacy-policy', {
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language),
                languageIsNotEnglish:
                    getCurrentLanguageCode(req.language) !== 'en',
                languageHasNoManualTranslation:
                    getCurrentLanguageCode(req.language) !== 'en' &&
                    getCurrentLanguageCode(req.language) !== 'de',
                currentWindowLocation: getCurrentLocationWithoutLanguage(req)
            });
        } catch (error) {
            res.redirect('/');
        }
    }
);

router.use(
    '/imprint',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.render('imprint', {
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language),
                currentWindowLocation: getCurrentLocationWithoutLanguage(req)
            });
        } catch (error) {
            res.redirect('/');
        }
    }
);

router.use('/:rest', (req, res) => {
    res.redirect('/');
});

router.use(
    '/',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        res.render('home', {
            release: '0.9.1',
            languages: getListWithNativeNames(),
            currentLanguage: getNativeName(req.language),
            currentLanguageCode: getCurrentLanguageCode(req.language),
            currentWindowLocation: getCurrentLocationWithoutLanguage(req)
        });
        /*
        try {
            // we should throttle and cache this, so we do not exceed the github rate limit
            const releaseInfo = await superagent
                .get(
                    'https://api.github.com/repos/Lumieducation/Lumi/releases/latest'
                )
                .set('User-Agent', 'Lumi.education-Homepage');

            res.render('home', {
                release: releaseInfo.body.name,
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language)
            });
        } catch (error) {
            console.log('error:', error);
            res.render('home', {
                release: '0.8.3',
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language)
            });
        }*/
    }
);

export default router;
