/**
 * Created by Administrator on 2015/11/14 0014.
 */

/*判断是否为数组*/
function isArray(arr){
    return Object.prototype.toString.call(arr) == "[object Array]";
}

/*判断是否为函数*/
function isFunction(fn){
    return Object.prototype.toString.call(fn) == "[object Function]";
}

/*判断是否为对象*/
function isObject(ob){
    return Object.prototype.toString.call(ob) == "[object Object]";
}

/*将对象深度克隆*/
function cloneObject(src) {
    if(isArray(src)|| isObject(src)){
        var buf = isArray(src) ? [] : {};
        for(var k in src)
            buf[k] = isObject(src) ? cloneObject(src[k]) : src[k];
        return buf;
    }else{
        return src;
    }
}

/*将数组去重*/
function uniqArray(arr){
    var i,j;
    for(i = 0;i<arr.length;i++){
        for(j =i+1;j<arr.length;j++){
            if(arr[i] === arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}

/*简单实现字符串两端去空格功能*/
function simpleTrim(str){
    var arr = str.split('');
   for(var i = 0;i<arr.length;i++) {
        if(arr[i] == " " || arr[i] =="   " || arr[i] == " "){
            arr.shift();
            i--;
        }else{
            break;
        }
   }
   for(var j = arr.length-1;j>=0;j--){
        if(arr[j] == " " || arr[j] =="   " || arr[j] == " "){
            arr.pop();
        }else{
            break;
        }
   }
    str = arr.join('');
    return str;
}

/*用正则表达式实现字符串两端去空格功能*/
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
}

/*遍历数组每个元素，然后运行给定函数*/
function each(arr,fn){
    var index,item;
    for(index=0;index<arr.length;index++){
        item = arr[index];
        fn(item,index);
    }
}

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj){
    var i=0;
    for(var k in obj){
        i++;
    }
    return i;
}

// 判断是否为邮箱地址
function isEmail(emailStr){
    var pattern = /^\w+@\w+\.com$/;
    return (pattern.test(emailStr));
}

// 判断是否为手机号
function isMobilePhone(phone){
    var pattern = /^\d{11}$/;
    return (pattern.test(phone));
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element,newClassName){
    element.className += " " + newClassName;
}

// 移除element中的样式oldClassName
function removeClass(element,oldClassName){
    element.className = element.className.replace(oldClassName,"");
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element,siblingNode){
    return(element.parentNode === siblingNode.parentNode);
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element){
    var scrollLeft,scrollTop;
    var absoluteLeft = element.offsetLeft;
    var absoluteTop = element.offsetHeight;
    var current = element.offsetParent;
    while( current !== null){
        absoluteLeft += current.offsetLeft;
        absoluteTop += current.offsetHeight;
        current = current.offsetParent;
    }
    if(document.compatMode == "BackCompat"){
        scrollLeft = document.body.scrollLeft;
        scrollTop = document.body.scrollHeight;
    }else{
        scrollLeft = document.documentElement.scrollLeft;
        scrollTop = document.documentElement.scrollHeight;
    }
    return{
        left : absoluteLeft-scrollLeft,
        top : absoluteTop-scrollTop
    }
}

// 实现一个简单的Query
function $(selector){
    var pattern1 = /(^|\W\s+)#\w+$/,
        pattern2 = /(^|\s+)\w+$/,
        pattern3 = /(^|\W\s+)\.\w+$/,
        pattern4 = /\[.+\]/,
        pattern5 = /(^|\s+)#\w+(\s+.+)+/;
    selector = trim(selector);
    if(pattern1.test(selector)){        // 可以通过id获取DOM对象
        return document.getElementById(selector.slice(1));
    }
    if(pattern2.test(selector)){        // 可以通过tagName获取DOM对象
        return document.getElementsByTagName(selector)[0];
    }
    if(pattern3.test(selector)){        // 可以通过样式名称获取DOM对象
        return document.getElementsByClassName(selector.slice(1))[0];
    }
    if(pattern4.test(selector)){        // 可以通过attribute匹配获取DOM对象
        var tagNameList = document.getElementsByTagName("*");
        var selectorName,
            selectorValue,
            NO_equal = true;
        if(selector.indexOf("=") > -1){
            var n =selector.indexOf("=");
            selectorName = trim(selector.slice(1,n));
            selectorValue = trim(selector.slice(n+1,selector.length-1));
            NO_equal = false;
        }else{
            selectorName = selector.slice(1,selector.length-1);
        }
        for(var i=0;i<tagNameList.length;i++){
            if(NO_equal && tagNameList[i].getAttribute(selectorName)){
                return tagNameList[i];
            }else if((!NO_equal) && tagNameList[i].getAttribute(selectorName) == selectorValue){
                return tagNameList[i];
            }
        }
    }
    if(pattern5.test(selector)){        // 可以通过简单的组合提高查询便利性，
        var n  = selector.indexOf(" ");
        var n1 = selector.indexOf(".");
        var idSel = selector.slice(0,n);
        var classSel = selector.slice(n1+1);
        return $(idSel).getElementsByClassName(classSel)[0];
    }
}

// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element,event,listener){
    if(element.addEventListener){
        element.addEventListener(event,listener,false);
    }else if(element.attachEvent){
        element.attachEvent("on" + event,listener);
    }else{
        element["on" + event] = listener;
    }
}

// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element,event,listener){
    if(element.removeEventListener){
        element.removeEventListener(event,listener,false);
    }else if(element.detachEvent){
        element.detachEvent("on" + event,listener);
    }else{
        element["on" + event] = null;
    }
}

// 获得事件对象，不属于要求完成的方法之中
function getEvent(event){
    return event ? event : window.event;
}
// 获得事件对象的真正目标，不属于要求完成的方法之中
function getTarget(event){
    return event.target ? event.target : event.srcElement;
}

// 实现对click事件的绑定
function addClickEvent(element,listener){
    addEvent(element,"click",listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element,listener){
    element.onkeydown = function(event){
        var e = getEvent(event);
        if(e && e.keyCode == 13){
            listener();
        }
    }
}

$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;

// 事件代理
function delegateEvent(element,tag,eventName,listener){
    $.on(element,eventName,function(event){
        var e = getEvent(event);
        var target = getTarget(e);
        if(target.tagName.toLowerCase() == tag){
            listener();
        }
    })
}

// 判断是否为IE浏览器，返回-1或者版本号
function isIE(){
    if(!!window.ActiveXObject || "ActiveXObject" in window){
        return navigator.userAgent.slice(8,11);
    }else{
        return -1;
    }
}

// 设置cookie
function setCookie(cookieName,cookieValue,expiredays){
    var cookieText = encodeURIComponent(cookieName) + "=" + encodeURIComponent(cookieValue);
    if(expiredays instanceof Date){
        cookieText += ";expire=" + expiredays;
    }
    document.cookie = cookieText;
}

// 获取cookie值
function getCookie(cookieName){
    var cookieName = encodeURIComponent(cookieName) + "=",
        cookieStart = document.cookie.indexOf(cookieName),
        cookieValue = null;
    if(cookieStart > -1){
        var cookieEnd = document.cookie.indexOf(";",cookieStart);
        if(cookieEnd == -1){
            cookieEnd = document.cookie.length;
        }
        cookieValue  = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length,cookieEnd));
    }
    return cookieValue;
}





























































