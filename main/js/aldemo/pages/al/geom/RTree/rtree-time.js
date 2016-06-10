require(['aldemo/PageBuilder', 'aldemo/PageContext', 'aldemo/config',
         'al/geom/Rect', 'al/geom/RTree', 'al/math/Random', 
         'altest/DataRunner', 'jquery', 'highcharts',
         'aldemo/pages/al/geom/RTree/rtree-config'],

    function(PageBuilder, PageContext, config,
        Rect, RTree, Random, 
        DataRunner, $, Highcharts,
        rtreeConfig) {
        
    var context = new PageContext('RTree Time', 3),
        builder = new PageBuilder(config, context);
    builder.build();
    
    var runner, // DataRunner to run the timing tests
        chart = createChart(), // creation time chart
        searchChart = createSearchTimeChart(), // search time chart
        runId = 0; // unique id to determine if another run request has occured

    /**
     * Setup before starting the test
     */
    function configureDemo() {
        runner = new DataRunner();
        runner.data = makeDataSteps(rtreeConfig.rectCount(), rtreeConfig.numDivs());

        var context = {
            rtrees: []
        };
        
        runner.addTask(genCreateFunc(), {
            onResult: function (result, datum) {
                var series = chart.series[0];
                series.addPoint([datum, result], true);
            },
            
            onComplete: function () {
                
                runner.addTask(genLinearFindFunc(), {
                    onResult: function (result, datum) {
                        var series = searchChart.series[0];
                        series.addPoint([datum, result], true);
                    },
                    context: context
                });
                
                runner.addTask(genBruteFindFunc(), {
                    onResult: function (result, datum) {
                        var series = searchChart.series[1];
                        series.addPoint([datum, result], true);
                    }
                });
            },
            context: context
        });
        
    }

    /**
     * Hide progress bars
     */
    function hideProgressBars() {
        $('#progress').hide();
    }
    
    /**
     * Show progress bars
     */
    function showProgressBars() {
        $('#progress').show();
    }

    /**
     * Removes all data from the series
     */
    function resetSeries() {
        chart.series[0].setData([], true);
        searchChart.series[0].setData([], true);
        searchChart.series[1].setData([], true);
    }

    /**
     * Reset and restart the demo
     */
    function resetDemo() {
        resetSeries();
        showProgressBars();
        
        configureDemo();
        oneStep(++runId);
    }

    /**
     * Makes evenly spaced intervals of size num/divs
     * @param {Number} num
     * @param {Number} divs
     * @returns {Array}
     */
    function makeDataSteps(num, divs) {
        var step = num / divs,
            arr = [];

        for (var i = step; i <= num; i += step) {
            arr.push(Math.round(i));
        }

        return arr;
    }

    /**
     * Generates a Function for creating an RTree that will be evaluated for each data value
     * @returns {Function}
     */
    function genCreateFunc() {
        var avgCount = rtreeConfig.numAvgs();
        
        return function(times, dataIndex) {
            var rt = new RTree(),
                rects = rtreeConfig.rectPatternFn(times);

            var avg = 0;
            for (var k = 0; k < avgCount; k++) {
                var start = new Date();

                rt = new RTree();

                for (var i = 0; i < rects.length; i++) {
                    var rect = rects[i];
                    rt.insert(rect, i);
                }
                var diff = new Date() - start;
                avg += diff;
            }
            this.rtrees[dataIndex] = rt;
            return avg / avgCount;
        };
    }
    
    /**
     * Generates a Function for searching a linear split RTree that will be evaluated for each data value
     * @returns {Function}
     */
    function genLinearFindFunc() {
        var x = Random.uniform(0, 0.4),
            y = Random.uniform(0, 0.4),
            r = new Rect(x, y, x + 0.1, y + 0.1),
            avgCount = rtreeConfig.numAvgs();

        return function(times, taskIndex) {
            var rtree = this.rtrees[taskIndex],
                avg = 0;

            for (var k = 0; k < avgCount; k++) {
                var found = null,
                    start = new Date(),
                    count = times;

                while (count > 0) {
                    found = rtree.search(r);
                    count--;
                }
                var diff = new Date() - start;
                avg += diff;
            }
            return avg / avgCount;
        };
    }
    
    /**
     * Checks every item in an array to see if it intersects a Rect
     * @param {Rect} r
     * @param {Array} arr
     * @returns {Array}
     */
    function arrayIntersectsRect(r, arr) {
        var result = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            var a = arr[i];
            if (r.intersects(a)) {
                result.push(a);
            }
        }
        return result;
    }
    
    /**
     * Generates a Function for searching an Array of Rect that will be evaluated for each data value
     * @returns {Function}
     */
    function genBruteFindFunc() {
        var x = Random.uniform(0, 0.4),
            y = Random.uniform(0, 0.4),
            r = new Rect(x, y, x + 0.1, y + 0.1),
            avgCount = rtreeConfig.numAvgs();

        return function(times) {
            var rects = rtreeConfig.rectPatternFn(times);
            
            var avg = 0;
            for (var k = 0; k < avgCount; k++) {
                var found = null,
                    start = new Date(),
                    count = times;

                while (count > 0) {
                    found = arrayIntersectsRect(r, rects);
                    count--;
                }
                var diff = new Date() - start;
                avg += diff;
            }
            return avg / avgCount;
        };
    }

    /**
     * Runs one step of the demo and will call itself via setTimeout until done.
     * Changing the runId will cause the sequence to stop.
     * @param {type} id
     */
    function oneStep(id) {
        if (id !== runId) {
            return;
        }
        
        if (runner.isComplete()) {
            hideProgressBars();
        } else {
            runner.runNextTask();
            $('progress').val(runner.getProgress());
            
            var nextStep = function () {
                oneStep(id);
            };

            window.setTimeout(nextStep, rtreeConfig.stepDelay());
        }
    }

    /**
     * Initializes the chart for creation time
     * @returns {Highcharts.Chart}
     */
    function createChart() {
        return new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'spline'
            },
            title: {
                text: 'Creation Time'
            },
            xAxis: {
                title: {
                    text: 'Rect Count'
                }
            },
            yAxis: {
                title: {
                    text: 'Time (ms)'
                }
            },
            series: [{
                name: 'Linear',
                data: []
            }]
        });
    }
    
    /**
     * Initializes the chart for search time
     * @returns {Highcharts.Chart}
     */
    function createSearchTimeChart() {
        return new Highcharts.Chart({
            chart: {
                renderTo: 'container2',
                type: 'spline'
            },
            title: {
                text: 'Search Time'
            },
            xAxis: {
                title: {
                    text: 'Rect Count'
                }
            },
            yAxis: {
                title: {
                    text: 'Time (ms)'
                }
            },
            series: [{
                name: 'Linear',
                data: []
            }, {
                name: 'Brute',
                data: []
            }]
        });
    }
    
    $('#run-button').click(resetDemo);
    hideProgressBars();
});