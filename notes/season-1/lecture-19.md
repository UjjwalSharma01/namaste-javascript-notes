# Episode 19: map, filter & reduce

## 🎯 What You'll Learn
- Master the three essential array methods: map, filter, and reduce
- Understand when and how to use each Higher-Order Function
- Transform data efficiently using functional programming patterns
- Chain array methods for complex data transformations
- Build real-world applications with array manipulation
- Compare functional vs imperative programming approaches

---

## 🌟 The Power Trio of Array Methods

> **map, filter & reduce are Higher-Order Functions** that form the foundation of functional programming in JavaScript.

### 📊 **Quick Overview Table**

| Method | Purpose | Input | Output | Use Case |
|--------|---------|-------|--------|----------|
| **`map`** | Transform each element | Array | New Array (same length) | Convert data format |
| **`filter`** | Select elements by condition | Array | New Array (≤ length) | Remove unwanted items |
| **`reduce`** | Combine all elements | Array | Single Value | Aggregate calculations |

---

## 🗺️ Map Function: Data Transformation

### 📚 **What is Map?**

**Map is used to transform an array.** The `map()` method creates a **new array** with the results of calling a function for **every array element**.

```js
const output = arr.map(function) 
// The function tells map what transformation to apply on each element
```

### 🔧 **Map Function Characteristics**

| Aspect | Description |
|--------|-------------|
| **Immutability** | Original array remains unchanged |
| **1:1 Mapping** | Each element produces exactly one result |
| **Same Length** | Output array has same length as input |
| **Pure Function** | No side effects, predictable results |

### 💡 **Practical Examples**

#### **Example 1: Double the Numbers**
```js
const arr = [5, 1, 3, 2, 6];

// Task: Double each element → [10, 2, 6, 4, 12]
function double(x) {
  return x * 2;
}

const doubleArr = arr.map(double);
console.log(doubleArr); // [10, 2, 6, 4, 12]
console.log(arr);       // [5, 1, 3, 2, 6] - Original unchanged ✅
```

#### **Example 2: Triple the Numbers**
```js
const arr = [5, 1, 3, 2, 6];

// Transformation logic
function triple(x) {
  return x * 3;
}

const tripleArr = arr.map(triple);
console.log(tripleArr); // [15, 3, 9, 6, 18]
```

#### **Example 3: Convert to Binary**
```js
const arr = [5, 1, 3, 2, 6];

// 🎯 Multiple ways to write the same transformation:

// Method 1: Named function
function binary(x) {
    return x.toString(2);
}
const binaryArr = arr.map(binary);

// Method 2: Inline function
const binaryArr = arr.map(function(x) {
    return x.toString(2);
});

// Method 3: Arrow function (most concise)
const binaryArr = arr.map(x => x.toString(2));

console.log(binaryArr); // ["101", "1", "11", "10", "110"]
```

### 🧠 **Map Internals: How It Works**

```js
// 🔍 Conceptual implementation of map
Array.prototype.myMap = function(callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this)); // value, index, array
    }
    return result;
};
```

---

## 🔍 Filter Function: Selective Filtering

### 📚 **What is Filter?**

**Filter is used to select elements from an array.** The `filter()` method creates a **new array** with all elements that **pass a test** implemented by the provided function.

```js
const filteredArray = arr.filter(conditionFunction)
// Returns only elements where conditionFunction returns true
```

### 🎯 **Filter Characteristics**

| Aspect | Description |
|--------|-------------|
| **Selective** | Only elements passing the test are included |
| **Boolean Logic** | Callback must return truthy/falsy values |
| **Smaller/Equal Length** | Output length ≤ input length |
| **Immutable** | Original array remains unchanged |

### 💡 **Practical Examples**

#### **Example 1: Filter Odd Numbers**
```js
const array = [5, 1, 3, 2, 6];

// Filter odd values
function isOdd(x) {
  return x % 2; // Returns 1 (truthy) for odd, 0 (falsy) for even
}

const oddArr = array.filter(isOdd);
console.log(oddArr); // [5, 1, 3]

// Arrow function version
const oddArr = array.filter(x => x % 2);
```

#### **Example 2: Filter by Condition**
```js
const numbers = [1, 4, 9, 16, 25, 36];

// Get numbers greater than 10
const largeNumbers = numbers.filter(num => num > 10);
console.log(largeNumbers); // [16, 25, 36]

// Get perfect squares under 20
const smallSquares = numbers.filter(num => num < 20);
console.log(smallSquares); // [1, 4, 9, 16]
```

### 🔍 **Filter Truth Table**

| Element | Condition | Result | Included? |
|---------|-----------|--------|-----------|
| 5 | 5 % 2 = 1 | Truthy | ✅ Yes |
| 1 | 1 % 2 = 1 | Truthy | ✅ Yes |
| 3 | 3 % 2 = 1 | Truthy | ✅ Yes |
| 2 | 2 % 2 = 0 | Falsy | ❌ No |
| 6 | 6 % 2 = 0 | Falsy | ❌ No |

---

## ⚡ Reduce Function: Data Aggregation

### 📚 **What is Reduce?**

**Reduce takes all values of an array and produces a single output.** It "reduces" the array to give a consolidated result.

```js
const result = arr.reduce(function(accumulator, current, index, array) {
    // accumulator: accumulated result from previous iterations
    // current: current element being processed
    // index: current element's index (optional)
    // array: the array being processed (optional)
    return newAccumulatorValue;
}, initialValue);
```

### 🎯 **Reduce Characteristics**

| Aspect | Description |
|--------|-------------|
| **Aggregation** | Combines multiple values into one |
| **Accumulator** | Carries forward the result from each iteration |
| **Flexible Output** | Can return any data type |
| **Initial Value** | Starting point for accumulator |

### 💡 **Practical Examples**

#### **Example 1: Sum of Array Elements**

```js
const array = [5, 1, 3, 2, 6];

// ❌ Non-functional programming way
function findSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum = sum + arr[i];
  }
  return sum;
}
console.log(findSum(array)); // 17

// ✅ Functional programming way with reduce
const sumOfElem = array.reduce(function (accumulator, current) {
  // accumulator represents the running total (like 'sum' variable above)
  // current represents the current array element (like 'arr[i]' above)
  accumulator = accumulator + current;
  return accumulator;
}, 0); // Initial value: 0 (like sum = 0 above)

console.log(sumOfElem); // 17
```

#### **Example 2: Find Maximum Value**

```js
const array = [5, 1, 3, 2, 6];

// ❌ Imperative approach
function findMax(arr) {
    let max = 0;
    for(let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
console.log(findMax(array)); // 6

// ✅ Functional approach with reduce
const maxValue = array.reduce((acc, current) => {
    if (current > acc) {
        acc = current;
    }
    return acc;
}, 0);
console.log(maxValue); // 6

// 🎯 Even cleaner version with meaningful variable names
const maxValue = array.reduce((max, current) => {
    if (current > max) {
        max = current;
    }
    return max;
}, 0);
console.log(maxValue); // 6
```

### 🔄 **Reduce Execution Flow**

```js
// Step-by-step execution for sum calculation
const array = [5, 1, 3, 2, 6];

/*
Iteration 1: accumulator = 0, current = 5 → return 0 + 5 = 5
Iteration 2: accumulator = 5, current = 1 → return 5 + 1 = 6  
Iteration 3: accumulator = 6, current = 3 → return 6 + 3 = 9
Iteration 4: accumulator = 9, current = 2 → return 9 + 2 = 11
Iteration 5: accumulator = 11, current = 6 → return 11 + 6 = 17
Final result: 17
*/
```

---

## 🎯 Real-World Examples: Working with Objects

### 👥 **User Data Processing**

```js
const users = [
    { firstName: "Alok", lastName: "Raj", age: 23 },
    { firstName: "Ashish", lastName: "Kumar", age: 29 },
    { firstName: "Ankit", lastName: "Roy", age: 29 },
    { firstName: "Pranav", lastName: "Mukherjee", age: 50 },
];
```

#### **🗺️ Map Example: Get Full Names**

```js
// Task: Get array of full names → ["Alok Raj", "Ashish Kumar", ...]
const fullNameArr = users.map(user => user.firstName + " " + user.lastName);
console.log(fullNameArr); 
// Output: ["Alok Raj", "Ashish Kumar", "Ankit Roy", "Pranav Mukherjee"]

// Alternative approaches:
const fullNameArr = users.map(user => `${user.firstName} ${user.lastName}`);
const fullNameArr = users.map(({firstName, lastName}) => `${firstName} ${lastName}`);
```

#### **⚡ Reduce Example: Age Distribution Report**

```js
// Task: Get count of people by age → {23: 1, 29: 2, 50: 1}
const ageReport = users.reduce((acc, curr) => {
    if (acc[curr.age]) {
        acc[curr.age] = acc[curr.age] + 1; // Increment existing count
    } else {
        acc[curr.age] = 1; // Initialize count for new age
    }
    return acc; // Always return updated accumulator
}, {}); // Start with empty object

console.log(ageReport); // {23: 1, 29: 2, 50: 1}

// 🎯 Cleaner version using logical OR
const ageReport = users.reduce((acc, curr) => {
    acc[curr.age] = (acc[curr.age] || 0) + 1;
    return acc;
}, {});
```

### 📊 **Step-by-Step Reduce Execution**

```js
// How the age report builds up:
/*
Initial: acc = {}
User 1 (Alok, 23): acc = {23: 1}
User 2 (Ashish, 29): acc = {23: 1, 29: 1}  
User 3 (Ankit, 29): acc = {23: 1, 29: 2}
User 4 (Pranav, 50): acc = {23: 1, 29: 2, 50: 1}
Final result: {23: 1, 29: 2, 50: 1}
*/
```

---

## 🔗 Function Chaining: The Power of Composition

### 🎯 **Combining Multiple Operations**

Function chaining allows you to **combine multiple array methods** to create powerful data processing pipelines.

```js
const users = [
  { firstName: "Alok", lastName: "Raj", age: 23 },
  { firstName: "Ashish", lastName: "Kumar", age: 29 },
  { firstName: "Ankit", lastName: "Roy", age: 29 },
  { firstName: "Pranav", lastName: "Mukherjee", age: 50 },
];

// Task: Get first names of people under 30
const youngUserNames = users
  .filter(user => user.age < 30)    // Step 1: Filter young users
  .map(user => user.firstName);     // Step 2: Extract first names

console.log(youngUserNames); // ["Alok", "Ashish", "Ankit"]
```

### 🧠 **Chain Execution Breakdown**

```js
// Step-by-step execution:

// Original array:
[
  { firstName: "Alok", lastName: "Raj", age: 23 },
  { firstName: "Ashish", lastName: "Kumar", age: 29 },
  { firstName: "Ankit", lastName: "Roy", age: 29 },
  { firstName: "Pranav", lastName: "Mukherjee", age: 50 }
]

// After .filter(user => user.age < 30):
[
  { firstName: "Alok", lastName: "Raj", age: 23 },
  { firstName: "Ashish", lastName: "Kumar", age: 29 },
  { firstName: "Ankit", lastName: "Roy", age: 29 }
]

// After .map(user => user.firstName):
["Alok", "Ashish", "Ankit"]
```

### 🏆 **Homework Challenge: Using Reduce Only**

```js
// Challenge: Implement the same logic using only reduce
const youngUserNames = users.reduce((acc, curr) => {
  if (curr.age < 30) {
    acc.push(curr.firstName);
  }
  return acc;
}, []);

console.log(youngUserNames); // ["Alok", "Ashish", "Ankit"]
```

---

## 🚀 Advanced Patterns and Techniques

### 🎯 **Complex Transformations**

#### **Multi-step Processing Pipeline**
```js
const salesData = [
  { product: "Laptop", price: 1200, quantity: 2, category: "Electronics" },
  { product: "Mouse", price: 25, quantity: 10, category: "Electronics" },
  { product: "Book", price: 15, quantity: 5, category: "Education" },
  { product: "Phone", price: 800, quantity: 3, category: "Electronics" }
];

// Get total revenue from Electronics with quantity > 5
const electronicsRevenue = salesData
  .filter(item => item.category === "Electronics")
  .filter(item => item.quantity > 5)
  .map(item => ({ ...item, revenue: item.price * item.quantity }))
  .reduce((total, item) => total + item.revenue, 0);

console.log(electronicsRevenue); // 250 (Mouse: 25 * 10)
```

#### **Data Aggregation with Grouping**
```js
// Group products by category with total revenue
const categoryReport = salesData.reduce((acc, item) => {
  const category = item.category;
  const revenue = item.price * item.quantity;
  
  if (!acc[category]) {
    acc[category] = { count: 0, totalRevenue: 0, products: [] };
  }
  
  acc[category].count++;
  acc[category].totalRevenue += revenue;
  acc[category].products.push(item.product);
  
  return acc;
}, {});

console.log(categoryReport);
/*
{
  Electronics: { count: 3, totalRevenue: 4850, products: ["Laptop", "Mouse", "Phone"] },
  Education: { count: 1, totalRevenue: 75, products: ["Book"] }
}
*/
```

### 🔄 **Functional vs Imperative Comparison**

| Approach | Readability | Performance | Immutability | Debugging |
|----------|-------------|-------------|--------------|-----------|
| **Functional** | High | Good | ✅ Preserved | Method-by-method |
| **Imperative** | Medium | Better | ❌ Mutates | Step-by-step |

#### **Performance Considerations**
```js
// Large datasets: Consider performance trade-offs
const largeArray = Array.from({length: 1000000}, (_, i) => i);

// ❌ Multiple iterations (3 passes through data)
const result1 = largeArray
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .reduce((sum, n) => sum + n, 0);

// ✅ Single iteration with reduce
const result2 = largeArray.reduce((sum, n) => {
  if (n % 2 === 0) {
    return sum + (n * 2);
  }
  return sum;
}, 0);
```

---

## 🛠️ Building Custom Implementations

### 🔧 **Understanding Internals**

#### **Custom Map Implementation**
```js
Array.prototype.myMap = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) { // Handle sparse arrays
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};
```

#### **Custom Filter Implementation**
```js
Array.prototype.myFilter = function(callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};
```

#### **Custom Reduce Implementation**
```js
Array.prototype.myReduce = function(callback, initialValue) {
  let hasInitial = arguments.length > 1;
  let accumulator = hasInitial ? initialValue : this[0];
  let startIndex = hasInitial ? 0 : 1;
  
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }
  return accumulator;
};
```

---

## ⚠️ Common Pitfalls and Best Practices

### 🚫 **Common Mistakes**

#### **1. Mutating Original Array**
```js
// ❌ Wrong: Mutating during map
const numbers = [1, 2, 3];
const doubled = numbers.map((num, index, arr) => {
  arr[index] = num * 2; // Don't do this!
  return num * 2;
});

// ✅ Correct: Pure transformation
const doubled = numbers.map(num => num * 2);
```

#### **2. Not Returning from Reduce**
```js
// ❌ Wrong: Forgetting to return accumulator
const sum = numbers.reduce((acc, num) => {
  acc + num; // Missing return!
});

// ✅ Correct: Always return accumulator
const sum = numbers.reduce((acc, num) => acc + num, 0);
```

#### **3. Forgetting Initial Value in Reduce**
```js
// ❌ Dangerous: No initial value with empty array
const emptyArray = [];
const sum = emptyArray.reduce((acc, num) => acc + num); // TypeError!

// ✅ Safe: Always provide initial value
const sum = emptyArray.reduce((acc, num) => acc + num, 0); // Returns 0
```

### ✅ **Best Practices**

#### **1. Use Method Chaining Thoughtfully**
```js
// ✅ Good: Logical flow, easy to read
const result = data
  .filter(isValid)      // Remove invalid items
  .map(transform)       // Transform valid items
  .reduce(aggregate, 0); // Aggregate results

// ❌ Avoid: Too many steps, hard to debug
const result = data
  .filter(a).map(b).filter(c).map(d).filter(e).reduce(f, 0);
```

#### **2. Prefer Descriptive Function Names**
```js
// ✅ Good: Clear intent
const adults = users.filter(isAdult);
const fullNames = users.map(getFullName);

// ❌ Unclear: Anonymous functions everywhere
const adults = users.filter(u => u.age >= 18);
```

#### **3. Handle Edge Cases**
```js
// ✅ Robust: Handle undefined/null values
const safeDivide = numbers.map(num => num !== 0 ? 100 / num : 0);
const validUsers = users.filter(user => user && user.age && user.name);
```

---

## 📋 Quick Summary

### 💡 **Key Takeaways:**

#### **1. 🗺️ Map - Transformation**
- **Purpose:** Transform each element into something new
- **Length:** Output has same length as input
- **Use Case:** Convert data format, apply calculations
- **Returns:** New array with transformed elements

#### **2. 🔍 Filter - Selection**
- **Purpose:** Select elements that meet a condition
- **Length:** Output length ≤ input length  
- **Use Case:** Remove unwanted elements, find specific items
- **Returns:** New array with filtered elements

#### **3. ⚡ Reduce - Aggregation**
- **Purpose:** Combine all elements into single value
- **Length:** Always returns one value (any type)
- **Use Case:** Sum, average, grouping, complex aggregations
- **Returns:** Single accumulated value

#### **4. 🔗 Function Chaining**
- **Combine methods** for complex data processing
- **Read left-to-right** like a pipeline
- **Each method** receives output from previous method
- **Powerful pattern** for data transformation

### 🧠 **Quick Memory Aid:**
```
Map = Transform (1:1)
Filter = Select (1:0 or 1:1) 
Reduce = Aggregate (N:1)
Chain = Pipeline (method1 → method2 → method3)
All = Higher-Order Functions (take functions as arguments)
```

### 🎯 **Method Selection Guide:**

| Need to... | Use | Example |
|------------|-----|---------|
| **Transform all elements** | `map` | Convert strings to uppercase |
| **Find matching elements** | `filter` | Get users over 18 |
| **Calculate single result** | `reduce` | Sum of numbers |
| **Complex processing** | **Chain** | Filter then transform then sum |

### 🚀 **Real-World Applications:**
- **📊 Data visualization** → Transform API data for charts
- **🛒 E-commerce** → Filter products, calculate totals
- **📝 Form validation** → Check fields, transform inputs  
- **📱 UI updates** → Process user lists, generate components
- **📈 Analytics** → Aggregate user behavior data

### ⚡ **Performance Tips:**
- **Single reduce** is often faster than multiple chained methods
- **Consider data size** when choosing between approaches
- **Use early returns** in filter conditions when possible
- **Profile your code** with large datasets

---

## 🎥 Watch the Video

<a href="https://www.youtube.com/watch?v=zdp0zrpKzIE&list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP" target="_blank"><img src="https://img.youtube.com/vi/zdp0zrpKzIE/0.jpg" width="750"
alt="map, filter & reduce Youtube Link"/></a>
