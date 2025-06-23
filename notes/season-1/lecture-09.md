# Episode 9: Block Scope & Shadowing in JavaScript

## 🎯 What You'll Learn
- Understanding blocks and compound statements in JavaScript
- How block scope works with var, let, and const
- The concept of shadowing and its different behaviors
- Legal vs illegal shadowing patterns
- Memory allocation differences in block scope vs global scope

---

## 🧱 Understanding Blocks

### 📚 What is a Block?
**Block** (also called **compound statement**) is used to group JavaScript statements together into 1 group. We group them within `{...}`.

```javascript
{
  var a = 10;
  let b = 20;
  const c = 30;
  // Here let and const are hoisted in Block scope,
  // While, var is hoisted in Global scope.
}
```

### 🔍 Why Do We Need Blocks?
Blocks are used where JavaScript expects a **single statement**, but we want to write **multiple statements**.

```javascript
// Example: if statement expects one statement
if (true) 
  console.log("Hello"); // ✅ Single statement

// But what if we want multiple statements?
if (true) {             // ✅ Block allows multiple statements
  console.log("Hello");
  console.log("World");
  let message = "Hi";
}
```

---

## 🎯 Block Scope Behavior

### 📊 Memory Allocation in Blocks

| Variable Type | Storage Location | Accessibility |
|---------------|------------------|---------------|
| **var** | Global scope | ✅ Accessible outside block |
| **let** | Block scope | ❌ Only accessible inside block |
| **const** | Block scope | ❌ Only accessible inside block |

### 🔍 Block Scope and Accessibility Example

```javascript
{
  var a = 10;
  let b = 20;
  const c = 30;
}
console.log(a); // ✅ 10
console.log(b); // ❌ Uncaught ReferenceError: b is not defined
console.log(c); // ❌ Uncaught ReferenceError: c is not defined
```

### 🧠 What's Happening in Memory?

#### **Inside the Block:**
- `let b` and `const c` are initialized as `undefined` in a **separate memory space called "Block"**
- `var a` is stored in **Global scope**
- This is why `let` and `const` are **BLOCK SCOPED**

#### **Outside the Block:**
- `var a` can be accessed anywhere as it's in global scope
- `let b` and `const c` cannot be accessed outside the block
- They are destroyed when the block execution is complete

---

## 🌑 Understanding Shadowing

### 📚 What is Shadowing?
When a variable inside a block has the **same name** as a variable outside the block, the inner variable **shadows** (hides) the outer variable.

### 🔍 Shadowing with `var` (the value changes of in the global space)

```javascript
var a = 100;
{
  var a = 10; // same name as global var
  let b = 20;
  const c = 30;
  console.log(a); // 10
  console.log(b); // 20
  console.log(c); // 30
}
console.log(a); // 10, instead of the 100 we were expecting
```

### 🧠 Why Does This Happen?
- Block `var a = 10` **modifies** the value of global `a` as well
- In memory: only `b` and `c` are in block space
- `a` initially is in global space (`a = 100`)
- When `a = 10` line runs, `a` is **not created** in block space
- Instead, it **replaces** 100 with 10 in global space itself

> **🚨 Important:** This shadowing behavior **happens only for var**

---

## ✅ Proper Shadowing with `let` and `const`

### 🔍 Let and Const Shadowing Behavior

```javascript
let b = 100;
{
  var a = 10;
  let b = 20;
  const c = 30;
  console.log(b); // 20
}
console.log(b); // 100
```
> **🚨 Important:The value of the `let/const` changes for the block/function scope not globally**
### 🧠 What's Different Here?
- Both `b`'s are in **separate memory spaces**
- Inner `b = 20` is in **Block scope**
- Outer `b = 100` is in **Script scope** (another memory space)
- Same behavior is true for **const** declarations
- **No interference** between inner and outer variables

![Block Scope Explanation](/assets/scope.jpg "Block Scope Memory Allocation")

---

## 🎯 Shadowing in Functions

### 📚 Same Logic Applies to Functions

```javascript
const c = 100;
function x() {
  const c = 10;
  console.log(c); // 10
}
x();
console.log(c); // 100
```

### 💡 Function Scope Behavior:
- Function creates its own scope
- Inner `const c = 10` shadows outer `const c = 100`
- Both variables exist independently
- No modification of outer variable
- _Same as how it behaves in the simple block space_ of the let and const

---

## 🚫 Illegal Shadowing

### ❌ What is Illegal Shadowing?

```javascript
let a = 20;
{
  var a = 20; // ❌ Uncaught SyntaxError: Identifier 'a' has already been declared
}
```

### 📊 Shadowing Rules

#### **Block Scope Shadowing:**
| Outer Variable | Inner Variable | Result |
|----------------|----------------|---------|
| **var** | **var** | ✅ Valid (but modifies outer) |
| **var** | **let** | ✅ Valid Shadowing |
| **var** | **const** | ✅ Valid Shadowing |
| **let** | **let** | ✅ Valid Shadowing |
| **let** | **const** | ✅ Valid Shadowing |
| **let** | **var** | ❌ Illegal Shadowing (scope conflict) |
| **const** | **const** | ✅ Valid Shadowing |
| **const** | **let** | ✅ Valid Shadowing |
| **const** | **var** | ❌ Illegal Shadowing (scope conflict) |

#### **Function Scope Shadowing:**
| Outer Variable | Inner Variable | Result |
|----------------|----------------|---------|
| **let** | **var** (in function) | ✅ Valid Shadowing |
| **const** | **var** (in function) | ✅ Valid Shadowing |
| All other combinations | Same as block scope rules |

### 🔍 Why is `let` → `var` Illegal in Block Scope?

```javascript
// ❌ Illegal in block scope
let a = 20;
{
  var a = 20; // ❌ This tries to declare 'a' in global scope
              // But 'a' already exists in script scope as let
}
```

**Reason:** `var` tries to create a variable in global scope, but `let a` already exists in script scope, causing a conflict.

### ✅ But Valid in Function Scope

```javascript
// ✅ Valid in function scope
let a = 20;
function x() {
  var a = 20; // ✅ Valid - function creates separate scope boundary
}
```

**Reason:** Functions create their own scope, so `var` is confined to function scope and doesn't conflict with outer `let`.

## 🧠 **Why Block Scope vs Function Scope Behaves Differently**

### 🚫 **Why NOT in Block Scope?**

```javascript
let a = 20;
{
    var a = 20; // ❌ SyntaxError: Identifier 'a' has already been declared
}
```

**What happens in memory:**

1. **`let a = 20`** → Stored in **Script scope**
2. **`var a = 20`** → Tries to go to **Global scope** 
3. **Problem**: JavaScript engine sees **TWO declarations of `a`** in the **SAME LEXICAL ENVIRONMENT**

```
Memory Structure:
├── Global Scope
│   └── var a (trying to declare here)
├── Script Scope  
│   └── let a = 20 (already exists here)
└── Block Scope
    └── (empty - var doesn't stay here)
```

**❌ Conflict**: Both `let a` (Script) and `var a` (Global) are **visible in the same scope chain** → **SyntaxError**

### ✅ **Why YES in Function Scope?**

```javascript
let a = 20;
function someFunction() {
    var a = 20; // ✅ Works perfectly!
}
```

**What happens in memory:**

1. **`let a = 20`** → Stored in **Script scope**
2. **`var a = 20`** → Stored in **Function scope** (NOT Global!)
3. **No Problem**: They exist in **DIFFERENT lexical environments**

```
Memory Structure:
├── Global Scope
│   └── (empty)
├── Script Scope  
│   └── let a = 20
└── Function Scope
    └── var a = 20 (completely separate environment)
```

**✅ No Conflict**: `let a` (Script) and `var a` (Function) are in **separate scope boundaries**

### 🔍 **The Key Difference**

#### **Block Scope (`{}`):**
- **Does NOT create** a separate boundary for `var`
- `var` **ignores** block boundaries and goes to **Global/Function scope**
- Creates **scope pollution** and **identifier conflicts**

#### **Function Scope (`function {}`):**
- **Creates** a **strong boundary** that `var` **cannot cross**
- `var` **respects** function boundaries and stays **contained**
- **No scope pollution** - each function is isolated

### 💡 **Real-World Analogy**

Think of it like **building boundaries**:

#### 🏠 **Block Scope = Glass Wall**
- `var` can **see through** and **ignore** the glass wall
- Goes to the main house (Global scope)
- Creates **conflicts** with existing residents

#### 🏰 **Function Scope = Concrete Wall**  
- `var` **cannot cross** the concrete wall
- Stays **contained** within the function castle
- **No conflicts** with outside world

### 🎯 **Scope Boundary Summary**

| Scope Type | `var` Behavior | Conflict Potential |
|------------|----------------|-------------------|
| **Block `{}`** | Ignores boundary, goes to Global/Function | ❌ High (same lexical environment) |
| **Function `function {}`** | Respects boundary, stays in function | ✅ None (separate lexical environment) |

**Bottom Line**: Function scope creates a **true isolation boundary** that `var` respects, while block scope is just a **suggestion** that `var` ignores! 🎯

---

### ✅ Valid Shadowing Examples

```javascript
// ✅ let shadowing let
let a = 20;
{
  let a = 30; // Valid - different scopes
  console.log(a); // 30
}
console.log(a); // 20
```

```javascript
// ✅ var shadowing with let
var a = 20;
{
  let a = 30; // Valid - let creates block scope
  console.log(a); // 30
}
console.log(a); // 20
```

---

## 🔧 Function Scope Exception

### 📚 Functions Create Their Own Scope

```javascript
let a = 20;
function x() {
  var a = 20; // ✅ Valid - function scope is separate
}
```

### 🧠 Why is This Valid?
- **var is function scoped**, not block scoped
- Functions create their own scope boundary
- No conflict between function scope and outer script scope
- **All scope rules that work in functions are same in arrow functions too**

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Blocks and Block Scope**
- Blocks group statements using `{}`
- `let` and `const` are block scoped
- `var` ignores block scope (function scoped only)

#### **2. Shadowing Behavior**
- **var**: Modifies outer variable (same memory space)
- **let/const**: Creates separate memory space (true shadowing)

#### **3. Legal vs Illegal Shadowing**
- Cannot shadow `let`/`const` with `var` in same scope
- Can shadow `var` with `let`/`const`
- Functions create separate scope (different rules)

#### **4. Memory Spaces**
- **Global**: `var` declarations
- **Script**: `let`/`const` declarations outside blocks
- **Block**: `let`/`const` declarations inside blocks
- **Function**: All variables inside functions

### 🧠 Quick Memory Aid:
```
Block = {...} groups statements
let/const = Block scoped (separate memory)
var = Function scoped (ignores blocks)
Shadowing: var modifies, let/const separates
Illegal: let/const → var (scope conflict)
```

### 🎯 Where You'll Use This:
Understanding block scope helps with:
- **Writing** more predictable code
- **Avoiding** variable conflicts
- **Using** proper scoping strategies
- **Debugging** scope-related issues

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=lW_erSjyMeM&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/lW_erSjyMeM/0.jpg" width="750"
alt="Block Scope & Shadowing in JS Youtube Link"/></a>
