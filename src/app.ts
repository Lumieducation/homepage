import bodyParser from 'body-parser';
import express from 'express';
import * as exphbs from 'express-handlebars';
import path from 'path';
import morgan from 'morgan';
import i18next from 'i18next';
import i18nextHttpMiddleware from 'i18next-http-middleware';
import i18nextFsBackend from 'i18next-fs-backend';
import helmet from 'helmet';

import routes from './routes';
import { languages } from './languages';

// deepcode ignore UseCsurfForExpress: no post requests in the app
const app = express();

let devMode = false;
if (process.env.NODE_ENV === 'development') {
    console.log('Starting server in development mode...');
    devMode = true;
}

// Add logger
app.use(morgan('tiny'));

// Add save HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: false,
        hsts: !devMode
    })
);

i18next
    .use(i18nextFsBackend)
    .use(i18nextHttpMiddleware.LanguageDetector) // This will add the
    // properties language and languages to the req object.
    // See https://github.com/i18next/i18next-http-middleware#adding-own-detection-functionality
    // how to detect language in your own fashion. You can also choose not
    // to add a detector if you only want to use one language.
    .init({
        backend: {
            loadPath: path.resolve(`locales/{{lng}}.json`)
        },
        debug: process.env.DEBUG && process.env.DEBUG.includes('i18n'),
        defaultNS: 'server',
        fallbackLng: 'en',
        load: 'all',
        ns: ['server'],
        lowerCaseLng: true,
        preload: languages,
        detection: {
            order: ['querystring', 'path', 'header'],
            lookupPath: 'lng',
            lookupFromPathIndex: 0
        }
    });

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(i18nextHttpMiddleware.handle(i18next));
const handleBars = exphbs.create({
    helpers: {
        i18n: (key: string, ctx: any) => {
            return ctx.data?.root?.t(key, ctx.hash);
        }
    }
});

app.engine('handlebars', handleBars.engine);
app.set('view engine', 'handlebars');
if (process.env.NODE_ENV === 'production') {
    app.enable('view cache');
}

app.enable('trust proxy');

app.use(
    '*',
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (process.env.NODE_ENV === 'production') {
            if (req.secure) {
                next();
            } else {
                if (
                    !/^(\/[\w\-]+){0,}\/?(\?[\w\-]+=[\w\-]+)?$/i.test(
                        req.originalUrl
                    )
                ) {
                    res.status(400).send('Illegal request').end();
                    return;
                }
                res.redirect(`https://lumi.education${req.originalUrl}`);
            }
        } else {
            next();
        }
    }
);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/:lang([a-zA-Z]{2,3}-?[a-zA-Z]{0,6})', (req, res, next) => {
    if (typeof req.params.lang !== 'string') {
        next();
        return;
    }
    // deepcode ignore HTTPSourceWithUncheckedType: checked by route regex and typeof
    const langLowercase = req.params.lang.toLocaleLowerCase();
    if (languages.includes(langLowercase)) {
        if (req.url === '/' && !req.originalUrl.endsWith('/')) {
            // deepcode ignore OR: checked against dictionary languages
            res.redirect(`/${langLowercase}/`);
        } else {
            routes(req, res, next);
        }
    } else {
        next();
    }
});

app.use(routes);

app.listen(process.env.PORT || 8080);
