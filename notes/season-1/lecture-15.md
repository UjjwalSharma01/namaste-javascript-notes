# Episode 15: Asynchronous JavaScript & EVENT LOOP from scratch

## 🎯 What You'll Learn
- How JavaScript handles asynchronous operations despite being single-threaded
- Understanding the Browser's Web APIs and their role
- The Event Loop mechanism and how it coordinates execution
- Callback Queue vs Microtask Queue priority system
- How fetch, setTimeout, and DOM events work behind the scenes
- Common pitfalls and timing issues in asynchronous JavaScript

---

## ⚡ JavaScript's Asynchronous Foundation

> **🔑 Key Truth:** Call stack will execute any execution context which enters it. Time, tide and JS waits for none. **TLDR: Call stack has no timer.**

### 🧠 **The Big Picture**

JavaScript Engine alone is quite limited. The **Browser** provides the real superpowers:

```
Browser Components:
├── JavaScript Engine
│   └── Call Stack (Global & Local Execution Contexts)
├── Web APIs (Browser's Superpowers)
│   ├── Timer (setTimeout, setInterval)
│   ├── DOM APIs (document, getElementById, etc.)
│   ├── Network (fetch, XMLHttpRequest)
│   ├── Storage (localStorage, sessionStorage)
│   ├── Location & History
│   └── Many more...
└── Event Loop System
    ├── Callback Queue
    └── Microtask Queue
```

**🔗 Connection:** JavaScript needs some way to connect the call stack with all these browser superpowers. This is done using **Web APIs**.

![Event Loop 1 Demo](/assets/eventloop1.jpg)

---

## 🌐 Web APIs: Browser's Superpowers

### 📚 **What are Web APIs?**

**None of the below are part of JavaScript!** These are extra superpowers that browser provides. Browser gives access to JS call stack to use these powers.

![Event Loop 2 Demo](/assets/eventloop2.jpg)

### 🔧 **Common Web APIs:**

| Web API | Purpose | Example Usage |
|---------|---------|---------------|
| **setTimeout()** | Timer function | `setTimeout(callback, delay)` |
| **DOM APIs** | HTML DOM tree access | `document.getElementById()` |
| **fetch()** | Network requests | `fetch('https://api.example.com')` |
| **localStorage** | Browser storage | `localStorage.setItem()` |
| **console** | Developer tools | `console.log()` (Yes, even console is not JS!) |
| **location** | URL/navigation | `window.location.href` |

### 🪟 **Window Object: The Global Gateway**

We get all these APIs through the **global `window` object**:

```javascript
// These are all equivalent:
setTimeout(callback, 1000);
window.setTimeout(callback, 1000);

console.log("Hello");
window.console.log("Hello");

localStorage.setItem("key", "value");
window.localStorage.setItem("key", "value");
```

**💡 Why we don't write `window`:** As `window` is the global object, and all Web APIs are present in it, we don't explicitly write `window` - but it's always implied.

---

## 🔄 Event Loop in Action

### 🔍 **Basic Example: Understanding the Flow**

![Event Loop 3 Demo](/assets/eventloop3.jpg)

```javascript
console.log("start");
setTimeout(function cb() {
  console.log("timer");
}, 5000);
console.log("end");

// Output:
// start
// end
// timer (after 5 seconds)
```

### 🧠 **Step-by-Step Execution:**

#### **Phase 1: Synchronous Execution**
1. **GEC created** → Global Execution Context enters call stack
2. **`console.log("start")`** → Calls console Web API → Prints "start"
3. **`setTimeout(..., 5000)`** → Calls setTimeout Web API:
   - Stores callback `cb()` in Web API environment
   - Starts 5-second timer
   - Returns immediately (non-blocking)
4. **`console.log("end")`** → Calls console Web API → Prints "end"
5. **GEC completes** → Pops from call stack

#### **Phase 2: Timer Completion**
6. **Timer expires** → After 5 seconds, `cb()` needs to execute
7. **But wait!** → `cb()` cannot directly enter call stack
8. **Callback Queue** → `cb()` first goes to callback queue
9. **Event Loop** → Checks if call stack is empty, then moves `cb()` to call stack
10. **Execution** → `cb()` executes, prints "timer", then pops from call stack

### 🛡️ **Event Loop: The Gatekeeper**

**Event Loop's Job:**
- Continuously monitor call stack and callback queue
- **If call stack is empty** AND **callback queue has tasks** → Move task to call stack
- **Never interrupt** ongoing execution in call stack

---

## 📋 Callback Queue Deep Dive

### ❓ **Q: How does the timer callback reach the call stack after 5 seconds?**

![Event Loop 4 Demo](/assets/eventloop4.jpg)

**Answer:** Through the **Callback Queue** and **Event Loop** mechanism:

1. **Timer expires** → `cb()` ready for execution
2. **Enters callback queue** → Waits for its turn
3. **Event loop monitors** → Checks call stack status
4. **Call stack empty?** → Event loop moves `cb()` to call stack
5. **Execution** → `cb()` runs and completes

### 🔍 **Event Listener Example**

![Event Loop 5 Demo](/assets/eventloop5.jpg)

```javascript
console.log("Start");

document.getElementById("btn").addEventListener("click", function cb() {
  // cb() registered in Web API environment with click event attached
  console.log("Callback");
});

console.log("End");

// Output immediately:
// Start
// End
// 
// Output when button clicked:
// Callback
```

### 🧠 **What Happens:**

1. **Event listener registered** → `cb()` stored in Web API environment
2. **Event attached** → Browser watches for click events on button
3. **Execution continues** → "Start" and "End" printed, GEC pops
4. **Event listener persists** → Stays in Web API environment indefinitely
5. **User clicks** → `cb()` moves to callback queue
6. **Event loop** → Moves `cb()` to call stack for execution

#### **🚨 Important:** Event listeners stay in Web API environment until explicitly removed or browser closed!

### ❓ **Q: Why do we need a callback queue?**

**Scenario:** User clicks button 6 times rapidly

**Answer:**
1. **6 callbacks** → All 6 `cb()` instances enter callback queue
2. **Sequential processing** → Event loop processes them one by one
3. **No conflicts** → Each callback executes completely before next one
4. **FIFO order** → First click processed first, last click processed last

**💡 Benefit:** Maintains order and prevents callback conflicts.

---

## ⚡ Microtask Queue: The Priority Lane

### 🔍 **Fetch API Behavior**

```javascript
console.log("Start");

setTimeout(function cbT() {
  console.log("CB Timeout");
}, 5000);

fetch("https://api.netflix.com").then(function cbF() {
  console.log("CB Netflix");
}); // Takes 2 seconds to get response

// Millions of lines of code here...

console.log("End");

// Actual Output:
// Start
// End
// CB Netflix (after 2 seconds)
// CB Timeout (after 5 seconds)
```

### 🧠 **Execution Analysis:**

#### **Phase 1: Registration**
1. **`console.log("Start")`** → Prints "Start"
2. **`setTimeout`** → `cbT` registered in Web API, 5-second timer starts
3. **`fetch`** → `cbF` registered in Web API, network request initiated
4. **Millions of lines** → Execute synchronously
5. **`console.log("End")`** → Prints "End"

#### **Phase 2: Async Completion**
6. **After 2 seconds** → Netflix response ready, `cbF` enters **Microtask Queue**
7. **After 5 seconds** → Timer expires, `cbT` enters **Callback Queue**
8. **Event loop priority** → Processes Microtask Queue first
9. **`cbF` executes** → Prints "CB Netflix"
10. **`cbT` executes** → Prints "CB Timeout"

![Event Loop 6 Demo](/assets/eventloop6.jpg)

### 🏆 **Priority System**

![Microtask Priority Visualization](/assets/microtask.gif)

```
Event Loop Priority:
1. Call Stack (highest priority)
2. Microtask Queue 
3. Callback Queue (lowest priority)
```

#### **⚡ Microtask Queue gets higher priority than Callback Queue!**

### 📊 **What Goes Where?**

| Queue Type | Contents | Examples |
|------------|----------|----------|
| **Microtask Queue** | Promise callbacks, Mutation Observer | `.then()`, `.catch()`, `.finally()` |
| **Callback Queue** | All other async callbacks | `setTimeout`, `setInterval`, DOM events |

#### **🔍 Detailed Breakdown:**

**Microtask Queue:**
- **Promise callbacks** → `.then()`, `.catch()`, `.finally()`
- **Mutation Observer** → Watches DOM changes and executes callbacks
- **queueMicrotask()** → Manually queued microtasks

**Callback Queue (Task Queue):**
- **Timer callbacks** → `setTimeout`, `setInterval`
- **DOM events** → Click, scroll, resize handlers
- **I/O operations** → File operations, network (excluding fetch promises)

### ⚠️ **Starvation Problem**

```javascript
// ❌ This can cause starvation
function recursiveMicrotask() {
  Promise.resolve().then(() => {
    console.log("Microtask");
    recursiveMicrotask(); // Creates new microtask
  });
}

setTimeout(() => {
  console.log("This may never run!"); // Starved callback
}, 0);

recursiveMicrotask();
```

**Problem:** If microtask queue keeps creating new tasks, callback queue never gets a chance to run!

---

## ❓ Important Questions & Answers

### **1. When does the event loop actually start?**

**Answer:** Event loop, as the name suggests, is a single-thread, loop that is **almost infinite**. It's **always running** and doing its job from the moment the JavaScript runtime starts.

```javascript
// Event loop is running even before this code executes
console.log("Event loop was already running!");
```

### **2. Are only asynchronous Web API callbacks registered in Web API environment?**

**Answer:** **YES**, only asynchronous callbacks go through Web APIs. Synchronous callbacks like those in `map`, `filter`, and `reduce` are **not** registered in Web API environment.

```javascript
// ❌ NOT in Web API (synchronous callback)
[1, 2, 3].map(function(x) {
  return x * 2;
});

// ✅ IN Web API (asynchronous callback)
setTimeout(function() {
  console.log("Async callback");
}, 1000);
```

### **3. Does Web API environment store the callback function and push the same to queue?**

**Answer:** **Yes**, callback functions are stored in Web API environment, and a **reference** is scheduled in the queues. 

**⚠️ Special Case:** Event listeners (click handlers) stay in Web API environment **forever** until explicitly removed. This is why it's advised to remove listeners when not needed for garbage collection.

```javascript
// Event listener stays in Web API forever
button.addEventListener('click', handleClick);

// Good practice: Remove when done
button.removeEventListener('click', handleClick);
```

### **4. What if setTimeout delay is 0ms?**

**Answer:** There are **trust issues** with `setTimeout()` 😅. Even with 0ms delay:

```javascript
setTimeout(() => {
  console.log("This might wait!");
}, 0);

// Heavy synchronous operation
for (let i = 0; i < 1000000000; i++) {
  // Blocking operation
}

console.log("This runs first!");
```

**Why?** The callback needs to wait until the **call stack is empty**. So the 0ms callback might wait for 100ms+ if the stack is busy.

---

## 🎬 Visual Learning: Event Loop in Motion

### 📱 **Interactive Visualizations**

![microtask 1 Demo](/assets/microtask1.gif)
![microtask 2 Demo](/assets/microtask2.gif)
![microtask 3 Demo](/assets/microtask3.gif)
![microtask 4 Demo](/assets/microtask4.gif)
![microtask 5 Demo](/assets/microtask5.gif)
![microtask 6 Demo](/assets/microtask6.gif)

**💡 Pro Tip:** Study these GIFs to visualize how different async operations flow through the event loop system!

---

## 📋 Quick Summary

### 💡 What We Learned:

#### **1. Browser Architecture**
- JavaScript Engine + Web APIs + Event Loop System
- Web APIs provide async capabilities to single-threaded JavaScript
- Window object is the gateway to all Web APIs

#### **2. Event Loop Mechanism**
- Call Stack executes synchronous code
- Web APIs handle asynchronous operations
- Event Loop coordinates between queues and call stack

#### **3. Queue Priority System**
- **Microtask Queue** → Higher priority (Promises, Mutation Observer)
- **Callback Queue** → Lower priority (setTimeout, DOM events)
- Event Loop always processes microtasks before callbacks

#### **4. Common Patterns**
- Timer callbacks go through callback queue
- Promise callbacks go through microtask queue
- Event listeners persist in Web API environment

### 🧠 Quick Memory Aid:
```
Single Thread + Web APIs = Async JavaScript
Call Stack → Microtask Queue → Callback Queue
Promises = Microtask (high priority)
setTimeout = Callback (low priority)  
Event Loop = The coordinator between all
```

### 🎯 Where You'll Use This:
Understanding the event loop helps with:
- **Debugging** timing issues in async code
- **Optimizing** performance of web applications
- **Understanding** why certain code executes in specific order
- **Writing** better asynchronous JavaScript

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=8zKuNo4ay8E&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/8zKuNo4ay8E/0.jpg" width="750"
alt="Asynchronous JavaScript & EVENT LOOP from scratch in JS Youtube Link"/></a>
