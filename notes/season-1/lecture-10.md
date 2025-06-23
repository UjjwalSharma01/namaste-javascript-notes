# Episode 10: Closures in JavaScript

## 🎯 What You'll Learn
- Understanding closures and how they work in JavaScript
- How functions bundle with their lexical scope
- Practical examples of closures in different scenarios
- Advantages and disadvantages of using closures
- Real-world applications: Module Pattern, Currying, Memoization
- Common pitfalls and memory considerations

---

## 🔒 Understanding Closures

### 📚 What is a Closure?
**Closure**: A function bundled along with its lexical scope is **closure**.

> **🔑 Key Definition:** A closure is a function that has access to its outer function scope even after the function has returned. Meaning, a closure can remember and access variables and arguments reference of its outer function even after the function has returned.

### 🧠 How Closures Work
JavaScript has a **lexical scope environment**. If a function needs to access a variable, it first goes to its **local memory**. When it does not find it there, it goes to the **memory of its lexical parent**.

---

## 💡 Basic Closure Example

### 🔍 Simple Closure Demonstration

```javascript
function x() {
  var a = 7;
  function y() {
    console.log(a);
  }
  return y;
}
var z = x();
console.log(z); // value of z is entire code of function y.
```

### 🧠 What's Happening Here?

#### **Step-by-Step Breakdown:**
1. **Function `x` is called** → Creates execution context
2. **Variable `a = 7`** → Stored in function `x`'s memory
3. **Function `y` is defined** → Has access to parent scope (`x`)
4. **`return y`** → Returns not just function `y`, but **entire closure**
5. **`var z = x()`** → `z` now contains function `y` + its lexical scope
6. **When `z()` is called later** → Still remembers `var a` inside `x()`

#### **🔑 Key Point:**
When `y` is returned, not only is the function returned but the **entire closure** (function `y` + its lexical scope) is returned and put inside `z`. So when `z` is used somewhere else in program, it **still remembers** `var a` inside `x()`.

---

## 🧩 Corner Cases in Closures

### ❓ **Question: What will this code print?**

```javascript
function x() {
  var a = 7;
  function y() {
    console.log(a);
  }
  a = 100;
  return y;
}
var z = x();
z(); // What will this print?
```

### 🤔 **Think about it...**
- Will it print `7` (the initial value)?
- Will it print `100` (the modified value)?
- Will it throw an error?

### ✅ **Answer: It will print `100`**

### 🧠 **Why does this happen?**

When a function is returned along with its **lexical scope**, it points to the **reference** of the variable, not the **value**.

#### **Step-by-Step Explanation:**
1. **`var a = 7`** → Variable `a` is created and assigned value `7`
2. **Function `y` is defined** → Creates closure with reference to variable `a`
3. **`a = 100`** → Variable `a`'s value is updated to `100`
4. **`return y`** → Returns function `y` with its lexical scope (closure)
5. **`z()` is called** → Accesses the current value of `a`, which is `100`

#### **🔑 Key Insight:**
```
Closure stores REFERENCE to variables, not their VALUES
├── Variable reference: Points to memory location of 'a'
├── Current value: Whatever 'a' holds at execution time
└── Result: Always gets the latest value of 'a'
```

### 💡 **Important Concept:**
- **Closures maintain live references** to outer scope variables
- **Changes to variables** are reflected when closure is executed
- **Not a snapshot** of values at closure creation time
- **Always accesses current state** of referenced variables

---

## 🎯 Complex Closure Example

### 🔍 Multi-Level Closure

```javascript
function z() {
  var b = 900;
  function x() {
    var a = 7;
    function y() {
      console.log(a, b);
    }
    y();
  }
  x();
}
z(); // Output: 7 900
```

### 🧠 Scope Chain in Action:
- **Function `y`** looks for `a` → Found in parent `x` scope
- **Function `y`** looks for `b` → Found in grandparent `z` scope
- **Closure includes** → All accessible variables from scope chain

### 🗑️ **Important Note: Garbage Collection in Closures**

```javascript
// Example: What if 'b' was never used?
function z() {
  var b = 900;          // This variable exists in scope
  function x() {
    var a = 7;
    function y() {
      console.log(a);   // Only 'a' is used, 'b' is NOT used
    }
    return y;           // Function y is returned as closure
  }
  return x();
}
var closure = z();
```

**🔑 Key Insight:** If variable `b` was **never used** in the innermost function `y`, JavaScript's **smart garbage collection** would:

- **Optimize the closure** → Only include variables that are actually referenced
- **Exclude unused variables** → `b` would be garbage collected and **not sent in closure**
- **Save memory** → Closure only carries what it needs

#### **Garbage Collection Rules:**
| Variable Usage | Included in Closure | Memory Impact |
|----------------|-------------------|---------------|
| **Used in inner function** | ✅ Yes | Kept in memory |
| **Not used in inner function** | ❌ No | Garbage collected |
| **Referenced but not accessed** | ✅ Yes | Kept in memory |

**💡 Practical Tip:** JavaScript engines are smart about closure optimization. Only variables that are **actually referenced** by inner functions are preserved in the closure's lexical environment.

![Closure Explanation](/assets/closure.jpg "Lexical Scope")

---

## ✅ Advantages of Closures

### 🎯 Real-World Applications

#### **1. 🏗️ Module Design Pattern**

The module design pattern allows us to encapsulate related functionality into a single module. It helps organize code, prevent global namespace pollution, and promotes reusability.

```javascript
// auth.js
const authModule = (function () {
  let loggedInUser = null;

  function login(username, password) {
    // Authenticate user logic...
    loggedInUser = username;
  }

  function logout() {
    loggedInUser = null;
  }

  function getUserInfo() {
    return loggedInUser;
  }

  return {
    login,
    logout,
    getUserInfo,
  };
})();

// Usage
authModule.login("john_doe", "secret");
console.log(authModule.getUserInfo()); // 'john_doe'
```

**Benefits:**
- **Data hiding** → `loggedInUser` is private
- **Controlled access** → Only exposed methods can modify data
- **Global namespace protection** → No pollution

#### **2. 🍛 Currying**

Currying is a technique where a function that takes multiple arguments is transformed into a series of functions that take one argument each. It enables partial function application and enhances code flexibility.

```javascript
const calculateTotalPrice = (taxRate) => (price) =>
  price + price * (taxRate / 100);

const calculateSalesTax = calculateTotalPrice(8); // 8% sales tax
const totalPrice = calculateSalesTax(100); // Price with tax
console.log(totalPrice); // 108
```

**Benefits:**
- **Reusability** → Create specialized functions
- **Partial application** → Pre-configure parameters
- **Function composition** → Build complex logic from simple parts

#### **3. 🧠 Memoization**

Memoization optimizes expensive function calls by caching their results. It's useful for recursive or repetitive computations.

```javascript
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log(fibonacci(10)); // 55
```

**Benefits:**
- **Performance optimization** → Avoid redundant calculations
- **Cache management** → Store and reuse results
- **Recursive optimization** → Dramatically improve recursive functions

#### **4. 🔐 Data Hiding and Encapsulation**

Encapsulation hides the internal details of an object and exposes only necessary methods and properties. It improves code maintainability and security.

```javascript
class Person {
  #name; // Private field

  constructor(name) {
    this.#name = name;
  }

  getName() {
    return this.#name;
  }
}

const person = new Person("Alice");
console.log(person.getName()); // 'Alice'
// console.log(person.#name); // Error: Private field '#name' must be declared in an enclosing class
```

**Benefits:**
- **Data protection** → Internal state cannot be directly accessed
- **Controlled interface** → Only specific methods can modify data
- **Security** → Prevents accidental or malicious modifications

#### **5. ⏰ setTimeout Applications**

`setTimeout` allows scheduling a function to run after a specified delay. It's commonly used for asynchronous tasks, animations, and event handling.

```javascript
function showMessage(message, delay) {
  setTimeout(() => {
    console.log(message);
  }, delay);
}

showMessage("Hello, world!", 2000); // Display after 2 seconds
```

**Benefits:**
- **Asynchronous execution** → Non-blocking operations
- **Delayed execution** → Schedule future tasks
- **Event handling** → Manage timed interactions

---

## ⚠️ Disadvantages of Closures

### 🚨 Memory Considerations

#### **1. 💾 Over Consumption of Memory**
- Closures keep references to outer scope variables
- Variables cannot be garbage collected while closure exists
- Multiple closures can hold onto large objects

#### **2. 🕳️ Memory Leak**
- Forgotten closures continue to hold references
- Circular references between closures and DOM elements
- Accumulation of unused but referenced data

#### **3. 🧊 Freeze Browser**
- Too many active closures can slow down performance
- Heavy memory usage can cause browser unresponsiveness
- Poor closure management in loops or events

### 💡 Best Practices to Avoid Issues:
```javascript
// ❌ Potential memory leak
function createHandlers() {
  const largeData = new Array(1000000).fill('data');
  
  return function() {
    console.log('Handler called');
    // largeData is still referenced even if not used
  };
}

// ✅ Better approach
function createHandlers() {
  const importantData = 'small data';
  
  return function() {
    console.log('Handler called', importantData);
    // Only keep what's needed
  };
}
```

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Closure Fundamentals**
- Function + lexical scope = Closure
- Remembers outer scope even after parent function returns
- Enables powerful programming patterns

#### **2. Practical Applications**
- **Module Pattern** → Encapsulation and data hiding
- **Currying** → Function transformation and reusability
- **Memoization** → Performance optimization
- **Private Variables** → Data protection

#### **3. Memory Management**
- Closures can prevent garbage collection
- Be mindful of large data in outer scopes
- Clean up unnecessary references

### 🧠 Quick Memory Aid:
```
Closure = Function + Lexical Environment
Remembers = Outer scope variables accessible
Applications = Modules, Currying, Memoization
Watch out = Memory leaks and performance
```

### 🎯 Where You'll Use This:
Understanding closures helps with:
- **Building** reusable and modular code
- **Creating** private variables and methods
- **Implementing** advanced patterns like callbacks
- **Optimizing** performance with memoization

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=qikxEIxsXco&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/qikxEIxsXco/0.jpg" width="750"
alt="Closure in JS Youtube Link"/></a>
