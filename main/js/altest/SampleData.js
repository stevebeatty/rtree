define(['al/geom/Rect', 'al/math/Random'], function(Rect, Random) {
    'use strict';

    var Sample = {
        makeCircleOfRects: function(size, scaleX, scaleY) {
            var sqrtSize = Math.floor(Math.sqrt(size)),
                offset = 1 / (2 * sqrtSize),
                rects = [],
                step = 2*Math.PI/size,
                angle = 0,
                len = 0.4,
                circ = (Math.PI * 0.8)/size;
            
            scaleX = scaleX || 1;
            scaleY = scaleY || 1;

            for (var i = 0; i < size; i++) {
                var x = len * Math.cos(angle) + 0.5,
                    y = len * Math.sin(angle) + 0.5,
                    width  = scaleX * circ,
                    xmin = x - 1/2 * width,
                    height = scaleY * circ,
                    ymin   = y - 1/2 * height,
                    r      = new Rect(xmin, ymin, xmin + 1/2*width, ymin + 1/2*height);

                rects.push(r);
                angle += step;
            }

            Random.shuffle(rects);
            return rects;
        },
        
        makeRandomRects: function(size, widthRange, heightRange) {
            var rects = [];
            for (var i = 0; i < size; i++) {
                var width  = Math.min(Random.uniform(widthRange), 1),
                    height = Math.min(Random.uniform(heightRange), 1),
                    xmin   = Random.uniform(0, 1 - width),
                    ymin   = Random.uniform(0, 1 - height),
                    r      = new Rect(xmin, ymin, xmin + width, ymin + height);

                rects.push(r);
            }

            Random.shuffle(rects);
            return rects;
        },

        makeGridRects: function(size, scaleX, scaleY) {
            var sqrtSize = Math.floor(Math.sqrt(size)),
                offset = 1 / (2 * sqrtSize),
                rects = [];
            
            scaleX = scaleX || 1;
            scaleY = scaleY || 1;

            for (var i = 0; i < sqrtSize; i++) {
                for (var j = 0; j < sqrtSize; j++) {
                    var xmin   = 2 * offset * j,
                        width  = scaleX * offset,
                        ymin   = 2 * offset * i,
                        height = scaleY * offset,
                        r      = new Rect(xmin, ymin, xmin + width, ymin + height);
                    
                    rects.push(r);
                }
            }

            Random.shuffle(rects);
            return rects;
        }
    };

    return Sample;
});