const getUrl = (path) => {
    const isCn = +localStorage.getItem("isCn");

    if (window.location.host.indexOf('localhost') > -1) {
        return `https://prod.api.demo.serverless.cn-northwest-1.elonniu.cn/v1/${path}`;
    }

    if (isCn) {
        return `https://prod.api.demo.serverless.cn-northwest-1.elonniu.cn/v1/${path}`;
    }

    return `https://prod.api.demo.serverless.ap-southeast-1.elonniu.com/v1/${path}`;
};

export const counterApi = () => {
    return fetch(getUrl("counter"), {
        method: "POST",
    }).then((response) => response.json());
};

export const getCounterApi = () => {
    return fetch(getUrl("counter"), {
        method: "GET",
    }).then((response) => response.json());
};

export const regionsApi = () => {
    return fetch(getUrl("regions")).then((response) => response.json());
};
