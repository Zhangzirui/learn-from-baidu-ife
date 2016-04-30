

/**
 * Created by Administrator on 2015/11/30 0030.
 * 没有引用util.js,想自己用原生js多多练习
 */

/*以checkbox形式输出*/
function print(arr){
    var output = document.getElementById("output");
    output.innerHTML = "";
    arr.forEach(function(item,index,array){
        var label = document.createElement("label"),
            check = document.createElement("input"),
            text = document.createTextNode(item);
        check.setAttribute("type","checkbox");
        label.setAttribute("style","display:block");
        label.appendChild(check);
        label.appendChild(text);
        output.appendChild(label);
    });
}

/*进行错误检测*/
function check(arr){
    var alert = document.getElementsByClassName("alert")[0];
    if(arr.length > 10){
        alert.style.display = "block";
        return false;
    }else{
        alert.style.display = "none";
    }
    return true;
}

/*将输入框中输入的的字符串保存到数组中，并除去空的，重复的*/
function toArray(){
    var string = document.getElementById("input").value;
    string = string.trim();
    var arr = string.split(/,|，|\n| | |;|；/),
        i, j;
    arr = arr.filter(function(item,index,array){
        return (/[^\s*]/.test(item));
    });
    for(i=0;i<arr.length;i++){
        for(j=i+1;j<arr.length;j++){
            if(arr[i] === arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    if(check(arr)){
        print(arr);
    }else{
        alert("请按要求输入！");
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

var button = document.getElementsByClassName("button")[0];
addEvent(button,"click",toArray);



