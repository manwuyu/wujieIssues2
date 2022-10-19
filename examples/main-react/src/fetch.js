// 携带登录态credentials必须为include

const filterUrl = ['baidu.com', 'bdimg.com', 'cloudhw.cn'];
export default function fetch(url, options) {
    if (!url) {
        return new Promise((resolve) => {
            resolve();
        });
    }
    if (filterUrl.filter(item=> url.includes(item)).length>0) {

        return window.fetch(url, { ...options, credentials: 'omit', mode: 'no-cors', headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }});
    } else {
        return window.fetch(url, { ...options, credentials: 'omit', mode: 'cors' });
    }
}
