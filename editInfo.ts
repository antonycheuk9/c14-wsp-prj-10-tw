import express from 'express';
import { Request, Response } from 'express';
import { client, isLoggedIn, Message } from './main';

export const editInfoRoutes = express.Router();



editInfoRoutes.post('/editInfo', isLoggedIn, async (req:Request, res:Response) => {
    await client.query(/*sql*/`update users set first_name = $1,last_name =$2,password =$3, qualification =$4, occupation =$5, phone_number=$6 where id = $7`, [req.body.first_name, req.body.last_name, req.body.password, req.body.qualification, req.body.occupation, req.body.phone_number, req.session['user'].id]);
    req.session['user'] = await (await client.query(/*sql*/`select * from users where id = $1`, [req.session['user'].id])).rows[0];
    let returnMessage:Message = {
        success: true,
        message: "success",
    }
    res.status(200).json(returnMessage);
})