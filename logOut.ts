import express from 'express';
import { Request, Response } from 'express';
import { isLoggedIn, Message } from './main'

export const logOutRoutes = express.Router();

logOutRoutes.get('/logOut', isLoggedIn, async function (req: Request, res: Response) {
    delete req.session['user'];
    let returnMessage:Message = {
        success: true,
        message: "log out",
    }
    res.json(returnMessage)
})