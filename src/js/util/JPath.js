define(['JsonPath'],
    /**@lends JPath*/ function (jsonPath) {

        /**
         * @constructor
         * the class provides methods for the manipulation of json paths.
         * better examples are following
         */
        function JPath(path) {
            if(!path) {
                return;
            }
            /** the json path as string*/
            this.Path = path;
            /** the length of json path */
            this.Length = path.split('.').length;
        }

        /**
         * splits a json path and return a string array which contains the parts
         * @example
         * var path = new JPath('$.example1.test1');
         * console.log(path.GetParts());
         * output
         * ['$', 'example1', 'test1']
         *@return a string array with all parts of the json path
         */
        JPath.prototype.GetParts = function () {
            return this.Path.split('.');
        };

        /**
         * set the indexes of a json path containing a array-element in the path.
         * the function sets the indexes in the order of the array-elements in the json path
         * @example
         * var jPath = new JPath('$.propertyName[*].objectName.propertyName2[*]');
         * jPath.SetIndexesOfPathArray([10, 0]).Path //out: '$.propertyName[10].objectName.propertyName2[0]'
         *
         * var jPath = new JPath('$.propertyName[*].objectName.propertyName2[*].propertyName3[*]');
         * jPath.SetIndexesOfPathArray([10, 20], true) //out: '$.propertyName[10].objectName.propertyName2[20].propertyName3[10]';
         * @param array {array} - the values of the to
         * @param all {boolean} - force to set all array-elements in the json path
         */
        JPath.prototype.SetIndexesOfPathArray = function (array, all) {
            var s = this.GetParts();
            var newPath = '';
            var c = 0;
            for (var i = 0; i < s.length; i++) {
                if (s[i].search(/(\[\d+\])|(\[\*\])/g) !== -1) {
                    var arrayPos;
                    if (all) {
                        arrayPos = c % array.length;
                    }
                    else {
                        arrayPos = c;
                    }
                    if (array[arrayPos] != null && array[arrayPos] !== '_') {
                        s[i] = s[i].replace(s[i].match(/(\[\d+\])|(\[\*\])/g)[0], '[' + array[arrayPos] + ']');
                    }
                    c++;
                }
                if (i < s.length - 1) {
                    newPath += s[i] + '.';
                }
                else {
                    newPath += s[i];
                }
            }
            return new JPath(newPath);
        };

        /**
         *@return {array|null} returns the indexes of json path who contains array-elements as a array and returns null if the json JPath doesn't contain any array-elements
         *@example
         * var path2 = '$.array[34].array2[33]';
         * var jPath = new JPath(path2);
         * jPath.GetIndexes() //out: [34, 44]
         *
         * var path3 = '$.array[*].array2[4].object';
         * var jPath = new JPath(path3);
         * jPath.GetIndexes(); //['*', 4]
         */
        JPath.prototype.GetIndexes = function () {
            var matches = this.Path.match(/(\[\d+\])|(\[\*\])/g);
            if (!matches) {
                return null;
            }
            var indexArray =[];
            for (var i = 0; i < matches.length; i++) {

                var val = matches[i].replace('[', '').replace(']', '');
                if (val !== '*') {
                    indexArray.push(parseInt(val));
                }
                else {
                    indexArray.push(val);
                }
            }
            return indexArray;
        };

        /**
         * determines if the a json path is a sub-path of another jsonPath.
         * check if this.Path contains sub-path as substring
         * @param subpath {string} - the sub-path
         * @return true if this.Path contains sub-path or false
         */
        JPath.prototype.IsSubPathOf = function (subpath) {
            if (this.Path.indexOf(subpath) !== -1) {
                return true;
            }
            else {
                var tmp_path = this.SetIndexesOfPathArray(['*'], true);
                subpath = new JPath(subpath).SetIndexesOfPathArray(['*'], true);
                if (tmp_path.Path.indexOf(subpath.Path) !== -1) {
                    return true;
                }
            }
            return false;
        };

        /**
         * private helper function for GetAllPossiblePaths
         * @see GetAllPossiblePathes
         */
        function GetAllPossiblePathsHelper(pathes, size, dim, index) {
            var new_res = [];
            for (var i = 0; i < pathes.length; i++) {
                for (var j = 0; j < size; j++) {
                    index[dim] = j;
                    new_res.push(new JPath(pathes[i].Path).SetIndexesOfPathArray(index));
                }
            }

            return new_res;
        }

        /**
         * calculates all possible json-paths.
         * requires the json-path to contains array-elements
         * @param sizes {array} - the ranges of the array
         * @returns a string-array with all json-paths
         * @example
         * var jPath = new JPath('$.array1[*].array2[0]');
         * var paths = jPath.GetAllPossiblePathes([3, 4]);
         * output:
         * ['$.array1[0].array2[0]', '$.array1[0].array2[1]', '$.array1[0].array2[2]', '$.array1[0].array2[3]',
         * '$.array1[1].array2[0]', '$.array1[1].array2[1]', '$.array1[1].array2[2]', '$.array1[1].array2[3]',
         * '$.array1[2].array2[0]', '$.array1[2].array2[1]', '$.array1[2].array2[2]', '$.array1[2].array2[3]']
         */
        JPath.prototype.GetAllPossiblePaths = function(sizes) {
            if (!this.ContainsArray()) {
                return [this];
            }
            var result = [];
            var index = [];
            for (var j = 0; j < sizes[0]; j++) {
                index[0] = j;
                result.push(this.SetIndexesOfPathArray(index));
            }
            index[0] = '_';
            for (var i = 1; i < sizes.length; i++) {
                result = GetAllPossiblePathsHelper(result, sizes[i], i, index);
                index[i] = '_';
            }
            return result;
        };



        /**
         * the root path of a the json path
         * @example
         * var path = new JPath('$.example1.test1');
         * console.log(path.GetRoot());
         * output
         * $.example1
         * @return return the root path the json path.
         */
        JPath.prototype.GetRoot = function () {
            return new JPath(this.Path.substring(0, this.Path.lastIndexOf('.')));
        };

        /**
         * determines if the json-path contains array-elements
         * @return true if the json-path contains array-elements else false
         */
        JPath.prototype.ContainsArray = function () {
            return this.Path.search(/(\[\d+\])|(\[\*\])/g) !== -1;
        };

        /**
         * Evaluates the JPath
         * @param {object} data
         * @returns {*}
         */
        JPath.prototype.eval = function(data){
            return jsonPath.eval(data, this.Path);
        };
        return JPath;
    });
