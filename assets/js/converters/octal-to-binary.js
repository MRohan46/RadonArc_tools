// ========================================
// Octal to Binary Converter Logic
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
    const binaryOutput = document.getElementById("binaryOutput");
    const explanationBox = document.getElementById("explanationBox");
    const octalDigits = document.getElementById("octalDigits");

    let octal = octalInput.value.trim();

    if (octal === "") {
      binaryOutput.textContent = "0";
      this.updateExplanation("0", "0");
      this.updateVisualizer("0");
      return;
    }

    // Validate octal string
    const validOctal = /^[0-7]+$/.test(octal);

    if (!validOctal) {
      binaryOutput.textContent = "Invalid Octal";
      explanationBox.style.opacity = "0.5";
      return;
    }

    // Convert each octal digit to 3-bit binary
    let binaryParts = [];
    for (let i = 0; i < octal.length; i++) {
      const digit = octal[i];
      const decimal = parseInt(digit, 8);
      let binChunk = decimal.toString(2).padStart(3, "0");
      binaryParts.push(binChunk);
    }

    binaryOutput.textContent = binaryParts.join(" ");

    // Update explanation
    this.updateExplanation(octal, binaryParts);
    explanationBox.style.opacity = "1";

    // Update visualizer
    this.updateVisualizer(octal);
  },

  updateExplanation(octal, binaryParts) {
    const explanationContent = document.getElementById("explanationContent");

    if (octal.length === 1) {
      explanationContent.innerHTML = `
                <p class="explanation-step">Octal digit: ${octal}</p>
                <p class="explanation-step">${octal} in decimal = ${parseInt(octal, 8)}</p>
                <p class="explanation-step">3-bit binary = ${binaryParts[0]}</p>
            `;
      return;
    }

    // Build step-by-step explanation
    let steps = [];
    for (let i = 0; i < octal.length; i++) {
      const digit = octal[i];
      const binary = binaryParts[i];
      steps.push(`${digit} = ${binary}`);
    }

    explanationContent.innerHTML = `
            <p class="explanation-step">Convert each octal digit to 3-bit binary:</p>
            <p class="explanation-step">${steps.join(" | ")}</p>
            <p class="explanation-step">Combine: ${binaryParts.join(" ")}</p>
        `;
  },

  updateVisualizer(octal) {
    const octalDigits = document.getElementById("octalDigits");

    let html = '<div class="octal-row">';

    for (let i = 0; i < octal.length; i++) {
      const digit = octal[i];
      const decimal = parseInt(digit, 8);
      const binary = decimal.toString(2).padStart(3, "0");

      html += `
                <div class="octal-group">
                    <div class="octal-digit">${digit}</div>
                    <div class="octal-arrow">↓</div>
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

      if (i < octal.length - 1) {
        html += '<div class="octal-space"></div>';
      }
    }

    html += "</div>";
    octalDigits.innerHTML = html;
  },

  setOctal(value) {
    document.getElementById("octalInput").value = value;
    this.convert();
  },

  swap() {
    const binaryValue = document
      .getElementById("binaryOutput")
      .textContent.replace(/ /g, "");

    if (binaryValue !== "Invalid") {
      // Redirect to binary-to-octal page with the binary value
      window.location.href = `binary-to-octal.html?value=${binaryValue}`;
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
