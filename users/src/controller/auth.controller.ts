import {Request, Response} from "express";
import {getRepository} from "typeorm";
import bcryptjs from 'bcryptjs';
import {User} from "../entity/user.entity";
import {sign} from "jsonwebtoken";
import {Token} from "../entity/token.entity";

export const Register = async (req: Request, res: Response) => {
    const {password, password_confirm, ...body} = req.body;

    if (password !== password_confirm) {
        return res.status(400).send({
            message: "Password's do not match!"
        })
    }

    const user = await getRepository(User).save({
        ...body,
        password: await bcryptjs.hash(password, 10),
    });

    delete user.password;

    res.send(user);
}

export const Login = async (req: Request, res: Response) => {
    const user = await getRepository(User).findOne({email: req.body.email}, {
        select: ["id", "password"]
    });

    if (!user) {
        return res.status(400).send({
            message: 'invalid credentials!'
        });
    }

    if (!await bcryptjs.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials!'
        });
    }

    const jwt = sign({
        id: user.id,
        scope: req.body.scope
    }, process.env.SECRET_KEY);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await getRepository(Token).save({
        user_id: user.id,
        token: jwt,
        expired_at: tomorrow
    });

    res.send({jwt});
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const user = req["user"];

    if ((req.params.scope == 'ambassador' && req["scope"] !== 'ambassador') || (req.params.scope == 'admin' && req["scope"] !== 'admin')) {
        return res.status(401).send({
            message: 'unauthorized'
        });
    }

    res.send(user);
}

export const Logout = async (req: Request, res: Response) => {
    const user = req["user"];

    await getRepository(Token).delete({
        user_id: user['id']
    });

    res.send({
        message: 'success'
    });
}

export const UpdateInfo = async (req: Request, res: Response) => {
    const user = req["user"];

    const repository = getRepository(User);

    await repository.update(user.id, req.body);

    res.send(await repository.findOne(user.id));
}

export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req["user"];

    if (req.body.password !== req.body.password_confirm) {
        return res.status(400).send({
            message: "Password's do not match!"
        })
    }

    await getRepository(User).update(user.id, {
        password: await bcryptjs.hash(req.body.password, 10)
    });

    res.send(user);
}
