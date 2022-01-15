import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Product} from "../entity/product.entity";
import {producer} from "../kafka/config";

export const Products = async (req: Request, res: Response) => {
    const product = await getRepository(Product).find();

    const messages = [
        {
            key: "productCreated",
            value: JSON.stringify(product)
        }
    ];

    await producer.sendBatch({
        topicMessages: [
            {
                topic: 'ambassador_topic',
                messages
            },
            {
                topic: 'checkout_topic',
                messages
            },
        ]
    });

    res.send(product);
}

export const CreateProduct = async (req: Request, res: Response) => {
    res.status(201).send(await getRepository(Product).save(req.body));
}

export const GetProduct = async (req: Request, res: Response) => {
    res.send(await getRepository(Product).findOne(req.params.id));
}

export const UpdateProduct = async (req: Request, res: Response) => {
    const repository = getRepository(Product);

    await repository.update(req.params.id, req.body);

    const product = await repository.findOne(req.params.id)

    const messages = [
        {
            key: "productUpdated",
            value: JSON.stringify(product)
        }
    ];

    await producer.sendBatch({
        topicMessages: [
            {
                topic: 'ambassador_topic',
                messages
            },
            {
                topic: 'checkout_topic',
                messages
            },
        ]
    });

    res.status(202).send(product);
}

export const DeleteProduct = async (req: Request, res: Response) => {
    await getRepository(Product).delete(req.params.id);

    const messages = [
        {
            key: "productDeleted",
            value: req.params.id
        }
    ];

    await producer.sendBatch({
        topicMessages: [
            {
                topic: 'ambassador_topic',
                messages
            },
            {
                topic: 'checkout_topic',
                messages
            },
        ]
    });
    
    res.status(204).send(null);
}
