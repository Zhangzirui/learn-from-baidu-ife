/**
 * Created by Administrator on 2015/12/5 0005.
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

/*函数加载*/
function addLoadEvent(func){
    var oldonload = window.load;
    if(typeof oldonload != 'function'){
        window.onload = func
    }else{
        window.onload = function(){
            oldonload();
            func();
        }
    }
}

/*轮播图实现*/
function carousel(){
    var select = $(".carousel-indicator")[0].getElementsByTagName("li");
    var item = $(".item");
    var index = 0;
    var timer = null;
    for(var i = 0;i<select.length;i++){
        select[i].id = i;
        addEvent(select[i],"mouseover",function(){
            index = this.id;
            clearInterval(timer);
            carouselChange();
        });
        addEvent(select[i],"mouseout",function(){
            timer = setInterval(autoPlay,2000);
        })
    }
    if(timer){
        clearInterval(timer);
        timer = null;
    }
    timer = setInterval(autoPlay,2000);
    function autoPlay(){
        if(++index == select.length){
            index = 0;
        }
        carouselChange();
    }
    function carouselChange(){
        if(select.length != item.length){
            return false;
        }
        for(var j = 0;j<select.length;j++){
            select[j].removeAttribute("class");
            item[j].setAttribute("style","display:none");
        }
        select[index].setAttribute("class","active");
        item[index].setAttribute("style","display:block");
    }
}

addLoadEvent(carousel);
