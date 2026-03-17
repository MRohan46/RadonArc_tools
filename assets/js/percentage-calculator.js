// ========================================
// Percentage Calculator Logic
// ========================================

const percentCalc = {
  // Type 1: What is X% of Y?
  calculateType1() {
    const percent = parseFloat(document.getElementById("percent1").value);
    const value = parseFloat(document.getElementById("value1").value);

    if (isNaN(percent) || isNaN(value)) {
      alert("Please enter valid numbers");
      return;
    }

    const result = (percent / 100) * value;
    
    this.showResult(
      "result1",
      `${this.formatNumber(result)}`,
      `${percent}% of ${this.formatNumber(value)} = ${this.formatNumber(result)}`
    );
  },

  // Type 2: X is what % of Y?
  calculateType2() {
    const value = parseFloat(document.getElementById("value2").value);
    const total = parseFloat(document.getElementById("total2").value);

    if (isNaN(value) || isNaN(total)) {
      alert("Please enter valid numbers");
      return;
    }

    if (total === 0) {
      alert("Total cannot be zero");
      return;
    }

    const result = (value / total) * 100;
    
    this.showResult(
      "result2",
      `${this.formatNumber(result)}%`,
      `${this.formatNumber(value)} is ${this.formatNumber(result)}% of ${this.formatNumber(total)}`
    );
  },

  // Type 3: Percentage Increase
  calculateType3() {
    const oldValue = parseFloat(document.getElementById("oldValue3").value);
    const newValue = parseFloat(document.getElementById("newValue3").value);

    if (isNaN(oldValue) || isNaN(newValue)) {
      alert("Please enter valid numbers");
      return;
    }

    if (oldValue === 0) {
      alert("Original value cannot be zero");
      return;
    }

    const change = newValue - oldValue;
    const percentChange = (change / oldValue) * 100;
    
    if (percentChange < 0) {
      this.showResult(
        "result3",
        `${this.formatNumber(Math.abs(percentChange))}% decrease`,
        `From ${this.formatNumber(oldValue)} to ${this.formatNumber(newValue)} is a ${this.formatNumber(Math.abs(percentChange))}% decrease`
      );
    } else {
      this.showResult(
        "result3",
        `${this.formatNumber(percentChange)}% increase`,
        `From ${this.formatNumber(oldValue)} to ${this.formatNumber(newValue)} is a ${this.formatNumber(percentChange)}% increase`
      );
    }
  },

  // Type 4: Percentage Decrease
  calculateType4() {
    const oldValue = parseFloat(document.getElementById("oldValue4").value);
    const newValue = parseFloat(document.getElementById("newValue4").value);

    if (isNaN(oldValue) || isNaN(newValue)) {
      alert("Please enter valid numbers");
      return;
    }

    if (oldValue === 0) {
      alert("Original value cannot be zero");
      return;
    }

    const change = newValue - oldValue;
    const percentChange = (change / oldValue) * 100;
    
    if (percentChange > 0) {
      this.showResult(
        "result4",
        `${this.formatNumber(percentChange)}% increase`,
        `From ${this.formatNumber(oldValue)} to ${this.formatNumber(newValue)} is a ${this.formatNumber(percentChange)}% increase`
      );
    } else {
      this.showResult(
        "result4",
        `${this.formatNumber(Math.abs(percentChange))}% decrease`,
        `From ${this.formatNumber(oldValue)} to ${this.formatNumber(newValue)} is a ${this.formatNumber(Math.abs(percentChange))}% decrease`
      );
    }
  },

  showResult(resultId, value, formula) {
    const resultDiv = document.getElementById(resultId);
    const resultValue = document.getElementById(`${resultId}Value`);
    const resultFormula = document.getElementById(`${resultId}Formula`);

    resultValue.textContent = value;
    resultFormula.textContent = formula;
    
    resultDiv.style.display = "block";
    
    // Animate in
    setTimeout(() => {
      resultDiv.style.opacity = "1";
      resultDiv.style.transform = "translateY(0)";
    }, 10);
  },

  formatNumber(num) {
    // Round to 2 decimal places if needed
    const rounded = Math.round(num * 100) / 100;
    
    // Remove trailing zeros
    let str = rounded.toString();
    if (str.includes(".")) {
      str = str.replace(/\.?0+$/, "");
    }
    
    return str;
  },
};

// Initialize result cards with animation setup
document.addEventListener("DOMContentLoaded", () => {
  const results = document.querySelectorAll(".percentage-result");
  results.forEach((result) => {
    result.style.opacity = "0";
    result.style.transform = "translateY(10px)";
    result.style.transition = "all 0.3s ease";
  });

  // Allow Enter key on inputs
  document.querySelectorAll(".percent-input").forEach((input, index) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const card = input.closest(".percentage-card");
        const button = card.querySelector("button");
        if (button) button.click();
      }
    });
  });
});
