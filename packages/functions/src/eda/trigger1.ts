export async function handler(event: any, context: any) {

    const {Records} = event;

    for (const record of Records) {
        console.log(record.body);
    }

    return {};
}
