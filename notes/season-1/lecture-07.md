# Episode 7: The Scope Chain, Scope & Lexical Environment

## 🎯 What You'll Learn
- Understanding Scope and its relationship with Lexical Environment
- How JavaScript resolves variable access through scope chain
- The concept of Lexical Environment and its hierarchy
- How inner functions can access outer function variables
- Physical location vs accessibility in JavaScript

---

## 🔗 Core Concept

**Scope** in JavaScript is directly related to **Lexical Environment**.

---

## 💡 Let's Explore Through Examples

### 🔍 Case 1: Function Accessing Global Variable

```javascript
// CASE 1
function a() {
  console.log(b); // 10
  // Instead of printing undefined it prints 10, So somehow this a function could access the variable b outside the function scope.
}
var b = 10;
a();
```

### 🔍 Case 2: Nested Function Accessing Global Variable

```javascript
// CASE 2
function a() {
  c();
  function c() {
    console.log(b); // 10
  }
}
var b = 10;
a();
```

### 🔍 Case 3: Local Variable Takes Precedence

```javascript
// CASE 3
function a() {
  c();
  function c() {
    var b = 100;
    console.log(b); // 100
  }
}
var b = 10;
a();
```

### 🔍 Case 4: Global Can't Access Local Variables

```javascript
// CASE 4
function a() {
  var b = 10;
  c();
  function c() {
    console.log(b); // 10
  }
}
a();
console.log(b); // Error, Not Defined
```

---

## 🧠 Understanding Each Case

### 📊 Analysis of Results

| Case | Result | Explanation |
|------|--------|-------------|
| **Case 1** | `10` | Function `a` can access global variable `b` |
| **Case 2** | `10` | Nested function `c` can also access global variable `b` |
| **Case 3** | `100` | Local variable `b` takes precedence over global `b` |
| **Case 4** | `10` then `Error` | Function can access parent scope, but global can't access local |

### 🎯 Key Insights:
- **Inner functions can access outer function variables**
- **Local variables take precedence over global ones**
- **Global scope cannot access local variables**
- **Nested functions can access variables from any parent scope**

---

## 🏗️ Execution Context Memory Structure

Let's understand **Case 4** in terms of execution context:

### 📚 Call Stack:
```
call_stack = [GEC, a(), c()]
```

### 🧠 Memory Allocation:
```javascript
c() = [
  [lexical environment pointer → a()]
]

a() = [
  b: 10,
  c: function,
  [lexical environment pointer → GEC]
]

GEC = [
  a: function,
  [lexical environment pointer → null]
]
```

### 📊 Visual Representation:

![Lexical Scope Explanation](/assets/lexical.jpg "Lexical Scope")
![Lexical Scope Explanation](/assets/lexical2.jpg "Lexical Scope")

---

## 🌍 Understanding Lexical Environment

### 🔗 What is Lexical Environment?

**Lexical Environment** = **Local Memory** + **Lexical Environment of its Parent**

### 📚 Key Points:
- **Lexical** means "in hierarchy, in order"
- Every Execution Context has its own Lexical Environment
- Lexical Environment is referenced in the local Execution Context's memory space
- Each Lexical Environment has a pointer to its parent's Lexical Environment

### 🔄 The Scope Chain Process:

When JavaScript looks for a variable:
1. **Check local memory** first
2. If not found, **check parent's lexical environment**
3. **Continue up the chain** until found or reach global
4. If not found anywhere, throw **ReferenceError**

This process is called the **Scope Chain** or **Lexical Environment Chain**.

---

## 📍 Lexical Scope Explained

### 🎯 What is Lexical Scope?

**Lexical Scope** (or **Static Scope**) refers to the accessibility of variables, functions, and objects based on their **physical location** in the source code.

### 💻 Visual Representation:

```javascript
function a() {
  function c() {
    // logic here
  }
  c(); // c is lexically inside a
} // a is lexically inside global execution
```

### 🏢 Scope Hierarchy:

```javascript
Global {
    Outer {
        Inner {
            // Inner is surrounded by lexical scope of Outer
            // Inner can access variables from Outer and Global
        }
    }
}
```

### 🔑 Key Rule:
**Physical location in code determines variable accessibility**

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Scope and Lexical Environment**
- Scope is directly related to Lexical Environment
- Lexical Environment = Local Memory + Parent's Lexical Environment
- Every execution context gets its own Lexical Environment

#### **2. Scope Chain Mechanism**
- JavaScript searches for variables through scope chain
- Starts from local scope, moves up to parent scopes
- Process continues until variable is found or global scope is reached

#### **3. Variable Access Rules**
- Inner functions can access outer function variables
- Local variables take precedence over global ones
- Global scope cannot access local variables
- Access is determined by physical location in code

#### **4. Lexical Scope Concept**
- Based on where variables are declared in the code
- Inner scope has access to outer scope
- Outer scope cannot access inner scope

### 🧠 Quick Memory Aid:
```
Lexical Environment = Local Memory + Parent's Environment
Scope Chain = Variable lookup process (inner → outer)
Lexical Scope = Physical location determines accessibility  
Inner can access Outer, but Outer cannot access Inner
```

### 🎯 Where You'll Use This:
Understanding scope helps with:
- **Debugging** variable access issues
- **Writing** cleaner, more organized code
- **Understanding** closures and advanced JavaScript concepts
- **Avoiding** variable naming conflicts

---

## 📝 TL;DR

**An inner function can access variables from outer functions even if nested deep. In any other case, a function cannot access variables not in its scope.**

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=uH-tVP8MUs8&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/uH-tVP8MUs8/0.jpg" width="750"
alt="The Scope Chain, Scope & Lexical Environment Youtube Link"/></a>
