# Episode 5: Shortest JS Program, Window & This Keyword

## 🎯 What You'll Learn
- What happens when JavaScript runs an empty file
- Understanding the global `window` object
- How `this` keyword works at global level
- How global variables attach to the window object
- Difference between browser and Node.js global objects

---

## 🤯 The Shortest JavaScript Program

### What is it?
**An empty file!** 

```javascript
// This empty file is a complete JavaScript program
```

### 🚀 What Happens Even in an Empty File?

Even with no code, the JavaScript engine does A LOT:

1. **🏗️ Creates Global Execution Context (GEC)**
   - Memory space allocated
   - Execution context set up

2. **🌍 Creates `window` object**
   - Global object created in global space
   - Contains lots of built-in functions and variables
   - Accessible from anywhere in the program

3. **👆 Creates `this` keyword**
   - Points to the `window` object at global level
   - `this === window` (in browsers)

> **💡 Quick Tip:** Anything that is **not inside a function** is what we call **global space**! and everything that you declare globally get attached to the global object (window in case of browsers). and you can access them by ``console.log(window.varname)``.

---

## 🌍 Understanding the Window Object

### 🔍 What is Window?
The **window** object is the **global object** in browsers. It contains:
- Built-in JavaScript functions (like `setTimeout`, `console.log`)
- Built-in variables
- DOM-related functions and properties
- Your global variables and functions

### 🎯 Key Point:
```javascript
this === window // true (at global level in browsers)
```

### 🔄 Different Environments:
| Environment | Global Object Name |
|-------------|-------------------|
| **Browser** | `window` |
| **Node.js** | `global` |
| **Web Workers** | `self` |

---

## 💡 Global Variables and Window Object

### 🔗 Global Variables Get Attached to Window

When you create variables in global scope, they automatically become properties of the window object:

```javascript
var x = 10;
console.log(x);        // 10
console.log(this.x);   // 10  
console.log(window.x); // 10
```

### 🤔 Why All Three Give Same Result?
- `x` → Direct access to global variable
- `this.x` → Access via `this` (which points to `window`)
- `window.x` → Direct access via `window` object

**All three are accessing the same variable!**

### 🔥 **Important Concept: Default Global Object Reference**

![Lecture 05](/assets/lecture%2005.png "Global Object Reference")

By default, when you use `console.log(varName)` in the JavaScript environment, it **automatically assumes** that you are referring to the **window** (or global object). Since `this` points to the global object at the global level:

```javascript
var name = "JavaScript";

// All of these are exactly the same!
console.log(name);        // "JavaScript" - assumes window.name
console.log(this.name);   // "JavaScript" - this points to window
console.log(window.name); // "JavaScript" - direct window access
```

**Key Insight:** `console.log(varName)` is essentially `console.log(window.varName)` in the browser!

---

## 🧠 How This Works Behind the Scenes

### 📚 Step-by-Step Process:

#### 1. **JavaScript Engine Starts**
```
Creates Global Execution Context
    ↓
Creates window object (global object)
    ↓  
Creates this keyword (points to window)
    ↓
Sets up: this === window
```

#### 2. **When You Declare Global Variables**
```javascript
var x = 10;
```

**What happens:**
- Variable `x` is created in global scope
- `x` automatically becomes `window.x`
- Can be accessed as `x`, `this.x`, or `window.x`

#### 3. **Memory Structure**
```javascript
window = {
  // Built-in properties
  console: {...},
  setTimeout: function() {...},
  // ... many more built-ins
  
  // Your global variables
  x: 10
}

this = window; // this points to window object
```

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Empty File Behavior**
- Even empty file creates Global Execution Context
- JavaScript engine sets up global environment automatically
- Minimum setup includes GEC, window object, and this keyword

#### **2. Window Object**
- Global object in browsers (called differently in other environments)
- Contains built-in functions and variables
- Accessible from anywhere in the program

#### **3. This Keyword at Global Level**
- `this` points to `window` object in browsers
- `this === window` is true at global level
- Provides another way to access global variables

#### **4. Global Variable Attachment**
- Global variables automatically become window properties
- Can be accessed multiple ways: `variable`, `this.variable`, `window.variable`
- All three methods access the same memory location

#### **5. Default Global Object Reference**
- `console.log(varName)` automatically assumes `window.varName`
- JavaScript implicitly refers to global object when no context specified
- This is why global variables are so easily accessible

### 🧠 Quick Memory Aid:
```
Empty File = GEC + window + this
Global Variable = window Property
this === window (in browsers)
Global Scope = Window Scope
console.log(varName) = console.log(window.varName)
```

### 🎯 Where You'll Use This:
Understanding global objects helps with:
- **Debugging** global variable issues
- **Understanding** how JavaScript sets up its environment
- **Working** with different JavaScript environments
- **Avoiding** global namespace pollution

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=QCRpVw2KXf8&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/QCRpVw2KXf8/0.jpg" width="750"
alt="Shortest JS Program, window & this keyword Youtube Link"/></a>
