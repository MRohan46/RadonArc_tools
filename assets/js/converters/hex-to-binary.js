// ========================================
// Hex to Binary Converter Logic
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
    const binaryOutput = document.getElementById("binaryOutput");
    const explanationBox = document.getElementById("explanationBox");
    const hexDigits = document.getElementById("hexDigits");

    let hex = hexInput.value.trim();

    // Remove any 0x prefix if present
    hex = hex.replace(/^0x/i, "");

    if (hex === "") {
      binaryOutput.textContent = "0";
      this.updateExplanation("0", "0");
      this.updateVisualizer("0");
      return;
    }

    // Validate hex string
    const validHex = /^[0-9A-Fa-f]+$/.test(hex);

    if (!validHex) {
      binaryOutput.textContent = "Invalid Hex";
      explanationBox.style.opacity = "0.5";
      return;
    }

    // Convert to uppercase for display
    hex = hex.toUpperCase();
    hexInput.value = hex;

    // Convert each hex digit to 4-bit binary
    let binary = "";
    for (let i = 0; i < hex.length; i++) {
      const digit = hex[i];
      const decimal = parseInt(digit, 16);
      let binChunk = decimal.toString(2).padStart(4, "0");
      binary += binChunk + " ";
    }

    binaryOutput.textContent = binary.trim();

    // Update explanation
    this.updateExplanation(hex, binary.trim().replace(/ /g, ""));
    explanationBox.style.opacity = "1";

    // Update visualizer
    this.updateVisualizer(hex);
  },

  updateExplanation(hex, binary) {
    const explanationContent = document.getElementById("explanationContent");

    if (hex.length === 1) {
      const decimal = parseInt(hex, 16);
      explanationContent.innerHTML = `
                <p class="explanation-step">Hex digit: ${hex}</p>
                <p class="explanation-step">${hex} in decimal = ${decimal}</p>
                <p class="explanation-step">${decimal} in binary = ${binary}</p>
            `;
      return;
    }

    // Build step-by-step explanation
    let steps = [];
    let binaryChunks = [];

    for (let i = 0; i < hex.length; i++) {
      const digit = hex[i];
      const decimal = parseInt(digit, 16);
      const binChunk = decimal.toString(2).padStart(4, "0");
      steps.push(`${digit} = ${binChunk}`);
      binaryChunks.push(binChunk);
    }

    explanationContent.innerHTML = `
            <p class="explanation-step">Convert each hex digit to 4-bit binary:</p>
            <p class="explanation-step">${steps.join(" | ")}</p>
            <p class="explanation-step">Combine: ${binaryChunks.join(" ")}</p>
        `;
  },

  updateVisualizer(hex) {
    const hexDigits = document.getElementById("hexDigits");

    let html = '<div class="hex-row">';

    for (let i = 0; i < hex.length; i++) {
      const digit = hex[i];
      const decimal = parseInt(digit, 16);
      const binary = decimal.toString(2).padStart(4, "0");

      html += `
                <div class="hex-group">
                    <div class="hex-digit">${digit}</div>
                    <div class="hex-arrow">↓</div>
                    <div class="binary-bits">
                        ${binary
                          .split("")
                          .map(
                            (bit) => `<span class="binary-bit">${bit}</span>`,
                          )
                          .join("")}
                    </div>
                </div>
            `;

      if (i < hex.length - 1) {
        html += '<div class="hex-space"></div>';
      }
    }

    html += "</div>";
    hexDigits.innerHTML = html;
  },

  setHex(value) {
    document.getElementById("hexInput").value = value;
    this.convert();
  },

  swap() {
    const binaryValue = document
      .getElementById("binaryOutput")
      .textContent.replace(/ /g, "");

    if (binaryValue !== "Invalid") {
      // Redirect to binary-to-hex page with the binary value
      window.location.href = `binary-to-hex.html?value=${binaryValue}`;
    }
  },
};

// Check for URL parameter on load
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get("value");

  if (value) {
    document.getElementById("hexInput").value = value;
  }

  converter.init();
});
