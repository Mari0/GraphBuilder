define(['jquery','chai','Global','MappingManager','util/InitGraphSchema'],
    function ($,chai,Global,MappingManager, InitGraphSchema) {

        return function() {
            var expect = chai.expect;

            var getDomainData = function (url, id, done) {
                $.get(url, function (data) {
                    var dataSrc = null;
                    try {
                        dataSrc = JSON.parse(data);
                    } catch (e) {
                        dataSrc = data;
                    }

                    MappingManager.createMappingCanvasFromExample(id, dataSrc);
                    done();
                }).fail(function (resp) {
                    alert(resp.responseText + ' No datasource example found!');
                    done();
                });

            };

            describe('Domain Test1', function () {
                before(function (done) {
                    getDomainData("http://localhost:8888/test/JsonVisulizationTest.json", "DomainTest1", done);
                });

                it('DOM check mapping canvas', function () {
                    var id = $('#DomainTest1').attr('id');
                    expect(id).to.equal('DomainTest1');
                });

                it('Model- check mapping object', function () {
                    var domain = MappingManager.getCurrentMappingCanvas().getDomain();
                    for (var key in domain) {
                        if (domain.hasOwnProperty(key)) {
                            expect(domain[key]).to.be.ok;
                        }
                    }
                });

            });
            describe('Domain Test2', function () {
                //initialize the app and wait a little
                //TODO find a better way for this
                before(function (done) {
                    getDomainData("http://mariorose.bitbucket.org/test_data/JSONArrayTest.json", "DomainTest2", done);
                });

                it('DOM check mapping canvas', function () {
                    var id = $('#DomainTest2').attr('id');
                    expect(id).to.equal('DomainTest2');
                });

                it('Model- check mapping object', function () {
                    var domain = MappingManager.getCurrentMappingCanvas().getDomain();
                    for (var key in domain) {
                        if (domain.hasOwnProperty(key)) {
                            expect(domain[key]).to.be.ok;
                        }
                    }
                });

            });
            describe('Domain Test3:  CB facebook document', function () {
                //initialize the app and wait a little
                //TODO find a better way for this
                before(function (done) {
                    getDomainData("http://mariorose.bitbucket.org/test_data/cb_facebook_min.json", "DomainTest3-Cb-Facebook", done);
                });

                it('DOM check mapping canvas', function () {
                    var id = $('#DomainTest3-Cb-Facebook').attr('id');
                    expect(id).to.equal('DomainTest3-Cb-Facebook');
                });

                it('Model- check mapping object', function () {
                    var domain = MappingManager.getCurrentMappingCanvas().getDomain();
                    for (var key in domain) {
                        if (domain.hasOwnProperty(key)) {
                            expect(domain[key]).to.be.ok;
                        }
                    }
                });

            });
            describe('Domain Test4:  AL ArangoDB document', function () {
                //initialize the app and wait a little
                //TODO find a better way for this
                before(function (done) {
                    getDomainData("http://mariorose.bitbucket.org/test_data/al_arangodb.json", "DomainTest4-AL-ArangoDb", done);
                });

                it('DOM check mapping canvas', function () {
                    var id = $('#DomainTest4-AL-ArangoDb').attr('id');
                    expect(id).to.equal('DomainTest4-AL-ArangoDb');
                });

                it('Model- check mapping object', function () {
                    var domain = MappingManager.getCurrentMappingCanvas().getDomain();
                    for (var key in domain) {
                        if (domain.hasOwnProperty(key)) {
                            expect(domain[key]).to.be.ok;
                        }
                    }
                });

            });
            describe('Load Graph Schema: Startup Universe', function () {
                before(function (done) {
                    $.get("http://mariorose.bitbucket.org/test_data/JsonOntology/startupUniverse.json", function (data) {
                        Global.Ontology = data;
                        InitGraphSchema.LoadJsonOntology();
                        done();
                    });
                });

                it('Label should contain StartupUniverse', function(){
                    expect($('#lblGraphSchemaName').text()).to.have.string('StartupUniverse');
                });

                it('Should have a Vertex Class Selection', function(){
                    expect($('#vertexClassSelector').length).to.be.above(0);
                });

                it('Should have Vertex Add Button', function(){
                    expect($('#addVertexClassButton').length).to.be.above(0);
                });
                it('Should have a Edge Class Selection', function(){
                    expect($('#edgeClassSelector').length).to.be.above(0);
                });

                it('Should have Edge Add Button', function(){
                    expect($('#addEdgeClassButton').length).to.be.above(0);
                });

                it('Should have Add Mapping Rule Button', function(){
                    expect($('#addTranslationPath').length).to.be.above(0);
                });

                describe('OntologyPanel Test',function(){

                    it('Add Vertex Class Button Test', function() {
                        $('#addVertexClassButton').click();
                        expect($('.NodeClass').length).to.be.equals(1);
                    });

                    describe('Mapping Rule Test',function(){
                        var mapping,  jsPlumbInstance, target, connection;
                        before(function(done){
                            mapping= MappingManager.getCurrentMappingCanvas();
                            var arrNodeClassesId = _.keys(mapping.getNodeClasses());
                            var nodeClass = mapping.getNodeClassById(arrNodeClassesId[_.random(0,arrNodeClassesId.length-1)]);

                            var arrProperty = _.keys(nodeClass.getProperties());
                            target = nodeClass.getPropertyById(arrProperty[_.random(0,arrProperty.length-1)]);

                            jsPlumbInstance = mapping.getJsPlumbInstance();
                            var epTarget = jsPlumbInstance.getEndpoints(target.getId())[0];
                            var epSource = jsPlumbInstance.getEndpoints('$.id')[0];
                            if(epTarget && epSource) {
                                connection = jsPlumbInstance.connect({source: epSource, target: epTarget});
                            }
                            done();
                        });

                        it('Check Source of Mapping Rule', function(){
                            expect(connection.sourceId).to.be.equal('$.id');
                            var mappingRule = mapping.getMappingRules()[connection.id];
                            expect(mappingRule.getDomain().getId()).to.be.equal('$.id');
                        });

                        it('Check Target of MappingRule', function(){
                            expect(connection.targetId).to.be.equal(target.getId());
                            var mappingRule = mapping.getMappingRules()[connection.id];
                            expect(mappingRule.getRange().getId()).to.be.equal(target.getId());
                        })

                    })
                })
            });
        }
    });