/**
 * Created by Administrator on 2015/12/13 0013.
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

// 事件代理
function delegateEvent(element,tag,eventName,listener){
    addEvent(element,eventName,function(event){
        var e = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(e);
        if(target.tagName.toLowerCase() == tag){
            listener();
        }
    })
}

//函数加载
function addLoadEvent(func){
    var oldonload = window.load;
    if( typeof oldonload != 'function'){
        window.onload = func;
    }else{
        window.onload = function(){
            oldonload();
            func();
        }
    }
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(elememt){
    var scrollLeft,scrollTop;
    var absoluteLeft = elememt.offsetLeft,
        absoluteTop = elememt.offsetTop;
    var current = elememt.offsetParent;
    while(current !== null){
        absoluteLeft = absoluteLeft + current.offsetLeft;
        absoluteTop = absoluteTop + current.offsetTop;
        current = current.offsetParent;
    }
    if(document.compatMode == "BackCompat"){
        scrollLeft = document.body.scrollLeft;
        scrollTop = document.body.scrollTop;
    }else{
        scrollLeft = document.documentElement.scrollLeft;
        scrollTop = document.documentElement.scrollTop;
    }
    return{
        left: absoluteLeft - scrollLeft,
        top: absoluteTop - scrollTop
    }
}

/*获取事件event，target,以及鼠标按键*/
var EventUtil = {
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    getButton: function(event){
        if(document.implementation.hasFeature("MouseEvents","2.0")){
            return event.button;
        }else{
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    }
};


////////////////////////////////////////////////////
/*  以上函数及对象是为了后面所需要的一些简单框架  */
/*                                                */
/*              下面为拖拽效果实现                */
////////////////////////////////////////////////////


/*刷新屏幕*/
function unitUl(begin,ul){
    var len;
    if(begin){
        len = 5;
        begin = false;
    }else{
        len = ul.children.length;
    }
    var list = [];
    for(var i = 0;i < len; i++){
        list.push("<li" + " " + "class=" + i + " " + "style=top:" + i*60 + "px" + ">" + "</li>");
    }
    ul.innerHTML = list.join("");
}

/*拖拽效果*/
function drag(event,target){
    var mouseX = event.clientX,
        mouseY = event.clientY,     //鼠标坐标
        outX = getPosition(target).left,
        outY = getPosition(target).top;     //事件对象坐标

    var moveX = mouseX,
        moveY = mouseY,
        isMove = true;      //判断是否开始拖拽

    var parent = target.parentNode,
        otherParent = parent.id.toString() == "array-left" ? $("#array-right") : $("#array-left");

    document.onmousemove = function(event){     //鼠标开始移动
        if(isMove){
            parent.removeChild(target);
            $("#wrap").appendChild(target);
        }
        isMove = false;
        unitUl(begin,parent);
        target.style.left = outX + event.clientX - mouseX + "px";
        target.style.top  = outY + event.clientY - mouseY + "px";
    };

    document.onmouseup = function(event){       //鼠标抬起
        document.onmousemove = null;
        document.onmouseup = null;
        if(event.clientX > getPosition(otherParent).left && event.clientX < getPosition(otherParent).left + 252 &&
            event.clientY > getPosition(otherParent).top && event.clientY < getPosition(otherParent).top + 500){
            $("#wrap").removeChild(target);
            otherParent.appendChild(target);
        }else if(isMove){
            mouseUp(target);
        }else{
            $("#wrap").removeChild(target);
            parent.appendChild(target);
        }
        unitUl(begin,parent);
        unitUl(begin,otherParent);
        isMove = true;
    };
}

/*鼠标按下*/
function mouseDown(target){
    target.style.opacity = "0.5";
    target.style.transform = "scale(0.95)";
}
/*鼠标抬起*/
function mouseUp(target){
    target.style.opacity = "1";
    target.style.transform = "scale(1)";
}





/*程序开始*/
function start(){
    unitUl(begin,$("#array-left"));

    addEvent($("#array-left"),"mousedown",function(event){       //绑定事件
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if(EventUtil.getButton(event) == 0){
            mouseDown(target);
            drag(event,target);
        }
    });

    addEvent($("#array-right"),"mousedown",function(event){      //绑定事件
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if(EventUtil.getButton(event) == 0){
            mouseDown(target);
            drag(event,target);
        }
    });
}

var begin = true;   /*判断是否第一次刷新屏幕*/
addLoadEvent(start());
begin = false;
