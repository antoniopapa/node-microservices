import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Link} from "../entity/link.entity";
import {producer} from "../kafka/config";

export const CreateLink = async (req: Request, res: Response) => {
    const user = req['user'];

    const link = await getRepository(Link).save({
        user_id: user['id'],
        code: Math.random().toString(36).substring(6),
        products: req.body.products.map(id => ({id}))
    });

    const messages = [
        {
            key: "linkCreated",
            value: JSON.stringify(link)
        }
    ];

    await producer.sendBatch({
        topicMessages: [
            {
                topic: 'admin_topic',
                messages
            },
            {
                topic: 'checkout_topic',
                messages
            }
        ]
    });

    res.send(link);
}

export const Stats = async (req: Request, res: Response) => {
    const user = req['user'];

    const links = await getRepository(Link).find({
        where: {
            user_id: user['id']
        },
        relations: ['orders']
    });

    res.send(links.map(link => {
        return {
            code: link.code,
            count: link.orders.length,
            revenue: link.orders.reduce((s, o) => s + o.total, 0)
        };
    }));
}
