import express from 'express';
import { Request, Response } from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});
client.connect();

export const getLinkRoutes = express.Router();

getLinkRoutes.post('/getLink', async function (req:Request, res:Response) {
    console.log(req.body);
    try {
        const link: string = (await client.query(/*sql*/`select * from injuries where injury_name = $1`, [req.body.injury_name])).rows[0].link;
        console.log(link)
        res.json(link);
    } catch (e) {
        console.log(e)
    };
})