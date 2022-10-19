
export function showLoading(info) {
    let text = info
    if ((text == null) || (text == "") || (typeof (text) == "undefined")) {
        text = "正在加载系统资源，请耐心等待......";
    }
    ElLoading.service({
        lock: true,
        text: text,
        fullscreen: true,
        background: "rgba(0, 0, 0, 0.7)"
    });
}

export function hideLoading() {
    let load = ElLoading.service({ fullscreen: true });
    load.close();
}

export function success(msg) {
    if ((msg == null) || (msg == "") || (typeof (msg) == "undefined")) {
        msg = "成功";
    }

    ElMessage({ message: msg, type: 'success', showClose: true });
}

export function error(msg) {
    if ((msg == null) || (msg == "") || (typeof (msg) == "undefined")) {
        msg = "操作失败";
    }

    ElMessage({ message: msg, type: 'error', showClose: true });
}

/**
 * 
 *判断业务是否错误
 */
export function isBusinessError(value) {
    if (value.code == 0) {
        return false;
    }
    error(value.message);
    return true;
}

/**
 * 判断是否是空对象
 * @param {对象} obj 
 * @returns Boolean true(空对象)
 */
export function isObjectEmpty(obj) {
    if (obj == null || typeof (obj) == 'undefined' || JSON.stringify(obj) == "{}") {
        return true;
    }
    return false;
}

/**
 * 判断是否是空字符串
 * @param {字符串} str 
 * @returns Boolean true(空字符)
 */
export function isStringEmpty(str) {
    if (str == null || typeof (str) == "undefined" || str == '') {
        return true;
    }
    return false;
}

/**
 * 判断是否是空数组
 * @param {数组} str 
 * @returns Boolean true(空数组)
 */
export function isArrayEmpty(arr) {
    if (arr == null || typeof (arr) == "undefined" || JSON.stringify(arr) == "[]") {
        return true;
    }
    return false;
}




/*
 * 返回将其转换为'yyyy-MM-dd'或'yyyy-MM-dd hh:mm:ss'
 * format缺省'yyyy-MM-dd hh:mm:ss'
 * date缺省当前时间
 */
export function formatDate(date, format) {
    if ((date == null) || (date == "") || (date == undefined)) {
        date = new Date();
    }
    if ((format == null) || (format == "") || (format == undefined)) {
        format = "yyyy-MM-dd hh:mm:ss";
    }
    date = new Date(date);
    const opt = {
        "M+": date.getMonth() + 1, //月 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分钟 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in opt) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? (("000" + opt[k]).substr(("" + opt[k]).length)) : ("00" + opt[k]).substr(("" + opt[k]).length));
        }
    }
    return format;
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        obj[name] = val;
        return rs;
    })
    return obj;
}

/*
 * 下划转驼峰
 */
export function camelCase(str) {
    return str.replace(/_[a-z]/g, str1 => str1.substr(-1).toUpperCase())
}

/**
 * 
 * blob二进制base64
 **/
export function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
        if (isArrayEmpty(blob)) {
            reject({ code: -1, message: "未获取文件流" });
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        }
        reader.onerror = function (e) {
            reject({ code: -1, message: "获取文件blob的base64失败", data: e });
        }
        reader.readAsDataURL(blob);
    });
}

/**
 * 二进制流转文件blob
 * @param {文件字节数组} stream 
 * @param {文件类型 如pdf->type:'application/pdf;chartset=UTF-8'} type 
 * @returns 转换成文件的uri
 */
export function binaryToBlob(stream, type) {
    return new Promise(function (resolve, reject) {
        if (isArrayEmpty(stream)) {
            reject({ code: -1, message: "未获取到文件流" });
            return;
        }
        if (isStringEmpty(type)) {
            reject({ code: -1, message: "未获取文件类型" });
            return;
        }
        let blob = new Blob([stream], { type: type });//手动设置类型样式：如pdf->type:'application/pdf;chartset=UTF-8'        
        let url = window.URL || window.webkitURL;
        let herf = url.createObjectURL(blob);
        if (isStringEmpty(href)) {
            reject({ code: -1, message: "字节流未正确转换文件" });
        } else {
            resolve(herf);
        }
    });
}

export function base64ToBlob(value) {
    return new Promise(function (resolve, reject) {
        if (isArrayEmpty(value)) {
            reject({ code: -1, message: "未获取到文件流" });
            return;
        }
        let mime = value.split(',')[0].split(':')[1].split(';')[0];
        //Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符，回车符给去掉，有时候因为存在需要把加号空格之类的换回来，取决于base64存取时的规则。
        value = value.replace(/[\n\r]/g, "");
        let byteString = window.atob(value);
        let rawLength = byteString.length;
        let intArray = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            intArray[i] = raw.charCodeAt(i);
        }
        let blob = new Blob([uInt8Array], { type: mime });
        if (isObjectEmpty(blob)) {
            reject({ code: -1, message: "转换文件失败" });
        } else {
            resolve(blob);
        }
    });
}