/**
 *
 * 控制层面
 *
 * 各种交互事件函数以及事件绑定
 *
 * @file    controller.js
 * @author  Zhangzirui(411489774@qq.com)
 *
 */

define(["unit","indexedDB"],function(unit,indexed){

    var folderId,fileId,foldersLength,filesLength;

    /**
     * 初始化全部的事件
     */
    var initALL = function(){

        indexed.openIndexedDB(indexed.iDB.name,indexed.iDB.version);

        setTimeout(function(){
            folderId = "folder--0";
            updatePage();
        },200);

    //------------------------事件绑定-----------------------------------------//

        //新建任务按钮绑定事件
        unit.addEvent(unit.$(".left-add"),"click",coverF.popup);
        unit.addEvent(unit.$(".cancel"),"click",coverF.cancel);
        unit.addEvent(unit.$(".confirm"),"click",coverF.add);
        unit.addEvent(unit.$(".mid-add"),"click",articleF.create);

        //界面显示绑定事件
        unit.addEvent(unit.$(".folder-menu"),"click",function(e){
           var event = unit.EventUnit.getEvent(e),
               target = unit.EventUnit.getTarget(event);
            if(target.tagName === "I" && target.id !== "icon-delete"){      /*当点击到文件夹图标时，将target改为父元素*/
                target = target.parentNode;
            }else if(target.id === "icon-delete"){                      /*当点击到删除图标时*/
                if(confirm("确认删除？删除后会删掉该文件夹所属的所有任务文件！")){
                    target = target.parentNode;
                    if(target.getAttribute("name") ==="默认分类"){
                        alert("默认分类为系统所带，不能删除...");
                        return true
                    }
                    folderF.delelte(target);
                    updatePage(indexed.files,indexed.folders);
                }
                return true;
            }
            folderId = target.id;
            updatePage();
        });
        unit.addEvent(unit.$(".file-menu"),"click",function(e){
            var event = unit.EventUnit.getEvent(e),
                target = unit.EventUnit.getTarget(event);
            if(target.tagName === "I" && target.id !== "icon-delete"){
                target = target.parentNode;
            }else if(target.id === "icon-delete"){
                if(confirm("确认删除？删除后会删掉该文件夹所属的所有任务文件！")){
                    target = target.parentNode;
                    if(target.getAttribute("name") ==="默认分类##默认子分类"){
                        alert("默认子分类为系统所带，不能删除...");
                        return true
                    }
                    fileF.delelte(target);
                }
                updatePage(indexed.files,indexed.folders);
                return true;
            }

            fileId = target.id;
            contentF.showWord(fileId);
        });

        //任务保存与修改绑定事件
        unit.addEvent(unit.$(".save"),"click",articleF.save);
        unit.addEvent(unit.$(".modify"),"click",articleF.modify);
    };


    var updatePage = function(){
        var foldersList = new Array();

        for(var i = 0;i < indexed.folders.length;i++){
            var folderName = indexed.folders[i].folderName;
            foldersList.push(folderName);
        }
        folderF.show(foldersList);
        if(!unit.$("#"+folderId)){
            var index = folderId.slice(8)-1;
            if(index >= 0){
                folderId = folderId.slice(0,8) + index;
            }
        }
        var filesHtml = fileF.show(folderId);
        if(filesHtml === ""){
            contentF.showWord("");
        }else{
            var posBegin = filesHtml.search("id")+ 4,
                posEnd =  filesHtml.search("name")-2;
            fileId = filesHtml.slice(posBegin,posEnd).trim();
            contentF.showWord(fileId);
        }

        coverF.update();
    };

    var folderF = {
        show: function(foldersList){
            var parentNode = unit.$("#folders"),
                contentString = "";
            for(var i = 0;i < foldersList.length;i++){
                contentString += "<li class='fold' id='folder--" + i + "' name=" + foldersList[i] +
                "><i class='iconfont icon'>&#xe62b;</i>" + foldersList[i] + "<i class='iconfont icon' id='icon-delete'>&#xe605;</i></li>";
            }
            parentNode.innerHTML = contentString;
        },

        add: function(folderName){
            var parentNode = unit.$("#folders"),
                childNode = document.createElement("li"),
                foldNodes = document.getElementsByClassName("fold");
            childNode.id = "folder--" + indexed.folders.length;
            childNode.className = "fold";
            childNode.setAttribute("name",folderName);
            childNode.innerHTML = "<i class='iconfont icon'>&#xe62b;</i>" + folderName + "<i class='iconfont icon' id='icon-delete'>&#xe605;</i>";
            parentNode.appendChild(childNode);

            var newFolder = {
                    id: "folder--" + indexed.folders.length,
                    folderName: folderName
                },
                newArr = [newFolder];
            indexed.folders[indexed.folders.length] =  newFolder;
            indexed.addData(indexed.iDB.db,"folderStore",newArr);
        },

        delelte: function(target){
            var name = target.getAttribute("name");
            indexed.files = indexed.files.filter(function(item,index,array){
                if(item.folderName === name){
                    console.log(item);
                    var objArr2 = [item];
                    indexed.deleteData(indexed.iDB.db,"fileStore",objArr2);   /*删除file*/
                }
                return (item.folderName !== name)
            });
            console.log(indexed.files);
            indexed.folders = indexed.folders.filter(function(item,index,array){
               if(item.id === target.id){
                   var objArr = [item];
                   indexed.deleteData(indexed.iDB.db,"folderStore",objArr);    /*删除folder*/
               }
                return (item.id !== target.id)
            });
        }
    };

    var fileF = {
        show: function(folderId){
            var parentNode = unit.$("#files"),
                folderName = unit.$("#"+folderId).getAttribute("name"),
                contentString = "";
            for(var i = 0;i < indexed.files.length;i++){
                if(folderName === indexed.files[i].folderName){
                    contentString += "<li class='file' id='" + indexed.files[i].id + "' name=" + folderName + "##" + indexed.files[i].fileName +
                    "><i class='iconfont icon'>&#xe615;</i>" + indexed.files[i].fileName + "<i class='iconfont icon' id='icon-delete'>&#xe605;</i></li>";
                }
            }
            parentNode.innerHTML = contentString;
            return contentString;
        },

        add: function(folderName,fileName){
            var parentNode = unit.$("#files"),
                childNode = document.createElement("li"),
                fileNodes = document.getElementsByClassName("file");
            childNode.className = "file";
            childNode.id = "file--" + indexed.files.length;
            childNode.setAttribute("name",folderName + "##" + fileName);
            childNode.innerHTML = "<i class='iconfont icon'>&#xe615;</i>" + fileName + "<i class='iconfont icon' id='icon-delete'>&#xe605;</i>";
            parentNode.appendChild(childNode);

            var newObj = {
                    id: "file--" + indexed.files.length,
                    title: null,
                    date: null,
                    content: null,
                    isSave: null,
                    fileName: fileName,
                    folderName: folderName
                },
                newArr=[newObj];
            indexed.files[indexed.files.length] = newObj;
            indexed.addData(indexed.iDB.db,"fileStore",newArr);
        },

        delelte: function(target){
            indexed.files = indexed.files.filter(function(item,index,array){
               if(item.id === target.id){
                   var objArr = [item];
                   indexed.deleteData(indexed.iDB.db,"fileStore",objArr)
               }
                return (item.id !== target.id)
            });
        },

        update: function(index){
            indexed.files[index].title = document.getElementsByClassName("article-title")[0].value;
            indexed.files[index].date = document.getElementById("date").value;
            indexed.files[index].content = document.getElementsByClassName("textarea-content")[0].value;
            indexed.files[index].isSave = true;
        }
    };

    var contentF = {
        showWord:function(fileId){
            unit.$(".article-title").style.display = "none";
            unit.$("#date").style.display = "none";
            for(var i = 0;i < document.getElementsByClassName("article-none").length;i++){
                document.getElementsByClassName("article-none")[i].style.display = "inline";
            }
            if(fileId !== ""){
                var objFile = returnObjFile(fileId);
                if(objFile.isSave){
                    document.getElementsByClassName("article-none")[0].innerHTML = objFile.title;
                    document.getElementsByClassName("article-none")[1].innerHTML = objFile.date;
                    unit.$(".textarea-content").value = objFile.content;
                }else{
                    for(var i = 0;i < document.getElementsByClassName("article-none").length;i++){
                        document.getElementsByClassName("article-none")[i].innerHTML = "无";
                    }
                    unit.$(".textarea-content").value = "无";
                }
            }else{
                for(var i = 0;i < document.getElementsByClassName("article-none").length;i++){
                    document.getElementsByClassName("article-none")[i].innerHTML = "无";
                }
                unit.$(".textarea-content").value = "无";
            }
            unit.$(".textarea-content").setAttribute("disabled","disabled");
            unit.$(".save").style.display = "none";
        },

        showForm:function(obj){
            for(var i = 0;i < document.getElementsByClassName("article-none").length;i++){
                document.getElementsByClassName("article-none")[i].style.display = "none";
            }
            if(obj === ""){
                unit.$(".article-title").value = "";
                unit.$("#date").value = "";
                unit.$(".textarea-content").value = "";
            }else{
                unit.$(".article-title").value = obj.title;
                unit.$("#date").value = obj.date;
                unit.$(".textarea-content").value = obj.content;
            }
            unit.$(".article-title").style.display = "inline";
            unit.$("#date").style.display = "inline";
            unit.$(".textarea-content").removeAttribute("disabled");
            unit.$(".save").style.display = "inline";
        }
    };

    var articleF = {
        create: function(){
            if( !fileId || !isFile(fileId)){
                alert("请选择子分类的文件进行添加任务");
            }else{
                if(!returnObjFile(fileId).isSave){
                    contentF.showForm("");
                }else{
                    alert("该任务已存在");
                }
            }
        },

        save: function(){
            if(!unit.$(".suggest")){
                var suggestionNode =  document.createElement("i");
                suggestionNode.className = "suggest";
                unit.$(".article-header").appendChild(suggestionNode);
            }else{
                suggestionNode = unit.$(".suggest");
            }

            if(!unit.$(".article-title").value){
                suggestionNode.innerHTML = "请输入标题";
            }else if(!unit.$("#date").value){
                suggestionNode.innerHTML = "请输入时间";
            }else if(!unit.$(".textarea-content").value){
                suggestionNode.innerHTML = "请输入内容";
            }else{
                unit.$(".article-header").removeChild(suggestionNode);
                if(isFile(fileId)){
                    if(confirm("确认保存吗？")){
                        indexed.files.forEach(function(item,index,array){
                           if(item.id === fileId){
                               fileF.update(index);
                               indexed.updateData(indexed.iDB.db,"fileStore",fileId,indexed.files[index]);
                           }
                        });
                        contentF.showWord(fileId);
                    }
                }
            }
        },

        modify: function(){
            if(confirm("是否重新编辑？")){
                indexed.files.forEach(function(item,index,array){
                    if(item.id === fileId){
                        contentF.showForm(indexed.files[index]);
                    }
                });
            }
        }
    };

    var coverF = {
        popup: function(){
            unit.$(".cover").style.display = "block";
            unit.$(".popup-view").style.display = "block";
        },

        cancel: function(){
            unit.$(".cover").style.display = "none";
            unit.$(".popup-view").style.display = "none";
        },

        update: function(){
            var selectParent = unit.$("#form-choose");
            selectParent.innerHTML = "<option value='新增主分类' selected='selected'>新增主分类</option>";
            for(var i=0 ; i<document.getElementsByClassName("fold").length ; i++){
                var optionNode = document.createElement("option");
                optionNode.textContent = document.getElementsByClassName("fold")[i].getAttribute("name");
                optionNode.setAttribute("value",optionNode.textContent);
                selectParent.appendChild(optionNode);
            }
        },

        add: function(){
            var inputName = unit.$("#form-name"),
                select = unit.$("#form-choose");
            if(select.value === "新增主分类"){
                if(inputName.value === "" ){
                    alert("请输入新增主分类名称！");
                }else{
                    //var newOptionNode = document.createElement("option");
                    //newOptionNode.textContent = inputName.value;
                    //unit.$("#form-choose").appendChild(newOptionNode);
                    coverF.cancel();
                    folderF.add(inputName.value);
                    inputName.value = "";
                }
            }else{
                if(inputName.value === ""){
                    alert("请输入新增文件名称！");
                }else{
                    for(var i= 0;i<unit.$("#folders").children.length;i++){

                        if(unit.$("#folders").children[i].getAttribute("name") === select.value){
                            coverF.cancel();
                            folderId = unit.$("#folders").children[i].getAttribute("id");
                            fileF.add(unit.$("#"+folderId).getAttribute("name"),inputName.value);
                            fileF.show(folderId,indexed.files);
                            inputName.value = "";
                        }
                    }
                }
            }
            coverF.update();
        }
    };

    function returnObjFile(fileId){
        var objFile;
        indexed.files.forEach(function(item,index,array){
            if(fileId === item.id){
                objFile = item;
            }
        });
        return objFile;
    }

    function isFile(id){
        var pattern = /file/;
        if(!unit.$("#" + id)){
            return false;
        }
        return pattern.test(unit.$("#" + id).className);
    }



    return{
        initALL: initALL
    }
});