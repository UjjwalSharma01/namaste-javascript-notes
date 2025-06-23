# Episode 2: How JavaScript is Executed & Call Stack

## What You'll Learn 🎯
- How JavaScript creates and manages execution contexts
- The two phases of execution context creation
- Call Stack and how it manages execution order

---

## Understanding Execution Context 📚

When a JavaScript program runs, a **Global Execution Context** is created automatically.

### How Execution Context Works

| Phase | Description | What Happens |
|-------|-------------|--------------|
| **1. Memory Creation Phase** | Allocates memory to variables and functions | • Variables get `undefined`<br>• Functions get their complete code |
| **2. Code Execution Phase** | Executes code line by line | • Variables get their actual values<br>• Functions are invoked |

---

## Let's See This in Action 💻

Let's trace through this code step by step:

```javascript
var n = 2;
function square(num) {
  var ans = num * num;
  return ans;
}
var square2 = square(n);
var square4 = square(4);
```

## Breaking Down the Execution 🔍

### Phase 1: Memory Creation Phase 🧠

JavaScript first scans through the entire code and allocates memory:

| Line | Variable/Function | Memory Allocation |
|------|------------------|-------------------|
| `var n = 2;` | `n` | `undefined` |
| `function square(num) {...}` | `square` | Complete function code |
| `var square2 = square(n);` | `square2` | `undefined` |
| `var square4 = square(4);` | `square4` | `undefined` |

**Memory State After Phase 1:**

![Execution Context Phase 1](/assets/phase1.jpg "Execution Context Phase 1")

### Phase 2: Code Execution Phase ⚡

Now JavaScript executes the code line by line:

#### Line 1: `var n = 2;`
- ✅ Assigns value `2` to variable `n` (replaces `undefined`)

#### Line 2-5: `function square(num) {...}`
- ⏭️ Nothing to execute (function already stored in memory)

#### Line 6: `var square2 = square(n);`

> **Something Important Happens Here! 🚀**

When a function is called, JavaScript creates a **new Local Execution Context** (also called Function Execution Context). **Functions are a bit different than any other language** - a new execution context is created altogether:

**Memory Creation Phase (for square function):**
- `num` → `undefined`
- `ans` → `undefined`

**Code Execution Phase (for square function):**
1. `num` gets value `2` (from parameter `n`)
2. `ans = num * num` → `ans = 2 * 2` → `ans = 4`
3. `return ans` → returns `4` and **destroys** this execution context

> **Remember:** When the **return** keyword is encountered, it returns the control to the called line and also **the function execution context is deleted**.

**Memory State During Function Execution:**

![Execution Context Phase 2](/assets/phase2.jpg "Execution Context Phase 2")

#### Line 7: `var square4 = square(4);`
- Same process repeats with parameter value `4`
- Result: `square4 = 16`

**Final Memory State:**

![Final Execution Context](/assets/final_execution_context.jpg "Final Execution Context")

---

## 📚 Understanding Call Stack

### 🤔 What is Call Stack?
The **Call Stack** is JavaScript's way of managing execution contexts and keeping track of function calls.

### ⚡ Key Things to Know:
- **LIFO (Last In, First Out)** principle
- Tracks execution order
- Manages memory allocation and cleanup
- Prevents infinite recursion

### 📊 How Call Stack Works

```
Call Stack (LIFO Structure)
┌─────────────────────────┐
│                         │ ← Empty slots
│                         │
│                         │
│                         │
├─────────────────────────┤
│     square(4)           │ ← Executes first, removed first
├─────────────────────────┤
│     square(n)           │ ← Added first, still waiting
├─────────────────────────┤
│  Global Execution       │ ← Base context (always present)
│     Context             │
└─────────────────────────┘
```

### 🔄 Execution Flow:
1. **Global Execution Context** is pushed to stack
2. When `square(n)` is called → **New context** pushed to stack
3. When `square(n)` returns → **Context is popped** from stack
4. When `square(4)` is called → **New context** pushed to stack
5. When `square(4)` returns → **Context is popped** from stack
6. Finally, **Global context** is destroyed when program ends

### 🎯 **Why LIFO Matters - Practical Implications:**

**LIFO (Last In, First Out) is crucial for:**

#### **🐛 Debugging:**
```javascript
function a() {
  b(); // If error occurs in b(), stack trace shows: b() → a() → global
}
function b() {
  c(); // If error occurs in c(), stack trace shows: c() → b() → a() → global  
}
function c() {
  throw new Error("Something broke!");
}
```

#### **🔄 Function Return Order:**
- Nested functions must complete before their parent functions can continue
- This ensures proper cleanup and variable scope management
- Prevents memory leaks and maintains execution integrity

#### **📊 Memory Management:**
- Each function's variables are cleaned up when it's removed from stack
- LIFO ensures proper memory deallocation order
- Parent functions wait for child functions to complete before cleaning up

---

## 📝 Other Names for Call Stack
- Program Stack
- Control Stack  
- Runtime Stack
- Machine Stack
- Execution Context Stack

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Execution Context Creation**
- **Global Execution Context** is created when JS program runs
- Every **function call** creates a new **Local Execution Context**
- Each context has **2 phases**: Memory Creation → Code Execution

#### **2. Memory Creation Phase**
- Variables are allocated memory and assigned `undefined`
- Functions are stored with their complete code
- No code execution happens in this phase

#### **3. Code Execution Phase** 
- Variables get their actual values
- Functions create new execution contexts when called
- `return` statement destroys the function's execution context

#### **4. Call Stack Management**
- **LIFO (Last In, First Out)** structure
- Tracks execution order of all contexts
- Global context stays at bottom, function contexts stack on top
- Contexts are **pushed** when called, **popped** when returned

### 🧠 Quick Memory Aid:
```
JavaScript Execution = Global Context + Function Contexts
Each Context = Memory Phase + Execution Phase  
Call Stack = Context Manager (LIFO)
Return = Context Destruction
```

### 🎯 Where You'll Use This:
Understanding execution contexts and call stack helps with:
- **Debugging** code execution flow
- **Understanding** variable scope and hoisting
- **Preventing** stack overflow errors
- **Optimizing** function performance

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=iLWTnMzWtj4&t=1s&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/iLWTnMzWtj4/0.jpg" width="750"
alt="How JS is executed & Call Stack Youtube Link"/></a>
