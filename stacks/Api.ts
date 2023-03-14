import {Api as ApiV2, Function, StackContext, Table} from "sst/constructs";
import {env} from "process";
import {StartingPosition} from "aws-cdk-lib/aws-lambda";

export function Api({stack, app}: StackContext) {

    env.HOSTED_ZONE = app.region.startsWith('cn')
        ? 'elonniu.cn'
        : 'elonniu.com';

    const domainName = `${app.stage}.api.demo.serverless.${app.region}.${env.HOSTED_ZONE}`;
    // us: dev.api.demo.serverless.us-west-2.elonniu.com
    // cn: dev.api.demo.serverless.cn-north-1.elonniu.cn

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

    const clickFunction = new Function(
        stack, 'ClickFunction',
        {
            bind: [table],
            runtime: 'nodejs16.x',
            handler: "packages/functions/src/counter/click.handler",
            memorySize: 4028,
            architecture: "arm_64",
            timeout: 2,
            reservedConcurrentExecutions: 2,
        });

    const api = new ApiV2(stack, "Api", {
        customDomain: {
            domainName,
            hostedZone: env.HOSTED_ZONE,
            path: "v1"
        },
        defaults: {
            throttle: {
                rate: 10,
                burst: 5,
            },
            function: {
                bind: [table],
            },
        },
        routes: {
            "GET /": "packages/functions/src/lambda.handler",

            "POST /counter": {
                cdk: {
                    function: clickFunction
                }
            },
            "ANY /counter": "packages/functions/src/counter/get.handler",
        },
    });

    stack.addOutputs({
        url: api.customDomainUrl || "",
    });

    return api;
}
