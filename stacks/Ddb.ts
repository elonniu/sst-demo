import {StackContext, Table} from "sst/constructs";
import {StartingPosition} from "aws-cdk-lib/aws-lambda";

export function Ddb({stack, app}: StackContext) {

    let consumers = {};
    for (let i = 1; i < 30; i++) {
        consumers[`consumer${i}`] = {
            cdk: {
                eventSource: {
                    retryAttempts: 0,
                    startingPosition: StartingPosition.LATEST,
                },
            },
            function: "packages/functions/src/ddb_trigger.handler",
        };
    }

    const table = new Table(stack, "Counter", {
        fields: {
            counter: "string",
        },
        primaryIndex: {partitionKey: "counter"},
        stream: "new_and_old_images",
        consumers: consumers,
    });

    return {table};
}
