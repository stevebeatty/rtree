define(['underscore'], function(US) {
    'use strict';
    
    var Random = {
        /**
         * Generates a random number with uniform distribution in the interval [min, max)
         * 
         * @param {Number|Array} min minium value or an Array of [min, max]
         * @param {Number=} max maxium value (optional if first is Array)
         * @returns {Number} number strictly less than max and greater than or
         *          equal to min
         */
        uniform: function(min, max) {
            if (US.isArray(min)) {
                max = min[1];
                min = min[0];
            }
            if (max < min ) throw new RangeError('max must not be less than min');
            return Math.random() * (max - min) + min;
        },
        
        /**
         * Generates a random integer with uniform distribution in the interval [min, max)
         * @param {type} min
         * @param {type} max
         * @returns {Number}
         */
        uniformInt: function(min, max) {
            return Math.floor(Random.uniform(min, max));
        },

        /**
         * Shuffles the entries in the array using the Fisher-Yates algorithm
         * @param {type} array
         * @returns {undefined}
         */
        shuffle: function(array) {
            if (!US.isArray(array)) throw new TypeError('"array" must be an array type');
            for (var i = 0; i < array.length; i++) {
                var r = Random.uniformInt(i, array.length - 1);
                var temp = array[i];
                array[i] = array[r];
                array[r] = temp;
            }
        }
    };
    
    return Random;
});