define(['jquery',
		'navbar/FileInputTab',
		'navbar/OntologyTab',
		'navbar/HttpInputTab',
		'navbar/MappingExportTab',
		'navbar/ImportTab',
        'navbar/ProjectTab',
        'text!tpl/navbar/navbar.html'], /**@lends NavigationBar*/
	function ($, FileInputTab, OntologyTab, HttpInputTab, MappingExportTab, ImportTab, ProjectTab, navbarHtml) {
    /**
     * Initializes the Navigation Bar and all corresponding tabs
     * @constructor
     */
	function NavigationBar() {
        var $body = $('body');

        //Initialize Tabs Navigation Container
        $body.append($(navbarHtml));

        //Initialize Content Container
        $body.append($(document.createElement('div'))
            .attr('id', 'mc_navbar_content')
            .attr('class', 'tab-content'));

        //Init Tabs
        ProjectTab();
		FileInputTab();
		HttpInputTab();
		ImportTab();
		MappingExportTab();
		OntologyTab();
	}

	return NavigationBar;
});
