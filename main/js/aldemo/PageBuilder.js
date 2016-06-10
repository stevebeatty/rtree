define(['jquery', 'handlebars-templates'], function(jQuery, HB) {
    function PageBuilder (config, pageContext) {
        this.config = config;

        this.options = {
            config: config,
            pageContext: pageContext
        };
    };
    
    PageBuilder.prototype.addHead = function() {
        document.title = this.options.pageContext.title;
    };
    
    PageBuilder.prototype.addNav = function(context) {
        var html = HB.templates.nav(context);
        jQuery('body').prepend(html);
    };
    
    PageBuilder.prototype.build = function() {
        this.addHead();
        
        if (this.config.hasNav) {
            this.addNav(this.options);
        }
    };
    
    return PageBuilder;
});

