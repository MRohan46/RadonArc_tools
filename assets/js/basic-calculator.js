// ========================================
// Basic Calculator Logic
// ========================================

const calc = {
  expression: "",
  result: "0",
  memory: 0,
  isNewNumber: true,

  init() {
    this.updateDisplay();
    this.setupKeyboard();
  },

  setupKeyboard() {
    document.addEventListener("keydown", (e) => {
      const key = e.key;

      if (key >= "0" && key <= "9") {
        this.inputNumber(key);
      } else if (key === ".") {
        this.inputDecimal();
      } else if (key === "+") {
        this.inputOperator("+");
      } else if (key === "-") {
        this.inputOperator("-");
      } else if (key === "*") {
        this.inputOperator("*");
      } else if (key === "/") {
        e.preventDefault();
        this.inputOperator("/");
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        this.calculate();
      } else if (key === "Backspace") {
        e.preventDefault();
        this.backspace();
      } else if (key === "Delete" || key.toLowerCase() === "c") {
        this.clear();
      } else if (key === "Escape") {
        this.clearEntry();
      } else if (key === "%") {
        this.percentage();
      }
    });
  },

  inputNumber(num) {
    if (this.isNewNumber) {
      this.expression = num;
      this.isNewNumber = false;
    } else {
      this.expression += num;
    }
    this.updateDisplay();
  },

  inputOperator(op) {
    if (this.expression === "") {
      this.expression = this.result;
    }

    const lastChar = this.expression[this.expression.length - 1];
    if ("+-*/".includes(lastChar)) {
      this.expression = this.expression.slice(0, -1);
    }

    this.expression += op;
    this.isNewNumber = false;
    this.updateDisplay();
  },

  inputDecimal() {
    const parts = this.expression.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];

    if (this.isNewNumber) {
      this.expression = "0.";
      this.isNewNumber = false;
    } else if (!lastPart.includes(".")) {
      this.expression += ".";
    }
    this.updateDisplay();
  },

  calculate() {
    try {
      let expr = this.expression;

      if (!expr) {
        return;
      }

      // Replace visual operators with JavaScript operators
      expr = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");

      // Evaluate the expression
      const result = eval(expr);

      if (isNaN(result) || !isFinite(result)) {
        this.result = "Error";
      } else {
        // Round to avoid floating point errors
        this.result = this.formatResult(result);
      }

      this.expression = this.result;
      this.isNewNumber = true;
      this.updateDisplay();
    } catch (error) {
      this.result = "Error";
      this.updateDisplay();
    }
  },

  formatResult(num) {
    // Round to 10 decimal places
    const rounded = Math.round(num * 10000000000) / 10000000000;

    // Remove trailing zeros
    let str = rounded.toString();
    if (str.includes(".")) {
      str = str.replace(/\.?0+$/, "");
    }

    return str;
  },

  clear() {
    this.expression = "";
    this.result = "0";
    this.isNewNumber = true;
    this.updateDisplay();
  },

  clearEntry() {
    this.expression = "";
    this.isNewNumber = true;
    this.updateDisplay();
  },

  backspace() {
    if (this.expression.length > 0) {
      this.expression = this.expression.slice(0, -1);
      if (this.expression === "") {
        this.result = "0";
      }
      this.updateDisplay();
    }
  },

  percentage() {
    try {
      const num = parseFloat(this.expression || this.result);
      if (isNaN(num)) {
        this.result = "Error";
      } else {
        this.result = this.formatResult(num / 100);
        this.expression = this.result;
        this.isNewNumber = true;
      }
      this.updateDisplay();
    } catch (error) {
      this.result = "Error";
      this.updateDisplay();
    }
  },

  // Memory Functions
  memoryClear() {
    this.memory = 0;
    this.updateMemoryDisplay();
  },

  memoryRecall() {
    this.expression = this.memory.toString();
    this.isNewNumber = true;
    this.updateDisplay();
  },

  memoryAdd() {
    try {
      const num = parseFloat(this.expression || this.result);
      if (!isNaN(num)) {
        this.memory += num;
        this.updateMemoryDisplay();
      }
    } catch (error) {
      // Ignore
    }
  },

  memorySubtract() {
    try {
      const num = parseFloat(this.expression || this.result);
      if (!isNaN(num)) {
        this.memory -= num;
        this.updateMemoryDisplay();
      }
    } catch (error) {
      // Ignore
    }
  },

  memoryStore() {
    try {
      const num = parseFloat(this.expression || this.result);
      if (!isNaN(num)) {
        this.memory = num;
        this.updateMemoryDisplay();
      }
    } catch (error) {
      // Ignore
    }
  },

  updateMemoryDisplay() {
    const memDisplay = document.getElementById("calcMemory");
    const memValue = document.getElementById("memoryValue");

    if (this.memory !== 0) {
      memDisplay.style.display = "block";
      memValue.textContent = this.formatResult(this.memory);
    } else {
      memDisplay.style.display = "none";
    }
  },

  updateDisplay() {
    document.getElementById("calcExpression").textContent =
      this.expression || "0";
    document.getElementById("calcResult").textContent = this.result;
  },
};

// Initialize calculator on page load
document.addEventListener("DOMContentLoaded", () => {
  calc.init();
});
