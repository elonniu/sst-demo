import {Api as ApiV2, StackContext, use} from "sst/constructs";
import * as Lambda from "aws-cdk-lib/aws-lambda";
import path from "path";
import {Api} from "./Api";

export function JavaDocker({app, stack}: StackContext) {

    // Configure path to Dockerfile
    const dockerfile = path.resolve("resources/springboot-docker");

    // Create AWS Lambda function and push image to ECR
    const fn = new Lambda.DockerImageFunction(stack, "tcl-function", {
        code: Lambda.DockerImageCode.fromImageAsset(dockerfile),
        currentVersionOptions: {
            provisionedConcurrentExecutions: 1,
        },
        memorySize: 8048,
        environment: {
            RUST_LOG: 'info',
            READINESS_CHECK_PATH: '/healthz',
            REMOVE_BASE_PATH: '/java-docker',
        },
    });

    const version = fn.currentVersion;

    const api: ApiV2 = use(Api)

    api.addRoutes(stack, {
        "ANY /java-docker/{proxy+}": {
            cdk: {
                function: version
            }
        }
    });

    stack.addOutputs({
        url: `${api.customDomainUrl}java-docker/` || "",
        url_pets: `${api.customDomainUrl}java-docker/pets` || "",
    });

    return {api};
}
