import {StackContext, Topic, use} from "sst/constructs";
import {topicUrl} from "sst-helper";
import {Sqs} from "./Sqs";
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
export function Sns({stack, app}: StackContext) {

    const {queue} = use(Sqs);

    const topic = new Topic(stack, "Topic", {
        subscribers: {
            subscriber1: {
                function: {
                    handler: "packages/functions/src/eda/trigger1.handler",
                }
            },
            subscriber2: {
                function: {
                    handler: "packages/functions/src/eda/trigger2.handler",
                }
            },
        }
    });

    // topic.cdk.topic.addSubscription(new subscriptions.SqsSubscription(queue.cdk.queue));

    stack.addOutputs({
        url: topicUrl(topic, app),
    });

    return {topic};
}
