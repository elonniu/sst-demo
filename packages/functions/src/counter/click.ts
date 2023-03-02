import {DynamoDB} from "aws-sdk";
import {Table} from "sst/node/table";
import {APIGatewayProxyHandlerV2} from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

    const getParams = {
        TableName: Table.Counter.tableName,
        Key: {
            counter: "clicks",
        },
    };

    const results = await dynamoDb.get(getParams).promise();

    let count = results.Item ? results.Item.tally : 0;

    const putParams = {
        TableName: Table.Counter.tableName,
        Key: {
            counter: "clicks",
        },
        UpdateExpression: "SET tally = :count",
        ExpressionAttributeValues: {
            ":count": ++count,
        },
    };

    await dynamoDb.update(putParams).promise();

    return {
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            count: count,
        }),
    };
}
