import {v4 as uuidv4} from "uuid";
import {Table} from "sst/node/table";
import {param, response} from "../../lib/Api";
import {ddbPut, ms} from "../../lib/Helper";
import {ApiHandler} from "sst/node/api";
import console from "console";

export const handler = ApiHandler(async (event) => {

    console.log(JSON.stringify(event, null, "  "));

    const batch = param(event.queryStringParameters?.batch, 'batch', 100);
    const client = param(event.queryStringParameters?.client, 'client');
    const request_at_ms = param(event.queryStringParameters?.request_at_ms, 'request_at_ms', ms());

    const start = Date.now();
    const uuid = uuidv4().toString();

    let items = [];
    for (let i = 0; i < batch; i++) {
        items.push({
            PutRequest: {
                Item: {
                    id: `${uuid}-${i}`,
                    put_at_ms: ms(),
                    client: client,
                    request_at_ms: Number(request_at_ms),
                }
            }
        });
    }

    await ddbPut(Table.ddb.tableName, items);

    const end = Date.now();

    return response({
        ms: Number(end.toString()) - Number(start.toString()),
        batch: batch
    });
});
