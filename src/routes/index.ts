import * as express from 'express';
import * as superagent from 'superagent';

const router = express.Router();



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

            res.render('home', { release: releaseInfo.body.name});
        } catch (error) {
            res.render('home', { release: '0.2.35'});
        }
    }
);

export default router;
