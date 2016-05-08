/**
 *
 * AMD indexedDB数据库配置
 *
 * @file    indexedDB.js
 * @author  Zhangzirui(411489774@qq.com)
 *
 */

define(function(require){

    //数据库对象
    window.indexedDB = window.indexedDB || window.webikitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    //数据库事务
    window.IDBTransaction = window.IDBTransaction || window.webikitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
    //数据库查询条件
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;
    //游标
    window.IBDCursor =  window.IBDCursor || window.webkitIBDCursor || window.mozIBDCursor || window.msIBDCursor;

    //定义数据库
    var iDB = {
            name: "webApp-indexedDB",
            version: 1,
            db: null
        };
    var folders = new Array(), //存放对应folder与file的对应关系
        files = new Array();    //存放file与article的对应关系
    files = [{
        id: "file--0",
        title: "使用说明",
        date: "2016-3-28",
        content: "简单的个人任务管理系统\n\n\n左侧为任务分类列表，支持增加分类，删除分类的操作\n中间列为任务列表，点击新增任务按钮，右侧会变成任务编辑页面\n右侧为任务详细描述部分\n\n\n本系统支持离线，使用indexedDB存储任务内容",
        isSave: true,
        fileName: "默认子分类",
        folderName: "默认分类"
    }];
    folders= [{
        id: "folder--0",
        folderName: "默认分类"
    }];

    //定义存储类型的构造函数
    function FileDB(obj){
        this.id = obj.id;
        this.title = obj.title;
        this.date = obj.date;
        this.content = obj.content;
        this.isSave = obj.isSave;
        this.fileName = obj.fileName;
        this.folderName = obj.folderName;
    }
    function FolderDB(id,name){
        this.id = id;
        this.folderName = name;
    }


    /**
     * 打开或建立数据库
     * @param   {string} name   数据库名称
     * @param   {number} version    数据库版本号
     */
     var openIndexedDB = function(name,version){
        if(!window.indexedDB){
            console.log("您的浏览器不支持indexedDB!");
            return false
        }
        var dbConnect = window.indexedDB.open(name,version);
        dbConnect.onsuccess = function(event){
            console.log("数据库链接成功");
            iDB.db = event.target.result;
            if(iDB.db.objectStoreNames.contains("fileStore") && iDB.db.objectStoreNames.contains("folderStore")){
                console.log("正在载入数据...");
                addCursor(iDB.db,"fileStore");
                addCursor(iDB.db,"folderStore");
            }
            //setTimeout(function(){
            //    addData(iDB.db,"fileStore");
            //},200);
        };
        dbConnect.onerror = function(){
            console.log("数据库链接失败")
        };
        dbConnect.onupgradeneeded = function(){
            console.log("Upgrading...");
            var db = event.target.result;
            if(!db.objectStoreNames.contains("fileStore") && !db.objectStoreNames.contains("folderStore")){
                var fileStore = db.createObjectStore("fileStore",{keyPath:"id"}),
                    folderStore = db.createObjectStore("folderStore",{keyPath:"id"});
                fileStore.createIndex("idIndex","id",{unique: true});
                folderStore.createIndex("idIndex","id",{unique: true});
            }
            setTimeout(function(){
                addData(iDB.db,"fileStore",files);
                addData(iDB.db,"folderStore",folders);
            },100);
        };
    };

    /**
     * 添加数据到数据库
     * @param   {object} db   数据库打开建立的对象
     * @param   {string} storeName  目标仓库的名称
     * @param   {array} dataset  想要添加的数据数组
     */
    var addData = function(db,storeName,dataset){
        var transaction = db.transaction(storeName,"readwrite");
        transaction.onerror = function(e){
            console.dir(e);
        };
        transaction.oncomplete = function(){
            console.log("transaction complete");
        };
        var store = transaction.objectStore(storeName);
        for(var i = 0;i < dataset.length;i++){
            var request = store.add(dataset[i]);
            request.onerror = function(e){
                console.log("Error", e.target.error.name)
            };
            request.onsuccess = function(e){
                console.log("数据添加成功！");
            }
        }
    };

    /**
     * 删除数据库中的数据
     * @param   {object} db   数据库打开建立的对象
     * @param   {string} storeName  目标仓库的名称
     * @param   {array}  dataset    想要删除的数据数组
     */
    var deleteData = function(db,storeName,dataset){
        var transaction = db.transaction(storeName,"readwrite");
        transaction.onerror = function(e){
            console.dir(e);
        };
        transaction.oncomplete = function(){
            console.log("transaction complete");
        };
        var store = transaction.objectStore(storeName);

        for(var i = 0;i < dataset.length;i++){
            console.log("dataset[i]:   "+dataset[i]);
            var request = store.delete(dataset[i].id);
            request.onerror = function(e){
                console.log("Error", e.target.error.name)
            };
            request.onsuccess = function(e){
                console.log("数据删除成功！");
            }
        }
    };

    /**
     * 更新数据库中的数据
     * @param   {object} db   数据库打开建立的对象
     * @param   {string} storeName  目标仓库的名称
     * @param   {string} keyPath   数据对应的键名
     * @param   {object} newValue  要更新的数据对象
     */
    var updateData = function(db,storeName,keyPath,newValue){
        var transaction = db.transaction(storeName,"readwrite");
        transaction.onerror = function(e){
            console.dir(e);
        };
        transaction.oncomplete = function(){
            console.log("transaction complete");
        };
        var store = transaction.objectStore(storeName);
        var request = store.get(keyPath);
        request.onerror = function(e){
            console.log("Error",e.target.error.name);
        };
        request.onsuccess = function(event){
            var article = event.target.result;
            article = newValue;
            store.put(article);
        }
    };

    /**
    * 数据库索引查找
    * @param    {object} db   数据库打开建立的对象
    * @param    {string} storeName  目标仓库的名称
    * @param    {string} indexId   索引
    */

    //var getByIndex = function(db,storeName,indexId){
    //    var transaction = db.transaction(storeName);
    //    transaction.onerror = function(e){
    //        console.dir(e);
    //    };
    //    transaction.oncomplete = function(){
    //        console.log("transaction complete");
    //    };
    //    var store = transaction.objectStore(storeName),
    //        request = store.index("idIndex").get(indexId);
    //    request.onsuccess = function(event){
    //        result =  request.result;
    //    };
    //};

    /**
     * 数据库游标
     * @param   {object} db   数据库打开建立的对象
     * @param   {string} storeName  目标仓库的名称
     *
     * 一般用来查找
     * 在这里用来初始化及更新files与folders数组
     *
     */
    var addCursor = function(db,storeName){
        var transaction = db.transaction(storeName,"readonly");
        transaction.onerror = function(e){
            console.dir(e);
        };
        transaction.oncomplete = function(){
            console.log("transaction complete");
        };
        var store = transaction.objectStore(storeName);
        var cursor = store.openCursor();
        cursor.onsuccess = function(event){
            var request = event.target.result;
            if(request){
                var resObj = request.value,
                    i = resObj.id.slice(-1);
                if(storeName === "fileStore"){

                    files[i] = resObj;
                }else{

                    folders[i] = resObj
                }

                request.continue();
            }
        }
    };

    //var updateFiles = function(index){
    //
    //    files[index].title = document.getElementsByClassName("article-title")[0].value;
    //    files[index].date = document.getElementById("date").value;
    //    files[index].content = document.getElementsByClassName("textarea-content")[0].value;
    //    files[index].isSave = true;
    //};

    return{
        iDB: iDB,
        files: files,
        folders: folders,
        FileDB: FileDB,
        FolderDB: FolderDB,
        openIndexedDB: openIndexedDB,
        addData: addData,
        updateData: updateData,
        addCursor: addCursor,
        deleteData: deleteData
    };
});