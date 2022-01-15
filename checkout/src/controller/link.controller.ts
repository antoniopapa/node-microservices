import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Link} from "../entity/link.entity";
import {UserService} from "../service/user.service";

export const GetLink = async (req: Request, res: Response) => {
    const link = await getRepository(Link).findOne({
        where: {
            code: req.params.code
        },
        relations: ['products']
    });

    link['user'] = await UserService.get(`users/${link.user_id}`);

    res.send(link);
}
