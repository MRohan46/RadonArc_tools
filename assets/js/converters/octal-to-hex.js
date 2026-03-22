// ========================================
// Octal to Hex Converter Logic
// ========================================

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
    const hexOutput = document.getElementById("hexOutput");
    const explanationBox = document.getElementById("explanationBox");
    const stepOctal = document.getElementById("stepOctal");
    const stepBinary = document.getElementById("stepBinary");
    const stepHex = document.getElementById("stepHex");

    let octal = octalInput.value.trim();

    if (octal === "") {
      hexOutput.textContent = "0";
      this.updateVisualizer("0", "0", "0");
      this.updateExplanation("0", "0", "0");
      return;
    }

    // Validate octal string
    const validOctal = /^[0-7]+$/.test(octal);

    if (!validOctal) {
      hexOutput.textContent = "Invalid";
      explanationBox.style.opacity = "0.5";
      return;
    }

    // Step 1: Convert octal to decimal
    const decimal = parseInt(octal, 8);

    // Step 2: Convert decimal to hex
    const hex = decimal.toString(16).toUpperCase();

    // Step 3: Convert octal to binary for visualization
    let binary = "";
    for (let i = 0; i < octal.length; i++) {
      const digit = octal[i];
      const dec = parseInt(digit, 8);
      binary += dec.toString(2).padStart(3, "0");
    }

    hexOutput.textContent = hex;

    // Update visualizer
    this.updateVisualizer(octal, binary, hex);

    // Update explanation
    this.updateExplanation(octal, binary, hex);
    explanationBox.style.opacity = "1";
  },

  updateVisualizer(octal, binary, hex) {
    const stepOctal = document.getElementById("stepOctal");
    const stepBinary = document.getElementById("stepBinary");
    const stepHex = document.getElementById("stepHex");

    stepOctal.textContent = octal;
    stepBinary.textContent = binary;
    stepHex.textContent = hex;

    // Format binary for display (group by 3 bits for octal)
    const binaryGroups = [];
    for (let i = 0; i < binary.length; i += 3) {
      binaryGroups.push(binary.substr(i, 3));
    }

    // Format binary for display (group by 4 bits for hex)
    const binaryPadded = binary.padStart(Math.ceil(binary.length / 4) * 4, "0");
    const hexGroups = [];
    for (let i = 0; i < binaryPadded.length; i += 4) {
      hexGroups.push(binaryPadded.substr(i, 4));
    }

    // Add title attributes for hover info
    stepBinary.setAttribute(
      "title",
      `Octal groups: ${binaryGroups.join(" ")} | Hex groups: ${hexGroups.join(" ")}`,
    );
  },

  updateExplanation(octal, binary, hex) {
    const explanationContent = document.getElementById("explanationContent");

    // Build step-by-step explanation
    const octalToBinary = [];
    for (let i = 0; i < octal.length; i++) {
      const digit = octal[i];
      const dec = parseInt(digit, 8);
      const bin = dec.toString(2).padStart(3, "0");
      octalToBinary.push(`${digit} → ${bin}`);
    }

    // Group binary for hex
    const binaryPadded = binary.padStart(Math.ceil(binary.length / 4) * 4, "0");
    const hexGroups = [];
    for (let i = 0; i < binaryPadded.length; i += 4) {
      const group = binaryPadded.substr(i, 4);
      const groupHex = parseInt(group, 2).toString(16).toUpperCase();
      hexGroups.push(`${group} → ${groupHex}`);
    }

    explanationContent.innerHTML = `
            <p class="explanation-step"><strong>Step 1:</strong> Convert each octal digit to 3-bit binary</p>
            <p class="explanation-step">${octalToBinary.join(" | ")} = ${binary}</p>
            <p class="explanation-step"><strong>Step 2:</strong> Group binary into 4-bit chunks (pad left if needed)</p>
            <p class="explanation-step">${binary} → ${binaryPadded}</p>
            <p class="explanation-step"><strong>Step 3:</strong> Convert each 4-bit group to hex</p>
            <p class="explanation-step">${hexGroups.join(" | ")} = ${hex}</p>
        `;
  },

  setOctal(value) {
    document.getElementById("octalInput").value = value;
    this.convert();
  },

  swap() {
    const hexValue = document.getElementById("hexOutput").textContent;

    if (hexValue !== "Invalid") {
      // Redirect to hex-to-octal page with the hex value
      window.location.href = `hex-to-octal.html?value=${hexValue}`;
    }
  },
};

// Check for URL parameter on load
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get("value");

  if (value) {
    document.getElementById("octalInput").value = value;
  }

  converter.init();
});
