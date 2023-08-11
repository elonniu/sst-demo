import {Api, Config, Function, StackContext, Topic} from "sst/constructs";
import {lambdaUrl} from "../packages/lib/ResourceUrl";

export function Conf({stack, app}: StackContext) {

    new Config.Secret(stack, 'Config');

    const topic = new Topic(stack, "USER_UPDATED");

    const conf = new Config.Parameter(stack, "USER_UPDATED_TOPIC_NAME", {
        value: topic.topicName,
    });

    // npx sst secrets set STRIPE_KEY sk_test_abc123
    const STRIPE_KEY = new Config.Secret(stack, "STRIPE_KEY");

    const apiFunction = new Function(
        stack, 'ConfigFunction',
        {
            bind: [conf, STRIPE_KEY],
            functionName: `${app.stage}-${app.name}-conf-api`,
            runtime: 'nodejs18.x',
            handler: "packages/functions/src/conf.handler",
        });

    const api = new Api(stack, "config-api", {
        routes: {
            "GET /": {
                cdk: {
                    function: apiFunction
                }
            }
        },
    });

    api.bind([STRIPE_KEY]);

    stack.addOutputs({
        url: api.url,
        lambda: lambdaUrl(apiFunction, app),
    });

    return {api};
}


