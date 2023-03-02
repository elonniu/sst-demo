export function response(json: Object) {

    return {
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(json),
    };

}
export function param(value: string | undefined | number, key: string, defaultValue: string | number | null = null) {

    if (value) {
        return value;
    }

    if (defaultValue !== null) {
        return defaultValue;
    }

    throw new Error(`${key} can not be empty`)
}
