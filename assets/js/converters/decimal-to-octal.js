// ========================================
// Decimal to Octal Converter Logic
// ========================================

const converter = {
  init() {
    this.setupEventListeners();
    this.convert(); // Initial conversion
  },

  setupEventListeners() {
    const decimalInput = document.getElementById("decimalInput");

    decimalInput.addEventListener("input", () => this.convert());
    decimalInput.addEventListener("keyup", () => this.convert());

    // Allow only numbers
    decimalInput.addEventListener("keypress", (e) => {
      const char = e.key;
      const validChars = "0123456789";

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
    decimalInput.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteText = (e.clipboardData || window.clipboardData).getData(
        "text",
      );
      const cleaned = pasteText.replace(/[^0-9]/g, "");

      const start = decimalInput.selectionStart;
      const end = decimalInput.selectionEnd;
      const currentValue = decimalInput.value;
      const newValue =
        currentValue.substring(0, start) +
        cleaned +
        currentValue.substring(end);

      decimalInput.value = newValue;
      this.convert();
    });
  },

  convert() {
    const decimalInput = document.getElementById("decimalInput");
    const octalOutput = document.getElementById("octalOutput");
    const explanationBox = document.getElementById("explanationBox");

    let decimal = decimalInput.value.trim();

    if (decimal === "" || decimal === "-") {
      octalOutput.textContent = "0";
      this.updateExplanation("0", "0");
      return;
    }

    // Parse as integer
    const decimalNum = parseInt(decimal, 10);

    if (isNaN(decimalNum) || decimalNum < 0) {
      octalOutput.textContent = "Invalid";
      explanationBox.style.opacity = "0.5";
      return;
    }

    // Convert to octal
    const octal = decimalNum.toString(8);

    // Format with commas for thousands in decimal display
    decimalInput.value = decimalNum.toLocaleString();

    octalOutput.textContent = octal;

    // Update explanation
    this.updateExplanation(decimalNum, octal);
    explanationBox.style.opacity = "1";
  },

  updateExplanation(decimal, octal) {
    const explanationContent = document.getElementById("explanationContent");

    if (decimal < 8) {
      explanationContent.innerHTML = `
                <p class="explanation-step">${decimal} is less than 8</p>
                <p class="explanation-step">Single digit: ${decimal} = ${octal}</p>
            `;
      return;
    }

    // Build step-by-step division explanation
    let steps = [];
    let remainders = [];
    let quotient = decimal;

    while (quotient > 0) {
      const remainder = quotient % 8;
      remainders.unshift(remainder.toString());

      steps.push(
        `${quotient} ÷ 8 = ${Math.floor(quotient / 8)} remainder ${remainder}`,
      );
      quotient = Math.floor(quotient / 8);
    }

    explanationContent.innerHTML = `
            <p class="explanation-step">${steps.join('</p><p class="explanation-step">')}</p>
            <p class="explanation-step">Read remainders from bottom to top: ${octal}</p>
        `;
  },

  setDecimal(value) {
    document.getElementById("decimalInput").value = value;
    this.convert();
  },

  swap() {
    const octalValue = document.getElementById("octalOutput").textContent;

    if (octalValue !== "Invalid") {
      // Redirect to octal-to-decimal page with the octal value
      window.location.href = `octal-to-decimal.html?value=${octalValue}`;
    }
  },
};

// Check for URL parameter on load
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get("value");

  if (value) {
    document.getElementById("decimalInput").value = value;
  }

  converter.init();
});
