import {Kafka, EachMessagePayload} from 'kafkajs';
import {createTransport} from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT,
    brokers: [process.env.KAFKA_BROKERS],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD
    }
});

const consumer = kafka.consumer({
    groupId: process.env.KAFKA_CLIENT
});

const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const run = async () => {
    await consumer.connect();

    await consumer.subscribe({topic: 'email_topic'});

    await consumer.run({
        eachMessage: async (message: EachMessagePayload) => {
            const order = JSON.parse(message.message.value.toString());

            await transporter.sendMail({
                from: 'from@example.com',
                to: 'admin@admin.com',
                subject: 'An order has been completed',
                html: `Order #${order.id} with a total of $${order.admin_revenue} has been completed`
            });

            await transporter.sendMail({
                from: 'from@example.com',
                to: order.ambassador_email,
                subject: 'An order has been completed',
                html: `You earned $${order.ambassador_revenue} from the link #${order.code}`
            });
        }
    });

    await transporter.close()
}

run().then(console.error);


