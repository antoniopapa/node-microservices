import {createConnection, getRepository} from "typeorm";
import {Order} from "../entity/order.entity";
import {OrderItem} from "../entity/order-item.entity";
import {Link} from "../entity/link.entity";
import {Product} from "../entity/product.entity";

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

    const orders = await oldConnection.manager.find(Order, {
        relations: ['order_items']
    });

    const orderRepository = getRepository(Order);

    for (const order of orders) {
        await orderRepository.save(order);
    }

    process.exit();
});
