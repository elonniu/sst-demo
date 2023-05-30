import {ApiHandler} from "sst/node/api";
import {Time} from "@my-sst-app/core/time";
import {Table} from "sst/node/table";
import {DynamoDB} from "aws-sdk";
import * as process from "process";

const dynamoDb = new DynamoDB.DocumentClient();

const region = process.env.AWS_REGION;

export const handler = ApiHandler(async (event, context) => {
    console.log(JSON.stringify(event, null, "  "));

    const {apiId} = event.requestContext;
    const apiLog = `https://cn-north-1.console.amazonaws.cn/apigateway/main/api-detail?api=${apiId}&region=cn-north-1`;
    const lambdaLog = `https://${region}.console.amazonaws.cn/cloudwatch/home?region=${region}#logsV2:log-groups/log-group/${fixedPath(context.logGroupName)}/log-events/${fixedPath(context.logStreamName)}`;
    const functionName = `https://cn-north-1.console.amazonaws.cn/lambda/home?region=cn-north-1#/functions/${context.functionName}?tab=code`;

    const getParams = {
        // Get the table name from the environment variable
        TableName: Table.Counter.tableName,
        // Get the row where the counter is called "clicks"
        Key: {
            counter: "clicks",
        },
    };
    const results = await dynamoDb.get(getParams).promise();

    // If there is a row, then get the value of the
    // column called "tally"
    let count = results.Item ? results.Item.tally : 0;

    return {
        // apiLog,
        // lambdaLog,
        // functionName,
        // count,
        // env: process.env,
        // event,
        // context,
        body: `Hello world. The time is ${Time.now()}`,
    };
});

function fixedPath(path: string) {
    return path.replaceAll('/', '$252F');
}

