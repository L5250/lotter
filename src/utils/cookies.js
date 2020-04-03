let Cookie = {
    addCookie(objName, objValue, objHours) {
    //添加cookie
    let str = objName + '=' + escape(objValue);
    
    if (objHours > 0) {
    //为0时不设定过期时间，浏览器关闭时cookie自动消失
    let date = new Date();
    let ms = objHours * 1000 * 60;
    
    date.setTime(date.getTime() + ms);
    str += '; expires=' + date.toGMTString();
    }
    document.cookie = str;
    console.log('添加cookie成功');
    },
    
    getCookie(objName) {
    //获取指定名称的cookie的值
    let arrStr = document.cookie.split('; ');
    
    for (let i = 0; i < arrStr.length; i++) {
    let temp = arrStr[i].split('=');
    
    if (temp[0] === objName) return unescape(temp[1]);
    }
    },
    
    delCookie(name) {
    //为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
    let date = new Date();
    
    date.setTime(date.getTime() - 10000);
    document.cookie = name + '=a; expires=' + date.toGMTString();
    },
    
    allCookie() {
    //读取所有保存的cookie字符串
    let str = document.cookie;
    
    if (str === '') {
    str = '没有保存任何cookie';
    }
    console.log(str);
    }
    };
    
    export { Cookie };