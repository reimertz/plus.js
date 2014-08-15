var assert = require('assert');
var plus = require('../src/index.js');

//key
var keyData = {name: 'plus.js'};
assert.equal('<span>This framework is called plus.js</span>', plus.render(keyTemplate, keyData));

//loop
var loopData = {array:['be fast','do loops','understand if-statements']};

assert.equal('<span>This framework is called plus.js</span>', plus.render(loopTemplate, loopData));

//if
var ifDataShow = {doRender: true};
assert.equal('<h1>This will be rendered.</h1>', plus.render(ifTemplateShow, ifDataShow));

//if
var ifDataDontShow = {lol: true};
assert.equal('', plus.render(ifTemplateDontShow, ifDataDontShow));