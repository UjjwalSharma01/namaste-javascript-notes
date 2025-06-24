# Episode 24 : Promise APIs (all, allSettled, race, any) + Interview Questions 🔥

## 📚 What You'll Learn

By the end of this lecture, you'll master:

- 🏎️ **Promise.all()**: Parallel execution with fail-fast behavior for performance optimization
- 🛡️ **Promise.allSettled()**: Safe parallel execution that waits for all promises regardless of outcome
- 🏁 **Promise.race()**: First-to-finish wins strategy for timeout implementations and competitive scenarios
- ✨ **Promise.any()**: Success-focused execution that waits for the first successful result
- 🎯 **Real-world Applications**: API orchestration, batch processing, and resilient system design
- 💼 **Interview Mastery**: Common gotchas, edge cases, and performance considerations
- 🔧 **Advanced Patterns**: Error aggregation, timeout handling, and parallel vs sequential strategies

---

## 📋 4 Essential Promise APIs

> **💡 One simply doesn't use async/await without knowing promises!**

### 🚀 **Core Promise APIs Overview**

| API | Purpose | Behavior | Use Case |
|-----|---------|----------|----------|
| **Promise.all()** | Parallel execution | **Fail-fast** - rejects on first error | All operations must succeed |
| **Promise.allSettled()** | Parallel execution | **Safe** - waits for all to complete | Want all results regardless |
| **Promise.race()** | Competition | **First-to-finish** wins (success or error) | Timeout implementations |
| **Promise.any()** | Success-focused | **First success** wins, ignores failures | Fallback strategies |

---

## 🏎️ Promise.all() - Parallel with Fail-Fast

### 📚 **Definition**

> **Promise.all()** handles multiple promises in parallel and collects results in a single aggregate array. It follows a **fail-fast strategy** - if any promise rejects, the entire operation fails immediately.

### 🎯 **When to Use Promise.all()**

**Perfect for scenarios where:**
- 🔗 **All operations must succeed** for the result to be meaningful
- ⚡ **Performance is critical** - parallel execution saves time
- 📊 **Data aggregation** from multiple sources required
- 🔄 **Batch processing** operations

### 💼 **Real-World Example: E-commerce Dashboard**

```js
// Loading user dashboard data
async function loadDashboard(userId) {
  try {
    const [user, orders, wishlist, recommendations] = await Promise.all([
      fetchUserProfile(userId),     // 2 seconds
      fetchUserOrders(userId),      // 1.5 seconds  
      fetchUserWishlist(userId),    // 1 second
      fetchRecommendations(userId)  // 3 seconds
    ]);
    
    return { user, orders, wishlist, recommendations };
    // Total time: 3 seconds (not 7.5 seconds sequentially!)
  } catch (error) {
    throw new Error(`Dashboard loading failed: ${error.message}`);
  }
}
```

### 🔍 **Execution Behavior Analysis**

#### **🎯 Success Scenario**
```js
Promise.all([p1, p2, p3]) // p1: 3s, p2: 1s, p3: 2s
```

| Time | Status | Execution |
|------|---------|-----------|
| **0s** | Started | All 3 promises begin executing |
| **1s** | p2 ✅ | p2 completes successfully |
| **2s** | p3 ✅ | p3 completes successfully |
| **3s** | p1 ✅ | p1 completes, **Promise.all resolves** |
| **Result** | ✅ Success | `[val1, val2, val3]` in **3 seconds** |

#### **❌ Failure Scenario**
```js
Promise.all([p1, p2, p3]) // p1: 3s, p2: 1s (fails), p3: 2s
```

| Time | Status | Execution |
|------|---------|-----------|
| **0s** | Started | All 3 promises begin executing |
| **1s** | p2 ❌ | **p2 fails - Promise.all immediately rejects** |
| **2s** | p3 ✅ | p3 still completes (but result ignored) |
| **3s** | p1 ✅ | p1 still completes (but result ignored) |
| **Result** | ❌ Failure | Error from p2 in **1 second** |

### ⚠️ **Key Behaviors**

#### **🚨 Fail-Fast Strategy**
- **Immediate rejection** on first promise failure
- **Background promises continue** but results are ignored
- **Error propagation** - original error is preserved
- **No partial results** - all or nothing approach

#### **📊 Result Ordering**
- **Maintains input order** regardless of completion time
- **Parallel execution** but sequential result array
- **Type preservation** - each result maintains its original type

### 💡 **Promise.all() Conclusion**

> **Promise.all()** waits for **all** input promises to resolve and returns an array containing results in **original order**. If **any** promise rejects, Promise.all **immediately** returns a rejected promise with the error from the first failed promise.

---

## 🛡️ Promise.allSettled() - Safe Parallel Execution

### 📚 **Definition**

> **Promise.allSettled()** waits for **all** promises to settle (resolve or reject) and returns detailed results for each promise, including both successes and failures.

### 🎯 **When to Use Promise.allSettled()**

**Perfect for scenarios where:**
- 📊 **Want all results** regardless of individual failures
- 🛡️ **Fault tolerance** is more important than fail-fast behavior
- 📈 **Analytics and monitoring** - need to track success/failure rates
- 🔄 **Batch operations** where partial success is acceptable

### 💼 **Real-World Example: Social Media Aggregator**

```js
// Fetching posts from multiple social platforms
async function aggregateSocialPosts(userId) {
  const socialPromises = [
    fetchFacebookPosts(userId),   // Might be down
    fetchTwitterPosts(userId),    // API rate limited
    fetchInstagramPosts(userId),  // User might be private
    fetchLinkedInPosts(userId)    // Working fine
  ];
  
  const results = await Promise.allSettled(socialPromises);
  
  const posts = [];
  const errors = [];
  
  results.forEach((result, index) => {
    const platform = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'][index];
    
    if (result.status === 'fulfilled') {
      posts.push({ platform, posts: result.value });
    } else {
      errors.push({ platform, error: result.reason });
    }
  });
  
  return { posts, errors, successRate: posts.length / results.length };
}
```

### 🔍 **Execution Behavior Analysis**

#### **🎯 Mixed Results Scenario**
```js
Promise.allSettled([p1, p2, p3]) // p1: 3s (success), p2: 1s (fail), p3: 2s (success)
```

| Time | Status | Execution |
|------|---------|-----------|
| **0s** | Started | All 3 promises begin executing |
| **1s** | p2 ❌ | p2 fails (but Promise.allSettled continues) |
| **2s** | p3 ✅ | p3 completes successfully |
| **3s** | p1 ✅ | p1 completes - **Promise.allSettled resolves** |
| **Result** | ✅ Always | Detailed results array in **3 seconds** |

### 📊 **Result Structure**

```js
// Promise.allSettled result format
[
  { status: 'fulfilled', value: 'P1 Success' },
  { status: 'rejected', reason: 'P2 Error' },
  { status: 'fulfilled', value: 'P3 Success' }
]
```

### 🔄 **Result Processing Patterns**

#### **📈 Success/Failure Analysis**
```js
function analyzeResults(settledResults) {
  const analysis = {
    total: settledResults.length,
    successful: 0,
    failed: 0,
    results: [],
    errors: []
  };
  
  settledResults.forEach(result => {
    if (result.status === 'fulfilled') {
      analysis.successful++;
      analysis.results.push(result.value);
    } else {
      analysis.failed++;
      analysis.errors.push(result.reason);
    }
  });
  
  analysis.successRate = (analysis.successful / analysis.total) * 100;
  return analysis;
}
```

### 💡 **Promise.allSettled() Conclusion**

> **Promise.allSettled()** is the **safest** Promise API. It **always waits** for all promises to complete and provides **detailed status** for each, making it perfect for **fault-tolerant** operations.

### 🆚 **Promise.all() vs Promise.allSettled()**

| Aspect | Promise.all() | Promise.allSettled() |
|--------|---------------|---------------------|
| **Failure Behavior** | **Fail-fast** ⚡ | **Fault-tolerant** 🛡️ |
| **Result on Error** | Rejects immediately | Always resolves with details |
| **Use Case** | All must succeed | Partial success acceptable |
| **Performance** | Faster failure detection | Complete execution always |
| **Error Info** | First error only | All errors preserved |

---

## 🏁 Promise.race() - First-to-Finish Wins

### 📚 **Definition**

> **Promise.race()** returns a promise that fulfills or rejects as soon as **any** of the input promises settles (resolves or rejects), with the value or reason from that promise.

### 🎯 **When to Use Promise.race()**

**Perfect for scenarios involving:**
- ⏱️ **Timeout implementations** - cancel slow operations
- 🔄 **Fallback strategies** - try multiple sources, use first available
- 🌐 **Server selection** - connect to fastest responding server
- 📊 **Performance testing** - measure response times

### 💼 **Real-World Example: Timeout Implementation**

```js
// Create a timeout promise
function timeout(ms, message = 'Operation timed out') {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

// API call with timeout
async function fetchWithTimeout(url, timeoutMs = 5000) {
  try {
    const result = await Promise.race([
      fetch(url),                                    // API call
      timeout(timeoutMs, `Request timed out after ${timeoutMs}ms`)  // Timeout
    ]);
    return await result.json();
  } catch (error) {
    if (error.message.includes('timed out')) {
      console.log('Request was too slow, consider retry or fallback');
    }
    throw error;
  }
}
```

### 🔍 **Execution Behavior Analysis**

#### **🎯 Success Race Scenario**
```js
Promise.race([p1, p2, p3]) // p1: 3s, p2: 1s (wins), p3: 2s
```

| Time | Status | Execution |
|------|---------|-----------|
| **0s** | Started | All 3 promises begin executing |
| **1s** | p2 ✅ | **p2 wins - Promise.race resolves immediately** |
| **2s** | p3 ✅ | p3 completes (but result ignored) |
| **3s** | p1 ✅ | p1 completes (but result ignored) |
| **Result** | ✅ Winner | `val2` in **1 second** |

#### **❌ Failure Race Scenario**
```js
Promise.race([p1, p2, p3]) // p1: 3s, p2: 5s, p3: 2s (fails)
```

| Time | Status | Execution |
|------|---------|-----------|
| **0s** | Started | All 3 promises begin executing |
| **2s** | p3 ❌ | **p3 fails first - Promise.race rejects immediately** |
| **3s** | p1 ✅ | p1 completes (but result ignored) |
| **5s** | p2 ✅ | p2 completes (but result ignored) |
| **Result** | ❌ First Failure | Error from p3 in **2 seconds** |

### 🌐 **Advanced Use Cases**

#### **🔄 Multiple Server Fallback**
```js
async function fetchFromFastestServer(data) {
  const serverUrls = [
    'https://api-us.example.com',
    'https://api-eu.example.com', 
    'https://api-asia.example.com'
  ];
  
  try {
    // Race between multiple servers
    const response = await Promise.race(
      serverUrls.map(url => fetch(`${url}/data`, {
        method: 'POST',
        body: JSON.stringify(data)
      }))
    );
    
    return await response.json();
  } catch (error) {
    throw new Error('All servers failed to respond');
  }
}
```

#### **📊 Performance Monitoring**
```js
async function measurePerformance(operation) {
  const start = performance.now();
  
  try {
    const result = await Promise.race([
      operation(),
      timeout(10000, 'Performance benchmark timeout')
    ]);
    
    const duration = performance.now() - start;
    console.log(`Operation completed in ${duration.toFixed(2)}ms`);
    return { result, duration };
    
  } catch (error) {
    const duration = performance.now() - start;
    console.log(`Operation failed after ${duration.toFixed(2)}ms`);
    throw error;
  }
}
```

### 💡 **Promise.race() Conclusion**

> **Promise.race()** implements a **winner-takes-all** strategy where the **first settled promise** (success or failure) determines the outcome. Perfect for **timeout patterns** and **performance optimization**.

---

## ✨ Promise.any() - Success-Focused Execution

### 📚 **Definition**

> **Promise.any()** returns a promise that fulfills with the **first successful result**. It only rejects if **all** promises fail, returning an `AggregateError` with all failure reasons.

### 🎯 **When to Use Promise.any()**

**Perfect for scenarios requiring:**
- 🎯 **Success-focused fallbacks** - try multiple approaches until one works
- 🔄 **Resilient data fetching** - multiple data sources with different reliability
- 📡 **Service discovery** - find any working service instance
- 🌐 **CDN selection** - use fastest available content delivery network

### 💼 **Real-World Example: Resilient Image Loading**

```js
async function loadImageWithFallbacks(imageId) {
  const imageSources = [
    `https://cdn-primary.example.com/images/${imageId}.jpg`,    // Primary CDN
    `https://cdn-backup.example.com/images/${imageId}.jpg`,     // Backup CDN  
    `https://storage.example.com/images/${imageId}.jpg`,        // Cloud storage
    `https://legacy-server.example.com/images/${imageId}.jpg`   // Legacy server
  ];
  
  try {
    // Use the first source that successfully loads
    const response = await Promise.any(
      imageSources.map(url => fetch(url).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res;
      }))
    );
    
    return await response.blob();
  } catch (aggregateError) {
    console.error('All image sources failed:', aggregateError.errors);
    throw new Error('Image could not be loaded from any source');
  }
}
```

### 🔍 **Execution Behavior Analysis**

#### **🎯 Success-Focused Scenario**
```js
Promise.any([p1, p2, p3]) // p1: 3s, p2: 5s, p3: 2s (fails)
```

| Time | Status | Execution |
|------|---------|-----------|
| **0s** | Started | All 3 promises begin executing |
| **2s** | p3 ❌ | p3 fails (Promise.any ignores and continues) |
| **3s** | p1 ✅ | **p1 succeeds - Promise.any resolves immediately** |
| **5s** | p2 ✅ | p2 completes (but result ignored) |
| **Result** | ✅ First Success | `val1` in **3 seconds** |

#### **❌ All Failures Scenario**
```js
Promise.any([p1, p2, p3]) // All fail: p1: 3s, p2: 5s, p3: 2s
```

| Time | Status | Execution |
|------|---------|-----------|
| **0s** | Started | All 3 promises begin executing |
| **2s** | p3 ❌ | p3 fails (waiting for others) |
| **3s** | p1 ❌ | p1 fails (waiting for last) |
| **5s** | p2 ❌ | **p2 fails - Promise.any rejects with AggregateError** |
| **Result** | ❌ All Failed | `AggregateError` with all errors in **5 seconds** |

### 🚨 **AggregateError Handling**

```js
try {
  const result = await Promise.any([
    failingPromise1(),
    failingPromise2(), 
    failingPromise3()
  ]);
} catch (aggregateError) {
  console.log('Error type:', aggregateError.name);        // 'AggregateError'
  console.log('Message:', aggregateError.message);        // 'All promises were rejected'
  console.log('Individual errors:', aggregateError.errors); // Array of all errors
  
  // Process individual errors
  aggregateError.errors.forEach((error, index) => {
    console.log(`Promise ${index + 1} failed:`, error.message);
  });
}
```

### 🔄 **Fallback Strategy Pattern**

```js
async function robustDataFetch(query) {
  const dataSources = [
    () => fetchFromPrimaryAPI(query),      // Fast but might be down
    () => fetchFromSecondaryAPI(query),    // Slower but reliable
    () => fetchFromCache(query),           // Fastest but might be stale
    () => fetchFromBackup(query)           // Slowest but always works
  ];
  
  try {
    // Try all sources, use first successful result
    const result = await Promise.any(dataSources.map(source => source()));
    console.log('Data fetched successfully from one of the sources');
    return result;
  } catch (aggregateError) {
    console.error('All data sources failed:', aggregateError.errors);
    
    // Fallback to default data
    return getDefaultData(query);
  }
}
```

### 💡 **Promise.any() Conclusion**

> **Promise.any()** waits for the **first successful** promise and ignores failures. Only rejects when **all promises fail**, making it perfect for **resilient fallback strategies**.

### 🆚 **Promise.race() vs Promise.any()**

| Aspect | Promise.race() | Promise.any() |
|--------|---------------|---------------|
| **Focus** | **First to finish** (success or failure) | **First to succeed** |
| **Failure Handling** | Fails on first rejection | Ignores failures until all fail |
| **Use Case** | Timeout implementations | Fallback strategies |
| **Result** | First settled promise | First successful promise |
| **Error Behavior** | Immediate on first error | AggregateError when all fail |

---

## 💻 Code Examples & Detailed Analysis

### 🏎️ **Promise.all() Examples**

#### **📌 Success Scenario: All Promises Resolve**

```js
// Creating test promises with different timing
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P1 Success");
  }, 3000); // Slowest - determines total time
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P2 Success");
  }, 1000); // Fastest to complete
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P3 Success");
  }, 2000); // Middle timing
});

// Promise.all execution
Promise.all([p1, p2, p3]).then((results) => {
  console.log(results); 
  // Output: ['P1 Success', 'P2 Success', 'P3 Success']
  // ⏱️ Total time: 3 seconds (not 6 seconds!)
  // 📊 Results maintain input order regardless of completion order
});
```

**🔍 Execution Timeline:**
```
0ms  ━━━━ All promises start executing
1000ms ━━ p2 completes (fastest)
2000ms ━━ p3 completes  
3000ms ━━ p1 completes → Promise.all resolves with all results
```

#### **📌 Failure Scenario: Fail-Fast Behavior**

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P1 Success");
  }, 3000); // Will complete but result ignored
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("P2 Fail");
  }, 1000); // ❌ Fails first - triggers immediate rejection
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P3 Success");
  }, 2000); // Will complete but result ignored
});

Promise.all([p1, p2, p3])
  .then((results) => {
    console.log("Success:", results); // This won't execute
  })
  .catch((err) => {
    console.error("Failed:", err); // Output: "Failed: P2 Fail"
    // ⏱️ Error thrown after 1 second (fail-fast)
  });
```

**🔍 Error Timeline:**
```
0ms    ━━━━ All promises start
1000ms ━━━━ p2 fails → Promise.all immediately rejects
2000ms ━━━━ p3 completes (result discarded)
3000ms ━━━━ p1 completes (result discarded)
```

### 🛡️ **Promise.allSettled() Examples**

#### **📌 Mixed Results: Some Success, Some Failure**

> **💡 This is the safest among all Promise APIs**

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P1 Success");
  }, 3000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P2 Success");
  }, 1000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("P3 Fail");
  }, 2000);
});

Promise.allSettled([p1, p2, p3])
  .then((results) => {
    console.log("All settled results:", results);
    // ⏱️ Waits for ALL promises (3 seconds total)
  })
  .catch((err) => {
    console.error("This won't execute - allSettled never rejects");
  });

/* 📊 Output after 3 seconds:
[
  { status: 'fulfilled', value: 'P1 Success' },
  { status: 'fulfilled', value: 'P2 Success' },
  { status: 'rejected', reason: 'P3 Fail' }
]
*/
```

#### **🔧 Processing allSettled Results**

```js
async function processAllSettledResults() {
  const results = await Promise.allSettled([p1, p2, p3]);
  
  // Separate successes and failures
  const successes = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
    
  const failures = results
    .filter(result => result.status === 'rejected')
    .map(result => result.reason);
  
  console.log(`✅ Successes (${successes.length}):`, successes);
  console.log(`❌ Failures (${failures.length}):`, failures);
  console.log(`📊 Success rate: ${(successes.length / results.length * 100).toFixed(1)}%`);
}
```

### 🏁 **Promise.race() Examples**

#### **📌 Success Race: Fastest Wins**

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P1 Success");
  }, 3000); // Slowest
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P2 Success");
  }, 1000); // 🏆 Winner - fastest success
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("P3 Fail");
  }, 2000); // Faster than p1 but slower than p2
});

Promise.race([p1, p2, p3])
  .then((result) => {
    console.log("Winner:", result); // Output: "Winner: P2 Success"
    // ⏱️ Result available after 1 second
  })
  .catch((err) => {
    console.error("Race failed:", err);
  });
```

#### **📌 Failure Race: First Error Wins**

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P1 Success");
  }, 3000); // Would succeed but too slow
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P2 Success");
  }, 5000); // Would succeed but too slow
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("P3 Fail");
  }, 2000); // ❌ Fails first - race ends here
});

Promise.race([p1, p2, p3])
  .then((result) => {
    console.log("Success:", result); // This won't execute
  })
  .catch((err) => {
    console.error("Race error:", err); // Output: "Race error: P3 Fail"
    // ⏱️ Error after 2 seconds
  });
```

### ✨ **Promise.any() Examples**

#### **📌 Success-Focused: Ignores Failures**

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P1 Success");
  }, 3000); // 🏆 First success wins
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("P2 Success");
  }, 5000); // Would succeed but too slow
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("P3 Fail");
  }, 2000); // ❌ Fails but ignored by Promise.any
});

Promise.any([p1, p2, p3])
  .then((result) => {
    console.log("First success:", result); // Output: "First success: P1 Success"
    // ⏱️ Result after 3 seconds (ignores p3 failure at 2s)
  })
  .catch((err) => {
    console.error("All failed:", err);
  });
```

#### **📌 All Failures: AggregateError**

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("P1 Fail");
  }, 3000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("P2 Fail");
  }, 5000); // Last to fail - determines total time
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("P3 Fail");
  }, 2000);
});

Promise.any([p1, p2, p3])
  .then((result) => {
    console.log("Success:", result); // This won't execute
  })
  .catch((err) => {
    console.error("Error type:", err.name); // "AggregateError"
    console.error("Message:", err.message); // "All promises were rejected"
    console.error("Individual errors:", err.errors); 
    // Output: ['P1 Fail', 'P2 Fail', 'P3 Fail']
    // ⏱️ AggregateError after 5 seconds (waits for all)
  });
```

#### **🔍 Handling AggregateError Properly**

```js
try {
  const result = await Promise.any([failingPromise1(), failingPromise2(), failingPromise3()]);
  console.log("Got a success:", result);
} catch (aggregateError) {
  if (aggregateError.name === 'AggregateError') {
    console.log(`All ${aggregateError.errors.length} promises failed:`);
    
    aggregateError.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error.message || error}`);
    });
    
    // Implement fallback strategy
    return getDefaultValue();
  }
  
  throw aggregateError; // Re-throw if not AggregateError
}
```

---

## 📊 Promise Settlement States

### 🔍 **Understanding Promise States**

> **Settled** = Promise has completed (either resolved or rejected)

| State | Description | Result |
|-------|-------------|---------|
| **Pending** ⏳ | Initial state, not yet settled | No result yet |
| **Fulfilled** ✅ | Successfully resolved | Has a value |
| **Rejected** ❌ | Operation failed | Has an error reason |
| **Settled** 🏁 | Either fulfilled or rejected | Final state |

### 📋 **State Categories**

#### **✅ Success States**
- **resolve** ✅
- **success** ✅  
- **fulfilled** ✅

#### **❌ Failure States**
- **reject** ❌
- **failure** ❌
- **rejected** ❌

### 💡 **Key Insight**
Once a promise is **settled**, it means it has a **final result** - either success with a value or failure with a reason.

---

## 🎯 Advanced Promise Patterns & Real-World Applications

### 🔄 **Parallel vs Sequential Execution**

#### **⚡ Parallel Execution (Faster)**
```js
// All promises start simultaneously
async function parallelExecution() {
  const start = performance.now();
  
  // Start all operations at once
  const [userData, orderData, wishlistData] = await Promise.all([
    fetchUserData(),    // 2 seconds
    fetchOrderData(),   // 1.5 seconds  
    fetchWishlistData() // 1 second
  ]);
  
  const duration = performance.now() - start;
  console.log(`Parallel execution: ${duration}ms`); // ~2000ms
  
  return { userData, orderData, wishlistData };
}
```

#### **🐌 Sequential Execution (Slower)**
```js
// Each promise waits for the previous one
async function sequentialExecution() {
  const start = performance.now();
  
  // Execute one after another
  const userData = await fetchUserData();       // 2 seconds
  const orderData = await fetchOrderData();    // + 1.5 seconds
  const wishlistData = await fetchWishlistData(); // + 1 second
  
  const duration = performance.now() - start;
  console.log(`Sequential execution: ${duration}ms`); // ~4500ms
  
  return { userData, orderData, wishlistData };
}
```

### 🌐 **Enterprise-Grade Error Handling**

#### **🛡️ Resilient Service Architecture**
```js
class ServiceManager {
  static async callWithFallback(primaryService, fallbackServices = []) {
    const allServices = [primaryService, ...fallbackServices];
    
    try {
      // Try to get first successful result
      const result = await Promise.any(
        allServices.map(async (service, index) => {
          try {
            const response = await service();
            console.log(`✅ Service ${index + 1} succeeded`);
            return response;
          } catch (error) {
            console.log(`❌ Service ${index + 1} failed:`, error.message);
            throw error;
          }
        })
      );
      
      return result;
    } catch (aggregateError) {
      console.error('🚨 All services failed:', aggregateError.errors);
      throw new Error('All services unavailable. Please try again later.');
    }
  }

  static async batchProcess(operations, { 
    concurrency = 5, 
    retries = 3, 
    timeout = 10000 
  } = {}) {
    const chunks = this.chunkArray(operations, concurrency);
    const results = [];
    
    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(
        chunk.map(op => this.withRetryAndTimeout(op, retries, timeout))
      );
      results.push(...chunkResults);
    }
    
    return this.processResults(results);
  }

  static async withRetryAndTimeout(operation, retries, timeout) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await Promise.race([
          operation(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
        ]);
      } catch (error) {
        if (attempt === retries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}
```

### 📊 **Performance Monitoring & Analytics**

#### **📈 Promise Performance Tracker**
```js
class PromiseAnalytics {
  static async trackPerformance(promiseFactory, label) {
    const start = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;
    
    try {
      const result = await promiseFactory();
      const duration = performance.now() - start;
      const endMemory = performance.memory?.usedJSHeapSize || 0;
      
      console.log(`📊 ${label} Performance:`, {
        duration: `${duration.toFixed(2)}ms`,
        memoryUsage: `${((endMemory - startMemory) / 1024 / 1024).toFixed(2)}MB`,
        status: '✅ Success'
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      console.log(`📊 ${label} Performance:`, {
        duration: `${duration.toFixed(2)}ms`,
        status: '❌ Failed',
        error: error.message
      });
      
      throw error;
    }
  }

  static async compareApproaches(approaches) {
    console.log('🏆 Performance Comparison:');
    
    const results = await Promise.allSettled(
      approaches.map(async ({ name, execute }) => {
        const result = await this.trackPerformance(execute, name);
        return { name, result };
      })
    );
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`  ${index + 1}. ${result.value.name}: ✅ Completed`);
      } else {
        console.log(`  ${index + 1}. ${approaches[index].name}: ❌ Failed`);
      }
    });
  }
}
```

### 🎮 **Interactive Promise Playground**

#### **🔬 Testing Different Scenarios**
```js
class PromisePlayground {
  static createTimedPromise(value, delay, shouldReject = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) {
          reject(new Error(`${value} failed after ${delay}ms`));
        } else {
          resolve(`${value} completed after ${delay}ms`);
        }
      }, delay);
    });
  }

  static async demoAll() {
    console.log('🏎️ Promise.all() Demo:');
    
    const promises = [
      this.createTimedPromise('Task 1', 3000),
      this.createTimedPromise('Task 2', 1000),
      this.createTimedPromise('Task 3', 2000)
    ];
    
    try {
      const results = await Promise.all(promises);
      console.log('✅ All completed:', results);
    } catch (error) {
      console.log('❌ Failed:', error.message);
    }
  }

  static async demoRace() {
    console.log('🏁 Promise.race() Demo:');
    
    const promises = [
      this.createTimedPromise('Slow Task', 3000),
      this.createTimedPromise('Fast Task', 1000),
      this.createTimedPromise('Medium Task', 2000)
    ];
    
    try {
      const winner = await Promise.race(promises);
      console.log('🏆 Winner:', winner);
    } catch (error) {
      console.log('❌ First failure:', error.message);
    }
  }
}
```

---

## 📚 Complete Summary & Reference Guide

### 🔍 **6 Static Promise Methods**

| Method | Behavior | Returns | Use Case |
|--------|----------|---------|----------|
| **Promise.all()** | Waits for all to resolve | Array of results | All must succeed |
| **Promise.allSettled()** | Waits for all to settle | Array of status objects | Want all results |
| **Promise.race()** | First to settle wins | Single result/error | Timeouts, competitions |
| **Promise.any()** | First to succeed wins | Single successful result | Fallback strategies |
| **Promise.resolve()** | Creates resolved promise | Resolved promise | Value wrapping |
| **Promise.reject()** | Creates rejected promise | Rejected promise | Error creation |

### 📊 **Behavior Matrix**

| Scenario | Promise.all() | Promise.allSettled() | Promise.race() | Promise.any() |
|----------|---------------|---------------------|----------------|---------------|
| **All succeed** | ✅ Returns all results | ✅ Returns all with status | ✅ Returns fastest | ✅ Returns fastest success |
| **One fails** | ❌ Rejects immediately | ✅ Returns all with status | 🎯 Returns first settled | ✅ Returns first success |
| **All fail** | ❌ Rejects with first error | ✅ Returns all failures | ❌ Rejects with first error | ❌ AggregateError |

### 💡 **Quick Decision Guide**

#### **🤔 When to Use Which?**

```
Need ALL operations to succeed?
├─ Yes → Promise.all()
└─ No → Continue...

Want results from ALL operations (success + failure)?
├─ Yes → Promise.allSettled()
└─ No → Continue...

Need just the FIRST result (success or failure)?
├─ Yes → Promise.race()
└─ No → Continue...

Need the FIRST SUCCESS (ignore failures)?
├─ Yes → Promise.any()
└─ No → Consider custom implementation
```

### 🧠 **Memory Aids**

#### **🔤 Name Mnemonics**
- **Promise.all()** → "**ALL** must succeed"
- **Promise.allSettled()** → "**ALL SETTLED** (completed)"
- **Promise.race()** → "**RACE** to finish first"
- **Promise.any()** → "**ANY** success will do"

#### **⚡ Quick Patterns**
```js
// Performance: Parallel execution
Promise.all([...])

// Safety: Fault tolerance  
Promise.allSettled([...])

// Speed: First response
Promise.race([...])

// Resilience: Fallback options
Promise.any([...])
```

### 🎯 **Interview Preparation**

#### **🔥 Common Interview Questions**

**Q1: What's the difference between Promise.all() and Promise.allSettled()?**
```js
// Promise.all() - fail-fast
Promise.all([p1, p2, p3]) // Rejects if any promise fails

// Promise.allSettled() - fault-tolerant
Promise.allSettled([p1, p2, p3]) // Always resolves with all results
```

**Q2: How would you implement a timeout for Promise.all()?**
```js
function timeoutAll(promises, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  
  return Promise.race([
    Promise.all(promises),
    timeout
  ]);
}
```

**Q3: What happens to other promises when Promise.race() resolves?**
```js
// Other promises continue executing in background
// But their results are ignored
// No cancellation mechanism in JavaScript
```

**Q4: How do you handle AggregateError from Promise.any()?**
```js
try {
  const result = await Promise.any(promises);
} catch (aggregateError) {
  console.log('All failed:', aggregateError.errors);
}
```

### 🚀 **Performance Best Practices**

#### **✅ Do's**
- Use **Promise.all()** for parallel independent operations
- Use **Promise.allSettled()** when you need all results
- Implement **timeout patterns** with Promise.race()
- Use **Promise.any()** for fallback strategies
- **Monitor performance** with timing measurements

#### **❌ Don'ts**
- Don't use sequential await when operations can be parallel
- Don't ignore error handling in Promise.all()
- Don't assume promises are cancelled when race resolves
- Don't forget to handle AggregateError in Promise.any()

### 🔮 **Advanced Concepts Preview**

Understanding these Promise APIs thoroughly prepares you for:
- **Async iterators** and generators
- **Reactive programming** with RxJS
- **Concurrency control** patterns
- **Microservice orchestration**
- **Stream processing** architectures

---

> **💡 Key Takeaway:** Promise.all is probably the **most common** in practice, but knowing when to use each API makes you a more effective JavaScript developer.

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=DlTVt1rZjIo&list=PLlasXeu85E9eWOpw9jxHOQyGMRiBZ60aX&index=4&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/DlTVt1rZjIo/0.jpg" width="750"
alt="Promise APIs in Javascript Youtube Link"/></a>

<hr>

Watch Live On Youtube below:

<a href="https://www.youtube.com/watch?v=DlTVt1rZjIo&list=PLlasXeu85E9eWOpw9jxHOQyGMRiBZ60aX&index=4&ab_channel=AkshaySaini" target="_blank"><img src="https://img.youtube.com/vi/DlTVt1rZjIo/0.jpg" width="750"
alt="Promise APIs in Javascript Youtube Link"/></a>
