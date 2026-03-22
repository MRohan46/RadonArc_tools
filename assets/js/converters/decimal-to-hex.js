// ========================================
// Decimal to Hex Converter Logic
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
    const hexOutput = document.getElementById("hexOutput");
    const explanationBox = document.getElementById("explanationBox");
    const colorPreview = document.getElementById("colorPreview");

    let decimal = decimalInput.value.trim();

    if (decimal === "" || decimal === "-") {
      hexOutput.textContent = "0";
      colorPreview.style.display = "none";
      this.updateExplanation("0", "0");
      return;
    }

    // Parse as integer
    const decimalNum = parseInt(decimal, 10);

    if (isNaN(decimalNum) || decimalNum < 0) {
      hexOutput.textContent = "Invalid";
      explanationBox.style.opacity = "0.5";
      colorPreview.style.display = "none";
      return;
    }

    // Convert to hex
    const hex = decimalNum.toString(16).toUpperCase();

    // Format with commas for thousands in decimal display
    decimalInput.value = decimalNum.toLocaleString();

    hexOutput.textContent = hex;

    // Update explanation
    this.updateExplanation(decimalNum, hex);
    explanationBox.style.opacity = "1";

    // Show color preview if hex is a valid color (6 digits or 3 digits)
    if (
      hex.length === 6 ||
      hex.length === 3 ||
      (hex.length === 2 && decimalNum <= 255)
    ) {
      let colorHex = hex;
      // Pad single bytes to 2 digits for RGB preview
      if (decimalNum <= 255 && hex.length <= 2) {
        colorHex = hex.padStart(2, "0");
        if (decimalNum <= 255) {
          // It's a single byte - show as grayscale
          this.showColorPreview(`#${colorHex}${colorHex}${colorHex}`);
        }
      } else if (hex.length === 3) {
        this.showColorPreview(`#${hex}`);
      } else if (hex.length === 6) {
        this.showColorPreview(`#${hex}`);
      } else {
        colorPreview.style.display = "none";
      }
    } else {
      colorPreview.style.display = "none";
    }
  },

  showColorPreview(hexColor) {
    const colorPreview = document.getElementById("colorPreview");
    const colorPreviewBox = document.getElementById("colorPreviewBox");

    colorPreviewBox.style.backgroundColor = hexColor;
    colorPreviewBox.style.border = "1px solid var(--border-subtle)";
    colorPreview.style.display = "block";

    // Add hex code as text
    colorPreviewBox.setAttribute("title", hexColor);
  },

  updateExplanation(decimal, hex) {
    const explanationContent = document.getElementById("explanationContent");

    if (decimal < 16) {
      explanationContent.innerHTML = `
                <p class="explanation-step">${decimal} is less than 16</p>
                <p class="explanation-step">Single digit: ${decimal} = ${hex}</p>
            `;
      return;
    }

    // Build step-by-step division explanation
    let steps = [];
    let remainders = [];
    let quotient = decimal;

    while (quotient > 0) {
      const remainder = quotient % 16;
      const remainderHex = remainder.toString(16).toUpperCase();
      remainders.unshift(remainderHex);

      steps.push(
        `${quotient} ÷ 16 = ${Math.floor(quotient / 16)} remainder ${remainder} (${remainderHex})`,
      );
      quotient = Math.floor(quotient / 16);
    }

    explanationContent.innerHTML = `
            <p class="explanation-step">${steps.join('</p><p class="explanation-step">')}</p>
            <p class="explanation-step">Read remainders from bottom to top: ${remainders.join("")}</p>
        `;
  },

  setDecimal(value) {
    document.getElementById("decimalInput").value = value;
    this.convert();
  },

  swap() {
    const hexValue = document.getElementById("hexOutput").textContent;

    if (hexValue !== "Invalid") {
      // Redirect to hex-to-decimal page with the hex value
      window.location.href = `hex-to-decimal.html?value=${hexValue}`;
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
