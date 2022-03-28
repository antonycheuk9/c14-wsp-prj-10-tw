import express from 'express';
import { Request, Response } from 'express';
import { client, isLoggedIn, Message } from './main';


export const medLogRoutes = express.Router();

medLogRoutes.get('/saveMedLog', isLoggedIn, async function (req: Request, res: Response) {
    console.log(req.session['injury'])
    console.log(req.session['diagnosis'])
    const injuryId: number = (await client.query(/*sql*/`select * from injuries where injury_name = $1`, [req.session['injury']])).rows[0].id;
    await client.query(/*sql*/`insert into medlog (user_id, injury_id, diagnosis, created_at, updated_at) values ($1, $2, $3, now(), now())`, [req.session['user'].id, injuryId, req.session['diagnosis']]);
    let returnMessage: Message = {
        success: true,
        message: "Saved",
    }
    res.status(200).json(returnMessage);
})

medLogRoutes.get('/getMedLog', isLoggedIn, async function (req: Request, res: Response) {
    const medlogs = (await client.query(/*sql*/`select * from medlog inner join injuries on injury_id = injuries.id inner join users on user_id = users.id where user_id = $1`, [req.session['user'].id])).rows;
    if (medlogs.length != 0) {
        res.status(200).json(medlogs)
    } else {
        let returnMessage:Message = {
            success: false,
            message: "You have currently no medical records.",
        }
        res.status(400).json(returnMessage)
    }
})