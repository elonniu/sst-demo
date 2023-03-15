import {Queue, StackContext} from "sst/constructs";
import {sqsUrl} from "../packages/lib/ResourceUrl";

export function Sqs({stack, app}: StackContext) {

    const queue = new Queue(stack, "Queue", {
        consumer: "packages/functions/src/trigger.handler",
    });

    stack.addOutputs({
        url: sqsUrl(queue.queueName, app),
    });

    return {queue};
}
