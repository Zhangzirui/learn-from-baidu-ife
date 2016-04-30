/**
 * Created by Administrator on 2015/12/2 0002.
 */

/*function isLeapYear(inputYear){
    if((inputYear % 4 == 0 && inputYear % 100 != 0) || (inputYear % 400 == 0)){
        return true;
    }
}
function getDay(year,month,date){
    var i,days = 0;
    for (i = 1800;i < year;i++){
        if(isLeapYear(i)){
            days += 366;
        }else{
            days += 365;
        }
    }
    for(i = 1;i < month;i++){
        if(i==1 || i==3 || i==5 || i==7 || i==8 || i==10 ){
            days += 31;
        }else if(i==4 || i==6 || i==9 || i==11){
            days += 30;
        }else if(i == 2){
            if(isLeapYear(year)){
                days += 29;
            }else{
                days += 28;
            }
        }
    }
    days += date - 1;
    return days;
}

function countDown(inputYear,inputMonth,inputDate){
    var time = new Date();
    var show = document.getElementsByClassName("show")[0];
    var currentYear = time.getFullYear(),
        currentMonth = time.getMonth() + 1,
        currentDate = time.getDate(),
        currentHour = time.getHours(),
        currentMinute = time.getMinutes(),
        currentSecond = time.getSeconds(),
        days,hours,minutes,seconds;
    //console.log(currentHour+":"+currentMinute+":"+currentSecond);
    days = getDay(inputYear,inputMonth,inputDate) - getDay(currentYear,currentMonth,currentDate) - 1;
    hours = 23 - currentHour;
    minutes = 59 - currentMinute;
    seconds = 60 - currentSecond;
    show.textContent = "距离" + inputYear + "年" + inputMonth + "月" + inputDate + "日还有" + days + "天" + hours
                        + "小时" + minutes + "分" + seconds + "秒";
}

function addEvent(element,event,listener){
    if(element.addEventListener){
        element.addEventListener(event,listener,false);
    }else if(element.attachEvent){
        element.attachEvent("on"+event,listener);
    }else{
        element["on"+event] = listener;
    }
}

function refresh(){
    var inputValue = document.getElementById("input").value;
    if(inputValue == ""){
        return false;
    }else{
        inputValue = inputValue.trim();
        var inputYear = inputValue.slice(0,4);
        var inputMonth = inputValue.slice(5,7);
        var inputDate = inputValue.slice(8,10);
        countDown(inputYear,inputMonth,inputDate);
        }
    setInterval(function(){
        refresh();
    },500);
}

var button = document.getElementsByClassName("button")[0];
addEvent(button,"click",refresh);*/

function countDown(){
    var inputTimeArr = document.getElementById("input").value.trim().split("-");
    inputTimeArr.forEach(function(item,index,array){
        inputTimeArr[index] = parseInt(item,10);
    });
    var futureDate = new Date(inputTimeArr[0],inputTimeArr[1]-1,inputTimeArr[2]);
    setInterval(function(){
        refreshTime(futureDate,inputTimeArr);
    },500);
}
function refreshTime(futureDate,inputTimeArr){
    var show = document.getElementsByClassName("show")[0];
    var days,hours,minutes,seconds;
    var difference = Date.parse(futureDate) - Date.parse(new Date());
    if(difference >= 0){
        difference = difference / 1000;
        days = Math.floor(difference / 86400);
        difference = difference % 86400;
        hours = Math.floor(difference / 3600);
        difference = difference % 3600;
        minutes = Math.floor(difference / 60);
        seconds = difference % 60;
        show.textContent = "距离" + inputTimeArr[0] + "年" + inputTimeArr[1] + "月" + inputTimeArr[2] + "日还有" + days + "天" + hours
        + "小时" + minutes + "分" + seconds + "秒";
    }
}
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
addEvent(button,"click",countDown);
