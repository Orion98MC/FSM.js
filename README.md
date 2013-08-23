# Description

A lightweight Finite State Machine in Javascript for nodejs and browsers

## Usage

```js  
var machine = new FSM();
```

### Transitions

Define a transition using:
```js  
machine.on(event, transitionFromState, toState, withCallback);
```

Example:
```js  
machine.on('POWER', 'off', 'on', function (done) {
  warmup();
  done(); // !very important!, it finishes the transition!
});
```

### State

You may define funtions to be run when a state is entered, leaved, or cycled.

Example:
```js  
machine.enter('on', function () {
  beep();
});
```

### Initial state

An initial state is required to before the machine can process events.

Example:
```js  
machine.setState('off');
```


### Sending events

Now that your machine is defined you may send events to it using:

```js  
machine.event(event, userInfo, exclusive);
```

Example:
```js  
machine.event("POWER");
```


## License terms

Copyright (c), 2013 Thierry Passeron

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.