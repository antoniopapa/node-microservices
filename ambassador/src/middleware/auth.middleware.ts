import {Request, Response} from "express";
import {UserService} from "../service/user.service";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        req["user"] = await UserService.get('user/ambassador', req.cookies['jwt']);

        next();
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
}
