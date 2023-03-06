import {Api as ApiV2, StackContext, Table} from "sst/constructs";
import {env} from "process";
import {StartingPosition} from "aws-cdk-lib/aws-lambda";

export function Api({stack, app}: StackContext) {

    env.HOSTED_ZONE = app.region.startsWith('cn')
        ? 'elonniu.cn'
        : 'elonniu.com';

    const domainName = `${app.stage}.api.demo.serverless.${app.region}.${env.HOSTED_ZONE}`;

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
                function: "packages/functions/src/ddb_trigger.handler",
            },
        },
    });

    const api = new ApiV2(stack, "Api", {
        customDomain: {
            domainName,
            hostedZone: env.HOSTED_ZONE,
            path: "v1"
        },
        defaults: {
            function: {
                bind: [table],
            },
        },
        routes: {
            "GET /": "packages/functions/src/lambda.handler",

            "POST /counter": "packages/functions/src/counter/click.handler",
            "ANY /counter": "packages/functions/src/counter/get.handler",
        },
    });

    stack.addOutputs({
        url: api.customDomainUrl || "",
    });

    return api;
}
