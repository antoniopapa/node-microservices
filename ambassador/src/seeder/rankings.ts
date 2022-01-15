import {createConnection, getRepository} from "typeorm";
import {createClient} from "redis";
import {Order} from "../entity/order.entity";
import {UserService} from "../service/user.service";


createConnection().then(async () => {
    const client = createClient({
        url: 'redis://redis:6379'
    });

    await client.connect();

    const users = await UserService.get('users');

    const orderRepository = getRepository(Order);

    for (const user of users) {
        if (user['is_ambassador']) {
            const orders = await orderRepository.find({
                user_id: user['id'],
            });

            const revenue = orders.reduce((s, o) => s + o.total, 0);

            await client.zAdd('rankings', {
                value: user['first_name'] + ' ' + user['last_name'],
                score: revenue
            });
        }
    }

    process.exit();
});
