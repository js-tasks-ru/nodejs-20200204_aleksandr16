function sum(a, b) {
  [a, b].forEach((arg) => {
    validateNumber(arg);
  });

  return a + b;
}

function validateNumber(number) {
  if (typeof(number) !== 'number') {
    throw new TypeError(number + ' is not a number');
  }
}

module.exports = sum;
