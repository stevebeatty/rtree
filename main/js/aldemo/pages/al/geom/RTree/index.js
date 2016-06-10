require(['aldemo/PageBuilder', 'aldemo/PageContext', 
    'aldemo/config'],

    function(PageBuilder, PageContext, config) {
        
    var context = new PageContext('RTree Index', 3),
        builder = new PageBuilder(config, context);
    builder.build();

});