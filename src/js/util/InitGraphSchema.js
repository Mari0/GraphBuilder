define([
    'jquery',
    'lodash',
    'Global'
], /**@lends InitGraphSchema*/
function ($, _,Global) {

    function InitGraphSchema() {	}

    InitGraphSchema.prototype.sourceId = null;
    InitGraphSchema.prototype.targetId = null;

    InitGraphSchema.prototype.domainId = null;
    InitGraphSchema.prototype.rangeId = null;

    /**loads the graph structure.
     * the graph structure can be a json-representation of the vertex and edge classes or an RDF/OWL-Ontology
     */
    InitGraphSchema.LoadOntology = function() {
        var fileInput = document.getElementById("upload");
        if (fileInput) {
            var file = fileInput.files[0];
            if (file) {
                var reader = new FileReader();
                if (file.name.search(/.json/) !== -1) {
                    reader.readAsText(file, "UTF-8");

                    reader.onload = function (evt) {
                        Global.Ontology = JSON.parse(evt.target.result);
                    };

                    reader.onerror = function () {
                        Global.Ontology = 'error reading file';
                    };
                } else {
                    alert("Not a JSON file");
                }
            }
        }
    };


    return InitGraphSchema;
});
