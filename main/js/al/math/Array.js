define(function() {
    'use strict';
    
    var Array = {
        /**
         * Scales an Array of Numbers by a value
         * 
         * @param {Array} numbers Array of Numbers
         * @param {Number} s scalar value
         * @return {Array} the Array
         */
        scale: function(numbers, s) {
            for (var i = 0; i < numbers.length; i++) {
                numbers[i] *= s;
            }
            return numbers;
        }
    };
    
    return Array;
});