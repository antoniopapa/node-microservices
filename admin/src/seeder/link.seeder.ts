import {createConnection, getRepository} from "typeorm";
import {Link} from "../entity/link.entity";
import {Product} from "../entity/product.entity";
import {Order} from "../entity/order.entity";
import {OrderItem} from "../entity/order-item.entity";

createConnection().then(async () => {
    const oldConnection = await createConnection({
            name: "old",
            type: "mysql",
            host: "host.docker.internal",
            port: 33066,
            username: "root",
            password: "root",
            database: "ambassador",
            entities: [Link, Product, Order, OrderItem]
        }
    );

    const links = await oldConnection.manager.find(Link, {
        relations: ["products"]
    });

    const repository = getRepository(Link);

    for (const link of links) {
        await repository.save(link);
    }

    process.exit();
});
