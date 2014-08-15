plus.js
=======

An lightweight, high-performance templating engine based on two eureka moments:

1. Everything in input.value will be returned as a one-line. So plus.js use `<input plus-template id="" value="">` to store templates.
2. Use '+  +'  as tags inside input.value since this will make the string evaulable.

These combined enable the following:
```javascript
var preparedTemplate = "return '"+ plusTemplate.value + "'",
    compileFunction = new Function('p', 'd', preparedTemplate);
    return compileFunction(_plusUtils, templateData, preparedTemplate);
```

plus.js also caches all the templates based on their ID's so, no need to compile a template twice.

This makes it very fast.
http://jsperf.com/mustache-against-handlebars/10

Usage
-------

### Variables
```javascript
//<input plus-template id="framework" value="
//  <span>This framework is called '+ d.name +' </span>
//">

plus.render(plus.getTemplate('framework'), {name:'plus.js'})
```
The templateData passed in is reached from the variable d, (d standing for data).
So, to inject data into the template, just use, `'+ d.key +'`.

### Loops

```javascript
//<input plus-template id="loop" value="
//  <span>plus.js can</span>
//  <ul>
//    '+ p.loop('<li>', d.array, '</li>') +'
//  </ul>
//">
plus.render(plus.getTemplate('loop'), {array:['template','compile','loops','if-statements']});
```

All plus.js functions are reached from variable p.

Inorder to maintain the string evaulable, we pass in what we want to have before and after the injected data
into the loop-function, like this: p.loop(before,data,after);

At the moment, plus.js only supports arrays with depth = 1. Support for deeper depths will of course get added
in the future.

### if-statements

```javascript
//<input plus-template id="ifs" value="
//  '+ p.if(d.doNotRender, '<h1>This will not rendered.</h1>', '<h1>But this will.</h1>') +'   
//">
plus.render(plus.getTemplate('ifs'), {doRender:true});
plus.render(plus.getTemplate('ifs'), {dontRender:false});
```