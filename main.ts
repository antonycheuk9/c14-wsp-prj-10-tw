import express from 'express';
import { Request, Response } from 'express';
import expressSession from 'express-session';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});
client.connect();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(expressSession({
    secret: 'Welcome to Freezio',
    resave: true,
    saveUninitialized: true
}));


app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/mainpage.html'))
})

export const isLoggedIn = function (req: Request, res: Response, next: express.NextFunction) {
    if (req.session['user']) {
        next();
    } else {
        res.redirect('/');
    }
}

export interface Message {
    success: boolean;
    message: string;
}

import { decisionTreeRoutes } from './decisionTree';
import { editInfoRoutes } from './editInfo';
import { getLinkRoutes } from './getLink';
import { infoRetrievalRoutes } from './infoRetrieval';
import { logInRoutes } from './logIn';
import { loginStatusRoutes } from './loginStatus';
import { logOutRoutes } from './logOut';
import { medLogRoutes } from './medLog';
import { signUpRoutes } from './signUp';
import { uploadProfilePicRoutes } from './uploadProfilePic';

app.use(signUpRoutes);

app.use(logInRoutes);

app.use(logOutRoutes);

app.use(loginStatusRoutes);

app.use(decisionTreeRoutes);

app.use(getLinkRoutes);

// requires login

app.use(infoRetrievalRoutes);

app.use(medLogRoutes);

app.use(editInfoRoutes);

app.use(uploadProfilePicRoutes);

app.use(express.static('public'));
app.use(isLoggedIn, express.static('uploads'));
app.use(isLoggedIn, express.static('private'));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
});