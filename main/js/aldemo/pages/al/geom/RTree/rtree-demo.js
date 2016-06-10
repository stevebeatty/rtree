require(['aldemo/PageBuilder', 'aldemo/PageContext', 'aldemo/config',
    'al/geom/Rect', 'al/geom/RTree', 'al/math/Random',
    'aldemo/pages/al/geom/RTree/rtree-config'],

    function(PageBuilder, PageContext, config,
            Rect, RTree, Random,
            rtreeConfig) {
        
    var context = new PageContext('RTree Demo', 3),
        builder = new PageBuilder(config, context);
    builder.build();
    

    var rtree, // RTree used in demo
        rectsToInsert = [], // Rects to insert into the RTree
        runId = 0; // unique id to determine if another run request has occured

    /**
     * Resets and restarts the demo
     */
    function resetDemo() {
        rectsToInsert = [];
        oneStep(++runId);
    }

    /**
     * Runs one step of the demo then schedules the next via setTimeout.  Stops
     * when the runId changes.  Will restart the demo when no rects are left to
     * insert
     * @param {type} id
     */
    function oneStep(id) {
        if (id !== runId) {
            return;
        }
        
        if (rectsToInsert.length === 0) {
            rectsToInsert = rtreeConfig.rectPatternFn(rtreeConfig.rectCount());
            rtree = new RTree();
        }

       var r = rectsToInsert.pop();
       rtree.insert(r, '');

       draw();

       var nextStep = function () {
           oneStep(id);
       };

       window.setTimeout(nextStep, rtreeConfig.stepDelay());
    }

    /**
     * Draws the RTree Demo
     */
    function draw() {
        var canvas = document.getElementById("rtree"),
            ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "20px Arial";
        ctx.fillText("RTree Demo, step " + rtree.size, 10, 20);

        ctx.save();

        var scale = 390,
            dx = 8 / scale,
            dy = -(40 + scale)/scale;

        ctx.scale(scale, -scale);
        ctx.translate(dx, dy);
        ctx.lineWidth = 1/scale;
        ctx.globalAlpha = 0.65;

        rtree.draw(ctx);
        drawRandomSearch(ctx);
        
        ctx.restore();
    }
    
    /**
     * Deletes and reinserts random entries log(size) times based on a random
     * probability
     * @param {type} ctx
     */
    function randomDeleteAndInsert(ctx) {
        if (Math.random() < 0.5 && rtree.height > 1) {
           ctx.save();
           
           var times = Math.floor(Math.log(rtree.size));
           
           ctx.strokeStyle = 'cyan';
           ctx.fillStyle = 'cyan';

           for (var i = 0; i < times; i++) {
               var entry = rtree.randomEntry();
               entry.rect.drawFilled(ctx);
               rtree.delete(entry);
               rtree.insert(entry.rect, entry.value);
           }
           
           ctx.restore();
       }
    }
    
    /**
     * Performs a random search and draws the results
     * @param {type} ctx
     */
    function drawRandomSearch(ctx) {
        ctx.save();
        
       var x = Random.uniform(0.1, 0.6),
           y = Random.uniform(0.1, 0.6);

       var query = new Rect(x, y, x + Random.uniform(0.1, 0.4), y + Random.uniform(0.1, 0.4));
       ctx.strokeStyle = 'magenta';
       ctx.fillStyle = 'magenta';
       query.draw(ctx);

       var res = rtree.search(query);
       for (var i = 0; i < res.length; i++) {
           var el = res[i];
           el.rect.drawFilled(ctx);
       }
        
        ctx.restore();
    }
    
    document.getElementById('run-button').onclick = resetDemo;
    resetDemo();
});