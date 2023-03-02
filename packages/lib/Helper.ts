import {DynamoDB} from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export function ms() {
    return Number(Date.now().toString());
}

export function s() {
    return Number(Date.now().toString().slice(0, 10));
}

export async function ddbPut(table: string, items: object[]) {

    const groupSize = 25;

    const batchWriteParallel = async (items: object[]) => {
        const promises = [];
        for (let i = 0; i < items.length; i += groupSize) {
            promises.push(dynamoDb.batchWrite({
                RequestItems: {
                    [table]: items.slice(i, i + groupSize)
                },
            }).promise());
        }
        return Promise.all(promises);
    };

    batchWriteParallel(items)
        .then((data) => {
            console.log('batchWriteParallel succeed: ', data);
        })
        .catch((error) => {
            console.error('batchWriteParallel error: ', error);
        });

}

export async function clearDdb(tableName: string) {

    let data = await dynamoDb.scan({
        TableName: tableName,
        ProjectionExpression: '#pk',
        ExpressionAttributeNames: {'#pk': 'id'},
    }).promise();

    const length = data?.Items?.length || 0;

    if (length === 0) {
        return length;
    }

    let items = [];

    for (let i = 0; i < length; i++) {
        const item = data.Items[i];
        items.push({
            DeleteRequest: {
                Key: {
                    id: item.id,
                }
            }
        });
    }

    await ddbPut(tableName, items);

    return length;
}
