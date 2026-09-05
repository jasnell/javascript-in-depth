// A callback loses this; an arrow captures this from the enclosing method.

const cabinet = {
  label: 'Main cabinet',
  identifyBroken() {
    return new Promise((resolve) => {
      setTimeout(function () {
        resolve(this?.label); // this decided at call time, not the cabinet
      }, 10);
    });
  },
  identifyFixed() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.label); // arrow captured this === cabinet at creation
      }, 10);
    });
  }
};

console.log(await cabinet.identifyBroken()); // undefined
console.log(await cabinet.identifyFixed());  // Main cabinet
