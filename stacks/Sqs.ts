import {Function, Queue, StackContext} from "sst/constructs";
import {sqsUrl} from "../packages/lib/ResourceUrl";
import * as lambdaEventSources from '@aws-cdk/aws-lambda-event-sources';

export function Sqs({stack, app}: StackContext) {

    const queue = new Queue(stack, "Queue");

    const fn1 = new Function(stack, "fn1", {
        handler: "packages/functions/src/eda/trigger1.handler",
    });
    fn1.addEventSource(new lambdaEventSources.SqsEventSource(queue.cdk.queue));

    const fn2 = new Function(stack, "fn2", {
        handler: "packages/functions/src/eda/trigger2.handler",
    });
    fn2.addEventSource(new lambdaEventSources.SqsEventSource(queue.cdk.queue));

    stack.addOutputs({
        url: sqsUrl(queue.queueName, app),
    });

    return {queue};
}
