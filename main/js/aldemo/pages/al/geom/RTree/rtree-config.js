define(['altest/SampleData', 'al/math/Array'],

    function(SampleData, Array) {
        
        var config = {};
        
        config.rectCount = function() {
            return parseInt(document.getElementById('rect-count').value);
        };
        
        config.stepDelay = function() { 
            return parseInt(document.getElementById('step-delay').value);
        };
        
        config.rectSize = function() {
            return parseFloat(document.getElementById('rect-size').value);
        };
        
        config.numAvgs = function() {
            return parseInt(document.getElementById('num-avgs').value);
        };
        
        config.numDivs = function() {
            return parseInt(document.getElementById('num-divs').value);
        };
        
        config.rectPatternFn = function (size) {
            var rectPattern = document.getElementById('rect-pattern').value;
            if (rectPattern === 'grid') {
                return SampleData.makeGridRects(size, config.rectSize(), config.rectSize());
            } else if (rectPattern === 'circle') {
                return SampleData.makeCircleOfRects(size, config.rectSize(), config.rectSize());
            } else {
                var s = 1/(2*Math.sqrt(size));
                return SampleData.makeRandomRects(
                    size,
                    Array.scale([0.01, s], config.rectSize()),
                    Array.scale([0.01, s], config.rectSize())
                );
            }
        };
        
        return config;
    });