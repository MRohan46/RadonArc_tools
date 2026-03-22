// ========================================
// Hex to Octal Converter Logic
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
    const octalOutput = document.getElementById("octalOutput");
    const explanationBox = document.getElementById("explanationBox");
    const stepHex = document.getElementById("stepHex");
    const stepBinary = document.getElementById("stepBinary");
    const stepOctal = document.getElementById("stepOctal");

    let hex = hexInput.value.trim();

    // Remove any 0x prefix if present
    hex = hex.replace(/^0x/i, "");

    if (hex === "") {
      octalOutput.textContent = "0";
      this.updateVisualizer("0", "0", "0");
      this.updateExplanation("0", "0", "0");
      return;
    }

    // Validate hex string
    const validHex = /^[0-9A-Fa-f]+$/.test(hex);

    if (!validHex) {
      octalOutput.textContent = "Invalid Hex";
      explanationBox.style.opacity = "0.5";
      return;
    }

    // Convert to uppercase for display
    hex = hex.toUpperCase();
    hexInput.value = hex;

    // Step 1: Convert hex to decimal
    const decimal = parseInt(hex, 16);

    // Step 2: Convert decimal to octal
    const octal = decimal.toString(8);

    // Step 3: Convert hex to binary for visualization
    let binary = "";
    for (let i = 0; i < hex.length; i++) {
      const digit = hex[i];
      const dec = parseInt(digit, 16);
      binary += dec.toString(2).padStart(4, "0");
    }

    octalOutput.textContent = octal;

    // Update visualizer
    this.updateVisualizer(hex, binary, octal);

    // Update explanation
    this.updateExplanation(hex, binary, octal);
    explanationBox.style.opacity = "1";
  },

  updateVisualizer(hex, binary, octal) {
    const stepHex = document.getElementById("stepHex");
    const stepBinary = document.getElementById("stepBinary");
    const stepOctal = document.getElementById("stepOctal");

    stepHex.textContent = hex;
    stepBinary.textContent = binary;
    stepOctal.textContent = octal;

    // Format binary for display (group by 4 bits for hex, 3 bits for octal)
    const hexGroups = [];
    for (let i = 0; i < binary.length; i += 4) {
      hexGroups.push(binary.substr(i, 4));
    }

    // Pad binary for octal grouping if needed
    const binaryForOctal = binary.padStart(
      Math.ceil(binary.length / 3) * 3,
      "0",
    );
    const octalGroups = [];
    for (let i = 0; i < binaryForOctal.length; i += 3) {
      octalGroups.push(binaryForOctal.substr(i, 3));
    }

    // Add title attributes for hover info
    stepBinary.setAttribute(
      "title",
      `Hex groups: ${hexGroups.join(" ")} | Octal groups: ${octalGroups.join(" ")}`,
    );
  },

  updateExplanation(hex, binary, octal) {
    const explanationContent = document.getElementById("explanationContent");

    // Build hex to binary conversion
    const hexToBinary = [];
    for (let i = 0; i < hex.length; i++) {
      const digit = hex[i];
      const dec = parseInt(digit, 16);
      const bin = dec.toString(2).padStart(4, "0");
      hexToBinary.push(`${digit} → ${bin}`);
    }

    // Group binary for octal
    const binaryPadded = binary.padStart(Math.ceil(binary.length / 3) * 3, "0");
    const octalGroups = [];
    for (let i = 0; i < binaryPadded.length; i += 3) {
      const group = binaryPadded.substr(i, 3);
      const groupOctal = parseInt(group, 2).toString(8);
      octalGroups.push(`${group} → ${groupOctal}`);
    }

    explanationContent.innerHTML = `
            <p class="explanation-step"><strong>Step 1:</strong> Convert each hex digit to 4-bit binary</p>
            <p class="explanation-step">${hexToBinary.join(" | ")} = ${binary}</p>
            <p class="explanation-step"><strong>Step 2:</strong> Group binary into 3-bit chunks (pad left if needed)</p>
            <p class="explanation-step">${binary} → ${binaryPadded}</p>
            <p class="explanation-step"><strong>Step 3:</strong> Convert each 3-bit group to octal</p>
            <p class="explanation-step">${octalGroups.join(" | ")} = ${octal}</p>
        `;
  },

  setHex(value) {
    document.getElementById("hexInput").value = value;
    this.convert();
  },

  swap() {
    const octalValue = document.getElementById("octalOutput").textContent;

    if (octalValue !== "Invalid") {
      // Redirect to octal-to-hex page with the octal value
      window.location.href = `octal-to-hex.html?value=${octalValue}`;
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
