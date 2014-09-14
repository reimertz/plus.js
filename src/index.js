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

  var loopCache = [];
  var partialLoopCache = [];

  function Writer() {
    this.functionCache = [];
    this.funcKeys = 'loop ,partial, i, ielse, quote, apostrophe, element,';
    this.functionArray = [this.loop, this.partial, this.i, this.ielse, this.quote, this.apostrophe, this.element];
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

  Writer.prototype.loop = function(templateData, htmlSkeleton) {
    var id = fastHash(htmlSkeleton);
    
    if (!loopCache[id] || templateData.length != loopCache[id].length) {        
      var preparedTemplate = '';
      
      for(var i = 0; i<templateData.length; i++){
        preparedTemplate += htmlSkeleton.replace('element', 'element[' + i + ']');
      }
    
      loopCache[id] = {
        func : new Function('element', "return '" + preparedTemplate + "'"),
        length : templateData.length
      }
    }

    return loopCache[id].func.call(this, templateData);
  };

Writer.prototype.partial = function(templateData, templateName) {
  if (!partialLoopCache[templateName] || templateData.length != partialLoopCache[templateName].length) {
    var preparedTemplate = '',
        plusTemplate = plus.getTemplate(templateName).textContent.replace(/(\r\n|\n|\r)/gm,"");   

    for(var i = 0; i<templateData.length; i++){
      preparedTemplate += plusTemplate.replace('element', 'element[' + i + ']');
    }

    partialLoopCache[templateName] = {
      func : new Function('p, element', "return '" + preparedTemplate + "'"),
      length : templateData.length
    }
  }
  return partialLoopCache[templateName].func(this, templateData);
}

Writer.prototype.i = function(statement, showData){
  return (statement !== void 0 && statement) ? showData || '' : '';
};

Writer.prototype.ielse = function(statement, showData, elseData){
  return (statement !== void 0 && statement) ? showData : (elseData || '');
};


Writer.prototype.quote = function(text) {
  return (text) ? '\"' + text + '\"' : '\"'
};
Writer.prototype.apostrophe = function(text) {
  return (text) ? '\'' + text + '\''  : '\'';
};

Writer.prototype.element = '\'+ element +\'';

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
  plus.version = "0.0.2";
  plus.tags = [ "'+", "+'" ];

}));