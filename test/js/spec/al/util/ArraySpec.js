define(['al/util/Array'], function(Array) {
    describe("util Array", function() {
        
        /**
         * Test swap
         */
        describe("swap", function() {
            var testArray;
        
            beforeEach(function() {
               testArray = [1, 2, 3, 4]; 
            });
            
            it("should swap a non-empty array", function() {
                var copy = testArray.slice();
                Array.swap(testArray, 0, 1);
                
                expect(testArray[0]).toBe(copy[1]);
                expect(testArray[1]).toBe(copy[0]);
                expect(testArray[2]).toBe(copy[2]);
                expect(testArray[3]).toBe(copy[3]);
            });
            
            it("should do nothing for a single element array", function() {
                var arr = [1];
                var copy = arr.slice();
                Array.swap(arr, 0, 0);
                
                expect(testArray[0]).toBe(copy[0]);
            });
            
        });
        
        
        describe("isSorted", function() {
            it("an empty array is sorted", function() {
                expect(Array.isSorted([])).toBe(true);
            });
            
            it("an array with one element is sorted", function() {
                expect(Array.isSorted([873])).toBe(true);
            });
            
            it("an array that is ascending is sorted", function() {
                expect(Array.isSorted([0, 1, 2, 3])).toBe(true);
            });
            
            it("an array that is not ascending is not sorted", function() {
                expect(Array.isSorted([3, 2, 1, 0])).not.toBe(true);
            });
            
            it("an null is not sorted", function() {
                function t() {
                    return Array.isSorted(null);
                }
                
                expect(t).toThrow();
            });
        });
    });
});