# Episode 3 : Hoisting in JavaScript (variables & functions)

- Let's observe the below code and it's explaination:
![Hoisting 1](/assets/Hoisting1.png "Hoisting")

```js
getName(); // Namaste Javascript
console.log(x); // undefined
var x = 7;
function getName() {
  console.log("Namaste Javascript");
}
```

- It should have been an outright error in many other languages, as it is not possible to even access something which is not even created (defined) yet But in JS, We know that in memory creation phase it assigns undefined and puts the content of function to function's memory. And in execution, it then executes whatever is asked. Here, as execution goes line by line and not after compiling, it could only print undefined and nothing else. This phenomenon, is not an error. However, if we remove var x = 7; then it gives error. <span style="color: red;">Uncaught ReferenceError: x is not defined</span>

- **Hoisting** is a concept which enables us to extract values of variables and functions even before initialising/assigning value without getting error and this is happening due to the 1st phase (memory creation phase) of the Execution Context.

- if i allocate the function to a variable or if it's a arrow function then it will not be assigned the entire code structure during the memory creation phase. It will be assigned as undefined. Example:

```js
getName(); // Uncaught TypeError: getName is not a function
console.log(getName);
var getName = () => {
  console.log("Namaste JavaScript");
};
```

or

```js
getName(); // Uncaught TypeError: getName is not a function
console.log(getName);
var getName = function() {
  console.log("Namaste JavaScript");
};
```


- So in previous lecture, we learnt that execution context gets created in two phase, so even before code execution, memory is created so in case of variable, it will be initialized as undefined while in case of function the whole function code is placed in the memory. Example:

```js
getName(); // Namaste JavaScript
console.log(x); // Uncaught Reference: x is not defined.
console.log(getName); // f getName(){ console.log("Namaste JavaScript); }
function getName() {
  console.log("Namaste JavaScript");
}
```
in this case the memory would something like this:
```js
{
  getName: function getName() {
    console.log("Namaste JavaScript");
  },
  x: undefined
}
```

### Difference between undefined and not defined

- **undefined** is a special value in JS which is assigned to a variable which is not assigned any value. It is a special value which is assigned by JS engine. this simply means that the variable is present within the code but you are accessing it before it is assigned any value.

- **not defined** means that the variable is not present in the code. It is not defined in the code. It is not present in the memory allocated in the first phase of execution context.

- Now let's observe a different example and try to understand the output.

```js
getName(); // Uncaught TypeError: getName is not a function
console.log(getName);

// way 1 to define function
var getName = () => {
  console.log("Namaste JavaScript");
};


// way 2 to define function
var getName = function() {
  console.log("Namaste JavaScript");
};

// in both the ways the behaviour will be same.
```


Now in the above code the function get name is defined as an arrow function. Arrow functions are not hoisted in the same way as normal functions. they are treated like variables. So, in the above code, the function get name is treated as a variable and not a function. So, when we try to call the function before it is defined, it throws an error.
<hr>

Watch Live On Youtube below:

<a href="https://www.youtube.com/watch?v=Fnlnw8uY6jo&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/Fnlnw8uY6jo/0.jpg" width="750"
alt="Hoisting Youtube Link"/></a>
