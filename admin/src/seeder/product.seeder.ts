import {createConnection, getRepository} from "typeorm";
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
            entities: [Product]
        }
    );

    const products = await oldConnection.manager.find(Product);

    const repository = getRepository(Product);

    for (const product of products) {
        await repository.save(product);
    }

    process.exit();
});
