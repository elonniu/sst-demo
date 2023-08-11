import {ApiHandler} from "sst/node/api";
import {Topic} from "sst/node/topic";
import {PublishCommand, SNSClient} from "@aws-sdk/client-sns";
import {response} from "../../lib/Api";

const sns = new SNSClient({});
export const handler = ApiHandler(async (event) => {

    const start = Date.now();

    const params = {
        TopicArn: Topic.Topic.topicArn,
        Message: "This is my message text.",
    };

    const command = new PublishCommand(params);
    await sns.send(command);

    const end = Date.now();

    return response({
        ms: Number(end.toString()) - Number(start.toString()),
    });
});
