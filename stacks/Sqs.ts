import {Queue, StackContext} from "sst/constructs";

export function Sqs({stack, app}: StackContext) {

    const queue = new Queue(stack, "Queue", {
        consumer: "packages/functions/src/trigger.handler",
    });

    return {queue};
}
