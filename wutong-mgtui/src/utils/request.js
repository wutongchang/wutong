import axios from 'axios';
import { saveAs } from 'file-saver'
import {
    isStringEmpty,
    isObjectEmpty,
    isBusinessError,
    error,
    showLoading,
    hideLoading,
} from "./index"

export const prefix = "api";

export function getAxiosParam(config) {
    if (isStringEmpty(config.url)) {
        let msg = "没有接口地址";
        error(msg);
        reject(msg);
        return;
    }
    let parameter = {
        url: config.url,
        method: "get",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        timeout: 60000
    };

    if (!isStringEmpty(config.method)) {
        parameter.method = config.method;
    }
    if (!isObjectEmpty(config.param)) {
        if (config.method == "get") {
            parameter.params = config.param;
        } else {
            parameter.data = JSON.stringify(config.param); // 仅适用 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法
        }
    }
    if (!isStringEmpty(config.token)) {
        parameter.headers.Authorization = "Bearer " + config.token
    }
    return parameter;
}
export function wuaxios(url, method, param, token) {
    return new Promise(function (resolve, reject) {
        url = `/${prefix}/${url}/`;
        let config = getAxiosParam({ url, method, param, token });
        showLoading();
        axios(config)
            .then(function (response) {
                hideLoading();
                let data = response.data;
                if (isBusinessError(data)) {
                    reject(data.message);
                } else {
                    resolve(data.data);
                }
            })
            .catch(function (err) {
                hideLoading();
                error(err);
                reject(err);
            });
    });
}

/**
 * 此种方式的优点是支持多文件下载、post下载、自定义文件名称，流程是向后端发送post请求，后端返回文件流，前端将文件流转成下载链接
 * @param {下载地址} url 
 * @param {参数对象} params 
 */
export function download(url, params, token) {
    return new Promise(function (resolve, reject) {
        let config = getAxiosParam({ url: url, params: params, token: token, method: "post" });
        config.responseType = "blob";
        showLoading("正在下载数据，请稍候");
        axios(config)
            .then(function (response) {
                hideLoading();
                let content = res.headers['content-disposition'];
                let mime= res.headers['content-type'];
                let name = content && content.split(';')[1].split('filename=')[1];
                let fileName = decodeURIComponent(name);               
                let data = response.data;
                let blob = new Blob([data],{type: mime })
                saveAs(blob,fileName);
                resolve(fileName);
            })
            .catch(function (err) {
                hideLoading();
                error('下载文件出现错误，请联系管理员！');
                reject(err);
            });
    });
}