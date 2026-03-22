// ========================================
// Hex to Decimal Converter Logic
// ========================================

const converter = {
  init() {
    this.setupEventListeners();
    this.convert(); // Initial conversion
  },

  setupEventListeners() {
    const hexInput = document.getElementById("hexInput");

    hexInput.addEventListener("input", () => this.convert());
    hexInput.addEventListener("keyup", () => this.convert());

    // Validate input as user types
    hexInput.addEventListener("keypress", (e) => {
      const char = e.key.toUpperCase();
      const validChars = "0123456789ABCDEF";

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
    hexInput.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteText = (e.clipboardData || window.clipboardData).getData(
        "text",
      );
      const cleaned = pasteText.toUpperCase().replace(/[^0-9A-F]/g, "");

      const start = hexInput.selectionStart;
      const end = hexInput.selectionEnd;
      const currentValue = hexInput.value;
      const newValue =
        currentValue.substring(0, start) +
        cleaned +
        currentValue.substring(end);

      hexInput.value = newValue;
      this.convert();
    });
  },

  convert() {
    const hexInput = document.getElementById("hexInput");
    const decimalOutput = document.getElementById("decimalOutput");
    const explanationBox = document.getElementById("explanationBox");

    let hex = hexInput.value.trim();

    // Remove any 0x prefix if present
    hex = hex.replace(/^0x/i, "");

    if (hex === "") {
      decimalOutput.textContent = "0";
      this.updateExplanation("0", 0);
      return;
    }

    // Validate hex string
    const validHex = /^[0-9A-Fa-f]+$/.test(hex);

    if (!validHex) {
      decimalOutput.textContent = "Invalid Hex";
      explanationBox.style.opacity = "0.5";
      return;
    }

    // Convert to uppercase for display
    hex = hex.toUpperCase();
    hexInput.value = hex;

    // Convert to decimal
    const decimal = parseInt(hex, 16);

    // Format decimal with commas for thousands
    decimalOutput.textContent = decimal.toLocaleString();

    // Update explanation
    this.updateExplanation(hex, decimal);
    explanationBox.style.opacity = "1";
  },

  updateExplanation(hex, decimal) {
    const explanationContent = document.getElementById("explanationContent");

    if (hex.length === 1) {
      explanationContent.innerHTML = `
                <p class="explanation-step">${hex} = ${decimal}</p>
                <p class="explanation-step">(Since ${hex} = ${decimal} in hexadecimal)</p>
            `;
      return;
    }

    // Build step-by-step explanation
    let steps = [];
    let total = 0;

    for (let i = 0; i < hex.length; i++) {
      const digit = hex[i];
      const digitValue = parseInt(digit, 16);
      const position = hex.length - 1 - i;
      const power = Math.pow(16, position);
      const contribution = digitValue * power;

      steps.push(
        `${digit} × 16<sup>${position}</sup> = ${digitValue} × ${power} = ${contribution}`,
      );
      total += contribution;
    }

    explanationContent.innerHTML = `
            <p class="explanation-step">${hex} = ${steps.join(" + ")}</p>
            <p class="explanation-step">= ${total.toLocaleString()}</p>
        `;
  },

  setHex(value) {
    document.getElementById("hexInput").value = value;
    this.convert();
  },

  swap() {
    const hexValue = document.getElementById("hexInput").value;
    const decimalValue = document
      .getElementById("decimalOutput")
      .textContent.replace(/,/g, "");

    if (decimalValue !== "Invalid Hex") {
      // Redirect to decimal-to-hex page with the decimal value
      window.location.href = `decimal-to-hex.html?value=${decimalValue}`;
    }
  },
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  converter.init();
});
