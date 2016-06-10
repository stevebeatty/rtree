define(['al/math/Random', 'underscore'], function(Random, US) {
    describe("math.Random", function() {
        
        /**
         * uniform
         */
        describe("uniform", function() {

            /**
             * This is a randomized test
             */
            it("should return a random in the interval [min, max)", function() {
                var min = 0,
                    max = 10;
                
                for (var i = 0; i < 100; i++) {
                    var r = Random.uniform(min, max);
                    expect(min <= r).toBeTruthy();
                    expect(r < max).toBeTruthy();
                }
            });

            it("max must not be less than min", function() {
               function t() {
                   Random.uniform(1, 0);
               } 
               
               expect(t).toThrow();
            });
        });
        
        
        /**
         * uniformInt
         */
        describe("uniformInt", function() {

            /**
             * This is a randomized test
             */
            it("should return a random in the interval [min, max)", function() {
                var min = 0,
                    max = 10;
                
                for (var i = 0; i < 100; i++) {
                    var r = Random.uniformInt(min, max);
                    expect(min <= r).toBe(true);
                    expect(r < max).toBe(true);
                }
            });
            
            it("should return only 0s for [0, 1)", function() {
                var min = 0,
                    max = 1;
                
                for (var i = 0; i < 100; i++) {
                    var r = Random.uniformInt(min, max);
                    expect(r).toBe(0);
                }
            });

            it("max must not be less than min", function() {
               function t() {
                   Random.uniformInt(1, 0);
               } 
               
               expect(t).toThrow();
            });
            
            it("a range of 1 will return only one value", function() {
               var v = 42;
               expect(Random.uniformInt(v, v+1)).toBe(v);
            });
        });
        
        /**
         * shuffle
         */
        describe("shuffle", function() {

            it("non-arrays should throw an error", function() {
                function t() {
                    Random.shuffle(null);
                }
                
                expect(t).toThrow();
            });
            
            it("no values should be removed", function() {
                var orig = [1, 2, 3, 4, 5, 6, 7],
                    copy = orig.slice();
                    
                Random.shuffle(copy);
                var diff = US.difference(orig, copy);
                expect(diff.length).toBe(0);
            });


        });
        
    });
});