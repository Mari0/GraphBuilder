define(['chai', 'util/JPath'], function(chai,JPath) {
    return function() {
        var expect = chai.expect;
        describe('JPath', function () {
            describe('JsonPath.SetIndexesOfPathArray - Set Indizes of a JsonPath which contains an Array', function () {

                it('set index of jsonpath containing one array', function () {
                    var jPath = new JPath('$.propertyName[*].objectName');
                    expect(jPath.SetIndexesOfPathArray([2]).Path).to.equal('$.propertyName[2].objectName');
                });
                it('set index of jsonpath containing two arrays', function () {
                    var jPath = new JPath('$.propertyName[0].propertyName2[*]');
                    expect(jPath.SetIndexesOfPathArray([10, 1]).Path).to.equal('$.propertyName[10].propertyName2[1]');
                });
                it('deal with jsonpath not containing an array', function () {
                    var jPath = new JPath('$.propertyName.objectName.propertyName2');
                    expect(jPath.SetIndexesOfPathArray([23, 324, 23424]).Path).to.equal('$.propertyName.objectName.propertyName2');
                });
                it('set indizes with the same values', function () {
                    var jPath = new JPath('$.propertyName[*].objectName.propertyName2[*]');
                    expect(jPath.SetIndexesOfPathArray([10, 0]).Path).to.equal('$.propertyName[10].objectName.propertyName2[0]');
                });
                it('the number of indizes to replace is greater than the number of arrays in the jsonPath', function () {
                    var jPath = new JPath('$.propertyName[*].objectName.propertyName2[*].propertyName3[*]');
                    expect(jPath.SetIndexesOfPathArray([10, 10]).Path).to.equal('$.propertyName[10].objectName.propertyName2[10].propertyName3[*]');
                });
                it('same as above but all property is true', function () {
                    var jPath = new JPath('$.propertyName[*].objectName.propertyName2[*].propertyName3[*]');
                    expect(jPath.SetIndexesOfPathArray([10, 20], true).Path).to.equal('$.propertyName[10].objectName.propertyName2[20].propertyName3[10]');
                });
                it('Ignore indizes test', function () {
                    var jPath = new JPath('$.propertyName[*].objectName.propertyName2[*].propertyName3[*]');
                    expect(jPath.SetIndexesOfPathArray([10, '_']).Path).to.equal('$.propertyName[10].objectName.propertyName2[*].propertyName3[*]')
                });
                it('Only set first index', function () {
                    var jPath = new JPath('$.propertyName[*].objectName.propertyName2[*].propertyName3[*]');
                    expect(jPath.SetIndexesOfPathArray([10]).Path).to.equal('$.propertyName[10].objectName.propertyName2[*].propertyName3[*]')
                });
                it('Only set second index', function () {
                    var jPath = new JPath('$.propertyName[*].objectName.propertyName2[*].propertyName3[*]');
                    expect(jPath.SetIndexesOfPathArray(['_', 10]).Path).to.equal('$.propertyName[*].objectName.propertyName2[10].propertyName3[*]')
                });
                it('Only set third index', function () {
                    var jPath = new JPath('$.propertyName[*].objectName.propertyName2[*].propertyName3[*]');
                    expect(jPath.SetIndexesOfPathArray(['_', '_', 10]).Path).to.equal('$.propertyName[*].objectName.propertyName2[*].propertyName3[10]')
                });
            });

            describe('JsonPath.IsSubJsonPathOf - Determine if a jsonPath contains another jsonPath as sub path', function () {
                it('Very Simple first test. Should return true', function () {
                    var jPath = new JPath('$.propertyName');
                    expect(jPath.IsSubPathOf('$')).to.be.true;
                });
                it('Pathes are Equal. Should return true', function () {
                    var jPath = new JPath('$.propertyName');
                    expect(jPath.IsSubPathOf('$.propertyName')).to.be.true;
                });
                it('Should return false', function () {
                    var jPath = new JPath('$.propertyName');
                    expect(jPath.IsSubPathOf('$.propertyName.propertyName2[*]')).to.be.false;
                });
                it('subpath detection with arrays', function () {
                    var jPath = new JPath('$.propertyName[3].propertyName2[*]');
                    expect(jPath.IsSubPathOf('$.propertyName[*]')).to.be.true;
                });
            });

            describe('JsonPath.GetAllPossiblePathes', function () {
                it('Test1', function () {
                    var jPath = new JPath('$.array1[*].array2[0]');
                    var pathes = jPath.GetAllPossiblePaths([3, 4]);
                    var strArr = [];
                    pathes.forEach(function (path) {
                        strArr.push(path.Path);
                    });
                    expect(strArr).to.eql([
                        '$.array1[0].array2[0]', '$.array1[0].array2[1]', '$.array1[0].array2[2]', '$.array1[0].array2[3]',
                        '$.array1[1].array2[0]', '$.array1[1].array2[1]', '$.array1[1].array2[2]', '$.array1[1].array2[3]',
                        '$.array1[2].array2[0]', '$.array1[2].array2[1]', '$.array1[2].array2[2]', '$.array1[2].array2[3]']);
                });
                it('Test2', function () {
                    var jPath = new JPath('$.array1[*].array2[0].something.array3[0]');
                    var pathes = jPath.GetAllPossiblePaths([3, 1, 2]);
                    var strArr = [];
                    pathes.forEach(function (path) {
                        strArr.push(path.Path);
                    });
                    expect(strArr).to.eql([
                        '$.array1[0].array2[0].something.array3[0]', '$.array1[0].array2[0].something.array3[1]',
                        '$.array1[1].array2[0].something.array3[0]', '$.array1[1].array2[0].something.array3[1]',
                        '$.array1[2].array2[0].something.array3[0]', '$.array1[2].array2[0].something.array3[1]']);
                });
                it('Path does not contain an array', function () {
                    var jPath = new JPath('$.something.something_else');
                    var pathes = jPath.GetAllPossiblePaths([3, 1, 2]);
                    var strArr = [];
                    pathes.forEach(function (path) {
                        strArr.push(path.Path);
                    });
                    expect(strArr).to.eql(['$.something.something_else']);
                });
                it('Test1', function () {
                    var jPath = new JPath('$.array1[*].array2[*]');
                    var pathes = jPath.GetAllPossiblePaths([3]);
                    var strArr = [];
                    pathes.forEach(function (path) {
                        strArr.push(path.Path);
                    });
                    expect(strArr).to.eql(['$.array1[0].array2[*]', '$.array1[1].array2[*]', '$.array1[2].array2[*]']);
                });
            });
            describe('Some Basic Test for JPath', function () {
                it('JsonPath of Length 1', function () {
                    var jPath = new JPath('$');
                    expect(jPath.GetRoot().Path).to.equal(undefined);
                    expect(jPath.Length).to.equal(1);
                });
                it('Simple Test', function () {
                    var jPath = new JPath('$.array[*]');
                    expect(jPath.GetRoot().Path).to.equal('$');
                    expect(jPath.Length).to.equal(2);
                });
            });
            describe('JsonPath.GetIndexes- Returns the Indexes as array of  a JsonPath', function () {
                var path = '$.object1';
                it('Test JsonPath: ' + path, function () {
                    var jPath = new JPath(path);
                    expect(jPath.GetIndexes()).to.equal(null);
                });
                var path2 = '$.array[34].array2[33]';
                it('Test JsonPath: ' + path2, function () {
                    var jPath = new JPath(path2);
                    expect(jPath.GetIndexes()).to.eql([34, 33]);
                });
                var path3 = '$.array[*].array2[4].object';
                it('Test JsonPath: ' + path3, function () {
                    var jPath = new JPath(path3);
                    expect(jPath.GetIndexes()).to.eql(['*', 4]);
                });
            });
        });
    }
});