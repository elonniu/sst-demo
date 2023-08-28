import {Function, Queue, StackContext} from "sst/constructs";
import {sqsUrl} from "../packages/lib/ResourceUrl";
import * as lambdaEventSources from '@aws-cdk/aws-lambda-event-sources';
import {Duration} from "aws-cdk-lib";
import {lambdaUrl} from "sst-helper";

export function Sqs({stack, app}: StackContext) {

    const queue = new Queue(stack, "Queue");

    const IEventSource = new lambdaEventSources.SqsEventSource(queue.cdk.queue, {
        batchSize: 1,
        maxBatchingWindow: Duration.seconds(5),
        enabled: true,
        reportBatchItemFailures: false
    });

    const fun = new Function(stack, "fn1", {
        handler: "packages/functions/src/eda/trigger1.handler",
        reservedConcurrentExecutions: 1
    });
    fun.addEventSource(IEventSource);

    stack.addOutputs({
        url: sqsUrl(queue.queueName, app),
        fun: lambdaUrl(fun, app),
    });

    return {queue};
}
