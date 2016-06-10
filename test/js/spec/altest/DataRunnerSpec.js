define(['altest/DataRunner'], function(DataRunner) {
    describe("DataRunner", function() {
        var runner;
        var data = [0, 1, 8, 15];
        var func = function(n) {
            return n + 1;
        };

        beforeEach(function() {
            runner = new DataRunner();
            runner.data = data;
        });
        
        it("should be complete with no tasks", function() {
            expect(runner.isComplete()).toEqual(true);
            expect(runner._findTaskIndexToRun()).toEqual(null);
            expect(runner._getNextTask()).toEqual(null);
            expect(runner.getProgress()).toEqual(0);
        });
        
        it("should not be complete with non-empty tasks", function() {
            runner.addTask(func);
            expect(runner.isComplete()).toBe(false);
        });
        
        it("the first task should be the first entry", function() {
            var idx = runner.addTask(func);
            
            expect(runner._findTaskIndexToRun()).toBe(idx);
            expect(runner._getNextTask()).toBe(runner.tasks[idx]);
        });
        
        it("running the next task should not complete until data is empty", function() {
            var idx = runner.addTask(func);
            
            expect(runner.runNextTask()).toBe(true);
            expect(runner.nextTask).toBe(idx);
            expect(runner._findTaskIndexToRun()).toBe(idx);
            expect(runner.getProgress()).toEqual(0.25);
            
            expect(runner.runNextTask()).toBe(true);
            expect(runner.getProgress()).toEqual(0.5);
            
            expect(runner.runNextTask()).toBe(true);
            expect(runner.getProgress()).toEqual(0.75);
            
            expect(runner.runNextTask()).toBe(true);
            expect(runner._findTaskIndexToRun()).toBe(null);
            expect(runner.getProgress()).toEqual(1);
            
            expect(runner.runNextTask()).toBe(false);
            expect(runner.getProgress()).toEqual(1);
            
            expect(runner.isComplete()).toBe(true);
        });
        
        it("should be able to run a task for each item in data", function() {
            runner.addTask(func);
            
            var count = 0;
            while (!runner.isComplete() && runner.runNextTask()) {
                count++;
            }
            
            expect(count).toEqual(4);

        });
        
        it("should be able to run a task for each item in data", function() {
            var idx = runner.addTask(func);
            
            var count = 0;
            while (!runner.isComplete()) {
                runner.runNextTask();
                count++;
            }

            expect(runner.results.length).toBe(1);
            expect(runner.results[idx].length).toBe(data.length);

            for (var i = 0; i < data.length; i++) {
                var d = data[i],
                    r = runner.results[idx][i];
                
                expect(r).toBe(d + 1);
            }

        });
        
        it("should be able to run 2 task and get results for each", function() {
            var idx1 = runner.addTask(func);
            var idx2 = runner.addTask(func);
            
            var count = 0;
            while (!runner.isComplete() && runner.runNextTask()) {
                count++;
            }
            
            expect(count).toBe(8);
            expect(runner.results.length).toBe(2);
            expect(runner.results[idx1].length).toBe(data.length);
            expect(runner.results[idx2].length).toBe(data.length);
            
            for (var i = 0; i < data.length; i++) {
                var d = data[i],
                    r1 = runner.results[idx1][i],
                    r2 = runner.results[idx2][i];
                
                expect(r1).toBe(d + 1);
                expect(r2).toBe(d + 1);
            }
        });
    });
});    
