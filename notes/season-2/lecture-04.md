# Episode 23: async await

## 🎯 What You'll Learn
- Understanding the async keyword and its purpose
- How await works and its relationship with Promises
- Behind-the-scenes execution of async/await functions
- Comprehensive error handling with try-catch blocks
- Real-world examples using fetch API and GitHub API
- Detailed comparison between async/await and Promise.then/.catch
- Call stack behavior and function suspension mechanics

---

## 🚀 Understanding async Functions

### 📚 **What is async?**

> **`async` is a keyword used before a function to create an asynchronous function.**

### 🔧 **async Function Characteristics**

| Aspect | Regular Function | async Function |
|--------|------------------|----------------|
| **Return Value** | Returns actual value | **Always returns Promise** |
| **Promise Wrapping** | No automatic wrapping | **Automatically wraps values** |
| **await Usage** | Cannot use await | **Can use await inside** |
| **Error Handling** | try-catch for sync errors | **try-catch for async errors** |

### 💡 **Basic async Function Example**

```js
// 💡 async function ALWAYS returns a Promise
async function getData() {
  return "Namaste JavaScript";
}

const dataPromise = getData();
console.log(dataPromise); // Promise {<fulfilled>: 'Namaste JavaScript'}

// ❓ How to extract data from the Promise?
dataPromise.then((res) => console.log(res)); // Namaste JavaScript
```

### 🔍 **Behind the Scenes: Value Wrapping**

```js
// What async does internally:
async function getData() {
  return "Namaste JavaScript";
}

// Is equivalent to:
function getData() {
  return Promise.resolve("Namaste JavaScript");
}
```

### 🎯 **Returning Existing Promises**

```js
const p = new Promise((resolve, reject) => {
  resolve("Promise resolved value!!");
});

async function getData() {
  return p; // Already a Promise
}

// Since p is already a Promise, async doesn't wrap it again
const dataPromise = getData();
console.log(dataPromise); // Promise {<fulfilled>: 'Promise resolved value!!'}
dataPromise.then((res) => console.log(res)); // Promise resolved value!!
```

### 📊 **async Return Value Analysis**

| Return Type | What async Does | Result |
|-------------|-----------------|---------|
| **String** | `Promise.resolve("string")` | Promise with string value |
| **Number** | `Promise.resolve(42)` | Promise with number value |
| **Object** | `Promise.resolve({...})` | Promise with object value |
| **Promise** | Returns as-is | Same Promise (no double wrapping) |
| **Nothing** | `Promise.resolve(undefined)` | Promise with undefined |

---

## ⏳ Understanding await

### 📚 **What is await?**

> **`await` is a keyword that pauses async function execution until a Promise resolves.**

### 🔑 **Key Rules for await**

#### **Rule 1: Only in async Functions**
```js
// ❌ Syntax Error: await outside async function
function regularFunction() {
  await somePromise(); // SyntaxError!
}

// ✅ Correct: await inside async function
async function asyncFunction() {
  await somePromise(); // Works perfectly
}
```

#### **Rule 2: Works with Promises**
```js
const p = new Promise((resolve, reject) => {
  resolve("Promise resolved value!!");
});

// Traditional Promise handling
function getData() {
  p.then((res) => console.log(res));
}

// async/await handling  
async function handlePromise() {
  const val = await p; // Waits for Promise to resolve
  console.log(val);
}
```

---

## 🆚 async/await vs Promise.then Comparison

### 🔍 **Execution Behavior Analysis**

Let's compare how both approaches handle the same Promise:

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved value!!");
  }, 3000);
});
```

#### **📌 Promise.then/.catch Approach**
```js
function getData() {
  // JS engine will NOT wait for Promise to resolve
  p.then((res) => console.log(res));
  console.log("Hello There!");
}

getData();
// Output:
// "Hello There!" (immediately)
// "Promise resolved value!!" (after 3 seconds)

// 💡 JavaScript doesn't wait - it registers the callback and moves on
```

#### **📌 async/await Approach**
```js
async function handlePromise() {
  // JS engine appears to wait for Promise to resolve
  const val = await p;
  console.log("Hello There!");
  console.log(val);
}

handlePromise();
// Output:
// (3 seconds pause)
// "Hello There!"
// "Promise resolved value!!"

// 💡 Code execution is suspended at await until Promise resolves
```

### 📊 **Execution Timeline Comparison**

| Time | Promise.then Approach | async/await Approach |
|------|----------------------|---------------------|
| **0ms** | Register callback, print "Hello There!" | Execute until await, then suspend |
| **3000ms** | Execute callback, print resolved value | Resume execution, print both lines |

---

## 🧠 Multiple await Scenarios

### 🎯 **Same Promise, Multiple awaits**

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved value!!");
  }, 3000);
});

async function handlePromise() {
  console.log("Hi");
  
  const val = await p;
  console.log("Hello There!");
  console.log(val);

  const val2 = await p; // Same Promise again
  console.log("Hello There! 2");
  console.log(val2);
}

handlePromise();

// ❓ Will it wait for 6 seconds total?
// ✅ No! Only 3 seconds total because both awaits are for the same Promise

// Execution Timeline:
// 0ms: "Hi" (immediate)
// 3000ms: All remaining lines execute immediately
// Output: "Hi" → (3 sec pause) → "Hello There!" → "Promise resolved value!!" → "Hello There! 2" → "Promise resolved value!!"
```

### 🔄 **Different Promises, Sequential Execution**

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved value by p1!!");
  }, 3000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved value by p2!!");
  }, 2000);
});

async function handlePromise() {
  console.log("Hi");
  
  const val = await p1; // Waits 3 seconds
  console.log("Hello There!");
  console.log(val);

  const val2 = await p2; // p2 already resolved, executes immediately
  console.log("Hello There! 2");
  console.log(val2);
}

// Execution Timeline:
// 0ms: "Hi"
// 3000ms: "Hello There!", "Promise resolved value by p1!!", "Hello There! 2", "Promise resolved value by p2!!"
```

### ⚡ **Order Matters: Faster Promise First**

```js
async function handlePromise() {
  console.log("Hi");
  
  const val = await p2; // Waits 2 seconds (faster promise first)
  console.log("Hello There!");
  console.log(val);

  const val2 = await p1; // Waits additional 1 second (3 total - 2 already elapsed)
  console.log("Hello There! 2");
  console.log(val2);
}

// Execution Timeline:
// 0ms: "Hi"
// 2000ms: "Hello There!", "Promise resolved value by p2!!"  
// 3000ms: "Hello There! 2", "Promise resolved value by p1!!"
```

---

## 🔬 Behind the Scenes: Call Stack Mechanics

### 📚 **The Reality: JavaScript Never Actually Waits**

> **Important:** JavaScript never blocks the call stack. The "waiting" is actually function suspension and resumption.

### 🎭 **Call Stack Flow Analysis**

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved value by p1!!");
  }, 5000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved value by p2!!");
  }, 10000);
});

async function handlePromise() {
  console.log("Hi");
  debugger; // Breakpoint 1
  
  const val = await p1;
  console.log("Hello There!");
  debugger; // Breakpoint 2
  console.log(val);

  const val2 = await p2;
  console.log("Hello There! 2");
  debugger; // Breakpoint 3
  console.log(val2);
}

handlePromise();
```

### 🔄 **Detailed Call Stack Flow**

| Step | Time | Call Stack | Action |
|------|------|------------|--------|
| **1** | 0ms | `handlePromise()` | Function pushed to stack |
| **2** | 0ms | `handlePromise()` | Logs "Hi" |
| **3** | 0ms | `handlePromise()` | Encounters `await p1` |
| **4** | 0ms | *Empty* | **Function suspended and removed from stack** |
| **5** | 5000ms | `handlePromise()` | **Function resumed after p1 resolves** |
| **6** | 5000ms | `handlePromise()` | Logs "Hello There!" and val |
| **7** | 5000ms | `handlePromise()` | Encounters `await p2` |
| **8** | 5000ms | *Empty* | **Function suspended again** |
| **9** | 10000ms | `handlePromise()` | **Function resumed after p2 resolves** |
| **10** | 10000ms | `handlePromise()` | Logs final messages and completes |

### 💡 **Key Insights**

#### **🎯 Suspension, Not Blocking**
- Function is **removed from call stack** during await
- **Call stack remains free** for other operations
- **No UI freezing** or blocking behavior

#### **🔄 Context Preservation**
- **Variable values preserved** during suspension
- **Execution resumes exactly** where it left off
- **Local scope maintained** across suspensions

#### **⚡ Smart Resolution**
- If Promise already resolved, **no suspension occurs**
- **Immediate execution** continues without delay

---

## 🌐 Real-World Example: GitHub API

### 🔧 **Practical fetch Implementation**

```js
async function handlePromise() {
  try {
    // Step 1: Make API request
    const data = await fetch("https://api.github.com/users/alok722");
    
    // Step 2: Parse JSON response (also returns Promise)
    const res = await data.json();
    
    // Step 3: Use the data
    console.log(res);
    console.log(`${res.name} has ${res.public_repos} public repositories`);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
}

handlePromise();
```

### 📊 **API Call Breakdown**

| Step | Operation | Returns | await Result |
|------|-----------|---------|--------------|
| **1** | `fetch()` | Promise<Response> | Response object |
| **2** | `response.json()` | Promise<Object> | Parsed JSON data |
| **3** | Use data | - | Final result |

### 🔍 **What Happens Internally**

```js
// Without async/await (traditional approach)
function handlePromiseTraditional() {
  fetch("https://api.github.com/users/alok722")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      console.log(`${data.name} has ${data.public_repos} public repositories`);
    })
    .catch(error => {
      console.error("Failed to fetch user data:", error);
    });
}

// With async/await (modern approach)
async function handlePromise() {
  try {
    const response = await fetch("https://api.github.com/users/alok722");
    const data = await response.json();
    console.log(data);
    console.log(`${data.name} has ${data.public_repos} public repositories`);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
}
```

---

## ⚠️ Error Handling Strategies

### 🛡️ **try-catch Block Pattern**

```js
async function handlePromise() {
  try {
    const data = await fetch("https://api.github.com/users/alok722");
    const res = await data.json();
    console.log(res);
  } catch (err) {
    // Handles ANY error in the try block
    console.error("Error occurred:", err.message);
  }
}

handlePromise();
```

### 🎯 **Alternative Error Handling**

```js
// Method 1: .catch() on async function call
async function handlePromise() {
  const data = await fetch("https://api.github.com/users/invalid-user");
  const res = await data.json();
  console.log(res);
}

handlePromise().catch((err) => {
  console.error("Promise chain failed:", err);
});

// Method 2: Specific error handling
async function handlePromise() {
  try {
    const data = await fetch("https://api.github.com/users/alok722");
    
    if (!data.ok) {
      throw new Error(`HTTP Error: ${data.status}`);
    }
    
    const res = await data.json();
    console.log(res);
  } catch (err) {
    if (err.name === 'TypeError') {
      console.error("Network error:", err.message);
    } else {
      console.error("API error:", err.message);
    }
  }
}
```

### 🔍 **Error Handling Comparison**

| Method | Syntax | Use Case | Benefits |
|--------|--------|----------|----------|
| **try-catch** | `try { await } catch (e) {}` | Within async function | Structured error handling |
| **Promise.catch()** | `asyncFunction().catch()` | Outside async function | Chain-style error handling |
| **Mixed** | Both approaches combined | Complex scenarios | Flexible error management |

---

## 🆚 async/await vs Promise.then/.catch

### 📊 **Comprehensive Comparison**

| Aspect | Promise.then/.catch | async/await |
|--------|-------------------|-------------|
| **Syntax** | Callback-based chaining | Synchronous-looking code |
| **Readability** | Nested, pyramid-like | Linear, top-to-bottom |
| **Error Handling** | `.catch()` chains | `try-catch` blocks |
| **Debugging** | Complex stack traces | Clear, line-by-line debugging |
| **Promise Chaining** | Explicit `.then()` calls | Implicit with `await` |
| **Performance** | Same (syntactic sugar) | Same (syntactic sugar) |

### 🎯 **Readability Comparison**

#### **❌ Promise Chaining (Harder to Read)**
```js
function processUser(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    })
    .then(user => {
      return fetch(`/api/users/${user.id}/posts`);
    })
    .then(response => response.json())
    .then(posts => {
      return fetch(`/api/users/${userId}/profile`);
    })
    .then(response => response.json())
    .then(profile => {
      return {
        user: user, // ❌ user is not in scope!
        posts: posts, // ❌ posts is not in scope!
        profile: profile
      };
    })
    .catch(error => {
      console.error('Process failed:', error);
      throw error;
    });
}
```

#### **✅ async/await (Easier to Read)**
```js
async function processUser(userId) {
  try {
    // Step 1: Get user data
    const userResponse = await fetch(`/api/users/${userId}`);
    if (!userResponse.ok) {
      throw new Error('User not found');
    }
    const user = await userResponse.json();
    
    // Step 2: Get user posts
    const postsResponse = await fetch(`/api/users/${user.id}/posts`);
    const posts = await postsResponse.json();
    
    // Step 3: Get user profile
    const profileResponse = await fetch(`/api/users/${userId}/profile`);
    const profile = await profileResponse.json();
    
    // Step 4: Return combined data
    return {
      user,    // ✅ All variables in scope
      posts,   // ✅ Clear and accessible
      profile
    };
    
  } catch (error) {
    console.error('Process failed:', error);
    throw error;
  }
}
```

### 🎯 **When to Use Which?**

#### **Use async/await When:**
- ✅ **Sequential operations** with dependencies
- ✅ **Complex error handling** required
- ✅ **Multiple await calls** in same function
- ✅ **Debugging** is important
- ✅ **Team prefers** synchronous-looking code

#### **Use Promise.then When:**
- ✅ **Simple transformations** with single operation
- ✅ **Functional programming** style preferred
- ✅ **Working with** existing Promise-based APIs
- ✅ **Method chaining** feels more natural

### 💡 **Best Practice: async/await is Generally Preferred**

> **Recommendation:** Use `async/await` for new code as it provides better readability, debugging, and error handling while being syntactic sugar over Promises.

---

## 🚀 Advanced async/await Patterns

### 🔄 **Parallel Execution with Promise.all()**

```js
// ❌ Sequential (slower)
async function getDataSequential() {
  const user = await fetch('/api/user');
  const posts = await fetch('/api/posts');
  const comments = await fetch('/api/comments');
  
  return {
    user: await user.json(),
    posts: await posts.json(),
    comments: await comments.json()
  };
}

// ✅ Parallel (faster)  
async function getDataParallel() {
  const [userResponse, postsResponse, commentsResponse] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/comments')
  ]);
  
  return {
    user: await userResponse.json(),
    posts: await postsResponse.json(),
    comments: await commentsResponse.json()
  };
}
```

### 🎯 **Error Recovery Patterns**

```js
async function robustApiCall(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        throw error; // Last attempt failed
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### ⚡ **Timeout Pattern**

```js
function timeout(ms) {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
}

async function fetchWithTimeout(url, timeoutMs = 5000) {
  try {
    const result = await Promise.race([
      fetch(url),
      timeout(timeoutMs)
    ]);
    return await result.json();
  } catch (error) {
    if (error.message === 'Timeout') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}
```

---

## 📋 Quick Summary

### 💡 **Key Takeaways:**

#### **1. 🚀 async Functions**
- **Always return Promise** - even simple values get wrapped
- **Enable await usage** - can use await keyword inside
- **Syntactic sugar** - cleaner syntax over Promise.then()
- **Same performance** - no overhead compared to Promises

#### **2. ⏳ await Keyword**
- **Only in async functions** - syntax error outside async
- **Pauses execution** - function suspends until Promise resolves
- **Non-blocking** - call stack remains free during suspension
- **Preserves context** - variables and scope maintained

#### **3. 🔄 Execution Behavior**
- **Suspension not blocking** - function removed from call stack
- **Context preservation** - execution resumes where it left off
- **Smart resolution** - no suspension if Promise already resolved
- **Sequential by default** - each await waits for previous

#### **4. ⚠️ Error Handling**
- **try-catch blocks** - structured error handling within async functions
- **Promise.catch()** - alternative error handling on function calls
- **Error propagation** - uncaught errors reject the returned Promise
- **Graceful degradation** - implement fallback strategies

### 🧠 **Quick Memory Aid:**
```
async = Function that returns Promise
await = Pause until Promise resolves (only in async)
Suspension = Function removed from call stack (not blocking)
try-catch = Error handling for async operations
Syntactic sugar = Cleaner syntax over Promise.then()
Same Promise multiple awaits = Only waits once
```

### 🎯 **Best Practices:**
- **Prefer async/await** over Promise.then() for new code
- **Use try-catch** for comprehensive error handling
- **Consider Promise.all()** for parallel operations
- **Handle errors gracefully** with meaningful messages
- **Use timeout patterns** for network requests
- **Implement retry logic** for resilient applications

### ⚡ **Real-World Applications:**
- **🌐 API calls** - Fetch data from REST APIs and GraphQL endpoints
- **📁 File operations** - Read/write files in Node.js applications
- **💾 Database queries** - Interact with databases using async ORMs
- **🔐 Authentication** - Handle login flows and token management
- **📧 Email services** - Send emails and handle delivery status
- **🎨 Image processing** - Upload and process images asynchronously

### 🔮 **Advanced Concepts Coming:**
Understanding async/await thoroughly prepares you for advanced topics like generators, async iterators, and reactive programming patterns.

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=6nv3qy3oNkc&list=PLlasXeu85E9eWOpw9jxHOQyGMRiBZ60aX&index=4&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/6nv3qy3oNkc/0.jpg" width="750"
alt="async-await in Javascript Youtube Link"/></a>
