/**
 *
 * 初始化一些实用的工具
 *
 * @file    unit.js
 * @author  Zhangzirui(411489774@qq.com)
 *
 */

define(function(require){

    /**
     * 判断是否为对象
     * @param   {Any}  obj   输入的任意类型
     * @return  {Boolean}   是否为对象
     */
    var isObject = function(obj){
        return Object.prototype.toString.call(obj) == "[object Object]";
    };

    /**
     * 数组去重
     * @param   {Array} arr 输入的数组
     * @return  {Array} 去重后的数组
     */
    var uniqueArr = function(arr){
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
    };

    /**
     * 实现一个简单的jquery
     * @param   {String}    selector    选择器名称
     * @return  {Element}   DOM元素
     */
    var $ = function(selector){
        var patternId = /(^|\W\s+)#.+$/,
            patternClass = /(^|\W\s+)\..+$/,
            patternElement = /(^|\W\s+)\w+$/;
        selector = selector.trim();
        if(patternId.test(selector)){
            return document.getElementById(selector.slice(1));
        }else if(patternClass.test(selector)){
            return document.getElementsByClassName(selector.slice(1))[0];
        }else if(patternElement.test(selector)){
            return document.getElementsByTagName(selector)[0];
        }else{
            return false;
        }
    };

    /**
     * 绑定事件
     * @param   {Element}   element DOM元素
     * @param   {String}    event   事件名称
     * @param   {Function}  listener    绑定的函数
     */
    var addEvent = function(element,event,listener){
        if(element.addEventListener){
            element.addEventListener(event,listener,false);
        }else if(element.attachEvent){
            element.attachEvent("on"+event,listener);
        }else{
            element["on"+event] = listener;
        }
    };

    /**
     * 获取当前事件
     * @param   {String}    event   事件
     * @return  对event对象的引用
     */
    var EventUnit = {
        getEvent: function(event){
            return event ? event : window.event;
        },
        getTarget: function(event){
            return event.target || event.srcElement;
        }
    };

    return{
        isObject: isObject,
        uniqueArr: uniqueArr,
        $: $,
        addEvent: addEvent,
        EventUnit: EventUnit
    }
});


///*判断是否为数组*/
//function isArray(arr){
//    return Object.prototype.toString.call(arr) == "[object Array]";
//}
//
///*判断是否为函数*/
//function isFunction(fn){
//    return Object.prototype.toString.call(fn) == "[object Function]";
//}
//
//
//
//
//
//
///*创建XHR对象*/
//function createXHR(){
//    if(typeof XMLHttpRequest != "undefined"){
//        return new XMLHttpRequest();
//    }else if(typeof ActiveXObject != "undefined"){
//        try{
//            return new ActiveXObject("MSXML2.XMLHttp");
//        }catch(e){
//            try{
//                return new ActiveXObject("Microsoft.XMLHttp")
//            }catch(e){}
//        }
//    }else{
//        throw new Error("No XHR object available")
//    }
//}

///*ajax请求*/
//function ajax(that){
//    var xhr = createXHR();
//    var keyword = that.value.trim();
//
//    xhr.open("GET","search/reminder?keyword=" + encodeURIComponent(keyword),true);
//    xhr.onreadystatechange = function(){
//        if (xhr.readyState == 4){
//            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
//                handleResult(xhr.responseText);
//            }else{
//                alert("Request was unsuccessful:" + xhr.status);
//            }
//        }
//    };
//    xhr.send();
//}


