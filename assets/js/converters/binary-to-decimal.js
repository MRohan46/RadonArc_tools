const converter = {
  init() {
    this.setupEventListeners();
    this.convert(); // Initial conversion
  },

  setupEventListeners() {
    const binaryInput = document.getElementById("binaryInput");

    binaryInput.addEventListener("input", () => this.convert());
    binaryInput.addEventListener("keyup", () => this.convert());

    // Validate input as user types
    binaryInput.addEventListener("keypress", (e) => {
      const char = e.key;
      const validChars = "01";

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
    binaryInput.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteText = (e.clipboardData || window.clipboardData).getData(
        "text",
      );
      const cleaned = pasteText.replace(/[^01]/g, "");

      const start = binaryInput.selectionStart;
      const end = binaryInput.selectionEnd;
      const currentValue = binaryInput.value;
      const newValue =
        currentValue.substring(0, start) +
        cleaned +
        currentValue.substring(end);

      binaryInput.value = newValue;
      this.convert();
    });
  },

  convert() {
    const binaryInput = document.getElementById("binaryInput");
    const decimalOutput = document.getElementById("decimalOutput");
    const explanationBox = document.getElementById("explanationBox");

    let binary = binaryInput.value.trim();

    if (binary === "") {
      decimalOutput.textContent = "0";
      this.updateExplanation("0", 0);
      return;
    }

    // Validate binary string
    const validBinary = /^[01]+$/.test(binary);

    if (!validBinary) {
      decimalOutput.textContent = "Invalid Binary";
      explanationBox.style.opacity = "0.5";
      return;
    }

    // Convert to decimal
    const decimal = parseInt(binary, 2);

    // Format decimal with commas for thousands
    decimalOutput.textContent = decimal.toLocaleString();

    // Update explanation
    this.updateExplanation(binary, decimal);
    explanationBox.style.opacity = "1";
  },

  updateExplanation(binary, decimal) {
    const explanationContent = document.getElementById("explanationContent");

    if (binary.length === 1) {
      explanationContent.innerHTML = `
                <p class="explanation-step">${binary} = ${decimal}</p>
            `;
      return;
    }

    // Build step-by-step explanation
    let steps = [];
    let total = 0;

    for (let i = 0; i < binary.length; i++) {
      const digit = binary[i];
      const position = binary.length - 1 - i;
      const power = Math.pow(2, position);
      const contribution = parseInt(digit) * power;

      if (digit === "1") {
        steps.push(`2<sup>${position}</sup> = ${power}`);
        total += contribution;
      }
    }

    if (steps.length === 0) {
      explanationContent.innerHTML = `
                <p class="explanation-step">All digits are 0, so result is 0</p>
            `;
    } else {
      explanationContent.innerHTML = `
                <p class="explanation-step">${binary} = ${steps.join(" + ")}</p>
                <p class="explanation-step">= ${total.toLocaleString()}</p>
            `;
    }
  },

  setBinary(value) {
    document.getElementById("binaryInput").value = value;
    this.convert();
  },

  swap() {
    const binaryValue = document.getElementById("binaryInput").value;
    const decimalValue = document
      .getElementById("decimalOutput")
      .textContent.replace(/,/g, "");

    if (decimalValue !== "Invalid Binary") {
      // Redirect to decimal-to-binary page with the decimal value
      window.location.href = `decimal-to-binary.html?value=${decimalValue}`;
    }
  },
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  converter.init();
});
