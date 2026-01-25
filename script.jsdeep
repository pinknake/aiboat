// Calculator State
const calculator = {
    currentValue: '0',
    previousValue: null,
    operation: null,
    memory: 0,
    calculationHistory: [],
    currentMode: 'basic'
};

// DOM Elements
const resultDisplay = document.getElementById('resultDisplay');
const calculationDisplay = document.getElementById('calculationDisplay');
const memoryIndicator = document.getElementById('memoryIndicator');
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Initialize Calculator
function initCalculator() {
    loadFromLocalStorage();
    updateDisplay();
    setupEventListeners();
    setupModeSwitching();
    calculateGST(); // Initial GST calculation
    calculateEMI(); // Initial EMI calculation
    calculateDiscount(); // Initial Discount calculation
    updateHistoryDisplay();
}

// Load from Local Storage
function loadFromLocalStorage() {
    const savedMemory = localStorage.getItem('calculatorMemory');
    const savedHistory = localStorage.getItem('calculationHistory');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedMemory) calculator.memory = parseFloat(savedMemory);
    if (savedHistory) calculator.calculationHistory = JSON.parse(savedHistory);
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    updateMemoryIndicator();
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('calculatorMemory', calculator.memory);
    localStorage.setItem('calculationHistory', JSON.stringify(calculator.calculationHistory));
}

// Update Display
function updateDisplay() {
    resultDisplay.textContent = formatNumber(calculator.currentValue);
    if (calculator.previousValue !== null && calculator.operation !== null) {
        calculationDisplay.textContent = `${formatNumber(calculator.previousValue)} ${getOperationSymbol(calculator.operation)}`;
    } else {
        calculationDisplay.textContent = '';
    }
}

// Format Number with Indian Number System
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    
    const number = parseFloat(num);
    if (isNaN(number)) return '0';
    
    // For very large numbers, use exponential notation
    if (Math.abs(number) > 1e12) {
        return number.toExponential(6);
    }
    
    // Format with Indian numbering system (lakhs, crores)
    if (Math.abs(number) >= 10000000) { // 1 crore
        const crores = number / 10000000;
        return `${crores.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Cr`;
    } else if (Math.abs(number) >= 100000) { // 1 lakh
        const lakhs = number / 100000;
        return `${lakhs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} L`;
    }
    
    // Regular formatting with commas
    return number.toLocaleString('en-IN', {
        maximumFractionDigits: 10,
        useGrouping: true
    });
}

// Get Operation Symbol
function getOperationSymbol(operation) {
    const symbols = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷',
        'percent': '%',
        'sqrt': '√',
        'square': 'x²'
    };
    return symbols[operation] || operation;
}

// Setup Event Listeners
function setupEventListeners() {
    // Number buttons
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
        });
    });
    
    // Operation buttons
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            handleAction(action);
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Copy script button
    document.getElementById('copyScript').addEventListener('click', copyCodeToClipboard);
    
    // Export history button
    document.getElementById('exportHistory').addEventListener('click', exportHistory);
    
    // Print button
    document.getElementById('printCalc').addEventListener('click', printCalculator);
    
    // Clear history button
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
}

// Handle Number Input
function appendNumber(number) {
    if (calculator.currentValue === '0' || calculator.currentValue === 'Error') {
        calculator.currentValue = number;
    } else {
        calculator.currentValue += number;
    }
    updateDisplay();
}

// Handle Actions
function handleAction(action) {
    switch(action) {
        case 'clear':
            clearCalculator();
            break;
        case 'backspace':
            backspace();
            break;
        case 'decimal':
            addDecimal();
            break;
        case 'equals':
            calculate();
            break;
        case 'percent':
            calculatePercentage();
            break;
        case 'sqrt':
            calculateSquareRoot();
            break;
        case 'square':
            calculateSquare();
            break;
        case 'mc':
            memoryClear();
            break;
        case 'mr':
            memoryRecall();
            break;
        case 'm+':
            memoryAdd();
            break;
        case 'm-':
            memorySubtract();
            break;
        default:
            // Basic operations: +, -, *, /
            if (['+', '-', '*', '/'].includes(action)) {
                setOperation(action);
            }
    }
}

// Basic Operations
function setOperation(op) {
    if (calculator.currentValue === 'Error') return;
    
    if (calculator.previousValue === null) {
        calculator.previousValue = calculator.currentValue;
        calculator.operation = op;
        calculator.currentValue = '0';
    } else {
        calculate();
        calculator.operation = op;
    }
    updateDisplay();
}

// Calculate Result
function calculate() {
    if (calculator.previousValue === null || calculator.operation === null) return;
    
    const prev = parseFloat(calculator.previousValue);
    const current = parseFloat(calculator.currentValue);
    
    if (isNaN(prev) || isNaN(current)) {
        calculator.currentValue = 'Error';
        calculator.previousValue = null;
        calculator.operation = null;
        updateDisplay();
        return;
    }
    
    let result;
    switch(calculator.operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                result = 'Error: Division by zero';
            } else {
                result = prev / current;
            }
            break;
        default:
            result = current;
    }
    
    // Add to history
    const historyEntry = {
        expression: `${prev} ${getOperationSymbol(calculator.operation)} ${current}`,
        result: result,
        timestamp: new Date().toLocaleString()
    };
    
    calculator.calculationHistory.unshift(historyEntry);
    if (calculator.calculationHistory.length > 50) {
        calculator.calculationHistory.pop();
    }
    
    calculator.currentValue = result.toString();
    calculator.previousValue = null;
    calculator.operation = null;
    
    updateDisplay();
    updateHistoryDisplay();
    saveToLocalStorage();
    showNotification('Calculation saved to history');
}

// Memory Functions
function memoryClear() {
    calculator.memory = 0;
    updateMemoryIndicator();
    saveToLocalStorage();
    showNotification('Memory cleared');
}

function memoryRecall() {
    if (calculator.memory !== 0) {
        calculator.currentValue = calculator.memory.toString();
        updateDisplay();
        showNotification('Memory recalled');
    }
}

function memoryAdd() {
    const current = parseFloat(calculator.currentValue);
    if (!isNaN(current)) {
        calculator.memory += current;
        updateMemoryIndicator();
        saveToLocalStorage();
        showNotification('Added to memory');
    }
}

function memorySubtract() {
    const current = parseFloat(calculator.currentValue);
    if (!isNaN(current)) {
        calculator.memory -= current;
        updateMemoryIndicator();
        saveToLocalStorage();
        showNotification('Subtracted from memory');
    }
}

function updateMemoryIndicator() {
    memoryIndicator.innerHTML = `<i class="fas fa-memory"></i> M: ${formatNumber(calculator.memory)}`;
}

// Other Calculator Functions
function clearCalculator() {
    calculator.currentValue = '0';
    calculator.previousValue = null;
    calculator.operation = null;
    updateDisplay();
}

function backspace() {
    if (calculator.currentValue.length > 1) {
        calculator.currentValue = calculator.currentValue.slice(0, -1);
    } else {
        calculator.currentValue = '0';
    }
    updateDisplay();
}

function addDecimal() {
    if (!calculator.currentValue.includes('.')) {
        calculator.currentValue += '.';
        updateDisplay();
    }
}

function calculatePercentage() {
    const current = parseFloat(calculator.currentValue);
    if (!isNaN(current)) {
        calculator.currentValue = (current / 100).toString();
        updateDisplay();
    }
}

function calculateSquareRoot() {
    const current = parseFloat(calculator.currentValue);
    if (current < 0) {
        calculator.currentValue = 'Error: Invalid input';
    } else if (!isNaN(current)) {
        calculator.currentValue = Math.sqrt(current).toString();
        updateDisplay();
    }
}

function calculateSquare() {
    const current = parseFloat(calculator.currentValue);
    if (!isNaN(current)) {
        calculator.currentValue = Math.pow(current, 2).toString();
        updateDisplay();
    }
}

// Keyboard Support
function handleKeyboardInput(e) {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        addDecimal();
    } else if (e.key === '+') {
        setOperation('+');
    } else if (e.key === '-') {
        setOperation('-');
    } else if (e.key === '*') {
        setOperation('*');
    } else if (e.key === '/') {
        e.preventDefault();
        setOperation('/');
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape' || e.key === 'Delete') {
        clearCalculator();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === '%') {
        calculatePercentage();
    }
}

// Mode Switching
function setupModeSwitching() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const calculators = document.querySelectorAll('.calculator');
    
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.getAttribute('data-mode');
            
            // Update active mode button
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding calculator
            calculators.forEach(calc => {
                calc.classList.remove('active');
                if (calc.id === `${mode}Calc`) {
                    calc.classList.add('active');
                }
            });
            
            calculator.currentMode = mode;
            showNotification(`Switched to ${mode} mode`);
        });
    });
    
    // GST Calculator buttons
    document.querySelectorAll('.rate-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.rate-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.getElementById('customRate').value = '';
            calculateGST();
        });
    });
    
    document.getElementById('customRate').addEventListener('input', calculateGST);
    document.getElementById('amount').addEventListener('input', calculateGST);
    document.getElementById('calculateGST').addEventListener('click', calculateGST);
    document.getElementById('resetGST').addEventListener('click', resetGST);
    
    // Finance Calculator
    document.querySelectorAll('.finance-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const financeType = tab.getAttribute('data-finance');
            
            document.querySelectorAll('.finance-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.finance-content').forEach(content => {
                content.classList.remove('active');
                if (content.id === `${financeType}Calc`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // EMI Calculator
    document.getElementById('loanAmount').addEventListener('input', calculateEMI);
    document.getElementById('interestRate').addEventListener('input', calculateEMI);
    document.getElementById('loanTenure').addEventListener('input', calculateEMI);
    document.getElementById('calculateEMI').addEventListener('click', calculateEMI);
    
    // Discount Calculator
    document.getElementById('originalPrice').addEventListener('input', calculateDiscount);
    document.getElementById('discountPercent').addEventListener('input', calculateDiscount);
    document.getElementById('calculateDiscount').addEventListener('click', calculateDiscount);
}

// GST Calculator Functions
function calculateGST() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    let gstRate;
    
    const activeRateBtn = document.querySelector('.rate-btn.active');
    if (activeRateBtn) {
        gstRate = parseFloat(activeRateBtn.getAttribute('data-rate'));
    } else {
        gstRate = parseFloat(document.getElementById('customRate').value) || 18;
    }
    
    if (amount <= 0 || gstRate < 0) {
        showNotification('Please enter valid values');
        return;
    }
    
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;
    const splitRate = gstRate / 2;
    
    document.getElementById('baseAmount').textContent = `₹${formatNumber(amount)}`;
    document.getElementById('gstAmount').textContent = `₹${formatNumber(gstAmount)}`;
    document.getElementById('totalAmount').textContent = `₹${formatNumber(totalAmount)}`;
    document.getElementById('cgstAmount').textContent = `₹${formatNumber(gstAmount / 2)} (${splitRate}%)`;
    document.getElementById('sgstAmount').textContent = `₹${formatNumber(gstAmount / 2)} (${splitRate}%)`;
}

function resetGST() {
    document.getElementById('amount').value = '1000';
    document.querySelectorAll('.rate-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-rate') === '18') {
            btn.classList.add('active');
        }
    });
    document.getElementById('customRate').value = '';
    calculateGST();
    showNotification('GST calculator reset');
}

// EMI Calculator Functions
function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const loanTenure = parseFloat(document.getElementById('loanTenure').value) || 0;
    
    if (loanAmount <= 0 || interestRate <= 0 || loanTenure <= 0) {
        showNotification('Please enter valid values');
        return;
    }
    
    const monthlyRate = interestRate / 12 / 100;
    const emi = loanAmount * monthlyRate * 
                Math.pow(1 + monthlyRate, loanTenure) / 
                (Math.pow(1 + monthlyRate, loanTenure) - 1);
    
    const totalPayment = emi * loanTenure;
    const totalInterest = totalPayment - loanAmount;
    
    document.getElementById('monthlyEMI').textContent = `₹${formatNumber(emi.toFixed(2))}`;
    document.getElementById('totalInterest').textContent = `₹${formatNumber(totalInterest.toFixed(2))}`;
    document.getElementById('totalPayment').textContent = `₹${formatNumber(totalPayment.toFixed(2))}`;
}

// Discount Calculator Functions
function calculateDiscount() {
    const originalPrice = parseFloat(document.getElementById('originalPrice').value) || 0;
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    
    if (originalPrice <= 0) {
        showNotification('Please enter valid price');
        return;
    }
    
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;
    
    document.getElementById('discountAmount').textContent = `₹${formatNumber(discountAmount.toFixed(2))}`;
    document.getElementById('finalPrice').textContent = `₹${formatNumber(finalPrice.toFixed(2))}`;
    document.getElementById('youSave').textContent = `₹${formatNumber(discountAmount.toFixed(2))}`;
}

// History Functions
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    if (calculator.calculationHistory.length === 0) {
        historyList.innerHTML = '<div class="history-item">No calculations yet</div>';
        return;
    }
    
    calculator.calculationHistory.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div>
                <div class="history-expression">${entry.expression}</div>
                <div class="history-time">${entry.timestamp}</div>
            </div>
            <div class="history-result">= ${formatNumber(entry.result)}</div>
        `;
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    if (calculator.calculationHistory.length === 0) {
        showNotification('History is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear all history?')) {
        calculator.calculationHistory = [];
        updateHistoryDisplay();
        saveToLocalStorage();
        showNotification('History cleared');
    }
}

function exportHistory() {
    if (calculator.calculationHistory.length === 0) {
        showNotification('No history to export');
        return;
    }
    
    let csvContent = "Date,Expression,Result\n";
    calculator.calculationHistory.forEach(entry => {
        csvContent += `${entry.timestamp},"${entry.expression}",${entry.result}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartcalc-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('History exported as CSV');
}

// Theme Functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showNotification(`Switched to ${newTheme} theme`);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Utility Functions
function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function copyCodeToClipboard() {
    const code = `
    // SmartCalc Pro - Complete Calculator Code
    // HTML, CSS, JavaScript - All in one file
    
    // This is a simplified version of the complete code
    // For full code, visit the GitHub repository
    
    // Features:
    // 1. Basic Calculator with memory functions
    // 2. GST Calculator (Indian taxes)
    // 3. EMI Calculator
    // 4. Discount Calculator
    // 5. Theme switching (light/dark)
    // 6. Calculation history
    // 7. Export functionality
    
    // No APIs required - Works offline!
    `;
    
    navigator.clipboard.writeText(code)
        .then(() => showNotification('Code copied to clipboard!'))
        .catch(err => showNotification('Failed to copy code'));
}

function printCalculator() {
    window.print();
    showNotification('Printing calculator...');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initCalculator);
