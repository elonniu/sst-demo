import {APIGatewayProxyHandlerV2} from "aws-lambda";
import {Table} from "sst/node/table";
import {DynamoDB} from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();
export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
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
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            count,
        }),
    };
}
