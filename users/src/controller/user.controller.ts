import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {User} from "../entity/user.entity";

export const Users = async (req: Request, res: Response) => {
    res.send(await getRepository(User).find());
}

export const GetUser = async (req: Request, res: Response) => {
    res.send(await getRepository(User).findOne(req.params.id));
}
