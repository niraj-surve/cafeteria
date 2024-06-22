import FormData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";

dotenv.config();

const mailApiKey = process.env.MAILGUN_API_KEY;

export function getClient() {
    const mailgun = new Mailgun(FormData);

    const client = mailgun.client({
        username: 'api',
        key: mailApiKey,
    });

    return client;
}
