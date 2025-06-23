# Episode 14: Callback Functions in JS ft. Event Listeners

## 🎯 What You'll Learn
- Understanding callback functions and their role in JavaScript
- How callbacks enable asynchronous programming in synchronous JavaScript
- Event listeners and their implementation with callbacks
- Data encapsulation using closures in event handlers
- Memory management with event listeners
- Garbage collection and removeEventListeners best practices

---

## 🔄 Understanding Callback Functions

### 📚 What are Callback Functions?

**Callback Functions** leverage the fact that functions are **first-class citizens** in JavaScript. You can take a function A and pass it to another function B. Here, A is a **callback function**. Basically, you are giving access to function B to call function A.

> **🔑 Key Insight:** Callback functions give us access to the whole **Asynchronous** world in a **Synchronous** world.

### 🔍 Basic Callback Example

```javascript
setTimeout(function () {
  console.log("Timer");
}, 1000); 
// First argument is callback function, second is timer
```

**What happens here:**
- `setTimeout` takes a **callback function** as first parameter
- After 1000ms, JavaScript **calls back** the function
- This enables **asynchronous behavior** in synchronous JavaScript

---

## 🧵 JavaScript: Synchronous to Asynchronous

### 🔑 **Fundamental Truth:**
**JavaScript is a synchronous and single-threaded language. But due to callbacks, we can do async things in JS.**

### 🔍 Execution Order Example

```javascript
setTimeout(function () {
  console.log("timer");
}, 5000);

function x(y) {
  console.log("x");
  y();
}

x(function y() {
  console.log("y");
});

// Output:
// x
// y
// timer (after 5 seconds)
```

### 🧠 **Call Stack Analysis:**

#### **Step-by-Step Execution:**
1. **`setTimeout` is called** → Callback registered, timer starts
2. **`x(function y() {...})` is called** → `x` enters call stack
3. **Inside `x`**: `console.log("x")` → Prints "x"
4. **Inside `x`**: `y()` is called → `y` enters call stack
5. **Inside `y`**: `console.log("y")` → Prints "y"
6. **`y` completes** → Exits call stack
7. **`x` completes** → Exits call stack
8. **Call stack is empty** → Main thread free
9. **After 5 seconds** → setTimeout callback enters call stack
10. **Callback executes** → Prints "timer"

#### **🚨 Critical Understanding:**
```
All functions execute through the call stack
If any operation blocks the call stack = Blocking the main thread
Main thread blocked = Entire application freezes
```

### ⚠️ **Never Block the Main Thread**

```javascript
// ❌ Bad Example (Blocking)
function blockingOperation() {
  // Suppose this takes 30 seconds
  for (let i = 0; i < 10000000000; i++) {
    // Heavy computation
  }
}

blockingOperation(); // This will freeze the browser for 30 seconds
console.log("This won't run until blockingOperation finishes");
```

```javascript
// ✅ Good Example (Non-blocking)
function nonBlockingOperation() {
  setTimeout(() => {
    // Heavy computation moved to async context
    for (let i = 0; i < 10000000000; i++) {
      // Heavy computation
    }
    console.log("Heavy computation done");
  }, 0);
}

nonBlockingOperation();
console.log("This runs immediately"); // Runs immediately
```

**💡 Best Practice:** Always use **async** for functions that take time (setTimeout, API calls, file operations, etc.)

---

## 🔗 Advanced Callback Example

### 🎯 **Sequential Execution with Callbacks**

```javascript
// Example: Print strings in order with random delays
function printStr(str, cb) {
  setTimeout(() => {
    console.log(str);
    cb();
  }, Math.floor(Math.random() * 100) + 1);
}

function printAll() {
  printStr("A", () => {
    printStr("B", () => {
      printStr("C", () => {
        console.log("All done!");
      });
    });
  });
}

printAll(); 
// Output: A B C All done! (always in this order)
```

### 🧠 **Why does this work?**
- Each `printStr` waits for a **random delay** (1-100ms)
- **Callbacks ensure order** → Next function only runs after previous completes
- **Nested structure** maintains sequence despite random timing

### ⚠️ **Callback Hell Preview:**
```javascript
// This pattern can lead to "Callback Hell" or "Pyramid of Doom"
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      getYetMoreData(c, function(d) {
        // ... and so on
      });
    });
  });
});
```

---

## 🎯 Event Listeners

### 📚 **What are Event Listeners?**

Event listeners are functions that **wait for specific events** to occur (click, hover, scroll, etc.) and then execute **callback functions** in response.

### 🔍 **Basic Event Listener Setup**

```html
<!-- index.html -->
<button id="clickMe">Click Me!</button>
```

```javascript
// index.js
document.getElementById("clickMe").addEventListener("click", function xyz() {
  // When click event occurs, this callback function (xyz) is called into callstack
  console.log("Button clicked");
});
```

### 🧠 **How Event Listeners Work:**
1. **Event listener registered** → Browser watches for click events
2. **User clicks button** → Browser detects the event
3. **Callback function queued** → `xyz` function added to event queue
4. **Call stack empty** → Event loop moves callback to call stack
5. **Callback executes** → "Button clicked" is printed

---

## 🔢 Implementing Counter with Event Listeners

### ❌ **Approach 1: Global Variable (Not Recommended)**

```javascript
let count = 0; // ❌ Global variable - anyone can modify it

document.getElementById("clickMe").addEventListener("click", function xyz() {
  console.log("Button clicked", ++count);
});

// Problem: count can be modified from anywhere
count = 1000; // Oops! Counter corrupted
```

**Issues:**
- **Global pollution** → Variable accessible everywhere
- **No data protection** → Any code can modify count
- **Accidental modifications** → Easy to corrupt state

### ✅ **Approach 2: Closures for Data Abstraction**

```javascript
function attachEventListener() {
  let count = 0; // ✅ Private variable protected by closure
  
  document.getElementById("clickMe").addEventListener("click", function xyz() {
    console.log("Button clicked", ++count);
    // Callback function forms closure with outer scope (count)
  });
}

attachEventListener();
```

**Benefits:**
- **Data encapsulation** → `count` is private and protected
- **Controlled access** → Only the event handler can modify count
- **No global pollution** → Clean global namespace
- **Each instance independent** → Multiple counters possible

![Event Listener Demo](/assets/event.jpg)

### 🔍 **Multiple Independent Counters:**

```javascript
function createCounter(buttonId) {
  let count = 0;
  
  document.getElementById(buttonId).addEventListener("click", function() {
    console.log(`${buttonId} clicked ${++count} times`);
  });
}

createCounter("button1"); // Independent counter 1
createCounter("button2"); // Independent counter 2
createCounter("button3"); // Independent counter 3
```

---

## 🗑️ Garbage Collection and removeEventListeners

### 🚨 **Memory Management Issues**

**Event listeners are heavy** because they form **closures**. This creates important memory considerations:

```javascript
function attachEventListener() {
  let count = 0;
  const largeData = new Array(1000000).fill("data"); // Large object
  
  document.getElementById("clickMe").addEventListener("click", function xyz() {
    console.log("Button clicked", ++count);
    // Closure keeps reference to both count AND largeData
  });
}
```

### 🧠 **The Memory Problem:**

#### **Why Memory Isn't Freed:**
1. **Event listener exists** → Callback function is referenced
2. **Callback has closure** → References outer scope variables
3. **Garbage collector can't clean** → Variables still "in use"
4. **Memory accumulates** → Even when call stack is empty

#### **Real-World Impact:**
```javascript
// ❌ This can cause memory leaks
for (let i = 0; i < 1000; i++) {
  document.querySelectorAll('.button')[i].addEventListener('click', function() {
    const heavyData = processLargeDataset(); // Heavy computation
    console.log('Button', i, 'clicked');
  });
}
// 1000 event listeners, each holding heavy data in memory
```

### ✅ **Best Practices for Memory Management**

#### **1. Remove Event Listeners When Not Needed:**

```javascript
function setupTemporaryListener() {
  const button = document.getElementById("clickMe");
  
  function handleClick() {
    console.log("Button clicked");
    
    // Remove listener after first click
    button.removeEventListener("click", handleClick);
  }
  
  button.addEventListener("click", handleClick);
}
```

#### **2. Clean Up in Component Lifecycle:**

```javascript
class ButtonComponent {
  constructor(buttonId) {
    this.button = document.getElementById(buttonId);
    this.handleClick = this.handleClick.bind(this);
    this.setupEventListener();
  }
  
  handleClick() {
    console.log("Button clicked");
  }
  
  setupEventListener() {
    this.button.addEventListener("click", this.handleClick);
  }
  
  cleanup() {
    // Always remove event listeners when component is destroyed
    this.button.removeEventListener("click", this.handleClick);
  }
}

const component = new ButtonComponent("myButton");
// Later, when component is no longer needed:
component.cleanup();
```

#### **3. Use AbortController (Modern Approach):**

```javascript
function setupEventListenerWithAbort() {
  const controller = new AbortController();
  
  document.getElementById("clickMe").addEventListener("click", function() {
    console.log("Button clicked");
  }, { signal: controller.signal });
  
  // Later, remove all listeners associated with this controller
  setTimeout(() => {
    controller.abort(); // Removes all event listeners
  }, 10000);
}
```

### 🚨 **Performance Impact**

Multiple event listeners can severely impact performance:

```javascript
// ❌ Performance killer
document.addEventListener('scroll', heavyScrollHandler);
document.addEventListener('mousemove', heavyMouseHandler);
document.addEventListener('resize', heavyResizeHandler);
// Multiple heavy event listeners running simultaneously
```

**Issues:**
- **onClick, onHover, onScroll** all in a page can slow it down heavily
- Each listener consumes memory through closures
- Frequent event firing can block main thread

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Callback Functions**
- Enable asynchronous programming in synchronous JavaScript
- Functions passed as arguments to other functions
- Bridge between sync and async worlds

#### **2. Call Stack and Threading**
- JavaScript is single-threaded with one call stack
- Never block the main thread with heavy operations
- Use async patterns for time-consuming tasks

#### **3. Event Listeners**
- Respond to user interactions through callback functions
- Form closures with outer scope for data access
- Enable interactive web applications

#### **4. Memory Management**
- Event listeners can cause memory leaks through closures
- Remove listeners when no longer needed
- Use modern patterns like AbortController for cleanup

### 🧠 Quick Memory Aid:
```
Callback = Function passed to another function
Async = Non-blocking, don't freeze main thread
Event Listener = Wait for events, call callbacks
Closure = Event handlers remember outer variables
Cleanup = Remove listeners to prevent memory leaks
```

### 🎯 Where You'll Use This:
Understanding callbacks and event listeners helps with:
- **Building** interactive user interfaces
- **Managing** asynchronous operations
- **Creating** responsive web applications
- **Optimizing** memory usage and performance

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=btj35dh3_U8&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/btj35dh3_U8/0.jpg" width="750"
alt="Callback Functions in JS ft. Event Listeners in JS Youtube Link"/></a>
