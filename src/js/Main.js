define([
        'MappingManager',
        'Global',
        'bootstrapWrapper/TabWrapper',
        'navbar/NavBarMain',
        'contextMenu/ContextMenu'
    ],
    function(MappingManager, Global, TabWrapper, MappingConfigNavigation) {
        $(document).ready(function() {
            MappingConfigNavigation();

            /*var keys = {};
             $('body').keydown(function (e) {
             keys[e.which] = true;
             keyboard(keys);
             }).keyup(function (e) {
             delete keys[e.which];
             });*/

            TabWrapper.InitTabContainer();
            console.log('GraphBuilder finished');
            if (Global.Config.TEST_MODE) {
                require(['./../test/TestMain'], function() {
                    console.log('Start Tests');
                });
            }
        });
    });