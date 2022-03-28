import express from 'express';
import { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { hashPassword } from './hash';
import { client, Message } from './main';

export const signUpRoutes = express.Router();

const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, path.resolve('uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
})
const upload = multer({ storage })

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

async function insertUser(req: Request, res: Response, is_contributor: boolean) {
    const users: User[] = (await client.query("SELECT * FROM users where email = $1"
        , [req.body.email])).rows;

    const userFound = users[0];

    let returnMessage: Message = {
        success: true,
        message: "",
    }

    if (userFound === undefined) {
        let hashedPassword = await hashPassword(req.body.password);
        if (req.file) {
            req.body.image = req.file.filename;
            await client.query(/*sql*/`INSERT INTO users (last_name,first_name,email,password,phone_number,sex,age,occupation,qualification,experience,is_active,is_contributor,image,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())`,
                [req.body.last_name, req.body.first_name, req.body.email, hashedPassword, parseInt(req.body.phone_number), req.body.gender, parseInt(req.body.age), req.body.occupation, req.body.qualification, req.body.experience, req.body.is_active, is_contributor, req.body.image]);
            returnMessage.message = "Signed up with profile picture"
        } else {
            await client.query(/*sql*/`INSERT INTO users (last_name,first_name,email,password,phone_number,sex,age,occupation,qualification,experience,is_active,is_contributor,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())`,
                [req.body.last_name, req.body.first_name, req.body.email, hashedPassword, parseInt(req.body.phone_number), req.body.gender, parseInt(req.body.age), req.body.occupation, req.body.qualification, req.body.experience, req.body.is_active, is_contributor]);
            returnMessage.message = "Signed up with NO profile picture"
        }
        const users: User[] = (await client.query("SELECT * FROM users where email = $1"
            , [req.body.email])).rows;

        const newUser = users[0];
        req.session['user'] = newUser;
        res.status(200).json(returnMessage);
    } else {
        res.status(400).json({ message: 'already existed' })
    }

}
signUpRoutes.post('/memberRegistration', upload.single('image'), async function (req, res) {
    await insertUser(req, res, false);
    console.log(req.session['user']);
})

signUpRoutes.post('/contributorRegistration', upload.single('image'), async function (req, res) {
    await insertUser(req, res, true)
})
