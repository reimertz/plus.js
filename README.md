plus.js
=======


A lightweight, high-performance templating engine that based on one eureka moment:

* Use '+ +' as tags since this make the template evaluable.

These enable the following:
```html
<script id="exampleTemplate"  type="text/template">
'+ name +' is an lightweight and performant
templating-engine.
</script>
```

```javascript
plus.render(plus.getTemplate('exampleTemplate'), {name:'plus.js'});
//plus.js is an lightweight and performant
//templating-engine.
```

plus.js also caches all the templates based on their ID's so, no need to compile a template twice.

This makes it very fast! http://jsperf.com/mustache-against-handlebars/19

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

## Functions
plus.js has basic support for looping, partials and if-statements.

###loop

When looping over an array, use '+ element +' where you want to
inject each element of the array.

```html
<script id="foxTemplate" type="text/template">
  <h2>What did the fox say?</h2>
  <ul>
    '+ loop(foxSaid).over('<li>'+ element +'</li>') +'
  </ul>
</script>
```

```javascript
var data = {
  foxSaid: [
    'Ring-ding-ding-ding-dingeringeding!',
    'Gering-ding-ding-ding-dingeringeding!',
    'Gering-ding-ding-ding-dingeringeding!'
]};

plus.render(plus.getTemplate('foxTemplate'), data);
//<h2>What did the fox say?</h2>
//<ul>
//  <li>'Ring-ding-ding-ding-dingeringeding!'</li>
//  <li>'Gering-ding-ding-ding-dingeringeding!',</li>
//  <li>'Gering-ding-ding-ding-dingeringeding!'</li>
//</ul>
```

###partial

If you want to render more complex templates, use partials.

As before, use '+ element +' to reach child-keys.

```html
<script id="meTemplate.love"  type="text/template">
  <li>
    <h4><b>'+ element.name +'</b></h4>
    <p><i>'+ element.why +'</i></p>
  </li>
</script>

<script id="meTemplate"  type="text/template">
  <h2>I really '+ doWhat +' these kind of things:</h2>
  <ul>
    '+  partial(data.love , 'meTemplate.love') +' 
  </ul>
</script>
```

```javascript
var data = {
  doWhat: 'love',
  love: [
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

###if-statements

If you want to render more complex templates, use partials.

As before, use '+ element +' to reach child-keys.

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

## Utilities

### Quotes
```javascript
var data = {
  mail:'pierre.reimertz@gmail.com'
};

plus.renderHTML('<a href='+ quote('mailto:' + mail) +'> '+ mail+'</a>', data);
//<a href="mailto:pierre.reimertz@gmail.com">pierre.reimertz@gmail.com</a>
```

### Apostrophes
```javascript
var data = {
  name: 'plus.js'
};

plus.renderHTML('<span>'+ quote(name) +'</span>', data);
//<span>'plus.js'</span>
```

### Example
#### template
```html
<script id="janeTemplate.gear"  type="text/template">
<li>'+ elemen.name +'</li>
</script>

<script id="janeTemplate"  type="text/template">
<h1>'+ name +'</h1>
<h3>'+ age +' years old</h3>
<a href='+ quote('mailto:' + mail) +'> '+ mail+'</a>
<h3>'+ mail +' years old</h3>
Likes:
<ul>
'+  loop(likes).over('<li>'+ element +'</li>') +'  
</ul>

<ul>
'+  partial(gear , 'janeTemplate.gear') +' 
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
```
#### result
```javascript
plus.render(plus.getTemplate('janeTemplate'),jane);
//<h1>Jane Complex</h1>
//<h3>23 years old</h3><a href="mailto:jane@d.oe"> jane@d.oe</a>
//<h3>jane@d.oe years old</h3>Likes:
//<ul>
    //<li>music</li>
    //<li>programming</li>
    //<li>beer</li>
//</ul>Gear:
//<ul>
    //<li>macbook pro retina</li>
    //<li>macbook white</li>
    //<li>iPad Air</li>
    //<li>iPhone 4S</li>
//</ul>
```
