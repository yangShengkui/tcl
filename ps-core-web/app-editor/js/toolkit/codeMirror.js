define(["jquery",
        '../../bower_components/codemirror/lib/codemirror',
        '../../bower_components/codemirror/addon/search/searchcursor',
        '../../bower_components/codemirror/addon/search/search',
        '../../bower_components/codemirror/addon/dialog/dialog',
        '../../bower_components/codemirror/addon/edit/matchbrackets',
        '../../bower_components/codemirror/addon/edit/closebrackets',
        '../../bower_components/codemirror/addon/comment/comment',
        '../../bower_components/codemirror/addon/wrap/hardwrap',
        '../../bower_components/codemirror/addon/fold/foldcode',
        '../../bower_components/codemirror/addon/fold/brace-fold',
        '../../bower_components/codemirror/mode/javascript/javascript',
        '../../bower_components/codemirror/keymap/sublime'
    ],
    function($, CodeMirror){
        var cm = {};
        var editor;
        cm.init = init;
        cm.setValue = setValue;
        cm.getValue = getValue;
        function init(){
            var value = "// The bindings defined specifically in the Sublime Text mode\nvar bindings = {\n";
            var dom = document.body.getElementsByTagName("codemirror")[0];
            var map = CodeMirror.keyMap.sublime;
            for (var key in map) {
                var val = map[key];
                if (key != "fallthrough" && val != "..." && (!/find/.test(val) || /findUnder/.test(val)))
                    value += "  \"" + key + "\": \"" + val + "\",\n";
            }
            value += "}\n\n// The implementation of joinLines\n";
            value += CodeMirror.commands.joinLines.toString().replace(/^function\s*\(/, "function joinLines(").replace(/\n  /g, "\n") + "\n";
            editor = CodeMirror(dom, {
                value: value,
                lineNumbers: true,
                mode: {name: "javascript", json: true},
                keyMap: "sublime",
                autoCloseBrackets: true,
                matchBrackets: true,
                showCursorWhenSelecting: true,
                theme: "monokai",
                tabSize: 2
            });
        }
        function setValue(value){
            editor.setValue(JSON.stringify(value, null, 2));
            setTimeout(delay);
            function delay(){
                editor.refresh();
            }
        }
        function getValue(){
            return editor.getValue();
        }
        return cm;
    }
);