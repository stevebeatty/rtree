
require(['aldemo/context/index-context', 'aldemo/PageBuilder', 'aldemo/config'], 
    function(context, PageBuilder, config) {
    var builder = new PageBuilder(config, context);
    builder.build();
});