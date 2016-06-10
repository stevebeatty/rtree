define(['al/math/Array', 'underscore'], function(Array, US) {
    describe("math.Array", function() {
        var numbers;
        
        beforeEach(function() {
            numbers = [42, 6.022, 3.14, 2.718, 0, -1];
        });
        
        /**
         * uniform
         */
        describe("scale", function() {

            /**
             * This is a randomized test
             */
            it("should scale every number by a value ", function() {
                var s = 4.5,
                    arr = numbers.slice();
                    
                Array.scale(arr, s);
                
                for (var i = 0; i < numbers.length; i++) {
                    expect(arr[i]).toBe(s * numbers[i]);
                }
            });

           
        });
    });
});