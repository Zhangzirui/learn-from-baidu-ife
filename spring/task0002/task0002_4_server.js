/**
 * Created by Administrator on 2015/12/10.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

var TEST_DATA = ['c#从入门到精通', 'c++ primer', 'Object c语言基础', 'HTML5 and CSS3', 'canvas api', 'android体系结构', 'Bootstrap 精讲', 'Javascript高级编程', 'Java Web开发', 'Express框架指南','Test123','TestTestTest'];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname)));

app.use('/search',function(req,res){
    var keyword = req.query.keyword;
    if(!keyword){
        keyword = req.body.keyword;
    }
    var responseTestList = select(keyword);

    setTimeout(function(){
        res.json(responseTestList)
    },500);
});

function select(keyword){
    var ret = [];
    if(keyword){
        keyword = keyword.toLocaleLowerCase();
        for(var i = 0,len = TEST_DATA.length;i < len;++i){
            if(TEST_DATA[i].toLocaleLowerCase().indexOf(keyword) == 0){
                ret.push(TEST_DATA[i]);
            }
        }
    }
    return ret;
}

var default_port = 80;
app.listen(default_port);
console.log("port：%d , 开始监听...",default_port);