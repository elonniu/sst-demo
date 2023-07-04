import {EventBus, StackContext} from "sst/constructs";
import * as events from "aws-cdk-lib/aws-events";
import {busUrl} from "../packages/lib/ResourceUrl";

export function Bus({stack, app}: StackContext) {

    const bus = new EventBus(stack, "EventBus", {
        cdk: {
            eventBus: events.EventBus.fromEventBusName(
                stack, "ImportedBus", "default"
            ),
        },
        rules: {
            s3: {
                pattern: {
                    source: ["aws.s3"],
                    detailType: ["Object Created", "Object Deleted"]
                },
                targets: {
                    function: "packages/functions/src/trigger.handler",
                },
            },
            ec2: {
                pattern: {
                    source: ["aws.ec2"],
                    detailType: ["EC2 Instance State-change Notification"],
                },
                targets: {
                    myTarget1: "packages/functions/src/trigger.handler",
                },
            },
            cloud_trail: {
                pattern: {
                    source: ["aws.cloudtrail"],
                },
                targets: {
                    myTarget1: "packages/functions/src/trigger.handler",
                },
            },
        },
    });

    stack.addOutputs({
        url: busUrl(bus, app),
    });

    return {bus};
}
