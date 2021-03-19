import * as express from 'express';
import * as superagent from 'superagent';

const router = express.Router();

router.post(
    '/api/v0/newsletter',
    (req: express.Request, res: express.Response) => {
        superagent
            .post(process.env.NEWSLETTER_API)
            .auth('anykey', process.env.NEWSLETTER_API_KEY)
            .send({
                email_address: req.body.email_address,
                status: 'pending'
            })
            .end((err, response) => {
                if (err) {
                    res.status(400).end();
                } else {
                    res.status(200).end();
                }
            });
    }
);

router.use(
    '/app/privacy-policy',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            res.render('app/privacy-policy');
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
            res.render('privacy-policy');
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
            res.render('imprint');
        } catch (error) {
            res.redirect('/');
        }
    }
);

router.use(
    '/',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            // we should throttle and chache this, so we do not exceed the github rate limit
            const releaseInfo = await superagent

                .get(
                    'https://api.github.com/repos/Lumieducation/Lumi/releases/latest'
                )
                .set('User-Agent', 'Lumi.education-Homepage');

            res.render('home', {
                release: releaseInfo.body.name
            });
        } catch (error) {
            res.render('home', { release: '0.2.35', test: 'moo' });
        }
    }
);

export default router;
