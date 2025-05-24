document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");

  let current = "0";
  let prev = null;
  let operator = null;
  let waiting = false;

  function update() {
    display.textContent = current;
  }

  function clear() {
    current = "0";
    prev = null;
    operator = null;
    waiting = false;
    update();
  }

  function del() {
    current = current.length > 1 ? current.slice(0, -1) : "0";
    update();
  }

  function append(num) {
    if (waiting) {
      current = num;
      waiting = false;
    }else {
      current = current === "0" && num !== "." ? num : current + num;
    }
    update();
  }

  function setOp(op) {
    if (operator && !waiting) calculate();
    prev = current;
    operator = op;
    waiting = true;
  }

  function calculate() {
    if (!operator || waiting) return;

    const a = parseFloat(prev);
    const b = parseFloat(current);
    let result = 0;

    if (operator === "+") result = a + b;
    else if (operator === "-") result = a - b;
    else if (operator === "*") result = a * b;
    else if (operator === "/") {
      if (b === 0) {
        current = "Error";
        update();
        return;
      }
      result = a / b;
    } else if (operator === "%") {
      result = a % b;
    }

    current = result.toString();
    operator = null;
    update();
  }

  function handleKey(key) {
    if (/^[0-9]$/.test(key)) append(key);
    else if (key === ".") append(".");
    else if (["+", "-", "*", "/", "%"].includes(key)) setOp(key);
    else if (key === "=" || key === "Enter") calculate();
    else if (key === "Backspace") del();
    else if (key === "Escape") clear();
  }

  document.querySelectorAll(".btn").forEach(btn => {
    const val = btn.dataset.value;
    const act = btn.dataset.action;

    btn.onclick = () => {
      if (btn.classList.contains("number")) append(val);
      else if (btn.classList.contains("operator")) val === "=" ? calculate() : setOp(val);
      else if (btn.classList.contains("control")) {
        if (act === "clear") clear();
        else if (act === "delete") del();
      }
    };
  });

  document.addEventListener("keydown", (e) => {
    if (["+", "-", "*", "/", "%", ".", "Enter", "=", "Backspace", "Escape"].includes(e.key) || /^[0-9]$/.test(e.key)) {
      e.preventDefault();
      handleKey(e.key);
    }
  });

  update();
});
