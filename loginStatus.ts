import express from 'express';
import { Request, Response } from 'express';
import { Message } from './main'

export const loginStatusRoutes = express.Router();

class LoginStatusMessage implements Message {
    success: boolean;
    message: string;
    loginStatus: boolean;

    constructor(success: boolean, message: string, loginStatus: boolean) {
        this.success = success;
        this.message = message;
        this.loginStatus = loginStatus;
    }
}

loginStatusRoutes.get('/loginStatus', async function (req:Request, res:Response) {
    if (req.session['user']) {
        let returnMessage = new LoginStatusMessage(true, "logged in", true);
        res.status(200).json(returnMessage)
    } else {
        let returnMessage = new LoginStatusMessage(false, "haven't logged in", false);
        res.status(401).json(returnMessage);
    }
});