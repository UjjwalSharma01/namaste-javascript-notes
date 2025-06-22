# Episode 4: Functions and Variable Environments

## 🎯 What You'll Learn
- How functions create their own execution contexts
- Understanding variable environments and scope
- How the same variable name can have different values in different contexts
- Call stack behavior with multiple function calls

---

## 🔍 Let's Start with This Interesting Code

```javascript
var x = 1;
a();
b(); // we are calling the functions before defining them. This will work properly, as seen in Hoisting.
console.log(x); // 1

function a() {
  var x = 10; // localscope because of separate execution context
  console.log(x); // 10
}

function b() {
  var x = 100;
  console.log(x); // 100
}
```

### 📊 Actual Output:
```
> 10
> 100  
> 1
```


---

## 🧠 Understanding Variable Environments

### 🔑 Key Concept:
Each function creates its **own execution context** with its **own variable environment**. This means:
- Variables with the same name can exist independently in different functions
- Each `x` is a completely separate variable in its own scope
- Functions don't interfere with each other's variables

---

## 📚 Step-by-Step Execution Flow

### 🏗️ Phase 1: Memory Creation (Global Execution Context)

**Global Memory:**
```javascript
{
  x: undefined,
  a: function a() { var x = 10; console.log(x); },
  b: function b() { var x = 100; console.log(x); }
}
```

**Call Stack:**
```
┌─────────────────┐
│  Global EC      │ ← Bottom of stack
└─────────────────┘
```

### ⚡ Phase 2: Code Execution

#### Step 1: `var x = 1;`
- Global `x` gets value `1`

#### Step 2: `a()` is called
- **New Local Execution Context created for function `a`**
- **Call Stack becomes:**
```
┌─────────────────┐
│   a() EC        │ ← Top of stack  
├─────────────────┤
│  Global EC      │ ← Bottom of stack
└─────────────────┘
```

**Memory Creation in `a()`:**
```javascript
{
  x: undefined  // This is a DIFFERENT x than global x
}
```

**Code Execution in `a()`:**
- `var x = 10;` → Local `x` becomes `10`
- `console.log(x);` → Prints `10` (local `x`, not global)
- Function `a()` completes → **Local EC is destroyed**

**Call Stack after `a()` completes:**
```
┌─────────────────┐
│  Global EC      │ ← Back to global context
└─────────────────┘
```

#### Step 3: `b()` is called
- **New Local Execution Context created for function `b`**
- Same process as `a()` but with different values

**Call Stack during `b()`:**
```
┌─────────────────┐
│   b() EC        │ ← Top of stack
├─────────────────┤  
│  Global EC      │ ← Bottom of stack
└─────────────────┘
```

- Local `x` in `b()` becomes `100`
- `console.log(x);` → Prints `100`
- Function `b()` completes → **Local EC is destroyed**

#### Step 4: `console.log(x);` (Global)
- Back in global context
- Prints global `x` which is still `1`

#### Step 5: Program Ends
- Global Execution Context is destroyed
- Call stack becomes empty

---

## 📊 Visual Representation

![Function Execution Context](/assets/function.jpg "Function Execution Context")

### 🎯 Call Stack Timeline:

| Step | Call Stack | Action |
|------|------------|--------|
| 1 | `[Global EC]` | Global context created |
| 2 | `[Global EC, a()]` | Function `a()` called |
| 3 | `[Global EC]` | Function `a()` completed |  
| 4 | `[Global EC, b()]` | Function `b()` called |
| 5 | `[Global EC]` | Function `b()` completed |
| 6 | `[]` | Program ends |

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Variable Environments**
- Each function has its own separate variable environment
- Variables with same names are independent in different scopes
- Local variables don't affect global variables

#### **2. Execution Context Creation**
- Every function call creates a new Local Execution Context
- Each context has its own memory space
- Contexts are destroyed when functions complete

#### **3. Call Stack Management**
- Functions are added to call stack when called
- Removed from call stack when they complete
- LIFO (Last In, First Out) principle applies

### 🧠 Quick Memory Aid:
```
Each Function = New Execution Context = New Variable Environment
Same Variable Name ≠ Same Variable (if in different functions)
Call Stack = Function Call Manager (LIFO)
Local Context Destroyed = Local Variables Gone
```

### 🎯 Where You'll Use This:
Understanding variable environments helps with:
- **Debugging** scope-related issues
- **Understanding** why variables don't interfere with each other
- **Writing** cleaner, more predictable functions
- **Avoiding** variable naming conflicts

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=gSDncyuGw0s&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/gSDncyuGw0s/0.jpg" width="750"
alt="Functions and Variable Environments Youtube Link"/></a>
