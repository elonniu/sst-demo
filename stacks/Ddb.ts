import {StackContext, Table} from "sst/constructs";
import {StartingPosition} from "aws-cdk-lib/aws-lambda";
import {ddbUrl} from "../packages/lib/ResourceUrl";

export function Ddb({stack, app}: StackContext) {

    let consumers = {};
    for (let i = 1; i <= 40; i++) {
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

    stack.addOutputs({
        url: ddbUrl(table.tableName, app),
    });

    return {table};
}
