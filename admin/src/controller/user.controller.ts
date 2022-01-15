import {Request, Response} from "express";
import {UserService} from "../service/user.service";

export const Ambassadors = async (req: Request, res: Response) => {
    const users = await UserService.get('users');

    res.send(users.filter(u => u['is_ambassador']));
}
