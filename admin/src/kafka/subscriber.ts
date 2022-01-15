import {getRepository} from "typeorm";
import {Link} from "../entity/link.entity";
import {Order} from "../entity/order.entity";

export class Subscriber {

    static async linkCreated(link: Link) {
        await getRepository(Link).save(link);
    }

    static async orderCompleted(order: Order) {
        await getRepository(Order).save(order);
    }
}
