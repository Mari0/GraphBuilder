requirejs.config({
	baseUrl : "js",
	shim : {
		bootstrap : {
			deps : ['jquery']
		},
		'jquery-contextmenu' : {
			deps : ['jquery']
		},
		'jsonEditor' : {
			deps : ['ace']
		},
        'jqueryui':{
            exports: '$',
            deps:['jquery']
        },
        jsPanel:{
            deps:['jqueryui']
        },
        vis:{
            deps:['css!./../components/vis/dist/vis.min']
        }
	},
	paths : {
		bootstrap : "./../components/bootstrap/dist/js/bootstrap.min",
		jquery : "./../components/jquery/dist/jquery.min",
        jqueryui: "./../components/jquery-ui/jquery-ui.min",
		"jquery-contextmenu" : "./../components/jQuery-contextMenu/dist/jquery.contextMenu",
		"jquerui-position" : "./../components/jQuery-contextMenu/src/jquery.ui.position",
		lodash : "./../components/lodash/lodash.min",
		JsonPath : "./../components/JSONPath/lib/jsonpath",
		jsonEditor : "./../components/jsoneditor/jsoneditor.min",
		ace : "./../components/jsoneditor/asset/ace/ace",
		jszip : './../components/jszip/dist/jszip.min',
        text: './../components/requirejs-text/text',
        tpl: "./../templates",
        jsPanel: "./../components/jspanel/source/jquery.jspanel.min",
        vis:"./../components/vis/dist/vis.min"
	},
	map : {
		'*' : {
			css : './../components/require-css/css.min'
		}
	}
});
requirejs(['css!../style', 'Main', 'bootstrap', 'jsPanel']);
