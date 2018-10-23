define([], function(){
  return {
    init : function(dt, format){
      var Node = function(data, format){
        if(format){
          var traverseFn = format.traverse;
          var repeat = function(element){
            if(traverseFn){
              traverseFn(element);
            };
            if(element.hasOwnProperty(format["children"])){
              element.children = element[format["children"]]
              for(var i in element.children){
                repeat(element.children[i])
              }
            }
          };
          repeat(data);
        };
        for(var i in data){
          this[i] = data[i];
        };
      };
      var repeat = function(children, inx, parent, lv){
        //console.log("new Node", children, inx);
        children[inx] = new Node(children[inx]);
        Object.defineProperties(children[inx], {
          'level': {
            value: lv,
            enumerable: false
          },
          'parent': {
            value: parent,
            enumerable: false
          }
        });
        if(children[inx].hasOwnProperty("children")){
          for(var i in children[inx].children){
            repeat(children[inx].children, i, children[inx], lv + 1)
          }
        }
      };
      var oldNode;
      Node.prototype.$on = function(eventName, handler){
        var cur = this;
        if(cur.label == "K10辊道组") {
          // console.log("[[[[[[[", oldNode, cur);
          if(oldNode != cur){
            // console.log("[[[[[[[",oldNode, cur);
          }
          oldNode = cur;
          //console.log(cur['events']);
          if(cur['events']){
            //console.log(cur['events'][eventName]);
          }
        };
        cur['events'] = cur['events'] || {};
        cur['events'][eventName] = cur['events'][eventName] || [];
        cur['events'][eventName].push(handler);
        /**
        if(cur.label == "K10辊道组") {
          console.log(cur['events'], cur, handler);
        };*/
      };
      Node.prototype.$trigger = function(eventName, data){
        var cur = this;
        if(cur['events']){
          if(cur['events'][eventName]){
            var funlist = cur['events'][eventName];
            for(var i in funlist) {
              var fun = funlist[i];
              fun(data);
            }
          }
        }
      };
      Node.prototype.find = function(condition){
        var cur = this;
        var find;
        cur.traverse(function(node){
          if(condition(node)){
            find = find || node;
          }
        });
        return find;
      };
      Node.prototype.traverse = function(callback){
        var cur = this;
        var repeat = function(element){
          if(callback){
            callback(element);
          }
          if(element.hasOwnProperty("children")){
            for(var i in element.children){
              repeat(element.children[i])
            }
          }
        };
        repeat(cur);
      };
      Node.prototype.getParents = function(){
        var cur = this;
        var rs = [];
        var parent = cur.parent;
        while(parent){
          rs.push(parent);
          parent = parent.parent;
        };
        return rs.reverse();
      };
      Node.prototype.isLast = function(){
        var parent = this.parent;
        return parent.children.indexOf(this) == parent.children.length - 1;
      };
      Node.prototype.traverseParents = function(callback){
        var repeat = function(element){
          if(element){
            if(callback){
              callback(element);
            };
            repeat(element.parent);
          }
        };
        repeat(this.parent);
      };
      Node.prototype.traverseChildren = function(callback){
        for(var i in this.children){
          callback(this.children[i]);
        }
      };
      Node.prototype.getChildren = function(callback){
        var rs = [];
        callback = callback || function(){
            return true;
          }
        for(var i in this.children){
          if(callback(this.children[i])){
            rs.push(this.children[i]);
          };
        }
        return rs;
      };
      Node.prototype.getBrothers = function(){
        var parent = this.parent || {};
        var rs = []
        for(var i in parent.children){
          if(parent.children[i] != this){
            rs.push(parent.children[i]);
          }
        }
        return rs;
      };
      Node.prototype.traverseBrothers = function(callback){
        var parent = this.parent;
        for(var i in parent.children){
          if(parent.children[i] != this){
            callback(parent.children[i]);
          }
        }
      };
      Node.prototype.addChildren = function(child){
        var node = this;
        if(!node.hasOwnProperty("children")){
          node.children = [];
        }
        node.children.push(child);
        var inx = node.children.indexOf(child);
        repeat(node.children, inx, node, node.level + 1);
      };
      Node.prototype.filterNode = function(condition){
        var cur = this;
        var rs = [];
        this.traverse(function(node){
          if(condition(node)){
            rs.push(node);
          }
        });
        return rs;
      };
      Node.prototype.updateChildren = function(children){
        var node = this;
        node.children = children;
        for(var i in node.children){
          repeat(node.children, i, node, node.level + 1);
        }
      };
      /**
      Node.prototype.getDescendants = function(callback){
        var cur = this;
        var rs = [];
        var repeat = function(element){
          callback = callback || function(){
              return true;
            }
          if(callback(element)){
            rs.push(element);
          }
          if(element.hasOwnProperty("children")){
            for(var i in element.children){
              repeat(element.children[i])
            }
          }
        };
        if(cur.hasOwnProperty("children")){
          for(var i in cur.children){
            repeat(cur.children[i])
          }
        };
        return rs;
      };*/
      Node.prototype.hasDescendant = function(target){
        var some = false;
        this.traverseDescendants(function(node){
          if(target == node){
            some = true;
          };
        });
        return some;
      };
      Node.prototype.getDescendants = function(callback){
        var cur = this;
        var rs = []
        callback = callback || function(){ return true; }
        var repeat = function(element){
          if(callback(element)){
            rs.push(element);
          }
          if(element.hasOwnProperty("children")){
            for(var i in element.children){
              repeat(element.children[i])
            }
          }
        };
        if(cur.hasOwnProperty("children")){
          for(var i in cur.children){
            repeat(cur.children[i])
          }
        };
        return rs;
      };
      Node.prototype.getLeafNodes = function(){
        var cur = this;
        var rs = [];
        cur.traverse(function(node){
          if(!node.children){
            rs.push(node);
          }
        });
        return rs;
      };
      Node.prototype.traverseDescendants = function(callback){
        var cur = this;
        var repeat = function(element){
          if(callback){
            callback(element);
          }
          if(element.hasOwnProperty("children")){
            for(var i in element.children){
              repeat(element.children[i])
            }
          }
        };
        if(cur.hasOwnProperty("children")){
          for(var i in cur.children){
            repeat(cur.children[i])
          }
        };
      };
      var rootNode = new Node(dt, format);
      Object.defineProperties(rootNode, {
        'level': {
          value: 0,
          enumerable: false
        },
        'parent': {
          value: null,
          enumerable: false
        }
      });
      for(var i in rootNode.children){
        repeat(rootNode.children, i, rootNode, 1);
      }
      return rootNode;
    }
  };
});