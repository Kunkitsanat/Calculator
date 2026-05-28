const body = document.body;
const div = document.createElement('div');
div.id = 'screen';

body.appendChild(div);

// display and buttons
const display = document.createElement('div');
const buttons = document.createElement('div');
display.id = 'display';
buttons.id = 'buttons';

display.textContent = '0';

div.appendChild(display);
div.appendChild(buttons);


const btnValues = [
    'AC', '+/-', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
];

btnValues.forEach(value => {
    const button = document.createElement('button');
    button.textContent = value;
    button.value = value;
    
    if (['÷', '×', '-', '+', '='].includes(value)) {
        button.classList.add('operator');
    } else if (['AC', '+/-', '%'].includes(value)) {
        button.classList.add('function');
    } else {
        button.classList.add('number');
    }
    
   
    if (value === '0') {
        button.classList.add('zero');
    }
    
    buttons.appendChild(button);
});

// Object Calculator
const Calculator = {
    displayValue: '0',
    firstOperand: null,
    operator: null,
    waitforSecondOperand: false,

    // function
    inputDigit(digit){
        if (this.waitforSecondOperand === true) {
            this.displayValue = digit;
            this.waitforSecondOperand = false; 
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
    },

    inputDecimal(){
        if(this.waitforSecondOperand === true){
            this.displayValue = '0.';
            this.waitforSecondOperand = false;
            return ;
        }
        
        if(!this.displayValue.includes('.')){
            this.displayValue += '.';
        }
    },

    handleOperator(operator){
        const inputValue = parseFloat(this.displayValue);

        if(this.firstOperand === null){
            this.firstOperand = inputValue;
        }
        else if(this.operator){
            const result = this.calculate(this.firstOperand,inputValue,this.operator);
            this.displayValue = String(result);
            this.firstOperand = result;
        }
        
        this.operator = operator;
        this.waitforSecondOperand = true;
    },

    calculate(firstOperand,secondOperand,operator){
        switch(operator){
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                return secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    },

    equal(){
        if (this.operator === null || this.waitforSecondOperand) {
            return;
        } 
        const inputValue = parseFloat(this.displayValue);
        const result = this.calculate(this.firstOperand, inputValue, this.operator);

        this.displayValue = String(result);
        this.firstOperand = null;
        this.operator = null;
        this.waitforSecondOperand = false;
        },

    clear(){
        this.displayValue = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitforSecondOperand = false;
    }
}

// buttons function
const btns = document.getElementById('buttons');

btns.addEventListener('click', (e) => {
    if (!e.target.matches('button')) return;

    const key = e.target; // button
    const keyValue = key.value; // button value eg. '+' , '67'

    if (key.classList.contains('operator')) {
        Calculator.handleOperator(keyValue);
    } else if (keyValue === '=') {
        Calculator.equals();
    } else if (keyValue === 'AC') {
        Calculator.clear();
    } else if (keyValue === '.') {
        Calculator.inputDecimal();
    } else {
        Calculator.inputDigit(keyValue);
    }

    updateDisplay();
})

// Update Display
function updateDisplay(){
    const displayElement = document.getElementById('display');
    displayElement.textContent = Calculator.displayValue;
}

// Keyboard function
window.addEventListener('keydown',(e) =>{
    const keyMap = {
        'Enter': '=',
        'Backspace': 'AC',
        '*': 'x',
        '/': '÷'
    }

    const keyValue = keyMap[e.key] ?? e.key;

    const actions = {
        '+': () => Calculator.handleOperator(keyValue),
        '-': () => Calculator.handleOperator(keyValue),
        '×': () => Calculator.handleOperator(keyValue),
        '÷': () => Calculator.handleOperator(keyValue),
        '=': () => Calculator.equal(),
        'AC': () => Calculator.clear()
    };

    if (actions[keyValue]) {
        // + - x ÷
        actions[keyValue]();
    } else if (keyValue >= '0' && keyValue <= '9') {
        // 0 - 9
        Calculator.inputDigit(keyValue);
    } else {
        return; 
    }

    updateDisplay();
})