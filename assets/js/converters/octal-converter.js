const converter = {
  init() {
    this.setupEventListeners();
    this.convert(); // Initial conversion
  },

  setupEventListeners() {
    const octalInput = document.getElementById("octalInput");

    octalInput.addEventListener("input", () => this.convert());
    octalInput.addEventListener("keyup", () => this.convert());

    // Validate input as user types
    octalInput.addEventListener("keypress", (e) => {
      const char = e.key;
      const validChars = "01234567";

      if (
        !validChars.includes(char) &&
        char !== "Backspace" &&
        char !== "Delete" &&
        char !== "ArrowLeft" &&
        char !== "ArrowRight" &&
        char !== "Home" &&
        char !== "End" &&
        char !== "Tab"
      ) {
        e.preventDefault();
      }
    });

    // Handle paste
    octalInput.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteText = (e.clipboardData || window.clipboardData).getData(
        "text",
      );
      const cleaned = pasteText.replace(/[^0-7]/g, "");

      const start = octalInput.selectionStart;
      const end = octalInput.selectionEnd;
      const currentValue = octalInput.value;
      const newValue =
        currentValue.substring(0, start) +
        cleaned +
        currentValue.substring(end);

      octalInput.value = newValue;
      this.convert();
    });
  },

  convert() {
    const octalInput = document.getElementById("octalInput");
    const decimalValue = document.getElementById("decimalValue");
    const binaryValue = document.getElementById("binaryValue");
    const hexValue = document.getElementById("hexValue");
    const explanationBox = document.getElementById("explanationBox");

    let octal = octalInput.value.trim();

    if (octal === "") {
      decimalValue.textContent = "0";
      binaryValue.textContent = "0";
      hexValue.textContent = "0";
      this.updateExplanation("0", 0);
      return;
    }

    // Validate octal string
    const validOctal = /^[0-7]+$/.test(octal);

    if (!validOctal) {
      decimalValue.textContent = "Invalid";
      binaryValue.textContent = "Invalid";
      hexValue.textContent = "Invalid";
      explanationBox.style.opacity = "0.5";
      return;
    }

    // Convert to decimal
    const decimal = parseInt(octal, 8);

    // Update all displays
    decimalValue.textContent = decimal.toLocaleString();
    binaryValue.textContent = decimal.toString(2);
    hexValue.textContent = decimal.toString(16).toUpperCase();

    // Update explanation
    this.updateExplanation(octal, decimal);
    explanationBox.style.opacity = "1";
  },

  updateExplanation(octal, decimal) {
    const explanationContent = document.getElementById("explanationContent");

    if (octal.length === 1) {
      explanationContent.innerHTML = `
                <p class="explanation-step">${octal} = ${decimal}</p>
            `;
      return;
    }

    // Build step-by-step explanation
    let steps = [];
    let total = 0;

    for (let i = 0; i < octal.length; i++) {
      const digit = octal[i];
      const position = octal.length - 1 - i;
      const power = Math.pow(8, position);
      const contribution = parseInt(digit) * power;

      steps.push(
        `${digit} × 8<sup>${position}</sup> = ${digit} × ${power} = ${contribution}`,
      );
      total += contribution;
    }

    explanationContent.innerHTML = `
            <p class="explanation-step">${octal} = ${steps.join(" + ")}</p>
            <p class="explanation-step">= ${total.toLocaleString()}</p>
        `;
  },

  setOctal(value) {
    document.getElementById("octalInput").value = value;
    this.convert();
  },
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  converter.init();
});
