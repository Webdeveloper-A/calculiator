 // Calculator State
    let currentValue = '0';
    let previousValue = '';
    let operator = null;
    let shouldResetDisplay = false;
    let history = [];
    let isLightMode = false;
    
    // DOM Elements
    const currentDisplay = document.getElementById('current-display');
    const previousDisplay = document.getElementById('previous-display');
    const historyPanel = document.getElementById('history-panel');
    const historyList = document.getElementById('history-list');
    const historyToggleText = document.getElementById('history-toggle-text');
    const historyArrow = document.getElementById('history-arrow');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const toast = document.getElementById('toast');
    const appTitleElement = document.getElementById('app-title');
    
    // Default config
    const defaultConfig = {
      app_title: 'SimpleCalc',
      background_color: '#0A0A0A',
      text_color: '#FFFFFF',
      accent_color: '#FF9500',
      secondary_color: '#333333',
      success_color: '#34C759'
    };
    
    // Element SDK initialization
    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (config) => {
          const title = config.app_title || defaultConfig.app_title;
          appTitleElement.textContent = title;
          document.title = title + ' - Oddiy Kalkulyator';
        },
        mapToCapabilities: (config) => ({
          recolorables: [
            {
              get: () => config.background_color || defaultConfig.background_color,
              set: (value) => {
                config.background_color = value;
                window.elementSdk.setConfig({ background_color: value });
              }
            },
            {
              get: () => config.secondary_color || defaultConfig.secondary_color,
              set: (value) => {
                config.secondary_color = value;
                window.elementSdk.setConfig({ secondary_color: value });
              }
            },
            {
              get: () => config.text_color || defaultConfig.text_color,
              set: (value) => {
                config.text_color = value;
                window.elementSdk.setConfig({ text_color: value });
              }
            },
            {
              get: () => config.accent_color || defaultConfig.accent_color,
              set: (value) => {
                config.accent_color = value;
                window.elementSdk.setConfig({ accent_color: value });
              }
            },
            {
              get: () => config.success_color || defaultConfig.success_color,
              set: (value) => {
                config.success_color = value;
                window.elementSdk.setConfig({ success_color: value });
              }
            }
          ],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
          ['app_title', config.app_title || defaultConfig.app_title]
        ])
      });
    }
    
    // Update display
    function updateDisplay() {
      currentDisplay.textContent = formatNumber(currentValue);
      
      if (previousValue && operator) {
        previousDisplay.textContent = `${formatNumber(previousValue)} ${operator}`;
      } else {
        previousDisplay.textContent = '';
      }
    }
    
    // Format number for display
    function formatNumber(num) {
      if (num === 'Error' || num === 'Infinity' || num === '-Infinity') return 'Xato';
      
      const parts = num.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return parts.join('.');
    }
    
    // Handle number input
    function inputNumber(num) {
      if (shouldResetDisplay) {
        currentValue = num;
        shouldResetDisplay = false;
      } else {
        if (currentValue === '0' && num !== '.') {
          currentValue = num;
        } else if (currentValue.replace(/[^0-9]/g, '').length < 15) {
          currentValue += num;
        }
      }
      updateDisplay();
    }
    
    // Handle decimal input
    function inputDecimal() {
      if (shouldResetDisplay) {
        currentValue = '0.';
        shouldResetDisplay = false;
      } else if (!currentValue.includes('.')) {
        currentValue += '.';
      }
      updateDisplay();
    }
    
    // Handle operator input
    function inputOperator(op) {
      if (operator && previousValue && !shouldResetDisplay) {
        calculate();
      }
      
      previousValue = currentValue;
      operator = op;
      shouldResetDisplay = true;
      updateDisplay();
    }
    
    // Calculate result
    function calculate() {
      if (!operator || !previousValue) return;
      
      const prev = parseFloat(previousValue);
      const current = parseFloat(currentValue);
      let result;
      
      switch (operator) {
        case '+':
          result = prev + current;
          break;
        case '−':
          result = prev - current;
          break;
        case '×':
          result = prev * current;
          break;
        case '÷':
          if (current === 0) {
            result = 'Error';
          } else {
            result = prev / current;
          }
          break;
        default:
          return;
      }
      
      // Add to history
      const historyEntry = `${formatNumber(previousValue)} ${operator} ${formatNumber(currentValue)} = ${formatNumber(result.toString())}`;
      addToHistory(historyEntry);
      
      currentValue = result.toString();
      if (currentValue.includes('.') && currentValue.split('.')[1].length > 10) {
        currentValue = parseFloat(currentValue).toFixed(10).replace(/\.?0+$/, '');
      }
      
      previousValue = '';
      operator = null;
      shouldResetDisplay = true;
      updateDisplay();
    }
    
    // Clear calculator
    function clearCalculator() {
      currentValue = '0';
      previousValue = '';
      operator = null;
      shouldResetDisplay = false;
      updateDisplay();
    }
    
    // Backspace
    function backspace() {
      if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
      } else {
        currentValue = '0';
      }
      updateDisplay();
    }
    
    // Toggle sign
    function toggleSign() {
      if (currentValue !== '0') {
        if (currentValue.startsWith('-')) {
          currentValue = currentValue.slice(1);
        } else {
          currentValue = '-' + currentValue;
        }
      }
      updateDisplay();
    }
    
    // Calculate percent
    function calculatePercent() {
      currentValue = (parseFloat(currentValue) / 100).toString();
      updateDisplay();
    }
    
    // Calculate square root
    function calculateSqrt() {
      const num = parseFloat(currentValue);
      if (num < 0) {
        currentValue = 'Error';
      } else {
        currentValue = Math.sqrt(num).toString();
        if (currentValue.includes('.') && currentValue.split('.')[1].length > 10) {
          currentValue = parseFloat(currentValue).toFixed(10).replace(/\.?0+$/, '');
        }
      }
      shouldResetDisplay = true;
      updateDisplay();
    }
    
    // Copy to clipboard
    function copyToClipboard() {
      navigator.clipboard.writeText(currentValue).then(() => {
        showToast('Nusxalandi!');
      }).catch(() => {
        showToast('Nusxalab bo\'lmadi');
      });
    }
    
    // Show toast notification
    function showToast(message) {
      toast.textContent = message;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 2000);
    }
    
    // History functions
    function addToHistory(entry) {
      history.unshift(entry);
      if (history.length > 5) history.pop();
      renderHistory();
    }
    
    function renderHistory() {
      historyList.innerHTML = history.map(item => `
        <div class="history-item text-sm py-1 px-2 rounded cursor-pointer hover:opacity-80" style="background: var(--bg-secondary); color: var(--text-secondary);" onclick="useHistoryResult('${item}')">
          ${item}
        </div>
      `).join('');
    }
    
    function useHistoryResult(entry) {
      const result = entry.split('=')[1].trim().replace(/\s/g, '');
      currentValue = result;
      shouldResetDisplay = true;
      updateDisplay();
    }
    
    function clearHistory() {
      history = [];
      renderHistory();
    }
    
    function toggleHistory() {
      const isHidden = historyPanel.classList.contains('hidden');
      historyPanel.classList.toggle('hidden');
      historyToggleText.textContent = isHidden ? 'Tarixni yashirish' : 'Tarixni ko\'rsatish';
      historyArrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    
    // Theme toggle
    function toggleTheme() {
      isLightMode = !isLightMode;
      document.body.classList.toggle('light-mode', isLightMode);
      document.querySelector('.calculator-container').classList.toggle('light-mode', isLightMode);
      
      // Update theme icon
      const iconPath = isLightMode 
        ? 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
        : 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z';
      
      themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/>`;
    }
    
    // Button click handler
    function handleClick(e) {
      const button = e.target.closest('.calc-btn');
      if (!button) return;
      
      const action = button.dataset.action;
      
      switch (action) {
        case 'number':
          inputNumber(button.dataset.number);
          break;
        case 'decimal':
          inputDecimal();
          break;
        case 'operator':
          inputOperator(button.dataset.operator);
          break;
        case 'equals':
          calculate();
          break;
        case 'clear':
          clearCalculator();
          break;
        case 'backspace':
          backspace();
          break;
        case 'toggle-sign':
          toggleSign();
          break;
        case 'percent':
          calculatePercent();
          break;
        case 'sqrt':
          calculateSqrt();
          break;
        case 'copy':
          copyToClipboard();
          break;
      }
    }
    
    // Keyboard support
    function handleKeyboard(e) {
      const key = e.key;
      
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        inputNumber(key);
      } else if (key === '.') {
        e.preventDefault();
        inputDecimal();
      } else if (key === '+') {
        e.preventDefault();
        inputOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        inputOperator('−');
      } else if (key === '*') {
        e.preventDefault();
        inputOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        inputOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
      } else if (key === 'Escape') {
        e.preventDefault();
        clearCalculator();
      } else if (key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (key === '%') {
        e.preventDefault();
        calculatePercent();
      }
    }
    
    // Event listeners
    document.querySelector('.calculator-container').addEventListener('click', handleClick);
    document.getElementById('toggle-history').addEventListener('click', toggleHistory);
    document.getElementById('clear-history').addEventListener('click', clearHistory);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.addEventListener('keydown', handleKeyboard);
    
    // Initialize display
    updateDisplay();