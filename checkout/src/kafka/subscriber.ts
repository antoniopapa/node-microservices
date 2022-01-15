import {Product} from "../entity/product.entity";
import {getRepository} from "typeorm";
import {Link} from "../entity/link.entity";

export class Subscriber {

    static async productCreated(product: Product) {
        await getRepository(Product).save(product);
    }

    static async productUpdated(product: Product) {
        await getRepository(Product).save(product);
    }

    static async productDeleted(id: number) {
        await getRepository(Product).delete(id);
    }

    static async linkCreated(link: Link) {
        await getRepository(Link).save(link);
    }
}
