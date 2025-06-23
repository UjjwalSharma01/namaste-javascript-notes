# Episode 3: Hoisting in JavaScript (Variables & Functions)

## 🎯 What You'll Learn
- Understanding Hoisting behavior in JavaScript
- How variables and functions are treated differently during hoisting
- Difference between `undefined` and `not defined`
- Why arrow functions and function expressions behave differently

---

## 🔍 Let's Start with This Surprising Code

![Hoisting 1](/assets/Hoisting1.png "Hoisting")

```javascript
getName(); // Namaste Javascript
console.log(x); // undefined
var x = 7;
function getName() {
  console.log("Namaste Javascript");
}
```

### 🤔 What Just Happened?

In most other languages, this code would throw an error because you're trying to access things before they're created. But JavaScript works differently!

**Why this works:**
- During the **memory creation phase**, JS assigns `undefined` to variables and stores the complete function code in memory
- During **execution phase**, it executes line by line
- So `getName()` works because the function is already in memory
- `console.log(x)` prints `undefined` because that's what was initially assigned

> **⚠️ Important:** If we remove `var x = 7;` completely, then we get: <span style="color: red;">Uncaught ReferenceError: x is not defined</span>

---

## 📚 What is Hoisting?

**Hoisting** is a concept that allows us to access variables and functions even before initializing/assigning values without getting errors. This happens because of the **memory creation phase** of the Execution Context.

### 🔥 **CRUCIAL CONCEPT: Memory Phase Happens BEFORE Any Execution**

This is extremely important to understand:

```javascript
debugger; // ← Even if debugger is on the FIRST line
console.log(x); // x is already in memory with 'undefined'
var x = 5;
function test() {
    return "hello";
}
```

**What happens:**
1. **Code is loaded/parsed**
2. **Memory Creation Phase completes** (happens BEFORE any code execution)
   - `x` → `undefined` 
   - `test` → complete function code stored
3. **Execution Phase starts**
4. **Debugger hits and stops** execution
5. **But memory allocation is ALREADY DONE!**

> **💡 Key Insight:** Memory Creation Phase is **NOT part of execution** - it's a **preparation phase** that happens **before** the first line of code even starts executing!

**Proof:** When debugger stops on line 1, check the browser's Variables/Scope panel - you'll see all variables and functions already exist in memory!

---

## 💡 Function Expressions vs Function Declarations

### � Key Point: 
**Arrow functions and function expressions are treated like variables during hoisting** - they don't get the special treatment that regular function declarations get.

### �🚨 Arrow Functions Don't Get Hoisted Like Regular Functions

When you assign a function to a variable (arrow function or function expression), it will **NOT** be assigned the entire code structure during memory creation phase. It will be assigned as `undefined`.

**Arrow Function Example:**
```javascript
getName(); // Uncaught TypeError: getName is not a function
console.log(getName); // undefined
var getName = () => {
  console.log("Namaste JavaScript");
};
```

**Function Expression Example:**
```javascript
getName(); // Uncaught TypeError: getName is not a function
console.log(getName); // undefined
var getName = function() {
  console.log("Namaste JavaScript");
};
```

---

## 🎯 When to Use Function Declarations vs Expressions

### 🤔 **Why Does This Difference Matter?**

Understanding when to use each type is crucial for writing predictable code:

### ✅ **Use Function Declarations When:**

#### **1. You Need Hoisting (Call Before Declaration):**
```javascript
// ✅ Works: Function available throughout entire scope
calculateTotal(); // Works fine!

function calculateTotal() {
  return price * quantity;
}
```

#### **2. Creating Main/Core Functions:**
```javascript
// ✅ Good for main application functions
function initApp() { /* startup logic */ }
function handleUserLogin() { /* login logic */ }
function processPayment() { /* payment logic */ }
```

#### **3. Recursive Functions:**
```javascript
// ✅ Function can call itself by name
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Self-reference works
}
```

### ✅ **Use Function Expressions When:**

#### **1. Conditional Function Creation:**
```javascript
// ✅ Create functions based on conditions
let calculator;
if (advancedMode) {
  calculator = function(a, b) { 
    return a * b + Math.pow(a, 2); 
  };
} else {
  calculator = function(a, b) { 
    return a * b; 
  };
}
```

#### **2. Callback Functions:**
```javascript
// ✅ Perfect for event handlers and callbacks
button.addEventListener('click', function() {
  console.log('Button clicked!');
});

// ✅ Array methods
numbers.map(function(num) { return num * 2; });
```

#### **3. Avoiding Global Scope Pollution:**
```javascript
// ✅ Function expression doesn't pollute global scope
const utils = {
  format: function(text) { return text.toUpperCase(); },
  validate: function(email) { return email.includes('@'); }
};
```

#### **4. Modules and Encapsulation:**
```javascript
// ✅ Creating private functions
const myModule = (function() {
  const privateFunction = function() {
    console.log("This is private");
  };
  
  return {
    publicMethod: function() {
      privateFunction(); // Can call private function
    }
  };
})();
```

### 📊 **Quick Decision Guide:**

| Need | Use | Why |
|------|-----|-----|
| **Call before declaration** | Function Declaration | Hoisting works |
| **Conditional creation** | Function Expression | More flexible |
| **Callbacks/Event handlers** | Function Expression | Cleaner syntax |
| **Main app functions** | Function Declaration | More readable |
| **Private functions** | Function Expression | Better encapsulation |

---

## 🧠 Memory Allocation Example

Let's see how memory is allocated in the execution context:

```javascript
getName(); // Namaste JavaScript
console.log(x); // Uncaught ReferenceError: x is not defined
console.log(getName); // f getName(){ console.log("Namaste JavaScript"); }
function getName() {
  console.log("Namaste JavaScript");
}
```

**Memory allocation looks like this:**
```javascript
{
  getName: function getName() {
    console.log("Namaste JavaScript");
  },
  // x is not present because it's not declared anywhere
}
```

---

## 🎭 Variable Shadowing in Hoisting

### 📚 What is Variable Shadowing?
**Variable Shadowing** occurs when a local variable has the same name as a variable in an outer scope, effectively "hiding" or "shadowing" the outer variable.

```javascript
var name = "Global John";

function greetUser() {
  console.log(name); // undefined (NOT "Global John")
  var name = "Local Jane";
  console.log(name); // "Local Jane"
}

greetUser();
console.log(name); // "Global John"
```

### 🤔 Why Does This Happen?

**During Memory Creation Phase:**
```javascript
// Global Execution Context
{
  name: undefined,
  greetUser: function
}

// greetUser() Execution Context  
{
  name: undefined, // ← This shadows the global 'name'
}
```

**During Execution Phase:**
1. `console.log(name)` finds local `name` (which is `undefined`)
2. Local `name` gets assigned `"Local Jane"`
3. `console.log(name)` prints `"Local Jane"`

### 💡 Key Insights:
- **Hoisting happens per scope** - each execution context has its own memory creation phase
- **Local variables shadow global ones** even during hoisting
- **JavaScript always looks in local scope first**

### ⚠️ Common Gotcha:
```javascript
var x = 1;
function test() {
  console.log(x); // undefined (not 1!)
  var x = 2;
}
test();
```

Even though `var x = 2` comes after `console.log(x)`, the hoisting of `var x` in the function scope shadows the global `x`.

---

## ⚡ Understanding `undefined` vs `not defined`

| Term | Meaning | Example |
|------|---------|---------|
| **undefined** | Variable exists in memory but no value assigned yet | `var x; console.log(x); // undefined` |
| **not defined** | Variable doesn't exist in memory at all | `console.log(y); // ReferenceError: y is not defined` |

### 📝 Simple Explanation:
- **undefined** = "Hey, I know this variable exists, but it doesn't have a value yet"
- **not defined** = "Sorry, I've never heard of this variable"

### 🔍 Type Coercion with `undefined`:
```javascript
console.log(undefined + 5); // NaN
console.log(undefined == null); // true
console.log(undefined === null); // false
console.log(typeof undefined); // "undefined"
```

**Why This Matters:**
- `undefined + 5` = `NaN` because `undefined` can't be converted to a number
- `undefined == null` is `true` (special case in JavaScript)
- `undefined === null` is `false` (different types)
- Always use `typeof` to safely check for `undefined`

---

## 🔄 Let's See Another Example

```javascript
getName(); // Uncaught TypeError: getName is not a function
console.log(getName); // undefined

// Way 1: Arrow Function
var getName = () => {
  console.log("Namaste JavaScript");
};

// Way 2: Function Expression  
var getName = function() {
  console.log("Namaste JavaScript");
};

// Both ways behave exactly the same!
```

### 🎯 Why This Happens:
Arrow functions and function expressions are **treated like variables** during hoisting. They don't get the special treatment that regular function declarations get.

**During Memory Creation Phase:**
- `getName` gets `undefined` (like any other variable)
- The actual function code is **NOT** stored in memory yet

**During Execution Phase:**
- When we try to call `getName()`, it's still `undefined`
- Calling `undefined` as a function gives: `TypeError: getName is not a function`

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Hoisting Basics**
- Hoisting allows access to variables and functions before they're declared
- Happens because of memory creation phase in execution context

#### **2. Function Declaration vs Function Expression**
- **Function Declaration**: Gets complete function code in memory during hoisting
- **Function Expression/Arrow Function**: Gets `undefined` like variables

#### **3. undefined vs not defined**
- **undefined**: Variable exists in memory but no value assigned
- **not defined**: Variable doesn't exist in memory at all

### 🧠 Quick Memory Aid:
```
JavaScript Execution Timeline:
1. Code Loading/Parsing
2. Memory Creation Phase (BEFORE any execution)
3. Execution Phase (line by line, synchronous)

Function Declaration = Fully Hoisted (complete code)
Function Expression/Arrow = Partially Hoisted (undefined)  
Variables = Partially Hoisted (undefined)
Not Declared = Not Hoisted (ReferenceError)
```

### 🎯 Where You'll Use This:
Understanding hoisting helps with:
- **Debugging** unexpected `undefined` values
- **Writing** better, more predictable code
- **Avoiding** common JavaScript pitfalls
- **Understanding** execution flow

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=Fnlnw8uY6jo&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/Fnlnw8uY6jo/0.jpg" width="750"
alt="Hoisting Youtube Link"/></a>
