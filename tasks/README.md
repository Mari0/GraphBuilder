## Grunt Task Description ##
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Make sure you followed the installation steps.

* Documentation
	* **Java is required**.
	* Run ```grunt doc``` to generate the documentation with default [jsdoc3](https://github.com/jsdoc3/jsdoc) template.
	* Run ```grunt docstrap``` to generate the documentation with [docstrap](https://github.com/terryweiss/docstrap) template.
	* Run ```grunt jsdoc``` to generate both.

* Licenses
	* To get the licenses of the *npm*-modules run ```grunt licenses:npm```. This will generate the file and folder *./licenses/npm_licenses.json*.
	* To get the licenses of the *bower*-modules run ```grunt licenses:bower```. This will generate the file and folder *./licenses/bower_licenses.json*.
	* To get both just run ``` grunt licenses```.

* Tests
	* Point your browser to [http://localhost:8888/test.html](http://localhost:8888/test.html)

* Builds
	* Run ```grunt build``` to optimize the app with requirejs optimizer.
	* Run  ```grunt build-min``` to build the minified and uglified version.
	* Run  ```grunt requirejs``` to build both.
* Dependency Analysis
	* Use ```grunt amdcheck``` to detect unused dependecies with [amdcheck](https://github.com/mehdishojaei/grunt-amdcheck).
	* Use ```grunt madge``` to detect circular dependencies.
	* To generate the dependency graph use [madge](https://www.npmjs.com/package/madge)
		* Install it with ```npm install madge -g```
		* Generate the dependency graph with ```madge -i depGraph.png -f amd js```
	* Use ```grunt amd``` to run both tasks.