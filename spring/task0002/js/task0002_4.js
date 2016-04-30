/**
 * Created by Administrator on 2015/12/9.
 */

/*简易的query，获取对象*/
function $(selector){
    var patternId = /(^|\W\s+)#.+$/,
        patternClass = /(^|\W\s+)\..+$/,
        patternEle = /(^|\W\s+)\w+$/;
    if(patternId.test(selector)){
        return document.getElementById(selector.slice(1));
    }else if(patternClass.test(selector)){
        return document.getElementsByClassName(selector.slice(1));
    }else if(patternEle.test(selector)){
        return document.getElementsByTagName(selector);
    }
}

/*事件绑定*/
function addEvent(element,event,listener){
    if(element.addEventListener){
        element.addEventListener(event,listener,false);
    }else if(element.attachEvent){
        element.attachEvent("on"+event,listener);
    }else{
        element["on"+event] = listener;
    }
}

/*获取事件对象*/
var EventUtil = {
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    }
};

/*创建XHR对象*/
function createXHR(){
    if(typeof XMLHttpRequest != "undefined"){
        return new XMLHttpRequest();
    }else if(typeof ActiveXObject != "undefined"){
        try{
            return new ActiveXObject("MSXML2.XMLHttp");
        }catch(e){
            try{
                return new ActiveXObject("Microsoft.XMLHttp")
            }catch(e){}
        }
    }else{
        throw new Error("No XHR object avaliable")
    }
}

/*ajax请求*/
function ajax(that){
    var xhr = createXHR();
    var keyword = that.value.trim();

    xhr.open("GET","search/reminder?keyword=" + encodeURIComponent(keyword),true);
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                handleResult(xhr.responseText);
            }else{
                alert("Request was unsuccessful:" + xhr.status);
            }
        }
    };
    xhr.send();
}

/*处理返回文本信息*/
function handleResult(responseText){
    var ret = JSON.parse(responseText),
        reminder = $("#reminder");
    if(ret.length){
        var list = [];
        for(var i = 0,len = ret.length;i < len;i++){
            list.push("<li" + " " + "id=" + i + ">" + ret[i] + "</li>");
        }
        reminder.innerHTML = list.join("");
        reminder.style.display = "block";
    }else{
        reminder.innerHTML = "";
        reminder.style.display = "none";
    }
    reminderLen =ret.length;
}

/*键盘上，下，回车键*/
function arrowUp(){
    if(index == -1 || index == 0){

    }else if(index>0){
        for(var i = 0;i < reminderLen;i++){
            $("#" + i.toString()).style.backgroundColor = "white";
        }
        index--;
        $("#" + index.toString()).style.backgroundColor = "#999999";
    }
}
function arrowDown(){
    index++;
    if(index < reminderLen){
        for(var i = 0;i < reminderLen;i++){
            $("#" + i.toString()).style.backgroundColor = "white";
        }
        $("#" + index.toString()).style.backgroundColor = "#999999";

    }else if(index == reminderLen){
        index--;
    }
}
function enter(){
    $("#search").value = $("#" + index.toString()).textContent;
    $("#reminder").style.display = "none";
    index = -1;
}


addEvent($("#search"),"keyup",function(event){
    var that = this;
    event = EventUtil.getEvent(event);
    var value = event.keyCode;
    if(value != 13 && value != 38 && value != 40){
        ajax(that);
    }else if(value == 38){
        arrowUp();
    }else if(value == 40){
        arrowDown();
    }else if(value == 13){
        enter();
    }
});
addEvent($("#reminder"),"click",function(event){
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);
    $("#search").value = target.innerHTML;
    this.style.display = "none";
    index = -1;
});
addEvent($("#reminder"),"mouseover",function(){
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);
    index = target.id;
    for(var i = 0;i < reminderLen;i++){
        $("#" + i.toString()).style.backgroundColor = "white";
    }
    $("#" + index.toString()).style.backgroundColor = "#999999";
});

var index = -1;
var reminderLen = 0; //li的长度