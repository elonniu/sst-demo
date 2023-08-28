import {ApiHandler} from "sst/node/api";
import {Queue} from "sst/node/queue";
import {response} from "../../lib/Api";
import {SendMessageBatchCommand, SQSClient} from "@aws-sdk/client-sqs";

const sqs = new SQSClient({});
export const handler = ApiHandler(async (event) => {

    const start = Date.now();

    const Entries = [];
    for (let i = 1; i <= 6; i++) {
        Entries.push({
            Id: i.toString(),
            MessageBody: "This is my message text: " + i.toString(),
        });
    }

    const params = {
        QueueUrl: Queue.Queue.queueUrl,
        Entries,
    };
    const command = new SendMessageBatchCommand(params);
    await sqs.send(command);

    const end = Date.now();

    return response({
        ms: Number(end.toString()) - Number(start.toString()),
    });
});
