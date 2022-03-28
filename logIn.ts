import express from 'express';
import { Request, Response } from 'express';
import { checkPassword } from './hash';
import { client, Message } from './main';

export const logInRoutes = express.Router();



interface User {
    id: number;
    email: string;
    password: string;
    last_name: string;
    first_name: string;
    phone_number: string;
    is_active: boolean;
    is_contributor: boolean;
}

class LoginMessage implements Message {
    success: boolean;
    message: string;
    is_contributor: boolean;
    constructor(success: boolean, message: string, is_contributor: boolean) {
        this.success = success;
        this.message = message;
        this.is_contributor = is_contributor;
    }
}

logInRoutes.post('/memberLogin', async function (req: Request, res: Response) {
    const users: User[] = (await client.query("SELECT * FROM users where email = $1"
        , [req.body.email])).rows;
    const userFound = users[0];
    if (userFound && await checkPassword(req.body.password, userFound.password)) {
        req.session['user'] = userFound;
        if (userFound.is_active == true) {
            let returnMessage: LoginMessage;
            if (!userFound.is_contributor) { returnMessage = new LoginMessage(true, "This is a member account.", false) }
            else { returnMessage = new LoginMessage(false, "Sorry! This is contibutor account.", true) }
            res.status(200).json(returnMessage);
            return
        }
    } else {
        let returnMessage: Message = {
            success: false,
            message: "Incorrect username/password"
        };
        res.status(401).json(returnMessage);
    }
})

logInRoutes.post('/contributorLogin', async function (req: Request, res: Response) {
    const users: User[] = (await client.query("SELECT * FROM users where email = $1"
        , [req.body.email])).rows;
    const userFound = users[0];

    if (userFound && await checkPassword(req.body.password, userFound.password)) {
        req.session['user'] = userFound;
        if (userFound.is_active == true) {
            let returnMessage: LoginMessage;
            if (userFound.is_contributor) { returnMessage = new LoginMessage(true, "This is a contributor account.", true) }
            else { returnMessage = new LoginMessage(false, "Sorry! This is member account.", false) }
            res.status(200).json(returnMessage);
            return
        }
    } else {
        let returnMessage: Message = {
            success: false,
            message: "Incorrect username/password"
        };
        res.status(401).json(returnMessage);
    }
})