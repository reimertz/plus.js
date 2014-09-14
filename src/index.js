/* 
* @preserve plus.js 0.0.1
* http://reimertz.github.io/plus.js
* (c) 2014 Pierre Reimertz
* may be freely distributed under the MIT license.
*/

(function (global, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports);
  } 
  else if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } 
  else {
    factory(global.plus = {});
  }
}(this, function (plus) {
  function fastHash(s) {
    var hash = 0, i = s.length-1;
    for ( ; i >= 0 ; --i) {
      hash = ((hash << 5) + hash) ^ s.charCodeAt(i);
    }
    return hash;
  };

  function Scanner() {
    this.templateCache = [];
  }; 

  Scanner.prototype.parse = function(templateName) {
    if (this.templateCache[templateName]) 
      return this.templateCache[templateName];

    this.templateCache[templateName] = document.getElementById(templateName);
    return this.templateCache[templateName];
  }

  function Looper(templateData) {
    this.templateData = templateData;
    this.variableName = 'element';
    return this;
  };

  Looper.cache = [];
  Looper.partialCache = [];

  Looper.prototype.as = function(variableName) {
    this.variableName = variableName;
    return this;
  }

  Looper.prototype.over = function(htmlSkeleton) {
    var id = fastHash(htmlSkeleton);
    
    if (!Looper.cache[id] || this.templateData.length != Looper.cache[id].length) {        
      var preparedTemplate = '';
      
      for(var i = 0; i<this.templateData.length; i++){
        preparedTemplate += htmlSkeleton.replace(this.variableName, '\'+_P[' + i + ']+\'');
      }
      Looper.cache[id] = {
        func : new Function('_P', "return '" + preparedTemplate + "'"),
        length : this.templateData.length
      }
    }
    return Looper.cache[id].func.call(this, this.templateData);
  }

  Looper.prototype.overPartial = function(templateName) {
    if (!Looper.partialCache[templateName] || this.templateData.length != Looper.partialCache[templateName].length) {
      var preparedTemplate = '',
          plusTemplate = plus.getTemplate(templateName).textContent.replace(/(\r\n|\n|\r)/gm,"");   

      for(var i = 0; i<this.templateData.length; i++){
        preparedTemplate += plusTemplate.replace(this.variableName, '_P[' + i + ']');
      }

      Looper.partialCache[templateName] = {
        func : new Function('_P', "return '" + preparedTemplate + "'"),
        length : this.templateData.length
      }
    }
    return Looper.partialCache[templateName].func(this.templateData);
  }

  function Writer() {
    this.functionCache = [];
    this.funcKeys = 'loop ,partial, i, ielse, element,';
    this.functionArray = [this.loop, this.partial, this.i, this.ielse, this.element];
  };

  Writer.prototype.render = function(plusTemplate, templateData, loopNr) {
    var id = plusTemplate.id;
    var keys = Object.keys(templateData);
    var length = keys.length;
    var values = [];

    for (var i = 0; i < length; i++) {
      values[i] = templateData[keys[i]];
    }
    
    if (!this.functionCache[id]) {
      var preparedTemplate = "return '" + plusTemplate.textContent.replace(/(\r\n|\n|\r)/gm,"") + "'";  
      this.functionCache[id] = 
        new Function(this.funcKeys + keys.join(','), preparedTemplate);
    }
    
    return this.functionCache[id].apply(this, this.functionArray.concat(values));
  }

  Writer.prototype.loop = function(templateData) {
    return new Looper(templateData);
  };

  Writer.prototype.i = function(statement, showData){
    return (statement !== void 0 && statement) ? showData || '' : '';
  };

  Writer.prototype.ielse = function(statement, showData, elseData){
    return (statement !== void 0 && statement) ? showData : (elseData || '');
  };


  var defaultScanner = new Scanner();
  var defaultWriter = new Writer();

  plus.render = function(plusTemplate, templateData) {
    return defaultWriter.render(plusTemplate, templateData);
  }

  plus.renderHTML = function(htmlSkeleton, templateData) {
    var plusTemplate = {
      textContent : htmlSkeleton,
      id : fastHash(htmlSkeleton)
    };

    return defaultWriter.render(plusTemplate, templateData);
  }

  plus.getTemplate = function(templateName) {
    return defaultScanner.parse(templateName);
  }

  plus.name = "plus.js";
  plus.version = "0.0.4";
  plus.tags = [ "'+", "+'" ];

}));