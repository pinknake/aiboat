(() => {
  const displayEl = document.getElementById('display');
  const buttons = Array.from(document.querySelectorAll('.btn'));

  let expr = '';

  function updateDisplay() {
    displayEl.textContent = expr === '' ? '0' : expr;
  }

  function appendValue(value) {
    // Prevent multiple leading zeros like "00"
    if (expr === '0' && value === '0') return;
    // Prevent starting with operator (except minus or left parenthesis)
    if (expr === '' && /[+\/*]/.test(value)) return;
    expr += value;
    updateDisplay();
  }

  function clearAll() {
    expr = '';
    updateDisplay();
  }

  function backspace() {
    if (expr.length > 0) expr = expr.slice(0, -1);
    updateDisplay();
  }

  function safeEvaluate(e) {
    if (!e) return;
    // Replace visual operator symbols with JS operators
    let sanitized = e.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

    // Allow only digits, operators, parentheses, decimal point and spaces
    if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
      return 'Error';
    }

    // Prevent sequences of operators that would be invalid (like "++" or "/-*" etc.)
    // A simple evaluation guard: no two operators in a row except for a minus after another operator or open paren
    if (/[+\/*.]{2,}/.test(sanitized)) {
      return 'Error';
    }

    try {
      // Use Function to evaluate in local scope
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (result === Infinity || result === -Infinity || Number.isNaN(result)) return 'Error';
      // Shorten long floats
      if (typeof result === 'number') {
        const approx = Math.round((result + Number.EPSILON) * 1e12) / 1e12;
        return String(approx);
      }
      return String(result);
    } catch (err) {
      return 'Error';
    }
  }

  function evaluate() {
    const out = safeEvaluate(expr);
    expr = out === 'Error' ? '' : out;
    displayEl.textContent = out;
  }

  // Button clicks
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');
      const action = btn.getAttribute('data-action');

      if (action === 'clear') {
        clearAll();
        return;
      }
      if (action === 'back') {
        backspace();
        return;
      }
      if (action === 'equals') {
        evaluate();
        return;
      }
      if (val) {
        appendValue(val);
      }
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (ev) => {
    const key = ev.key;
    // Numerals and dot
    if ((/^[0-9]$/.test(key)) || key === '.') {
      appendValue(key);
      ev.preventDefault();
      return;
    }

    // Operators: + - * / ( )
    if (['+', '-', '*', '/', '(', ')'].includes(key)) {
      appendValue(key);
      ev.preventDefault();
      return;
    }

    if (key === 'Enter' || key === '=') {
      evaluate();
      ev.preventDefault();
      return;
    }

    if (key === 'Backspace') {
      backspace();
      ev.preventDefault();
      return;
    }

    if (key === 'Escape' || key.toLowerCase() === 'c') {
      clearAll();
      ev.preventDefault();
      return;
    }
  });

  // Initialize
  updateDisplay();
})();
