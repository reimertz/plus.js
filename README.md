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

### Variables (d.variable)
```javascript
//<input plus-template id="framework" value="
//  <span>This framework is called '+ d.name +' </span>
//">

plus.render(plus.getTemplate('framework'), {name:'plus.js'})
```
The template data is reached by prefixing an variable with "d." (d standing for data).
So, '+ d.variable +'.

### Functions (p.functions)

```javascript
//<input plus-template id="loop" value="
//  <ul>
//    '+ p.loop(d.array, '<li>', d.item, '</li>') +'
//  </ul>
//  <a href='+ p.quote('mailto:' + d.mail) +'> '+ d.mail+'</a>
//">
plus.render(plus.getTemplate('loop'), {mail: 'pierre@pierrereimertz.com', array:['h','e','l','l','o']});
```

All plus.js functions are reached from variable p, and 

```javascript
'+ p.loop(d.array, '<li>'+ d.item +'</li>') +'
'+ p.loopPartial(d.array, 'templateName') +'
'+ p.if(variable, 'this will be rendered if true', 'this will be rendered if false (optional)') +'   
'+ p.quote('this will be quoted') 
'+ p.apostrophe('this will be apostrophed') 
```

### A complex example
```html
<input plus-template id="loopMe.gear" value="
<li>'+ d.item.name +'</li>
">

<input plus-template id="loopMe" value="
<h1>'+ d.name +'</h1>
<h3>'+ d.age +' years old</h3>
<a href='+ p.quote('mailto:' + d.mail) +'> '+ d.mail+'</a>
<h3>'+ d.mail +' years old</h3>
Likes:
<ul>
'+  p.loop(d.likes, '<li>'+ d.item +'</li>') +'  
</ul>

<ul>
'+  p.loopPartial(d.gear , 'loopMe.gear') +' 
</ul>
">
```
```javascript
var me = {
    age: 27,
    name: 'Pierre Reimertz',
    mail: 'pierre@pierrereimertz.com',
    likes: ['music','programming','beer'],
    gear:[{
      name: 'macbook pro retina'
    },{
      name: 'macbook white'
    },{
      name: 'iPad Air'
    },{
      name: 'iPhone 4S'
    }]
  };
document.write(plus.render(plus.getTemplate('loopMe'),me));
```
