import {DynamoDB} from "aws-sdk";
import {Table} from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler(event: Object, context: Object) {

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

    try {
        await dynamoDb.update(putParams).promise();
    } catch (e) {

    }

    return {
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            count: count,
        }),
    };
}
