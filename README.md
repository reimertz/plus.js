plus.js
=======

A lightweight, templating engine that is all about speed.

plus.js is based on the idea of using '+ +' as tags since this make the template evaluable.
As long as you can trust your data (plus.js is using new Function to compile templates), you're fine.

plus.js also caches all the templates based on their ID's so, no need to compile a template twice.

This makes it very fast! http://jsperf.com/mustache-against-handlebars/22

*** A trivial example:***
```html
<script id="exampleTemplate"  type="text/template">
'+ name +' is a lightweight, templating engine that 
is all about speed.
</script>
```

```javascript
plus.render(plus.getTemplate('exampleTemplate'), {name:'plus.js'});
//plus.js is an lightweight and performant
//templating-engine.
```

## Variables

```html
<script id="frameworkTemplate"  type="text/template">
<h1>This framework is called '+ name +'</h1>
<i>'+ array[0] +' loves it!</i>
</script>
```
```javascript
plus.render(plus.getTemplate('frameworkTemplate'), {name:'plus.js', array:['Cats','red', 5]);
//<h1>This framework is called plus.js</h1>
//<i>Cats love it!</i>
```

## Loops

#### loop(data).over('htmlSkeleton')

When looping over an array,  use the default
placeholder "element".


```html
<script id="foxTemplate" type="text/template">
  <h2>What did the fox say?</h2>
  <ul>
    '+ loop(foxSaid).over('<li>element</li>') +'
  </ul>
</script>
```

```javascript
var data = {
  foxSaid: [
    'Ring-ding-ding-ding-dingeringeding!',
    'Gering-ding-ding-ding-dingeringeding!',
    'Gering-ding-ding-ding-dingeringeding!'
  ]
};

plus.render(plus.getTemplate('foxTemplate'), data);
//<h2>What did the fox say?</h2>
//<ul>
//  <li>Ring-ding-ding-ding-dingeringeding!</li>
//  <li>Gering-ding-ding-ding-dingeringeding!</li>
//  <li>Gering-ding-ding-ding-dingeringeding!</li>
//</ul>
```


#### loop(data).as('placeholder').over('htmlSkeleton')

Use .as() to set your own placeholder in loops.

```html
<script id="foxTemplateAs" type="text/template">
  <ul>
    '+ loop(animals).as('animal').over('<li><b>animal</b></li>') +'
  </ul>
</script>
```

```javascript
var data = {
  animals : ['fox','pig','cat','dog']
};

plus.render(plus.getTemplate('foxTemplateAs'), data);
//<ul>
//  <li><b>fox</b></li>
//  <li><b>pig</b></li>
//  <li><b>cat</b></li>
//  <li><b>dog</b></li>
//</ul>
```


#### loop(data).as('placeholder').overPartial('partialName')

If you want to render more complex templates, use partials.
As before, use "element" or call as() as a placeholder.

```html
<script id="meTemplate.love"  type="text/template">
  <li>
    <h4><b>'+ love.name +'</b></h4>
    <p><i>'+ love.why +'</i></p>
  </li>
</script>

<script id="meTemplate"  type="text/template">
  <h2>I really '+ doWhat +' these kind of things:</h2>
  <ul>
    '+  loop(loveList).as('love').overPartial('meTemplate.love') +' 
  </ul>
</script>
```

```javascript
var data = {
  doWhat: 'love',
  loveList: [
    {
      name: 'A specific girl',
      why: 'Because she is my everything.'
    },{
      name: 'My guitar',
      why: 'Because it makes me forget what is worth forgetting.'
    }
]};

plus.render(plus.getTemplate('meTemplate'), data);
//<h2>I really love these kind of things:</h2>
//<ul>
//  <li>
//    <h4><b>A specific girl</b></h4>
//    <p><i>Because she is my everything.</i></p>
//  </li>
//  <li>
//    <h4><b>My guitar</b></h4>
//    <p><i>Because it makes me forget what is worth forgetting.</i></p>
//  </li>
//</ul>
```

## if-statements

```html
<input plus-template id="ifTemplate"  type="text/template">
<b>'+ i(plusjsRockz, 'this is a if-statement')+'</b>
and <i>'+ ielse(!plusjsRockz, 'This will not be rendered', 'this is a else-statement') +'</i>
</script>
```

```javascript
var data = {
  plusjsRockz : true
};

plus.render(plus.getTemplate('meTemplate'), data);
//<b>this is a if-statement</b>
//and <i>this is a else-statement</i>
```

### Example
#### template
```html
<script id="janeTemplate.gear"  type="text/template">
<li>'+ gear.name +'</li>
</script>

<script id="janeTemplate"  type="text/template">
<h1>'+ name +'</h1>
<h3>'+ age +' years old</h3>
<a href="mailto:'+ mail +'">'+ mail +'</a>
<h3>'+ age +' years old</h3>
Likes:
<ul>
'+  loop(likes).as('like').over('<li>like</li>') +'  
</ul>

<ul>
'+  loop(gearList).as('gear').overPartial('janeTemplate.gear') +' 
</ul>
</script>
```
#### data
```javascript
var jane = {
  age: 23,
  name: 'Jane Complex',
  mail: 'jane@d.oe',
  likes: ['music','programming','beer'],
  gearList:[{
    name: 'Computer'
  },{
    name: 'Coffee Maker'
  },{
    name: 'Bike'
  },{
    name: 'Cat'
  }]
};
```
#### result
```javascript
plus.render(plus.getTemplate('janeTemplate'),jane);
//<h1>Jane Complex</h1>
//<h3>23 years old</h3>
//<a href="mailto:jane@d.oe"> jane@d.oe</a>
//<h3>jane@d.oe years old</h3>
//Likes:
//<ul>
    //<li>music</li>
    //<li>programming</li>
    //<li>beer</li>
//</ul>Gear:
//<ul>
    //<li>Computer</li>
    //<li>Coffee Maker</li>
    //<li>Bike</li>
    //<li>Cat</li>
//</ul>
```
