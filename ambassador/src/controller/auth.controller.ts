import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Order} from "../entity/order.entity";
import {UserService} from "../service/user.service";

export const Register = async (req: Request, res: Response) => {
    const body = req.body;

    const user = await UserService.post('register', {
        ...body,
        is_ambassador: true
    });

    res.send(user);
}

export const Login = async (req: Request, res: Response) => {
    const body = req.body;

    const data = await UserService.post('login', {
        ...body,
        scope: 'ambassador'
    });

    res.cookie("jwt", data['jwt'], {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000//1 day
    });

    res.send({
        message: 'success'
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const user = req["user"];

    const orders = await getRepository(Order).find({
        user_id: user['id'],
    });

    user['revenue'] = orders.reduce((s, o) => s + o.total, 0);

    res.send(user);
}

export const Logout = async (req: Request, res: Response) => {
    await UserService.post('logout', {}, req.cookies['jwt']);

    res.cookie("jwt", "", {maxAge: 0});

    res.send({
        message: 'success'
    });
}

export const UpdateInfo = async (req: Request, res: Response) => {
    res.send(await UserService.put('users/info', req.body, req.cookies['jwt']));
}

export const UpdatePassword = async (req: Request, res: Response) => {
    res.send(await UserService.put('users/password', req.body, req.cookies['jwt']));
}
