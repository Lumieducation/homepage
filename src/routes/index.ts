import * as express from 'express';
import * as superagent from 'superagent';

import {
    getListWithNativeNames,
    getNativeName,
    getCurrentLanguageCode
} from '../languages';

const router = express.Router();

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
                currentLanguageCode: getCurrentLanguageCode(req.language)
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
                currentLanguageCode: getCurrentLanguageCode(req.language)
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
                currentLanguageCode: getCurrentLanguageCode(req.language)
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
            res.render('home', {
                release: '0.6.1',
                languages: getListWithNativeNames(),
                currentLanguage: getNativeName(req.language),
                currentLanguageCode: getCurrentLanguageCode(req.language)
            });
        }
    }
);

export default router;
