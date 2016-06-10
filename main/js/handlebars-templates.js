define(['handlebars.runtime'], function(Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['nav'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\r\n    <div class=\"container\">\r\n      <div class=\"navbar-header\">\r\n        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\r\n          <span class=\"sr-only\">Toggle navigation</span>\r\n          <span class=\"icon-bar\"></span>\r\n          <span class=\"icon-bar\"></span>\r\n          <span class=\"icon-bar\"></span>\r\n        </button>\r\n        <a class=\"navbar-brand\" href=\"/RTree/index.html\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.config)),stack1 == null || stack1 === false ? stack1 : stack1.projectName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n      </div>\r\n      <div class=\"collapse navbar-collapse\">\r\n        <ul class=\"nav navbar-nav\">\r\n          <li><a href=\"/RTree/html/al/geom/RTree/rtree-demo.html\">Demo</a></li>\r\n          <li><a href=\"/RTree/html/al/geom/RTree/rtree-time.html\">Time</a></li>\r\n        </ul>\r\n      </div><!--/.nav-collapse -->\r\n    </div>\r\n  </div>";
  return buffer;
  });
return Handlebars;
});