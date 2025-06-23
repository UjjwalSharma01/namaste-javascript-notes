# Episode 13: First Class Functions ft. Anonymous Functions

## 🎯 What You'll Learn
- Understanding different ways to create functions in JavaScript
- Difference between function statements and function expressions
- How hoisting affects different function types
- Anonymous functions and their use cases
- Named function expressions and their scope behavior
- Parameters vs arguments distinction
- First-class functions and higher-order functions concept

---

## ❤️ Functions in JavaScript

> **Functions are heart ♥ of JavaScript.**

Functions are one of the most powerful and flexible features in JavaScript. They can be created, passed around, and used in multiple ways.

---

## 🔍 Function Creation Methods

### ❓ **Q: What is Function Statement?**

**Function Statement** (also called **Function Declaration**) is the traditional way of creating functions.

```javascript
function a() {
  console.log("Hello");
}
a(); // Hello
```

**🔑 Key Characteristics:**
- **Hoisted completely** → Can be called before declaration
- **Creates named function** → Function has identifier `a`
- **Function declaration** → Standard way to define functions

---

### ❓ **Q: What is Function Expression?**

**Function Expression** is assigning a function to a variable. Here, **function acts like a value**.

```javascript
var b = function () {
  console.log("Hello");
};
b(); // Hello
```

**🔑 Key Characteristics:**
- **Variable hoisting behavior** → Variable is hoisted, but function is not
- **Anonymous function** → Function itself has no name
- **Assignment operation** → Function is assigned to variable `b`
- **Hoisting behavior** → If you call it before declaration, you'll get an error because the variable will only have the placeholder value `undefined` until the assignment happens

---

### ❓ **Q: Difference between Function Statement and Function Expression**

The major difference between these two lies in **Hoisting**.

```javascript
a(); // "Hello A" ✅ Works fine
b(); // ❌ TypeError: b is not a function

function a() {
  console.log("Hello A");
}

var b = function () {
  console.log("Hello B");
};
```

### 🧠 **Why does this happen?**

#### **Memory Creation Phase (Hoisting):**

| Declaration Type | Variable | Function | Accessibility |
|------------------|----------|----------|---------------|
| **Function Statement** | `a: f() {}` | Complete function stored | ✅ Immediately callable |
| **Function Expression** | `b: undefined` | Not stored yet | ❌ Cannot call until assignment |

#### **Step-by-Step Explanation:**
1. **During memory creation phase**:
   - `a` → Gets complete function assigned
   - `b` → Gets `undefined` assigned (like any variable)

2. **During code execution**:
   - `a()` → Function is available, executes successfully
   - `b()` → `undefined` is not a function → TypeError

3. **After `var b = function() {}`**:
   - `b` → Now contains the function and can be called

#### **🔑 Key Insight:**
```
Function Statement = Function + Variable created together
Function Expression = Variable first, Function assigned later
```

---

### ❓ **Q: What is Function Declaration?**

**Function Declaration** is just another name for **Function Statement**.

```javascript
// Function Declaration (same as Function Statement)
function myFunction() {
  console.log("This is a function declaration");
}
```

**📝 Note:** Both terms refer to the same concept - the traditional way of defining functions.

---

## 👻 Anonymous Functions

### ❓ **Q: What is Anonymous Function?**

**Anonymous Function** is a function without a name.

```javascript
function () {
  // This will throw Syntax Error - Function Statement requires function name
}
```

**🚨 Important Points:**
- **Cannot exist alone** → Must be used as a value
- **No identity** → Cannot be called directly
- **Syntax Error** → If used as statement without name

### 💡 **Where are Anonymous Functions Used?**

Anonymous functions are used when **functions are used as values**:

```javascript
// ✅ Used in Function Expression
var myFunc = function () {
  console.log("Anonymous function in expression");
};

// ✅ Used as Callback
setTimeout(function () {
  console.log("Anonymous function as callback");
}, 1000);

// ✅ Used in Array Methods
[1, 2, 3].map(function(x) {
  return x * 2;
});
```

---

## 🏷️ Named Function Expression

### ❓ **Q: What is Named Function Expression?**

**Named Function Expression** is the same as Function Expression, but the function has a name instead of being anonymous.

```javascript
var b = function xyz() {
  console.log("b called");
};

b(); // ✅ "b called" - Works fine
xyz(); // ❌ ReferenceError: xyz is not defined
```

### 🧠 **Why can't we call `xyz()`?**

#### **Scope Analysis:**
- **Function name `xyz`** is only available **inside the function scope** / __local scope__
- **Not created in global scope** → Cannot be accessed from outside
- **Only accessible within function body** → For recursion or self-reference

#### **Example of Internal Access:**
```javascript
var factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // ✅ Can call 'fact' inside
};

factorial(5); // ✅ Works: 120
fact(5);      // ❌ ReferenceError: fact is not defined
```

### 📊 **Function Expression Comparison:**

| Type | External Call | Internal Call | Use Case |
|------|---------------|---------------|----------|
| **Anonymous** | Variable name only | No self-reference | Simple functions |
| **Named** | Variable name only | Function name available | Recursion, debugging |

---

## 🔄 Parameters vs Arguments

### ❓ **Q: What's the difference between Parameters and Arguments?**

```javascript
var b = function (param1, param2) {
  // param1, param2 are PARAMETERS (labels/identifiers)
  console.log("b called");
};

b(arg1, arg2); // arg1, arg2 are ARGUMENTS (actual values passed)
```

### 📊 **Clear Distinction:**

| Term | Location | Purpose | Example |
|------|----------|---------|---------|
| **Parameters** | Function definition | Placeholders/variables | `function add(a, b)` |
| **Arguments** | Function call | Actual values passed | `add(5, 10)` |

### 💡 **Real Example:**
```javascript
function greet(name, age) {     // name, age = Parameters
  console.log(`Hello ${name}, you are ${age} years old`);
}

greet("John", 25);              // "John", 25 = Arguments
greet("Alice", 30);             // "Alice", 30 = Arguments
```

---

## 🥇 First Class Functions

### ❓ **Q: What are First Class Functions (aka First Class Citizens)?**

**First Class Functions** means functions can be:
- **Passed as arguments** to other functions
- **Returned from functions** 
- **Assigned to variables**
- **Stored in data structures**

This ability is altogether known as **First Class Function**. It's a programming concept available in some other languages too.

### 🔍 **Example 1: Passing Function as Argument**

```javascript
var b = function (param1) {
  console.log(param1); // Prints the entire function
};

b(function () {
  console.log("I'm passed as argument");
});
// Output: function () { console.log("I'm passed as argument"); }
```

### 🔍 **Example 2: Alternative Way**

```javascript
var b = function (param1) {
  console.log(param1);
};

function xyz() {
  console.log("Named function passed");
}

b(xyz); // Same as passing function directly
```

### 🔍 **Example 3: Returning Function from Function**

```javascript
var b = function (param1) {
  return function () {
    console.log("Function returned from another function");
  };
};

var returnedFunc = b();
returnedFunc(); // Calls the returned function
console.log(b()); // Logs the entire returned function
```

### 🎯 **Higher-Order Functions**

Functions that **operate on other functions** (by taking them as arguments or returning them) are called **Higher-Order Functions**.

```javascript
// Higher-Order Function Example
function calculator(operation) {
  return function(a, b) {
    return operation(a, b);
  };
}

function add(x, y) {
  return x + y;
}

function multiply(x, y) {
  return x * y;
}

var addCalculator = calculator(add);
var multiplyCalculator = calculator(multiply);

console.log(addCalculator(5, 3)); // 8
console.log(multiplyCalculator(5, 3)); // 15
```

### 💡 **Real-World Applications:**

#### **Callback Functions:**
```javascript
setTimeout(function() {
  console.log("Callback executed");
}, 1000);
```

#### **Array Methods:**
```javascript
[1, 2, 3, 4, 5]
  .filter(function(x) { return x > 2; })
  .map(function(x) { return x * 2; })
  .forEach(function(x) { console.log(x); });
```

#### **Event Handlers:**
```javascript
button.addEventListener('click', function() {
  console.log('Button clicked');
});
```

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Function Creation Methods**
- **Function Statement/Declaration** → Fully hoisted, callable before declaration
- **Function Expression** → Variable hoisted, function assigned later
- **Named Function Expression** → Function name only available internally

#### **2. Anonymous Functions**
- Functions without names
- Must be used as values (expressions, callbacks)
- Cannot exist as standalone statements

#### **3. Parameters vs Arguments**
- **Parameters** → Placeholders in function definition
- **Arguments** → Actual values passed during function call

#### **4. First Class Functions**
- Functions can be treated like any other value
- Pass as arguments, return from functions, assign to variables
- Enables powerful patterns like Higher-Order Functions

### 🧠 Quick Memory Aid:
```
Statement = Hoisted completely (callable before)
Expression = Variable hoisted, function later
Anonymous = No name, used as values
Parameters = Definition placeholders
Arguments = Call-time values
First Class = Functions as values (pass, return, assign)
```

### 🎯 Where You'll Use This:
Understanding function types helps with:
- **Writing** flexible and reusable code
- **Understanding** hoisting and scope behavior
- **Using** callbacks and event handlers effectively
- **Building** higher-order functions and functional patterns

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=SHINoHxvTso&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/SHINoHxvTso/0.jpg" width="750"
alt="First Class Functions ft. Anonymous Functions in JS Youtube Link"/></a>
