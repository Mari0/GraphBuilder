define([
    'jquery',
    'lodash',
    'Global',
    'text!tpl/tabContainer.html'], /**@lends Global*/
	function ($, _, Global, htmlTabContainer) {

	function TabWrapper() {}

    var tpl = _.template(htmlTabContainer);

	var tabIdPattern = 'mc_content';

    TabWrapper.TabContainerId = 'mc_tab';
    TabWrapper.TabContentContainerId = 'mc_tab_content';
    TabWrapper.TabCounter = 0;
    TabWrapper.$currentTab = null;

    TabWrapper.InitTabContainer = function () {
		$('body').append($(tpl({
                containerId: TabWrapper.TabContainerId,
                contentId: TabWrapper.TabContentContainerId
            })));
		TabWrapper.RegisterShowEvent();

	};
	TabWrapper.RegisterCloseEvent = function () {
		$(".closeTab").click(function (event) {
			//there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
			event.preventDefault();
			var tabContentId = $(this).parent().attr("href");
            var MappingManager = require('MappingManager');
            MappingManager.removeMappingById(tabContentId);
			if (tabContentId === Global.CurrentTabId) {
				//Show the tab to the right
                var $a = $('#' + TabWrapper.TabContainerId).find('li a[href=\"' + tabContentId + '\"]').parent();
				var $tab = $a.next().first();
				if ($tab.length === 0) {
					//If a the tab doesn't exists show them to the left
					$tab = $a.prev().first();
					if ($tab.length === 0) {
						$tab = $a.first();
					}
				}
				$(this).parent().parent().remove(); //remove li of tab
				$(tabContentId).remove(); //remove respective tab content
				$tab.find('a').click(); // Select first tab
				Global.CurrentTabId = $tab.attr('href'); //register new current tab
				$(Global.CurrentTabId).attr('class', 'panel panel-default tab-pane fade active in');
				$('#mc_tab_content').prepend($(Global.CurrentTabId));
			} else {
				$(this).parent().parent().remove(); //remove li of tab
				$(tabContentId).remove(); //remove respective tab content
			}
            if($(this).parents('li').is('#visNetwork')){
                var NetworkManager = require('NetworkManager');
                NetworkManager.clearNetwork();
            }
		});
	};
	TabWrapper.RegisterShowEvent = function () {
		$("#" + TabWrapper.TabContainerId).on("click", "a", function (e) {
			e.preventDefault();
			$(this).tab('show');
            var isNetwork = $(this).parent('li').attr('id');
            if(!isNetwork) {
                $('#mc_tab_content').prepend($($(this).attr('href')));
            }
			TabWrapper.$currentTab = $(this);
			Global.CurrentTabId = TabWrapper.$currentTab.attr('href');
			console.log('Current tab: ' + Global.CurrentTabId);
		});
	};
	TabWrapper.AddCloseableTab = function (label, content, isNetwork) {
		var tabId = tabIdPattern + TabWrapper.TabCounter++;
		$('#mc_tab').find('li').attr('class', '');
        $(Global.CurrentTabId).attr('class', 'panel panel-default tab-pane fade');
        $('#' + TabWrapper.TabContainerId)
            .append($(document.createElement('li'))
                .attr('id', isNetwork ?'visNetwork' : '')
                .attr('class', 'active')
                .append($(document.createElement('a'))
                    .attr('href', '#' + tabId)
                    .append($.parseHTML('<button class="close closeTab" type="button" >×</button>' + label))));

        //register close event
		TabWrapper.RegisterCloseEvent();
		Global.CurrentTabId = '#' + tabId;

        TabWrapper.$currentTab = $(document.createElement('div'))
            .attr('class', 'panel panel-default tab-pane fade active in')
            .attr('id', tabId)
            .append(content);

        if(isNetwork) {
            $('#' + TabWrapper.TabContentContainerId).append(TabWrapper.$currentTab);
        }
        else{
            $('#' + TabWrapper.TabContentContainerId).prepend(TabWrapper.$currentTab);
        }
    };

	TabWrapper.removeCurrentTab = function () {
		var tabContentId = TabWrapper.$currentTab.attr("href");
        TabWrapper.$currentTab.parent().remove(); //remove li of tab
		$('#' + Global.TabContainerId + ' a:last').tab('show'); // Select first tab
		$(tabContentId).remove(); //remove respective tab content
	};
	TabWrapper.showTab = function (tabId) {
		$('#' + TabWrapper.TabContainerId + ' a[href="#' + tabId + '"]').tab('show');
	};

    TabWrapper.changeLabelOfCurrentTab = function(label){
        var tab = $('#mc_tab').find('a[href="'+ Global.CurrentTabId + '"]');
        tab.empty();
        tab.append($.parseHTML('<button class="close closeTab" type="button" >×</button>' + label));
    };
	return TabWrapper;
});
