import {
    Column,
    createConnection,
    Entity,
    getRepository,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {Order as OrderEntity} from "../entity/order.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    code: string;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    order_items: OrderItem[];
}

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ambassador_revenue: number;

    @ManyToOne(() => Order, order => order.order_items)
    @JoinColumn({name: 'order_id'})
    order: Order;
}


createConnection().then(async () => {
    const oldConnection = await createConnection({
            name: "old",
            type: "mysql",
            host: "host.docker.internal",
            port: 33066,
            username: "root",
            password: "root",
            database: "ambassador",
            entities: [Order, OrderItem]
        }
    );

    const orders = await oldConnection.manager.find(Order, {
        relations: ['order_items']
    });

    const orderRepository = getRepository(OrderEntity);

    for (const order of orders) {
        let total = 0;

        for (const orderItem of order.order_items) {
            total += orderItem.ambassador_revenue;
        }

        await orderRepository.save({
            id: order.id,
            user_id: order.user_id,
            code: order.code,
            total
        });
    }

    process.exit();
});
