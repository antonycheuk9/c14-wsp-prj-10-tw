import express from 'express';
import { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { client, isLoggedIn } from './main';

const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, path.resolve('uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
})
const upload = multer({ storage })

export const uploadProfilePicRoutes = express.Router();

uploadProfilePicRoutes.post('/profile-picture', isLoggedIn, upload.single('image'), async (req:Request, res:Response) => {
    await client.query(/*sql*/`update users set image = $1 where id =$2`, [req.file.filename, req.session['user'].id])
    req.session['user'] = await (await client.query(/*sql*/`select * from users where id = $1`, [req.session['user'].id])).rows[0]
    res.json(req.file.filename);
})