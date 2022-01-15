import dotenv from 'dotenv';

dotenv.config();

import {EachMessagePayload} from "kafkajs";
import {kafka} from "./config";
import {Subscriber} from "./subscriber";
import {createConnection, getRepository} from "typeorm";
import {KafkaError} from "../entity/kafka-error.entity";

const consumer = kafka.consumer({
    groupId: process.env.KAFKA_CLIENT
});

createConnection().then(async () => {
    await consumer.connect();

    await consumer.subscribe({topic: process.env.KAFKA_TOPIC});

    await consumer.run({
        eachMessage: async (message: EachMessagePayload) => {
            const key = message.message.key.toString();
            const value = JSON.parse(message.message.value.toString());

            try {
                await Subscriber[key](value);
            } catch (e) {
                await getRepository(KafkaError).save({
                    key,
                    value,
                    error: e.message
                });
            }
        }
    });
});



