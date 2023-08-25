import {Api as ApiV2, Function, StackContext, use} from "sst/constructs";
import {env} from "process";
import {Ddb} from "./Ddb";
import {Sqs} from "./Sqs";
import {Sns} from "./Sns";
import {apiUrl} from "sst-helper";

export function Api({stack, app}: StackContext) {

    env.HOSTED_ZONE = app.region.startsWith('cn')
        ? 'elonniu.cn'
        : 'elonniu.com';

    const domainName = `${app.stage}.api.demo.serverless.${env.HOSTED_ZONE}`;
    // us: dev.api.demo.serverless.elonniu.com
    // cn: dev.api.demo.serverless.elonniu.cn

    const {table} = use(Ddb);
    const {queue} = use(Sqs);
    const {topic} = use(Sns);

    const clickFunction = new Function(
        stack, 'ClickFunction',
        {
            bind: [table],
            handler: "packages/functions/src/counter/click.handler",
            memorySize: 4028,
            architecture: "arm_64",
            timeout: 2,
            reservedConcurrentExecutions: 2,
        });

    const api = new ApiV2(stack, "Api", {
        cors: {
            allowMethods: ["ANY"],
        },
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
                bind: [table, queue, topic]
            },
        },
        routes: {
            "GET /": {
                function: {
                    handler: "packages/functions/src/lambda.handler",
                    tracing: "active",
                }
            },
            "ANY /counter": "packages/functions/src/counter/get.handler",
            "POST /counter": {
                cdk: {
                    function: clickFunction
                }
            },
            "GET /golang": {
                function: {
                    handler: "resources/golang/main.go",
                    runtime: "go1.x",
                    architecture: "x86_64",
                }
            },
            // "GET /python": {
            //     function: {
            //         handler: "resources/python/lambda.handler",
            //         runtime: "python3.11",
            //     }
            // },
            "GET /proxy": {
                type: "url",
                url: "https://www.aws.com",
            },
            "GET /sqs": "packages/functions/src/sqs.handler",
            "GET /sns": "packages/functions/src/sns.handler",
        },
    });

    stack.addOutputs({
        nodeJs: api.customDomainUrl || "",
        golang: `${api.customDomainUrl}golang`,
        python: `${api.customDomainUrl}python`,
        proxy: `${api.customDomainUrl}proxy`,
        api: apiUrl(api, stack)
    });

    return api;
}
