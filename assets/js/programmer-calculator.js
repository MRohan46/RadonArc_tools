// ========================================
// Programmer Calculator Logic
// ========================================

const progCalc = {
  currentBase: 10,
  expression: "",
  result: "0",
  currentValue: 0,
  isNewNumber: true,

  init() {
    this.updateDisplay();
    this.updateAllBases();
    this.setupKeyboard();
  },

  setupKeyboard() {
    document.addEventListener("keydown", (e) => {
      const key = e.key;

      // Numbers
      if (key >= "0" && key <= "9") {
        const digit = parseInt(key);
        if (digit < this.currentBase) {
          this.inputNumber(key);
        }
      }
      
      // Hex letters
      if (this.currentBase === 16) {
        if (key.toUpperCase() >= "A" && key.toUpperCase() <= "F") {
          this.inputNumber(key.toUpperCase());
        }
      }

      // Operators
      if (key === "+") this.inputOperator("+");
      else if (key === "-") this.inputOperator("-");
      else if (key === "*") this.inputOperator("*");
      else if (key === "/") {
        e.preventDefault();
        this.inputOperator("/");
      }
      else if (key === "Enter" || key === "=") {
        e.preventDefault();
        this.calculate();
      }
      else if (key === "Backspace") {
        e.preventDefault();
        this.backspace();
      }
      else if (key === "Delete" || key.toLowerCase() === "c") {
        this.clear();
      }
      else if (key === "Escape") {
        this.clearEntry();
      }
    });
  },

  changeBase(base) {
    try {
      // Convert current value to new base
      if (this.expression) {
        const decValue = parseInt(this.expression, this.currentBase);
        if (!isNaN(decValue)) {
          this.currentValue = decValue;
          this.expression = decValue.toString(base).toUpperCase();
          this.result = this.expression;
        }
      }

      this.currentBase = base;

      // Update active base button
      document.querySelectorAll(".base-btn-main").forEach((btn) => {
        btn.classList.remove("active");
        if (parseInt(btn.dataset.base) === base) {
          btn.classList.add("active");
        }
      });

      // Enable/disable buttons based on base
      this.updateButtonStates();
      this.updateAllBases();
      this.updateDisplay();
    } catch (error) {
      this.result = "Error";
      this.updateDisplay();
    }
  },

  updateButtonStates() {
    // Hex buttons (A-F)
    const hexButtons = document.querySelectorAll(".calc-btn-hex");
    hexButtons.forEach((btn) => {
      btn.disabled = this.currentBase !== 16;
    });

    // Digit buttons (0-9)
    const digitButtons = document.querySelectorAll(
      '.calc-grid-programmer .calc-btn:not([class*="operator"]):not([class*="secondary"]):not([class*="primary"]):not([class*="function"]):not([class*="hex"])',
    );
    digitButtons.forEach((btn) => {
      const digit = parseInt(btn.textContent);
      if (!isNaN(digit)) {
        btn.disabled = digit >= this.currentBase;
      }
    });
  },

  updateAllBases() {
    try {
      let decValue = this.currentValue;

      // If there's an expression, parse it
      if (this.expression && this.expression !== "0") {
        decValue = parseInt(this.expression, this.currentBase);
        if (isNaN(decValue)) {
          decValue = 0;
        }
        this.currentValue = decValue;
      }

      // Update all base displays
      document.getElementById("decValue").textContent = decValue.toString(10);
      document.getElementById("hexValue").textContent = decValue
        .toString(16)
        .toUpperCase();
      document.getElementById("octValue").textContent = decValue.toString(8);
      document.getElementById("binValue").textContent = decValue.toString(2);
    } catch (error) {
      // Reset on error
      document.getElementById("decValue").textContent = "0";
      document.getElementById("hexValue").textContent = "0";
      document.getElementById("octValue").textContent = "0";
      document.getElementById("binValue").textContent = "0";
    }
  },

  inputNumber(num) {
    if (this.isNewNumber) {
      this.expression = num;
      this.isNewNumber = false;
    } else {
      this.expression += num;
    }
    this.updateDisplay();
    this.updateAllBases();
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

  calculate() {
    try {
      let expr = this.expression;

      if (!expr) {
        return;
      }

      // Convert expression to decimal, evaluate, then convert back
      // Parse the expression considering the current base
      const tokens = expr.split(/([+\-*/])/);
      let decExpression = "";

      for (let token of tokens) {
        if (/[+\-*/]/.test(token)) {
          decExpression += token;
        } else if (token.trim()) {
          const num = parseInt(token, this.currentBase);
          decExpression += num;
        }
      }

      const result = eval(decExpression);

      if (isNaN(result) || !isFinite(result)) {
        this.result = "Error";
      } else {
        const intResult = Math.floor(result);
        this.currentValue = intResult;
        this.result = intResult.toString(this.currentBase).toUpperCase();
      }

      this.expression = this.result;
      this.isNewNumber = true;
      this.updateDisplay();
      this.updateAllBases();
    } catch (error) {
      this.result = "Error";
      this.updateDisplay();
    }
  },

  clear() {
    this.expression = "";
    this.result = "0";
    this.currentValue = 0;
    this.isNewNumber = true;
    this.updateDisplay();
    this.updateAllBases();
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
        this.currentValue = 0;
      }
      this.updateDisplay();
      this.updateAllBases();
    }
  },

  // Bitwise Operations
  bitwiseAnd() {
    this.applyBitwiseOperation("&");
  },

  bitwiseOr() {
    this.applyBitwiseOperation("|");
  },

  bitwiseXor() {
    this.applyBitwiseOperation("^");
  },

  bitwiseNot() {
    try {
      const num = parseInt(this.expression || this.result, this.currentBase);
      // For 32-bit NOT operation
      const result = ~num >>> 0;
      this.currentValue = result;
      this.result = result.toString(this.currentBase).toUpperCase();
      this.expression = this.result;
      this.isNewNumber = true;
      this.updateDisplay();
      this.updateAllBases();
    } catch (error) {
      this.result = "Error";
      this.updateDisplay();
    }
  },

  applyBitwiseOperation(op) {
    if (this.expression === "") {
      this.expression = this.result;
    }

    const lastChar = this.expression[this.expression.length - 1];
    if ("&|^".includes(lastChar)) {
      this.expression = this.expression.slice(0, -1);
    }

    this.expression += op;
    this.isNewNumber = false;
    this.updateDisplay();
  },

  updateDisplay() {
    document.getElementById("calcExpression").textContent =
      this.expression || "0";
    document.getElementById("calcResult").textContent = this.result;
  },
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  progCalc.init();
});
