define(function() {
    
    function DataRunner() {
        this.data = [];
        this.tasks = [];
        this.results = [];
        this.nextTask = 0;
    }

    DataRunner.prototype.addTask = function(func, config) {
        var index = this.tasks.length,
            conf = config || {},
            context = conf.context || {};
        
        this.tasks.push({
            func: func,
            status: 'Not started',
            dataIndex: 0,
            taskIndex: index,
            config: conf,
            context: context
        });
        
        this.results.push([]);
        
        return index;
    };

    DataRunner.prototype._findTaskIndexToRun = function() {
        for (var i = this.nextTask; i < this.tasks.length; i++) {
            var task = this.tasks[i];
            if (task.status === 'Not started' || task.status === 'Stopped') {
                return i;
            }
        }
        
        for (var i = 0; i < this.nextTask; i++) {
            var task = this.tasks[i];
            if (task.status === 'Not started' || task.status === 'Stopped') {
                return i;
            }
        }
        
        return null;
    };
    
    DataRunner.prototype._getNextTask = function() {
        var index = this._findTaskIndexToRun();
        if (index === null) return null;
        
        var task = this.tasks[index];
        
        index++;
        if (index >= this.tasks.length) {
            this.nextTask = 0;
        } else {
            this.nextTask = index;
        }
        
        return task;
    };

    DataRunner.prototype.runNextTask = function() {
        var task = this._getNextTask();
        if (!task) return false;
        
        this._runTask(task);
        
        return true;
    };
    
    DataRunner.prototype._runTask = function(task) {
        if (task.dataIndex >= this.data.length) {
            //task.status = 'Complete';
            return false;
        }
        
        task.status = 'Running';
        
        // call the function with the data and store the result
        var datum = this.data[task.dataIndex],
            res = task.func.call(task.context, datum, task.dataIndex),
            resArray = this.results[task.taskIndex];
    
        resArray.push(res);
        
        // if a callback is specified then notify that a result is ready
        if (task.config.onResult) {
            task.config.onResult.call(task.context, res, datum);
        }
        
        task.dataIndex++;
        if (task.dataIndex < this.data.length) {
            task.status = 'Stopped';
        } else {
            task.status = 'Complete';
            // if a callback is specified then notify that is complete
            if (task.config.onComplete) {
                task.config.onComplete.call(task.context,
                    this.results[task.taskIndex], this.data);
            }
        }
    };

    DataRunner.prototype.isComplete = function() {
        for (var i = 0; i < this.tasks.length; i++) {
            var task = this.tasks[i];
            if (task.status !== 'Complete') return false;
        }
        
        return true;
    };
    
    DataRunner.prototype.getProgress = function() {
        var prog = 0;
        for (var i = 0; i < this.tasks.length; i++) {
            prog += this.tasks[i].dataIndex / this.data.length;
        }
        return prog / Math.max(this.tasks.length, 1);
    };

    return DataRunner;
});