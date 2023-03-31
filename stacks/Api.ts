import {Api as ApiV2, Function, StackContext, use} from "sst/constructs";
import {env} from "process";
import {Ddb} from "./Ddb";

export function Api({stack, app}: StackContext) {

    env.HOSTED_ZONE = app.region.startsWith('cn')
        ? 'elonniu.cn'
        : 'elonniu.com';

    const domainName = `${app.stage}.api.demo.serverless.${app.region}.${env.HOSTED_ZONE}`;
    // us: dev.api.demo.serverless.us-west-2.elonniu.com
    // cn: dev.api.demo.serverless.cn-north-1.elonniu.cn

    const {table} = use(Ddb);

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
            "ANY /counter": "packages/functions/src/counter/get.handler",
            "POST /counter": {
                cdk: {
                    function: clickFunction
                }
            },
        },
    });

    stack.addOutputs({
        url: api.customDomainUrl || "",
    });

    return api;
}
