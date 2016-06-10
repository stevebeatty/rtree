define(function() {
    'use strict';
    
    var Array = {
        /**
         * Swaps the elements at indicies i and j in the array
         * @param {type} array
         * @param {type} i
         * @param {type} j
         * @returns {undefined}
         */
        swap: function(array, i, j) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        },
        
        /**
         * Determines if an array is in ascending (<=) order
         * 
         * @param {Array} array An array of Numbers
         * @returns {Boolean}
         */
        isSorted: function(array) {
            for (var i = 1; i < array.length; i++) {
                if (array[i] < array[i - 1]) return false;
            }
            
            return true;
        }
    };
    
    return Array;
});