// Wait until the entire HTML page is loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  
  // Get the element where the result is displayed (the calculator screen)
  const display = document.getElementById("display");

  // Variables to store the current number, previous number, selected operator, and state
  let current = "0";        // The number currently being typed or displayed
  let operator = null;      // Stores the operator like +, -, *, /
  let prev = null;          // Stores the previous number entered before the operator
  let waitingForNext = false; // Tracks whether we are waiting for the next number after an operator

  // Update the display on screen
  function updateDisplay() {
    display.textContent = current;
  }

  // Clear everything and reset the calculator
  function clearAll() {
    current = "0";
    operator = null;
    prev = null;
    waitingForNext = false;
    updateDisplay();
  }

  // Remove the last digit from the current input
  function deleteLast() {
    current = current.length <= 1 ? "0" : current.slice(0, -1);
    updateDisplay();
  }

  // Append a digit or decimal point to the current number
  function appendNumber(num) {
    if (waitingForNext) {
      // If we're waiting for the next number, start fresh
      current = num;
      waitingForNext = false;
    } else {
      // If current is "0" and input is not a decimal, replace it; otherwise, add to it
      current = current === "0" && num !== "." ? num : current + num;
    }
    updateDisplay();
  }

  // When an operator (+, -, *, /, etc.) is pressed
  function setOperator(op) {
    if (operator && !waitingForNext) {
      // If there's already an operator, do the calculation first
      calculate();
    }

    prev = current;             // Store the current number as previous
    operator = op;              // Store the selected operator
    current = prev + " " + op;  // Show something like "12 +"
    waitingForNext = true;      // Wait for the next number
    updateDisplay();
  }

  // Perform the calculation when "=" is pressed
  function calculate() {
    if (!operator || waitingForNext) return; // Prevent accidental calculation

    const a = parseFloat(prev);     // Convert previous string to number
    const b = parseFloat(current);  // Convert current string to number
    let result;

    // Based on the operator, perform the math
    switch (operator) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/":
        if (b === 0) {
          current = "Can't divide by 0";
          operator = null;
          updateDisplay();
          return;
        }
        result = a / b;
        break;
      case "%": result = a % b; break;
      case "^": result = Math.pow(a, b); break;
    }

    current = result.toString();  // Convert result back to string to display
    operator = null;              // Clear the operator
    updateDisplay();              // Show the result
  }

  // Find the factorial of a number (used in "factorial" function button)
  function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return "Error";  // Only positive integers
    let res = BigInt(1);
    for (let i = BigInt(2); i <= BigInt(n); i++) res *= i;
    return res.toString();
  }

  // Apply extra functions like π, square, factorial, power
  function applyFunction(action) {
    const num = parseFloat(current);

    switch (action) {
      case "pi":
        current = Math.PI.toFixed(8); // Use 3.14159265
        break;
      case "square":
        current = (num * num).toString();
        break;
      case "power":
        prev = current;
        operator = "^";
        waitingForNext = true;
        return; // Don't update display yet
      case "factorial":
        current = factorial(num);
        break;
      default:
        console.warn("Unknown action:", action);
    }

    updateDisplay();
  }

  // Handle keyboard inputs (like from physical keyboard)
  function handleInput(input) {
    if (!isNaN(input)) return appendNumber(input); // Numbers
    if (input === ".") return appendNumber(".");   // Decimal
    if (["+", "-", "*", "/", "%", "^"].includes(input)) return setOperator(input); // Operators
    if (input === "=" || input === "Enter") return calculate(); // Equal or Enter
    if (input === "Backspace") return deleteLast(); // Delete key
    if (input === "Escape") return clearAll();      // Escape = Clear All
    console.warn("Unhandled input:", input);
  }

  // Set up click events for all calculator buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    const val = btn.dataset.value;       // Value shown on button (e.g., 1, 2, +, etc.)
    const action = btn.dataset.action;   // Special actions like clear, delete, square, etc.

    btn.addEventListener("click", () => {
      if (btn.classList.contains("number")) appendNumber(val); // Number buttons
      else if (btn.classList.contains("operator")) {
        if (val === "=") calculate();    // Equal button
        else setOperator(val);          // Any other operator
      } else if (btn.classList.contains("control")) {
        if (action === "clear") clearAll();     // AC button
        else if (action === "delete") deleteLast(); // DEL button
      } else if (btn.classList.contains("func")) {
        applyFunction(action);          // Function buttons like square, pi, etc.
      }
    });
  });

  // Enable keyboard support (e.g., typing numbers and operators)
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (/^[0-9]$/.test(key)) return appendNumber(key); // Numbers
    if (["+", "-", "*", "/", "%", ".", "^", "Enter", "=", "Backspace", "Escape"].includes(key)) {
      e.preventDefault(); // Stop default browser behavior
      handleInput(key);
    }
  });

  // Show "0" when calculator first loads
  updateDisplay();
});
