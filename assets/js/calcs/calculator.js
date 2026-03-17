// ========================================
// Calculator Logic - Basic, Scientific & Programmer
// ========================================

const calculator = {
  currentMode: "basic",
  currentBase: 10,
  expression: "",
  result: "0",
  memory: 0,
  lastResult: 0,
  isNewNumber: true,

  init() {
    this.updateDisplay();
    this.setupModeButtons();
    this.setupKeyboard();
  },

  setupModeButtons() {
    document.querySelectorAll(".calc-mode-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const mode = e.target.dataset.mode;
        this.switchMode(mode);
      });
    });
  },

  switchMode(mode) {
    this.currentMode = mode;

    // Update active button
    document.querySelectorAll(".calc-mode-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.mode === mode) {
        btn.classList.add("active");
      }
    });

    // Show/hide grids
    document.getElementById("basicMode").style.display =
      mode === "basic" ? "grid" : "none";
    document.getElementById("scientificMode").style.display =
      mode === "scientific" ? "grid" : "none";
    document.getElementById("programmerMode").style.display =
      mode === "programmer" ? "grid" : "none";

    // Clear on mode switch
    this.clear();
  },

  setupKeyboard() {
    document.addEventListener("keydown", (e) => {
      const key = e.key;

      if (key >= "0" && key <= "9") {
        this.inputNumber(key);
      } else if (key === ".") {
        this.inputDecimal();
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        this.inputOperator(key);
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

      // Hex inputs for programmer mode
      if (this.currentMode === "programmer" && this.currentBase === 16) {
        if (key.toUpperCase() >= "A" && key.toUpperCase() <= "F") {
          this.inputNumber(key.toUpperCase());
        }
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
    if (this.isNewNumber) {
      this.expression = "0.";
      this.isNewNumber = false;
    } else if (!this.expression.includes(".")) {
      this.expression += ".";
    }
    this.updateDisplay();
  },

  calculate() {
    try {
      let expr = this.expression;

      if (this.currentMode === "programmer") {
        // Convert from current base to decimal for calculation
        const num = parseInt(expr, this.currentBase);
        this.result = num.toString(this.currentBase).toUpperCase();
      } else {
        // Replace operators for eval
        expr = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");

        // Evaluate
        const result = eval(expr);
        this.result = this.formatResult(result);
        this.lastResult = result;
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
    if (isNaN(num) || !isFinite(num)) return "Error";

    // Round to 10 decimal places to avoid floating point errors
    const rounded = Math.round(num * 10000000000) / 10000000000;

    // Format with commas for large numbers
    if (Math.abs(rounded) >= 1000000) {
      return rounded.toExponential(6);
    }

    return rounded.toString();
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
      this.result = (num / 100).toString();
      this.expression = this.result;
      this.isNewNumber = true;
      this.updateDisplay();
    } catch (error) {
      this.result = "Error";
      this.updateDisplay();
    }
  },

  // Scientific Functions
  sin() {
    this.applyFunction((x) => Math.sin(x));
  },

  cos() {
    this.applyFunction((x) => Math.cos(x));
  },

  tan() {
    this.applyFunction((x) => Math.tan(x));
  },

  asin() {
    this.applyFunction((x) => Math.asin(x));
  },

  acos() {
    this.applyFunction((x) => Math.acos(x));
  },

  atan() {
    this.applyFunction((x) => Math.atan(x));
  },

  log() {
    this.applyFunction((x) => Math.log10(x));
  },

  ln() {
    this.applyFunction((x) => Math.log(x));
  },

  sqrt() {
    this.applyFunction((x) => Math.sqrt(x));
  },

  power() {
    this.applyFunction((x) => Math.pow(x, 2));
  },

  powerY() {
    this.expression += "^";
    this.updateDisplay();
  },

  factorial() {
    this.applyFunction((x) => {
      if (x < 0 || !Number.isInteger(x)) return NaN;
      if (x === 0 || x === 1) return 1;
      let result = 1;
      for (let i = 2; i <= x; i++) {
        result *= i;
      }
      return result;
    });
  },

  pi() {
    this.expression = Math.PI.toString();
    this.isNewNumber = true;
    this.updateDisplay();
  },

  e() {
    this.expression = Math.E.toString();
    this.isNewNumber = true;
    this.updateDisplay();
  },

  negate() {
    try {
      const num = parseFloat(this.expression || this.result);
      this.result = (-num).toString();
      this.expression = this.result;
      this.isNewNumber = true;
      this.updateDisplay();
    } catch (error) {
      this.result = "Error";
      this.updateDisplay();
    }
  },

  reciprocal() {
    this.applyFunction((x) => 1 / x);
  },

  openParen() {
    this.expression += "(";
    this.updateDisplay();
  },

  closeParen() {
    this.expression += ")";
    this.updateDisplay();
  },

  applyFunction(fn) {
    try {
      const num = parseFloat(this.expression || this.result);
      const result = fn(num);
      this.result = this.formatResult(result);
      this.expression = this.result;
      this.isNewNumber = true;
      this.updateDisplay();
    } catch (error) {
      this.result = "Error";
      this.updateDisplay();
    }
  },

  // Programmer Mode Functions
  changeBase(base) {
    try {
      // Convert current number to new base
      const currentNum = parseInt(this.expression || this.result, this.currentBase);
      this.currentBase = base;
      this.expression = currentNum.toString(base).toUpperCase();
      this.result = this.expression;

      // Update active base button
      document.querySelectorAll(".calc-base-btn").forEach((btn) => {
        btn.classList.remove("active");
        if (parseInt(btn.dataset.base) === base) {
          btn.classList.add("active");
        }
      });

      // Enable/disable hex buttons
      const hexButtons = document.querySelectorAll(".calc-btn-hex");
      hexButtons.forEach((btn) => {
        btn.disabled = base !== 16;
      });

      // Disable invalid buttons for each base
      const digitButtons = document.querySelectorAll(
        '#programmerMode .calc-btn:not([class*="operator"]):not([class*="secondary"]):not([class*="primary"]):not([class*="function"]):not([class*="hex"])',
      );
      digitButtons.forEach((btn) => {
        const digit = parseInt(btn.textContent);
        if (!isNaN(digit)) {
          btn.disabled = digit >= base;
        }
      });

      this.updateDisplay();
    } catch (error) {
      this.result = "Error";
      this.updateDisplay();
    }
  },

  bitwiseAnd() {
    this.expression += "&";
    this.updateDisplay();
  },

  bitwiseOr() {
    this.expression += "|";
    this.updateDisplay();
  },

  bitwiseXor() {
    this.expression += "^";
    this.updateDisplay();
  },

  bitwiseNot() {
    try {
      const num = parseInt(this.expression || this.result, this.currentBase);
      this.result = (~num).toString(this.currentBase).toUpperCase();
      this.expression = this.result;
      this.isNewNumber = true;
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
      this.memory += num;
      this.updateMemoryDisplay();
    } catch (error) {
      // Ignore
    }
  },

  memorySubtract() {
    try {
      const num = parseFloat(this.expression || this.result);
      this.memory -= num;
      this.updateMemoryDisplay();
    } catch (error) {
      // Ignore
    }
  },

  memoryStore() {
    try {
      this.memory = parseFloat(this.expression || this.result);
      this.updateMemoryDisplay();
    } catch (error) {
      // Ignore
    }
  },

  updateMemoryDisplay() {
    const memDisplay = document.getElementById("calcMemory");
    const memValue = document.getElementById("memoryValue");

    if (this.memory !== 0) {
      memDisplay.style.display = "block";
      memValue.textContent = this.memory;
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
  calculator.init();
});
