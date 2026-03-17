// ========================================
// Scientific Calculator Logic
// ========================================

const sciCalc = {
  expression: "",
  result: "0",
  angleMode: "deg", // 'deg' or 'rad'
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
      } else if (key === "(") {
        this.openParen();
      } else if (key === ")") {
        this.closeParen();
      }
    });
  },

  setAngleMode(mode) {
    this.angleMode = mode;
    
    // Update button states
    document.querySelectorAll(".angle-btn").forEach(btn => {
      btn.classList.remove("active");
      if (btn.dataset.mode === mode) {
        btn.classList.add("active");
      }
    });
  },

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  toDegrees(radians) {
    return radians * (180 / Math.PI);
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
    if ("+-*/^".includes(lastChar)) {
      this.expression = this.expression.slice(0, -1);
    }

    this.expression += op;
    this.isNewNumber = false;
    this.updateDisplay();
  },

  inputDecimal() {
    const parts = this.expression.split(/[\+\-\*\/\^\(\)]/);
    const lastPart = parts[parts.length - 1];

    if (this.isNewNumber) {
      this.expression = "0.";
      this.isNewNumber = false;
    } else if (!lastPart.includes(".")) {
      this.expression += ".";
    }
    this.updateDisplay();
  },

  openParen() {
    if (this.isNewNumber) {
      this.expression = "(";
    } else {
      this.expression += "(";
    }
    this.isNewNumber = false;
    this.updateDisplay();
  },

  closeParen() {
    this.expression += ")";
    this.updateDisplay();
  },

  calculate() {
    try {
      let expr = this.expression;

      if (!expr) {
        return;
      }

      // Replace visual operators
      expr = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
      
      // Handle power operator
      expr = expr.replace(/\^/g, "**");

      // Evaluate
      const result = eval(expr);

      if (isNaN(result) || !isFinite(result)) {
        this.result = "Error";
      } else {
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
    const rounded = Math.round(num * 10000000000) / 10000000000;
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

  // Trigonometric Functions
  sin() {
    this.applyFunction((x) => {
      const angle = this.angleMode === "deg" ? this.toRadians(x) : x;
      return Math.sin(angle);
    });
  },

  cos() {
    this.applyFunction((x) => {
      const angle = this.angleMode === "deg" ? this.toRadians(x) : x;
      return Math.cos(angle);
    });
  },

  tan() {
    this.applyFunction((x) => {
      const angle = this.angleMode === "deg" ? this.toRadians(x) : x;
      return Math.tan(angle);
    });
  },

  asin() {
    this.applyFunction((x) => {
      const result = Math.asin(x);
      return this.angleMode === "deg" ? this.toDegrees(result) : result;
    });
  },

  acos() {
    this.applyFunction((x) => {
      const result = Math.acos(x);
      return this.angleMode === "deg" ? this.toDegrees(result) : result;
    });
  },

  atan() {
    this.applyFunction((x) => {
      const result = Math.atan(x);
      return this.angleMode === "deg" ? this.toDegrees(result) : result;
    });
  },

  // Logarithms
  log() {
    this.applyFunction((x) => Math.log10(x));
  },

  ln() {
    this.applyFunction((x) => Math.log(x));
  },

  // Powers & Roots
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

  exp() {
    this.applyFunction((x) => Math.exp(x));
  },

  // Other Functions
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

  reciprocal() {
    this.applyFunction((x) => 1 / x);
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

  // Constants
  pi() {
    if (this.isNewNumber) {
      this.expression = Math.PI.toString();
    } else {
      this.expression += Math.PI.toString();
    }
    this.isNewNumber = false;
    this.updateDisplay();
  },

  e() {
    if (this.isNewNumber) {
      this.expression = Math.E.toString();
    } else {
      this.expression += Math.E.toString();
    }
    this.isNewNumber = false;
    this.updateDisplay();
  },

  // Apply function helper
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

  updateDisplay() {
    document.getElementById("calcExpression").textContent =
      this.expression || "0";
    document.getElementById("calcResult").textContent = this.result;
  },
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  sciCalc.init();
});
