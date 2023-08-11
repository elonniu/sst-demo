import {StackContext, Table} from "sst/constructs";
import {StartingPosition} from "aws-cdk-lib/aws-lambda";
import {ddbUrl} from "../packages/lib/ResourceUrl";

export function Ddb({stack, app}: StackContext) {

    const table = new Table(stack, "Counter", {
        fields: {
            counter: "string",
        },
        primaryIndex: {partitionKey: "counter"},
        stream: "new_and_old_images",
        consumers: {
            consumer1: {
                cdk: {
                    eventSource: {
                        retryAttempts: 0,
                        startingPosition: StartingPosition.LATEST,
                    },
                },
                function: "packages/functions/src/eda/ddb_trigger.handler",
            }
        },
    });

    stack.addOutputs({
        url: ddbUrl(table.tableName, app),
    });

    return {table};
}
