'use strict';

module.exports = function(grunt){

    var _ = grunt.util._;

    var copyCssFiles = function(){
        grunt.file.copy('src/components/bootstrap/dist/css/bootstrap.min.css','dist/style/bootstrap/css/bootstrap.min.css');
        grunt.file.copy('src/components/bootstrap/dist/css/bootstrap-theme.min.css','dist/style/bootstrap/css/bootstrap-theme.min.css');
        grunt.file.copy('src/components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf','dist/style/bootstrap/fonts/glyphicons-halflings-regular.ttf');
        grunt.file.copy('src/components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff','dist/style/bootstrap/fonts/glyphicons-halflings-regular.woff');

        grunt.file.copy('src/components/jsoneditor/jsoneditor.min.css','dist/style/jsoneditor/jsoneditor.min.css');
        grunt.file.copy('src/components/jsoneditor/img/jsoneditor-icons.png','dist/style/jsoneditor/img/jsoneditor-icons.png');

        grunt.file.copy('src/components/jspanel/source/jquery.jspanel.min.css','dist/style/jspanel/jquery.jspanel.min.css');
        grunt.file.copy('src/components/jspanel/source/fonts/jsglyph.woff','dist/style/jspanel/fonts/jsglyph.woff');
        grunt.file.copy('src/components/jspanel/source/fonts/jsglyph.woff2','dist/style/jspanel/fonts/jsglyph.woff2');
        grunt.file.copy('src/components/jspanel/source/fonts/jsglyph.ttf','dist/style/jspanel/fonts/jsglyph.ttf');

        grunt.file.copy('src/components/jQuery-contextMenu/dist/jquery.contextMenu.min.css', 'dist/style/jqueryContextMenu/jquery.contextMenu.min.css');
        grunt.file.recurse('src/components/jQuery-contextMenu/dist/font', function(abs, root, sub, filename){
            grunt.file.copy(abs, 'dist/style/jqueryContextMenu/font/' + filename);
        });
    };

    grunt.registerTask('build', function(){
        grunt.task.run('requirejs:build');
        copyCssFiles();
        var tpl = _.template(grunt.file.read('tasks/index.html.tpl'));
        grunt.file.write('dist/index.html', tpl({build:'graphbuilder.js'}));
        grunt.file.copy('tasks/init.json', 'dist/init.json');
    });

    grunt.registerTask('build-min', function(){
        grunt.task.run('requirejs:build_min');
        copyCssFiles();
        var tpl = _.template(grunt.file.read('tasks/index.html.tpl'));
        grunt.file.write('dist/index.html', tpl({build:'graphbuilder.min.js'}));
        grunt.file.copy('tasks/init.json', 'dist/init.json');
    });
};