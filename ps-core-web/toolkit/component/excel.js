/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data)
  {
    var element = data.element;
    var excelDom = $("<div></div>");
    var removeEmptyCell = function(data) {
      for(var i in data){
        for(var j in data[i]) {
          if(typeof data[i][j] == "object") {
            delete data[i][j];
          }
        }
      }
    };
    element.render = function(data){
      var renderDom = function() {
        var table = $("<table></table>");
        table.css("width", "100%");
        for(var i in data) {
          if(i == 0) {
            table.append(renderRow(i, data[i], true));
          } else {
            table.append(renderRow(i, data[i]));
          }

        }
        return table;
        function renderRow(inx, row, header) {
          var rowDom = $("<tr></tr>");
          if(inx % 2 == 1){
            rowDom.css("background-color", "#eee");
          }
          for(var i in row) {
            if(header) {
              rowDom.append(renderHeader(row[i]))
            } else {
              rowDom.append(renderCol(row[i]))
            }
          }
          return rowDom;
          function renderHeader(th) {
            var thDom = $("<th></th>");
            thDom.css("padding", "5px 20px");
            thDom.css("text-align", "center");
            thDom.css("color", "#fff");
            thDom.css("line-height", "20px");
            thDom.css("border", "1px solid #3c8dbc");
            thDom.css("background-color", "#3c8dbc");
            thDom.css("font-weight", "bold");
            if(typeof th == 'string' && th !== '') {
              thDom.text(th);
              return thDom;
            }
          }
          function renderCol(col) {
            var colDom = $("<td></td>");
            colDom.css("padding", "5px 20px");
            colDom.css("line-height", "20px");
            colDom.css("text-align", "center");
            colDom.css("border", "1px solid #ddd");
            colDom.css("color", "#888")
            if(typeof col == 'string' && col !== '') {
              colDom.text(col);
              return colDom;
            }
          }
        }
      };
      var inner = renderDom();
      excelDom.children().remove();
      excelDom.append(inner);
    };
    removeEmptyCell(element.parameters.excelData);
    element.render(element.parameters.excelData)
    if(element.style) {
      excelDom.css(element.style);
    }
    return excelDom;
  }
});
