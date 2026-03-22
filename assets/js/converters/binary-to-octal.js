// ========================================
// Binary to Octal Converter Logic
// ========================================

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
    const octalOutput = document.getElementById("octalOutput");
    const explanationBox = document.getElementById("explanationBox");
    const binaryGrouping = document.getElementById("binaryGrouping");

    let binary = binaryInput.value.trim();

    if (binary === "") {
      octalOutput.textContent = "0";
      this.updateExplanation("0", "0");
      this.updateGrouping("0");
      return;
    }

    // Validate binary string
    const validBinary = /^[01]+$/.test(binary);

    if (!validBinary) {
      octalOutput.textContent = "Invalid Binary";
      explanationBox.style.opacity = "0.5";
      return;
    }

    // Pad binary to multiple of 3
    const paddedBinary = binary.padStart(Math.ceil(binary.length / 3) * 3, "0");

    // Group into 3-bit chunks and convert each to octal
    const groups = [];
    let octal = "";

    for (let i = 0; i < paddedBinary.length; i += 3) {
      const group = paddedBinary.substr(i, 3);
      groups.push(group);
      const decimal = parseInt(group, 2);
      octal += decimal.toString(8);
    }

    // Remove leading zeros from octal (but keep single zero)
    const cleanOctal = octal.replace(/^0+/, "") || "0";

    octalOutput.textContent = cleanOctal;

    // Update explanation
    this.updateExplanation(binary, groups, cleanOctal);
    explanationBox.style.opacity = "1";

    // Update grouping visualizer
    this.updateGrouping(binary, groups);
  },

  updateExplanation(binary, groups, octal) {
    const explanationContent = document.getElementById("explanationContent");

    if (binary.length <= 3) {
      const decimal = parseInt(binary.padStart(3, "0"), 2);
      explanationContent.innerHTML = `
                <p class="explanation-step">Binary: ${binary}</p>
                <p class="explanation-step">Pad to 3 bits: ${binary.padStart(3, "0")}</p>
                <p class="explanation-step">${binary.padStart(3, "0")} = ${decimal} in decimal</p>
                <p class="explanation-step">${decimal} in octal = ${octal}</p>
            `;
      return;
    }

    // Build step-by-step explanation with groups
    let steps = [];
    let groupValues = [];

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const decimal = parseInt(group, 2);
      const octalDigit = decimal.toString(8);
      steps.push(`${group} = ${octalDigit}`);
      groupValues.push(octalDigit);
    }

    explanationContent.innerHTML = `
            <p class="explanation-step">Group binary into 3-bit chunks (from left):</p>
            <p class="explanation-step">${steps.join(" | ")}</p>
            <p class="explanation-step">Combine octal digits: ${groupValues.join("")}</p>
        `;
  },

  updateGrouping(binary, groups) {
    const binaryGrouping = document.getElementById("binaryGrouping");

    if (!groups) {
      // Pad binary to multiple of 3
      const paddedBinary = binary.padStart(
        Math.ceil(binary.length / 3) * 3,
        "0",
      );
      groups = [];

      for (let i = 0; i < paddedBinary.length; i += 3) {
        groups.push(paddedBinary.substr(i, 3));
      }
    }

    let html = '<div class="grouping-row">';

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const decimal = parseInt(group, 2);
      const octalDigit = decimal.toString(8);

      html += `
                <div class="grouping-group">
                    <div class="grouping-bits">
                        ${group
                          .split("")
                          .map(
                            (bit) => `<span class="grouping-bit">${bit}</span>`,
                          )
                          .join("")}
                    </div>
                    <div class="grouping-arrow">↓</div>
                    <div class="grouping-octal">${octalDigit}</div>
                </div>
            `;

      if (i < groups.length - 1) {
        html += '<div class="grouping-plus">+</div>';
      }
    }

    html += "</div>";
    binaryGrouping.innerHTML = html;
  },

  setBinary(value) {
    document.getElementById("binaryInput").value = value;
    this.convert();
  },

  swap() {
    const octalValue = document.getElementById("octalOutput").textContent;

    if (octalValue !== "Invalid") {
      // Redirect to octal-to-binary page with the octal value
      window.location.href = `octal-to-binary.html?value=${octalValue}`;
    }
  },
};

// Check for URL parameter on load
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get("value");

  if (value) {
    document.getElementById("binaryInput").value = value;
  }

  converter.init();
});
