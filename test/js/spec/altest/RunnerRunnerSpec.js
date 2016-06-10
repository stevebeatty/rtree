define(['altest/DataRunner', 'altest/RunnerRunner'], function(DataRunner, RunnerRunner) {
    describe("RunnerRunner", function() {
        var runner;
        var data = [0, 1, 8, 15];
        var func = function(n) {
            return n + 1;
        };

        beforeEach(function() {
            runner = new RunnerRunner();
        });
        
        it("should be complete with no tasks", function() {
            expect(runner.isComplete()).toEqual(true);
            expect(runner._findNextIndexToRun()).toEqual(null);
            expect(runner._getNextRunner()).toEqual(null);
        });
        
        
        
        describe("DataRunner tests", function() {
            
            var dataRunner1, dataRunner2, dataRunner3,
                data2 = [3, 4, 7, 8, 9];
            
            beforeEach(function() {
                runner = new RunnerRunner();
                
                dataRunner1 = new DataRunner();
                dataRunner1.data = data;
                dataRunner1.addTask(func);
                
                dataRunner2 = new DataRunner();
                dataRunner2.data = data;
                dataRunner2.addTask(func);
                
                dataRunner3 = new DataRunner();
                dataRunner3.data = data2;
                dataRunner3.addTask(func);
            });
            
            it("should not be complete with non-empty tasks", function() {
                runner.addRunner(dataRunner1);

                expect(runner.isComplete()).toBe(false);
                expect(runner.getProgress()).toBe(0);
            });
            
            it("the first task should be the first entry", function() {
                var idx = runner.addRunner(dataRunner1);
                runner.addRunner(dataRunner2);

                expect(runner._findNextIndexToRun()).toBe(idx);
                expect(runner._getNextRunner()).toBe(runner.runners[idx]);
            });

            it("running the next task should not complete until data is empty", function() {
                var idx = runner.addRunner(dataRunner1);

                expect(runner.runNext()).toBe(true);
                expect(runner.nextRunner).toBe(idx);
                expect(runner._findNextIndexToRun()).toBe(idx);
                expect(runner.getProgress()).toBe(0.25);

                expect(runner.runNext()).toBe(true);
                expect(runner.getProgress()).toBe(0.5);
                
                expect(runner.runNext()).toBe(true);
                expect(runner.getProgress()).toBe(0.75);
                
                expect(runner.runNext()).toBe(true);
                expect(runner._findNextIndexToRun()).toBe(null);
                expect(runner.getProgress()).toBe(1);
                
                expect(runner.runNext()).toBe(false);
                expect(runner.getProgress()).toBe(1);

                expect(runner.isComplete()).toBe(true);
            });

            it("should be able to run a task for each item in data", function() {
                runner.addRunner(dataRunner1);
                runner.addRunner(dataRunner2);
                runner.addRunner(dataRunner3);

                var count = 0;
                while (!runner.isComplete() && runner.runNext()) {
                    count++;
                }

                expect(count).toEqual(13);

            });

            it("should be able to run a task for each item in data", function() {
                var idx = runner.addRunner(dataRunner1);
                          runner.addRunner(dataRunner2);

                while (!runner.isComplete()) {
                    runner.runNext();
                }

                expect(runner.runners[idx].results.length).toBe(1);
                expect(runner.runners[idx].results[0].length).toBe(data.length);

                for (var i = 0; i < data.length; i++) {
                    var d = data[i],
                        r = runner.runners[idx].results[0][i];

                    expect(r).toBe(d + 1);
                }

            });

            it("should be able to run 4 task and get results for each", function() {
                // add another task
                dataRunner1.addTask(func);
                
                var idx1 = runner.addRunner(dataRunner1),
                    idx2 = runner.addRunner(dataRunner2),
                    idx3 = runner.addRunner(dataRunner3);

                var count = 0;
                while (!runner.isComplete() && runner.runNext()) {
                    count++;
                }

                expect(count).toBe(17);
                expect(runner.runners[idx1].results.length).toBe(2);
                expect(runner.runners[idx1].results[0].length).toBe(data.length);
                expect(runner.runners[idx1].results[1].length).toBe(data.length);
                expect(runner.runners[idx2].results[0].length).toBe(data.length);

                for (var i = 0; i < data.length; i++) {
                    var d = data[i],
                        r1a = runner.runners[idx1].results[0][i],
                        r1b = runner.runners[idx1].results[0][i],
                        r2 = runner.runners[idx2].results[0][i];

                    expect(r1a).toBe(d + 1);
                    expect(r1b).toBe(d + 1);
                    expect(r2).toBe(d + 1);
                }
                
                for (var i = 0; i < data2.length; i++) {
                    var d = data2[i],
                        r3 = runner.runners[idx3].results[0][i];

                    expect(r3).toBe(d + 1);
                }
            });
        });
        
        
    });
});    
