import {ApiHandler} from "sst/node/api";
import {Queue} from "sst/node/queue";
import {response} from "../../lib/Api";
import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";

const sqs = new SQSClient({});
export const handler = ApiHandler(async (event) => {

    const start = Date.now();

    const params = {
        QueueUrl: Queue.Queue.queueUrl,
        MessageBody: "This is my message text.",
    };

    const command = new SendMessageCommand(params);
    await sqs.send(command);

    const end = Date.now();

    return response({
        ms: Number(end.toString()) - Number(start.toString()),
    });
});
