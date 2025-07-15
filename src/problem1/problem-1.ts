// Task

// Provide 3 unique implementations of the following function in JavaScript.

// **Input**: `n` - any integer

// *Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

// **Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

// Solution 1: For Loop
const sum_to_n_1 = (n: number): number => {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    return sum;
  };
  
  console.log(sum_to_n_1(5));

// Solution 2: Recursion
const sum_to_n_2 = (n: number): number => {
    if (n <= 0) return 0;
    return n + sum_to_n_2(n - 1);
  };
  
  console.log(sum_to_n_2(5));

// Solution 3: Gauss
const sum_to_n_3 = (n: number): number => {
  return n * (n + 1) / 2;
};

console.log(sum_to_n_3(5));

