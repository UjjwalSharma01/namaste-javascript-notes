# Episode 6: Undefined vs Not Defined in JavaScript

## 🎯 What You'll Learn
- The difference between `undefined` and `not defined`
- How JavaScript assigns `undefined` during memory allocation
- Understanding JavaScript as a loosely typed language
- Best practices for handling `undefined`

---

## 🔍 The Core Difference

### 🧠 Memory Allocation Phase
In the **first phase (memory allocation)**, JavaScript assigns each variable a placeholder called **`undefined`**.

### 📊 Quick Comparison

| Term | Meaning | When it happens |
|------|---------|-----------------|
| **undefined** | Memory allocated, but no value assigned yet | Variable declared but not initialized |
| **not defined** | Variable not declared/found in memory allocation phase | Variable never declared but accessed |

> **🔑 Key Point:** `Not Defined !== Undefined`

---

## 💡 Understanding `undefined`

### 📚 What is `undefined`?
- **`undefined`** is when memory is allocated for the variable, but no value is assigned yet
- It's just a **placeholder** assigned to the variable temporarily until a value is assigned
- It's a **special value** in JavaScript, not an error

### 🎯 Simple Rule:
> When a variable is **declared but not assigned** a value, its current value is **`undefined`**. But when the variable itself is **not declared** but called in code, then it is **`not defined`**.

---

## 🔍 Let's See This in Action

```javascript
console.log(x); // undefined
var x = 25;
console.log(x); // 25
console.log(a); // Uncaught ReferenceError: a is not defined
```

### 🧠 What's Happening Here?

#### **Line 1: `console.log(x);`** → `undefined`
- Variable `x` is **declared** (on line 2) but not yet **initialized**
- During memory creation phase, `x` got `undefined` as placeholder
- So accessing `x` before assignment gives `undefined`

#### **Line 2: `var x = 25;`**
- Now `x` gets the actual value `25`

#### **Line 3: `console.log(x);`** → `25`
- `x` now has a real value, so it prints `25`

#### **Line 4: `console.log(a);`** → `ReferenceError`
- Variable `a` was **never declared** anywhere
- JavaScript engine never allocated memory for `a`
- Result: `Uncaught ReferenceError: a is not defined`

---

## 🎭 JavaScript: The Flexible Language

### 🔄 Loosely Typed / Weakly Typed Language
JavaScript is a **loosely typed** (or **weakly typed**) language, which means:
- **No fixed data types** for variables
- Variables can change types during runtime
- Same variable can hold different types of values

### 💻 Example of Type Flexibility:
```javascript
var myVariable = 5;        // Number
myVariable = true;         // Boolean  
myVariable = 'hello';      // String
myVariable = [1, 2, 3];    // Array
myVariable = {name: 'JS'}; // Object

// All of these are perfectly valid!
```

---

## ⚠️ Best Practices with `undefined`

### 🚫 What NOT to Do:
```javascript
var x = undefined; // ❌ Never do this manually!
```

### ✅ What TO Do:
```javascript
var x; // ✅ Let JavaScript assign undefined naturally
// or
var x = null; // ✅ Use null if you want to explicitly indicate "no value"
```

### 🎯 Why Avoid Manual `undefined` Assignment?
- You **can** assign `undefined` to any variable manually
- But you should **NEVER** do it
- It's a **bad practice** that leads to:
  - Inconsistencies in code
  - Difficulty in debugging
  - Confusion about whether it's natural hoisting or manual assignment

> **💡 Best Practice:** Let `undefined` happen naturally through JavaScript's hoisting mechanism!

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. undefined vs not defined**
- **undefined**: Variable declared but no value assigned (memory allocated)
- **not defined**: Variable never declared (no memory allocated)
- These are completely different concepts!

#### **2. Memory Allocation Behavior**
- JavaScript assigns `undefined` as placeholder during memory creation phase
- This happens automatically through hoisting mechanism
- Don't interfere with this natural process

#### **3. JavaScript's Type System**
- Loosely typed language - no fixed data types
- Variables can change types during runtime
- Provides flexibility but requires careful handling

#### **4. Best Practices**
- Never manually assign `undefined` to variables
- Let JavaScript handle `undefined` naturally
- Use `null` if you need to explicitly indicate "no value"

### 🧠 Quick Memory Aid:
```
undefined = Declared but not assigned (placeholder)
not defined = Never declared (doesn't exist)
Loosely typed = Variables can change types
Manual undefined = Bad practice (avoid it!)
```

### 🎯 Where You'll Use This:
Understanding undefined helps with:
- **Debugging** variable initialization issues
- **Writing** more predictable code
- **Avoiding** common JavaScript pitfalls
- **Understanding** hoisting behavior

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=B7iF6G3EyIk&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/B7iF6G3EyIk/0.jpg" width="750"
alt="undefined vs not defined in JS Youtube Link"/></a>
