import {Kafka} from 'kafkajs';

export const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT,
    brokers: [process.env.KAFKA_BROKERS],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD
    }
});

export const producer = kafka.producer();
