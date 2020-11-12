import bodyParser from 'body-parser';
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';

import routes from './routes';
const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.enable('view cache');
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
                res.redirect(`https://${req.headers.host}${req.url}`);
            }
        } else {
            next();
        }
    }
);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(routes);

app.listen(process.env.PORT || 8080, () => {
    console.log(
        'express-server successfully booted: ' + process.env.PORT || 80
    );
});
