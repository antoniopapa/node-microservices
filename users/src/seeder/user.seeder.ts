import {createConnection, getRepository} from "typeorm";
import {User} from "../entity/user.entity";

createConnection().then(async () => {
    const oldConnection = await createConnection({
            name: "old",
            type: "mysql",
            host: "host.docker.internal",
            port: 33066,
            username: "root",
            password: "root",
            database: "ambassador",
            entities: [User]
        }
    );

    const users = await oldConnection.manager.find(User);

    const repository = getRepository(User);

    for (const user of users) {
        await repository.save(user);
    }

    process.exit();
});
