// 全局事件
$(function () {
    var createSkinSelector = function () {
        var boxId;
        var skinId = "myskin" + new Date().getTime()+""; // 避免与页面静态CSS链接重复
        var boxWidth = 590;
        var boxHeight = 200;
        var boxLeft = ($("body").width() - boxWidth) / 2;
        var boxTop = (document.documentElement.scrollTop || document.body.scrollTop) + 0.618 * (document.documentElement.clientHeight - boxHeight) / 2;
        boxId = IWB_DIALOG._init({
            modal: false
           ,showClose: true
           ,onClose:function() { 
           	   $("link[id=" + skinId + "]").remove();
           }
           ,width: boxWidth
           ,height: boxHeight
           ,top: boxTop
           ,left: boxLeft
           ,getDOM: function () {
                var skinSelector = ["<div class=\"facesettingBox\" style=\"border:none;position:relative;top:-10px;height:210px;\">"
                              ,"    <div class=\"tit\">"
                              ,"        <span class=\"facesetting\"></span>"
                              ,"        <strong>皮肤设置</strong>"
                              ,"    </div>"
                              ,"    "
                              ,"    <div class=\"facelist\">"
                              ,"        <ul class=\"DtempList clear\" id=\"skinBox\">"
                              ,"              正在读取皮肤列表,请稍候..."
                              ,"        </ul>"
                              ,"    </div>"
                              ,"    <div class=\"funBox\">"
                              ,"        <input type=\"button\" value=\"保存\" name=\"save\" class=\"button button_blue\">"
                              ,"        <input type=\"button\" value=\"取消\" name=\"cancel\" class=\"button button_gray\">"
                              ,"    </div>"
                              ,"</div>"].join("");

               var skinBox; // 皮肤列表 
               var saveBtn; // 保存
               var cancelBtn; // 取消
               var curSkin; // 当前选择的皮肤

               skinSelector = $(skinSelector);
               skinBox = skinSelector.find("#skinBox"); 
               saveBtn = skinSelector.find("input[name=save]");
               cancelBtn = skinSelector.find("input[name=cancel]");
               curSkin = "";

               // 加载皮肤列表
               IWB_API.listSkin("listskin" ,function (identity ,response) {
                   var skins;
                   var skin;
                   var skinBlock;
                   var i;
                   var noskin = (window.iwbResourceRoot ? iwbResourceRoot : "/") +  "resource/images/noskin.jpg";
                   if (response.ret === 0) {
                        skins = response.data;
                        skinBlock = [];
                        for (i=0; i<skins.length; i++) {
                            skin = skins[i];
                            skinBlock.push("<li data-folder=\"" + skin.foldername + "\">");
                            skinBlock.push("<img src=\"" + (skin.thumb ? skin.thumb : noskin) + "\"/>");
                            skinBlock.push("<p class=\"ico_lock\"></p>");
                            skinBlock.push("<p class=\"tempName\">" + (skin.name || "默认皮肤") + "</p>");
                            skinBlock.push("<div class=\"mask\"></div>");
                            skinBlock.push("</li>");
                        }
                        skinBlock = $(skinBlock.join(""));
                        skinBlock.click(function () {
                            var self = $(this);
                            var folder = self.attr("data-folder");
                            var skinCss = (window.iwbResourceRoot ? iwbResourceRoot : "/") + "view/" + folder + "/skin.css"; 
                            var link;

                            $("link[id=" + skinId + "]").remove();

                            // http://www.subchild.com/2010/05/20/cross-browser-problem-with-dynamic-css-loading-with-jquery-1-4-solved/
                            link = $("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + skinCss + "\" media=\"screen, projection\" id=\"" + skinId + "\"/>").appendTo("head");
                            // link = $("<link/>").appendTo("head");

                            link.attr({
                                rel: "stylesheet"
                               ,type: "text/css"
                               ,href: skinCss
                               ,media: "screen, projection"
                               ,id: skinId
                            });

                            curSkin = self.attr("data-folder");
                        });
                        skinBox.html("");
                        skinBox.append(skinBlock);
                   } else {
                       IWB_DIALOG.modaltipbox("warning","读取皮肤列表失败，请稍候重试");
                   }
               });

               // 保存设置
               saveBtn.click(function () {
                   if (!curSkin) {
                       IWB_DIALOG.msgbox("warning" ,"请选择皮肤", {
                           showClose: false
                           ,modal: true
                           ,autoClose: {
                               wait: 1500
                               ,callback: null
                           }
                       });
                       return;
                   }
                   IWB_API.saveSkin("setskin" ,curSkin ,function (identity ,response) {
                       if (response.ret === 0) {
                           IWB_DIALOG.tipbox("success","皮肤设置保存成功");
                       } else {
                           IWB_DIALOG.tipbox("warning","皮肤设置保存失败");
                       }
                       IWB_DIALOG._disposeDialog(boxId);
                   });
               });

               // 刷新页面
               cancelBtn.click(function () {
                   $("link[id=" + skinId + "]").remove();
                   IWB_DIALOG._disposeDialog(boxId);
               });

               return skinSelector;
           } // end getDOM
        });// end dialog _init
    };

    // 换肤按钮
    $("#changeskin").click(function () {
        createSkinSelector();
    });

    //幻灯片组件
    if (window.sliderBanner && IWB_SILDEWARE && IWB_SESSION.get("showSlideAdv")==null) {
        // 格式化数据
        for (var i=0; i<sliderBanner.length; i++) {
            if(sliderBanner[i].description) {
                sliderBanner[i].title = sliderBanner[i].description;
            }
            if(sliderBanner[i].picture) {
                sliderBanner[i].pic = sliderBanner[i].picture;
            }
        }
        $("#sliderBanner").append(IWB_SILDEWARE(sliderBanner,576,129));
    }

    // 插件
    $("#iwbPlugin").hover(function () {
        $(this).trigger("click");
    }, function () {
    });

    $("#iwbPlugin").click(function (e) {
        e.stopPropagation();
        $("#iwbPluginList").toggle();
    });

    // 
    $("body").click(function () {
        $(".iwbAutoCloseLayer").hide();
    });

});

$(function () {
    // styleid 0 大收听按钮 1 小收听按钮
    // type 1 收听按钮 0 取消收听
    var posConfig = {
        0: {
             0:["-52px", "-27px"]
            ,1:["-52px", "0px"]
           }
       ,1: {
             0:["0px", "-20px"]
            ,1:["0px", "0px"]
           }
    };

    $(".iwbFollowControl").live({
        click: function () {
            var self = $(this);
            var styleid = self.attr("data-styleid");
            var type = self.attr("data-type");
            var name = self.attr("data-name");
            switch (type) {
                case "0": // 取消收听
                IWB_API.unfollow("unfollow", name, function (identity ,response) {
                    if (response.ret === 0) { // 取消收听成功
                        self.attr("data-type",1); // 标记按钮为收听按钮
                        self.attr("title","收听");
                        self.animate({
                            "backgroundPosition": posConfig[styleid][self.attr("data-type")].join(" ")
                        } ,500)
                    } else {
                        IWB_DIALOG.modaltipbox("warning","取消收听失败")
                    }
                });
                break;
                case "1": // 收听
                IWB_API.follow("unfollow", name, function (identity ,response) {
                    if (response.ret === 0) { // 收听成功
                        self.attr("data-type",0); // 标记按钮为取消收听按钮
                        self.attr("title","取消收听");
                        self.animate({
                            "backgroundPosition": posConfig[styleid][self.attr("data-type")].join(" ")
                        } ,500);
                    } else {
                        IWB_DIALOG.modaltipbox("warning","收听失败");
                    }
                });
                break;
            }
        } 
    });
});

$(function () {
    var sliderWrapper = $("#peopleSlider"); 
    var pplistWrapper = sliderWrapper.find(".box");
    var scrollLeft = sliderWrapper.find(".btna");
    var scrollRight = sliderWrapper.find(".btnb");
    var pplist = pplistWrapper.find(".userlist");
    var ppls = pplist.find("li");
    
    var initScrollPos = 0; // 初始化滚动到第0个嘉宾
    var scrollEach = 3; // 每次滚动3个用户
    var autoScroll = true; // 既是配置又是做为方向的信息
    var autoScrollEach = 2; // 自动每次滚动元素个数
    var autoScrollIntervalTime = 3.5 * 1000; // 3.5秒滚动一次
    var autoScrollTimer;

    var scrollTo = function (el ,func) { // 移动到那个元素
        if (el && el.nodeName && !pplist.hasClass("animating")) {
            var el = $(el);
            var elPos = el.position();
            pplist.addClass("animating");
            pplist.animate({
                left: Math.min(0,- elPos.left)
            },500,function () {
                pplist.removeClass("animating");
                if (func) {
                    func();
                }
            });
        }
    };

    var firstVisible = function () {
        return pplist.size()&&(pplist.position().left === 0);
    };

    var lastVisible = function () {
        return ppls.size()&&(ppls.last().offset().left <= (pplistWrapper.offset().left + pplistWrapper.width()));
    };

    if (firstVisible()) {
        scrollLeft.hide();
    }

    if (lastVisible()) {
        scrollRight.hide();
    }

    if (firstVisible() && lastVisible()) { // 不能滚动
        return;
    };


    if (initScrollPos !== 0) {
        scrollTo(ppls.get(initScrollPos), function () {
            if (firstVisible()) {
                scrollLeft.hide();
            }
            if (lastVisible()) {
                scrollRight.hide();
            }
        });
    }

    // 自动滚动
    if (autoScroll) {
        autoScrollTimer = setInterval(function () {
                              // direction true代表正向滚动，否则反向
                              var direction = autoScroll;
                              if (direction) { // 正向滚动
                                  if (lastVisible()) {
                                      autoScroll = !direction;
                                      return;
                                  }
                                  initScrollPos += autoScrollEach;
                              } else {
                                  if (firstVisible()) {
                                      autoScroll = !direction;
                                      return;
                                  }
                                  initScrollPos -= autoScrollEach;
                                  initScrollPos = Math.max(0,initScrollPos);
                              }
                              scrollLeft.show();
                              scrollRight.show();
                              scrollTo(ppls.get(initScrollPos), function () {
                                  if (lastVisible()) {
                                      scrollRight.hide();
                                  }
                                  if (firstVisible()) {
                                      scrollLeft.hide();
                                  }
                              });
                          },autoScrollIntervalTime);
    }


    scrollLeft.click(function () {
        var el;
        if (autoScrollTimer) { // 停止自动滚动
            clearInterval(autoScrollTimer)
        };
        if (firstVisible()) {
            return;
        }
        scrollRight.show();
        initScrollPos = Math.max(0,initScrollPos - scrollEach);
        el = ppls.get(initScrollPos);
        scrollTo(el,function () {
            if (firstVisible()) {
                scrollLeft.hide();
            }
        });
    });

    scrollRight.click(function () {
        var el;
        if (autoScrollTimer) { // 停止自动滚动
            clearInterval(autoScrollTimer)
        };
        if (lastVisible()) {
            return;
        }
        scrollLeft.show();
        initScrollPos = Math.min(ppls.length - 1,initScrollPos + scrollEach);
        el = ppls.get(initScrollPos);
        scrollTo(el, function () {
            if (lastVisible()) {
                scrollRight.hide();
            }
        });
    });
});
