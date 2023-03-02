import {Api as ApiV2, StackContext, Table} from "sst/constructs";
import {App} from "sst/constructs/App";
import {env} from "process";
import {Stack} from "sst/constructs/Stack";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import {EndpointType, HttpIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {StartingPosition} from "aws-cdk-lib/aws-lambda";

export function Api({stack, app}: StackContext) {

    env.HOSTED_ZONE = app.region.startsWith('cn')
        ? 'elonniu.cn'
        : 'elonniu.com';

    const domainName = `${app.stage}.api.demo.serverless.${app.region}.${env.HOSTED_ZONE}`;

    if (shouldV1Api(app)) {
        return v1(stack, app, domainName);
    }

    return v2(stack, app, domainName);
}

export function v1(stack: Stack, app: App, domainName: string) {
    const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
        domainName: env.HOSTED_ZONE || "",
    });

    const certificate = new acm.DnsValidatedCertificate(stack, "Certificate", {
        domainName,
        hostedZone,
    });

    const api = new RestApi(stack, 'Api', {
        domainName: {
            domainName,
            certificate,
            endpointType: EndpointType.REGIONAL,
            basePath: 'v1'
        },
    });

    api.root.addMethod('GET', new HttpIntegration('http://petstore-demo-endpoint.execute-api.com/petstore/pets'));

    new route53.ARecord(stack, "AliasRecord",
        {
            recordName: domainName,
            target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
            zone: hostedZone
        }
    )

    return api;
}

export function v2(stack: Stack, app: App, domainName: string) {

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
        routes: commonRoutes(),
    });

    stack.addOutputs({
        url: api.customDomainUrl || "",
    });

    return api;
}

export function shouldV1Api(app: App) {
    const shouldV1Api = [
        'me-central-1',
        'eu-south-2',
        'eu-central-2',
        'ap-southeast-3',
        'ap-south-2',
        'ap-northeast-3',
    ];

    return shouldV1Api.includes(app.region);
}

export function commonRoutes() {
    return {
        "GET /": "packages/functions/src/lambda.handler",

        "POST /counter": "packages/functions/src/counter/click.handler",
        "ANY /counter": "packages/functions/src/counter/get.handler",
    };
}
