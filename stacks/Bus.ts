import {EventBus, StackContext} from "sst/constructs";
import * as events from "aws-cdk-lib/aws-events";

export function Bus({stack, app}: StackContext) {

    const bus = new EventBus(stack, "EventBus", {
        cdk: {
            eventBus: events.EventBus.fromEventBusName(
                stack, "ImportedBus", "default"
            ),
        },
        rules: {
            // cloudformation: {
            //     pattern: {
            //         source: ["aws.cloudformation"],
            //         detailType: ["CloudFormation Stack Status Change"],
            //     },
            //     targets: {
            //         myTarget1: "functions/eda/event_cloudformation.handler",
            //     },
            // },
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


    return {bus};
}
