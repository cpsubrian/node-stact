stact
=====

Manage a sorted stack of functions and execute them with flow control.

[![build status](https://secure.travis-ci.org/cpsubrian/node-stact.png)](http://travis-ci.org/cpsubrian/node-stact)

![Yummy](http://www.ihop.com/menus/main-menu/pancakes/-/media/ihop/MenuItems/Pancakes/Strawberry%20Banana%20Pancakes/Strawberry_Banana_Pancakes.png?mh=367)

Example
-------



API
---

### Add functions to the stack

Add functions to the stack using the API of [stac](https://github.com/cpsubrian/node-stac).

The last argument of the function MUST always be a continuation callback.

```js
stack.add(function (next) {
  // Do stuff.

  done();
});
```

All of **stac**'s API is supported, such as weighting your stack:

```js
stack.add(300, function () { /* ... */ });
stack.add(100, function () { /* ... */ });
stack.add(500, function () { /* ... */ });
```

### Add objects to the stack (that have a function property)

For more advanced use cases, you can add objects to the stack, but you'll
need to specify the property where the function can be found.

```js
var createStact = require('stact');
var stack = createStact({
  funcProp: 'task'
});

stack.add({
  name: 'Read Files',
  task: function (next) {
    // Do some work.

    next();
  }
});

stack.add({
  name: 'Save to S3',
  task: function (next) {
    // Do some work.

    next();
  }
});
```

### Create a stack that revolves around one function.

In somecases you want to call the same function multiple times with different
information.

```js
var createStact = require('stact');
var stack = createStact(function (prefix, next)
  // `this` will be set to the items added to the stack.
  next(null, prefix + this);
});

stack.add('Brian');
stack.add('Joe');
stack.add('Mary');

stack.runSeries('Name: ', function (err, results) {
  console.log(results);
  // [ 'Name: Brian', 'Name: Joe', 'Name: 'Mary' ]
});
```

### stack.run ( [arguments ...], callback )

Run the stack (in parallel), passing arbitray arguments to the functions.

```js
stack.run (arg1, arg2, function (err, results) {
  // Handle error or the results.
});
```


### stack.runSeries ( [arguments ...], callback )

Run the stack (in series), passing arbitrary arguments to the functions.

```js
stack.runSeries (arg1, arg2, arg3, function (err, results) {
  // Handle error or the results.
});
```


- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT
Copyright (C) 2013 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
