import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Link} from "./link.entity";

@Entity()
export class Order {
    @PrimaryColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    code: string;

    @Column()
    total: number;

    @ManyToOne(() => Link, link => link.orders, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({
        referencedColumnName: 'code',
        name: 'code'
    })
    link: Link;
}
