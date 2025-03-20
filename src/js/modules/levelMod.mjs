import { create, all } from "mathjs";
let config = {};
const math = create(all, config);

function generateCalculation(isLevel, updateTimer) {
  // initialize opertation
  let theOperation = [];
  // return operation based on levels
  switch (isLevel) {
    case 0:
      theOperation = levelZero();
      updateTimer = 5;
      break;
    case 1:
      theOperation = levelOne();
      updateTimer = 10;
      break;
    case 2:
      theOperation = levelTwo();
      updateTimer = 20;
      break;
    // level 4 and five can't use eval
    case 3:
      theOperation = levelThree();
      updateTimer = 40;
      break;
    case 4:
      theOperation = levelFour();
      updateTimer = 60;
      break;
  }
  return [theOperation, updateTimer];
}

function calculateResult(calculationArray, currenLevel) {
  const expression = calculationArray.join("");
  // update this with the mathjs library(bug result equals infinity or -infinity and it stops working)
  if (currenLevel == 0) {
    const result = eval(expression);
    let cal = math.parse(expression);
    let prettyDisplay = `$${cal.toTex()}$`;
    return [result % 1 == 0 ? result : result.toFixed(2), prettyDisplay];
  }
  if (currenLevel == 2) {
    let cal = math.parse(expression);
    let x = randomNumber([8, 9, 10], 1);
    let simplified = math.simplify(cal);
    let result = simplified.evaluate({ x: x });
    let prettyDisplay = `$${cal.toTex()}$ => $x = ${x}$`;
    return [result, prettyDisplay];
  }
  let cal = math.parse(expression);
  let result = math.simplify(cal).toString();
  let prettyDisplay = `$${cal.toTex()}$`;
  return [result, prettyDisplay];
}

// generate random results close to the right
// result and place right result in a random spot.
function generateRandomResults(result, isLevel) {
  let checkResult = isNaN(Number(result))
    ? "NaN"
    : result % 1 === 0
    ? "integer"
    : "decimal";
  let min =
    checkResult === "integer"
      ? parseInt(result)
      : checkResult === "decimal"
      ? result
      : eval(result);
  let max = (min * 10) / 10 + 8;

  const randomResults = new Set();
  while (randomResults.size < 4) {
    const randomNumber = Math.floor(Math.random() * (max - min)) + min;
    randomResults.add(
      randomNumber === min || randomResults.has(randomNumber)
        ? randomNumber + 1
        : randomNumber
    );
  }
  let newRandomResults = Array.from(randomResults);

  // right answer in random spot
  const randomIndex = Math.floor(Math.random() * newRandomResults.length);
  newRandomResults[randomIndex] = isNaN(result) ? eval(result) : result;

  // only turn decimal to fraction if level is bigger than 0
  newRandomResults = newRandomResults.map((n) => {
    if (isLevel < 1) {
      if (checkResult == "decimal") return parseFloat(n).toFixed(2);
      else return n;
    } else {
      if (checkResult !== "integer") {
        let fraction = math.format(math.fraction(n));
        // let parsed = math.parse(fraction);
        return fraction;
      } else return n;
    }
  });
  return [randomIndex, newRandomResults];
}

const randomNumber = (except, n, min = 0, max = 10) => {
  const arr = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  let exceptions = Array.isArray(except) ? except : [except];
  let randomItemArr = [];
  let newArr = [...arr];
  for (let i = 0; i < exceptions.length; i++) {
    const index = newArr.findIndex((el) => el == exceptions[i]);
    if (index != -1) {
      newArr.splice(index, 1);
    }
  }
  for (let i = 0; i < n; i++) {
    let random = Math.floor(Math.random() * newArr.length);
    randomItemArr.push(newArr[random]);
  }
  return randomItemArr.length == 1 ? randomItemArr[0] : randomItemArr;
};

const randomOperator = (except, n) => {
  const arr = ["+", "-", "*", "/"];
  let exceptions = Array.isArray(except) ? except : [except];
  let randomItemArr = [];
  let newArr = [...arr];
  for (let i = 0; i < exceptions.length; i++) {
    const index = newArr.findIndex((el) => el == exceptions[i]);
    if (index != -1) {
      newArr.splice(index, 1);
    }
  }
  for (let i = 0; i < n; i++) {
    let random = Math.floor(Math.random() * newArr.length);
    randomItemArr.push(newArr[random]);
  }
  return randomItemArr.length == 1 ? randomItemArr[0] : randomItemArr;
};

// levels | return an array
const levelZero = () => {
  const [firstNumber, secondNumber] = randomNumber(null, 2);
  const [firstOperator] = randomOperator(null, 1);
  return [firstNumber, firstOperator, secondNumber];
};

const levelOne = () => {
  const [firstNumber, secondNumber, thirdNumber] = randomNumber(null, 3);
  const [firstOperator, secondOperator] = randomOperator(null, 2);
  return [
    firstNumber,
    firstOperator,
    secondNumber,
    secondOperator,
    thirdNumber,
  ];
};
// linear equations
//  a != 0
// ax op b => solve for be
const levelTwo = () => {
  const [firstNumber, secondNumber] = randomNumber(0, 3);
  const [firstOperator] = randomOperator(["*", "/"], 2);

  let formula = `${firstNumber}x ${firstOperator} ${secondNumber}`;
  return formula.split(" ");
};

const levelThree = () => {
  // formula can be a array of diffent formulas(determines how to shape the calculation)
  const [firstNumber, secondNumber, thirdNumber, fourthNumber] = randomNumber(
    0,
    4
  );
  const [firstOperator, secondOperator, thirdOperator] = randomOperator(
    null,
    5
  );
  let formula = `${firstNumber} ${firstOperator} ${secondNumber} ${secondOperator} (${thirdNumber} ${thirdOperator} ${fourthNumber})`;
  return formula.split(" ");
};

// quadratic equations
// gotta check for condition (a + b + c == 0 : x1 = 1 && x2 = b/a|| a + b - c = 0) : x1 = 1 $$ x2 = -b/a
//  a != 0
const levelFour = () => {
  const [firstOperator, secondOperator] = randomOperator(["*", "/"], 2);
  const [firstNumber, secondNumber, thirdNumber] = randomNumber(0, 3);

  let formula = `${firstNumber}x^2 ${firstOperator} ${secondNumber}x ${secondOperator} ${thirdNumber}`;
  return formula.split(" ");
};

// let level = 3;
// let result = calculateResult(generateCalculation(level, 5)[0], level)[0];
// let randomR = generateRandomResults(result, level);

export { generateCalculation, calculateResult, generateRandomResults };
