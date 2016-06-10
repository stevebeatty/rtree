define(function() {
    
    function RunnerRunner() {
        this.runners = [];
        this.nextRunner = 0;
    }

    RunnerRunner.prototype.addRunner = function(runner) {
        var index = this.runners.length;
        this.runners.push(runner);
        return index;
    };

    RunnerRunner.prototype._findNextIndexToRun = function() {
        for (var i = this.nextRunner; i < this.runners.length; i++) {
            var runner = this.runners[i];
            if (!runner.isComplete()) {
                return i;
            }
        }
        
        for (var i = 0; i < this.nextRunner; i++) {
            var runner = this.runners[i];
            if (!runner.isComplete()) {
                return i;
            }
        }
        
        return null;
    };
    
    RunnerRunner.prototype._getNextRunner = function() {
        var index = this._findNextIndexToRun();
        if (index === null) return null;
        
        var runner = this.runners[index];
        
        index++;
        if (index >= this.runners.length) {
            this.nextRunner = 0;
        } else {
            this.nextRunner = index;
        }
        
        return runner;
    };

    RunnerRunner.prototype.runNext = function() {
        var runner = this._getNextRunner();
        if (!runner) return false;
        
        runner.runNextTask();
        return true;
    };

    RunnerRunner.prototype.isComplete = function() {
        for (var i = 0; i < this.runners.length; i++) {
            var runner = this.runners[i];
            if (!runner.isComplete()) return false;
        }
        
        return true;
    };
    
    RunnerRunner.prototype.getProgress = function() {
        var prog = 0;
        for (var i = 0; i < this.runners.length; i++) {
            prog += this.runners[i].getProgress();
        }
        return prog / Math.max(this.runners.length, 1);
    };

    return RunnerRunner;
});