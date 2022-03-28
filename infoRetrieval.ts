import express from 'express';
import { Request, Response } from 'express';
import { isLoggedIn } from './main';

export const infoRetrievalRoutes = express.Router();

infoRetrievalRoutes.get('/infoRetrieval', isLoggedIn, async function (req:Request, res:Response) {
    const userFound = req.session['user'];
    if (userFound) {
        res.json(
            userFound
        );
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});