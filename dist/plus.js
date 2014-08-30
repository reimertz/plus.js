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

  function Writer() {
    this.functionCache = [];
    this.loopCache = [];
    this.partialLoopCache = [];
  };

  Writer.prototype.render = function(plusTemplate, templateData) {
    var id = plusTemplate.id;
    
    //plus.js reserved name
    templateData.element = '\'+ element +\'';
    
    var keys = Object.keys(templateData);
    var length = keys.length;
    var values = [];
    for (var i = 0; i < length; i++) {
      values[i] = templateData[keys[i]];
    }
    
     if (!this.functionCache[id]) {
      var preparedTemplate = "return '"+ plusTemplate.value + "'";  
      this.functionCache[id] = 
        new Function(defaultPlusUtils.funcKeys + keys.join(','), preparedTemplate);
    }
    
    return this.functionCache[id].apply(defaultWriter, defaultPlusUtils.functionArray.concat(values));
  }

  function PlusUtils() {
    this.funcKeys = 'loop,loopPartial,ifelse,quote,apostrophe,';
    this.functionArray = [this.loop,this.loopPartial,this.ifelse,this.quote,this.apostrophe];
  }

  PlusUtils.prototype.loop = function(templateData, htmlSkeleton) {
    var id = fastHash(htmlSkeleton);
    
    if (!this.loopCache[id]) {            
      var preparedTemplate = '';
      
      for(var i = 0; i<templateData.length; i++){
        preparedTemplate += htmlSkeleton.replace('element', 'element[' + i + ']');
      }
    
      this.loopCache[id] = new Function('p, element', "return '" + preparedTemplate + "'");
    }

    return this.loopCache[id](this, templateData);
  };

    
PlusUtils.prototype.loopPartial = function(templateData, templateName) {
  if (!this.partialLoopCache[templateName]) {
    var preparedTemplate = '',
        plusTemplate = plus.getTemplate(templateName).value;   

    for(var i = 0; i<templateData.length; i++){
      preparedTemplate += plusTemplate.replace('element', 'element[' + i + ']');
    }

    this.partialLoopCache[templateName] = new Function('p, d', "return '" + preparedTemplate + "'");
  }
  return this.partialLoopCache[templateName](this, {element:templateData});
}

PlusUtils.prototype.ifelse = function(statement, showData, elseData){
  return (statement !== void 0 && statement) ? showData : (elseData || '');
};
PlusUtils.prototype.quote = function(text) {
  return (text) ? '\"' + text + '\"' : '\"'
};
PlusUtils.prototype.apostrophe = function(text) {
  return (text) ? '\'' + text + '\''  : '\'';
};

var defaultScanner = new Scanner();
var defaultWriter = new Writer();
var defaultPlusUtils = new PlusUtils();
      
  plus.init = function(){
    var style = document.createElement("style");
        style.innerHTML = 'input[plus-template]{display:none !important;visibility:hidden !important;}';
        style.type = "text/css";
        style.rel = "stylesheet";

    document.getElementsByTagName("head")[0].appendChild(style);
  }

  plus.render = function(plusTemplate, templateData) {
    return defaultWriter.render(plusTemplate, templateData);
  }
   

  plus.renderHTML = function(htmlSkeleton, templateData) {
    var plusTemplate = {
      value : htmlSkeleton,
      id : fastHash(htmlSkeleton)
    };

    return defaultWriter.render(plusTemplate, templateData);
  }

  plus.getTemplate = function(templateName) {
    return defaultScanner.parse(templateName);
  }

  plus.name = "plus.js";
  plus.version = "0.0.1";
  plus.tags = [ "'+", "+'" ];

  plus.init();
}));