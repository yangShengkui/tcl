/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  $.fn.autocomplete = function(obj){
    var slist = obj.options || [];
    var format = obj.format || {
        "id" : "id",
        "label" : "label"
      }
    //console.log(slist);
    var searchArea = $("<input />").addClass("form-control").css("display", "inline-block").css("height", "35px");
    var icon = $("<span></span>").addClass("glyphicon glyphicon-search");
    var button = $("<button></button>").addClass("btn btn-primary");
    var searchlist = $("<div></div>");
    searchlist.css("position", "absolute");
    searchlist.css("width", "100%");
    searchlist.css("z-index", 999);
    searchlist.css("max-height", "200px");
    searchlist.css("overflow-x", "hidden");
    searchlist.css("overflow-y", "auto");
    searchlist.css("box-shadow", "1px 1px 10px rgba(0,0,0,.3)");
    button.append(icon);
    this.css("position","relative");
    this.append(searchArea);
    this.append(searchlist);
    searchArea.on("keyup", function(event){
      var key = searchArea.val();
      searchlist.children().remove();
      var createItem = function(elem){
        var div = $("<div></div>").text(elem.label);
        div.css("padding", "10px");
        div.css("cursor", "pointer");
        div.css("background-color", "rgba(250,250,250,1)");
        div.css("border-bottom", "1px solid #eee");
        div.on("click", function(event){
          event.stopPropagation();
          searchArea.val(elem.label);
          searchlist.children().remove();
        });
        return div;
      };
      var check = function(item){
        if(key == ""){
          return true;
        } else {
          var pinyin = $$.chineseCharacterToPinyin(item);
          if(item.indexOf(key) != -1){
            return true;
          } else if(pinyin.indexOf(key.toUpperCase()) != -1){
            return true;
          } else {
            return false;
          }
        }
      }
      for(var i in slist){
        if(check(slist[i][format.label])){
          searchlist.append(createItem(slist[i]));
        }
      };
    });
  };
  return null;
});
