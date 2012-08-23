/**
 * Module wrapper around the minified version of Backbone.Validation
 * https://github.com/thedersen/backbone.validation
 */
define(['backbone-plain', 'underscore'], function(Backbone, _){
    
    // Backbone.Validation v0.5.2
    //
    // Copyright (C)2011-2012 Thomas Pedersen
    // Distributed under MIT License
    //
    // Documentation and full license available at:
    // http://thedersen.github.com/backbone.validation
    Backbone.Validation=function(a,b,c){var d={forceUpdate:!1,selector:"name"},e=function(a){return b.reduce(b.keys(a.validation),function(a,b){return a[b]=c,a},{})},f=function(c,d,e){var f=d[e]||{};return b.isFunction(f)?f:b.isString(f)?c[f]:(b.isArray(f)||(f=[f]),b.reduce(f,function(c,d){return b.each(b.without(b.keys(d),"msg"),function(b){c.push({fn:a.Validation.validators[b],val:d[b],msg:d.msg})}),c},[]))},g=function(a,c){return b.isObject(a)&&b.isObject(a[c])&&b.isObject(a[c].validation)},h=function(c,d,e,g,h){var i=f(c,d,e);return b.isFunction(i)?i.call(c,g,e,h):b.reduce(i,function(b,d){var f=d.fn.call(a.Validation.validators,g,e,d.val,c,h);return f===!1||b===!1?!1:f&&!b?d.msg||f:b},"")},i=function(a,c,d,e,f,j){if(!d)return!1;var k=!0,l;for(var m in c){l=h(a,c,m,a.get(m),e);if(b.isUndefined(d[m])&&l){k=!1;break}!l&&f&&j.valid(f,m,j.selector),l!==!1&&g(c,m)&&(k=i(a,c[m].validation,d[m],e))}return k},j=function(a,c,d,e,f,k){k=k||"";var l,m,n,o=[],p=[],q=!0,r=b.extend(c.toJSON(),e);for(n in e)m=h(c,d,n,e[n],r),m?(o.push(m),p.push(k+n),q=!1,a&&f.invalid(a,n,m,f.selector)):a&&f.valid(a,n,f.selector),m!==!1&&g(d,n)&&(l=j(a,c,d[n].validation,e[n],f,k+n+"."),Array.prototype.push.apply(o,l.errorMessages),Array.prototype.push.apply(p,l.invalidAttrs),q=q&&l.isValid);return q&&(q=i(c,d,e,r,a,f)),{errorMessages:o,invalidAttrs:p,isValid:q}},k=function(a,c){return{isValid:function(a){if(b.isString(a))return!h(this,this.validation,a,this.get(a),this.toJSON());if(b.isArray(a)){for(var c=0;c<a.length;c++)if(h(this,this.validation,a[c],this.get(a[c]),this.toJSON()))return!1;return!0}return a===!0&&this.validate(),this.validation?this._isValid:!0},validate:function(d,f){var g=this,h=b.extend({},c,f);if(!d)return g.validate.call(g,b.extend(e(g),g.toJSON()));var i=j(a,g,g.validation,d,h);g._isValid=i.isValid,b.defer(function(){g.trigger("validated",g._isValid,g,i.invalidAttrs),g.trigger("validated:"+(g._isValid?"valid":"invalid"),g,i.invalidAttrs)});if(!h.forceUpdate&&i.errorMessages.length>0)return i.errorMessages}}},l=function(a,c,d){b.extend(c,k(a,d))},m=function(a){delete a.validate,delete a.isValid},n=function(a){l(this.view,a,this.options)},o=function(a){m(a)};return{version:"0.5.2",configure:function(a){b.extend(d,a)},bind:function(c,e){var f=c.model,g=c.collection,h=b.extend({},d,a.Validation.callbacks,e);f&&l(c,f,h),g&&(g.each(function(a){l(c,a,h)}),g.bind("add",n,{view:c,options:h}),g.bind("remove",o))},unbind:function(a){var b=a.model,c=a.collection;b&&m(a.model),c&&(c.each(function(a){m(a)}),c.unbind("add",n),c.unbind("remove",o))},mixin:k(null,d)}}(Backbone,_),Backbone.Validation.callbacks={valid:function(a,b,c){a.$("["+c+"~="+b+"]").removeClass("invalid").removeAttr("data-error")},invalid:function(a,b,c,d){a.$("["+d+"~="+b+"]").addClass("invalid").attr("data-error",c)}},Backbone.Validation.patterns={digits:/^\d+$/,number:/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i},Backbone.Validation.messages={required:"{0} is required",acceptance:"{0} must be accepted",min:"{0} must be grater than or equal to {1}",max:"{0} must be less than or equal to {1}",range:"{0} must be between {1} and {2}",length:"{0} must be {1} characters",minLength:"{0} must be at least {1} characters",maxLength:"{0} must be at most {1} characters",rangeLength:"{0} must be between {1} and {2} characters",oneOf:"{0} must be one of: {1}",equalTo:"{0} must be the same as {1}",pattern:"{0} must be a valid {1}",object:"{0} must be an object"},Backbone.Validation.validators=function(a,b,c){var d=String.prototype.trim?function(a){return a===null?"":String.prototype.trim.call(a)}:function(a){var b=/^\s+/,c=/\s+$/;return a===null?"":a.toString().replace(b,"").replace(c,"")},e=function(){var a=Array.prototype.slice.call(arguments),b=a.shift();return b.replace(/\{(\d+)\}/g,function(b,c){return typeof a[c]!="undefined"?a[c]:b})},f=function(b){return c.isNumber(b)||c.isString(b)&&b.match(a.number)},g=function(a){return!(c.isNull(a)||c.isUndefined(a)||c.isString(a)&&d(a)==="")};return{fn:function(a,b,d,e,f){return c.isString(d)&&(d=e[d]),d.call(e,a,b,f)},required:function(a,d,f,h){var i=c.isFunction(f)?f.call(h):f;if(!i&&!g(a))return!1;if(i&&!g(a))return e(b.required,d)},acceptance:function(a,d){if(a!=="true"&&(!c.isBoolean(a)||a===!1))return e(b.acceptance,d)},min:function(a,c,d){if(!f(a)||a<d)return e(b.min,c,d)},max:function(a,c,d){if(!f(a)||a>d)return e(b.max,c,d)},range:function(a,c,d){if(!f(a)||a<d[0]||a>d[1])return e(b.range,c,d[0],d[1])},length:function(a,c,f){if(!g(a)||d(a).length!==f)return e(b.length,c,f)},minLength:function(a,c,f){if(!g(a)||d(a).length<f)return e(b.minLength,c,f)},maxLength:function(a,c,f){if(!g(a)||d(a).length>f)return e(b.maxLength,c,f)},rangeLength:function(a,c,f){if(!g(a)||d(a).length<f[0]||d(a).length>f[1])return e(b.rangeLength,c,f[0],f[1])},oneOf:function(a,d,f){if(!c.include(f,a))return e(b.oneOf,d,f.join(", "))},equalTo:function(a,c,d,f,g){if(a!==g[d])return e(b.equalTo,c,d)},pattern:function(c,d,f){if(!g(c)||!c.toString().match(a[f]||f))return e(b.pattern,d,f)},validation:function(a,d,f){if(!c.isObject(a))return e(b.object,d)}}}(Backbone.Validation.patterns,Backbone.Validation.messages,_);
       
    return Backbone;
});