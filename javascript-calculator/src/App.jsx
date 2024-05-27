import { useState } from 'react';
import './App.css';


let result = null;

function App() {
    
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');

    const operate = (a, b, operator) => {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '×':
                return a * b;
            case '÷':
                if (b === 0) {
                    throw new Error("division by zero");
                }
                return a / b;
            default:
                throw new Error("WTF");
        }
    }
    
    const handleClickedInput = (e) => {

        const operators = ['÷', '×', '-', '+'];
        const operatorRegex = /(\d+(\.\d+)?|[+−÷×])/g;
        const value = e.target.value;
        
        const isInputOperator = operators.includes(value) ? true : false;
        const isInputDecimal = value === '.' ? true: false;
        const isInputZero = value === '0'? true: false;

        if (!isInputOperator) {
            
            setDisplay(prevDisplay => {

                const hasDecimal = prevDisplay.includes('.') ? true: false;
                const isPrevDisplayOperator = operators.includes(prevDisplay)? true: false;

                // is result null or not
                if (result !== null) {
                    return value;
                }
                
                // handle 0
                if (prevDisplay === '0' && isInputZero) {
                    return value;
                } else if (prevDisplay === '0' && !isInputZero && !isInputDecimal) {
                    return value;
                } else if (operators.includes(prevDisplay) && !isPrevDisplayOperator) {     
                    return value;
                } 

                // handle decimal
                if (isInputDecimal) {
                    if (isPrevDisplayOperator) {
                        return '0.';
                    } else {
                        if (hasDecimal) {
                            return prevDisplay;
                        } else {
                            return prevDisplay.concat(value);
                        }
                    }

                } else {
                    if (isPrevDisplayOperator) {
                        return value;
                    }
                }

                return prevDisplay.concat(value);

            });

            setExpression(prevExpression => {
                
                const lastChar = prevExpression[prevExpression.length - 1];
                const isLastCharOperator = operators.includes(lastChar)? true: false;

                if (result !== null) {
                    return value;
                }

                // handle empty string and 0
                // if current expression is an empty string or zero
                if (prevExpression === '' || prevExpression === '0') {
                    // if current input value is a decimal point, return "0.". 
                    // If not, just replace it with the current input value 
                    if (isInputDecimal) {
                        return ('0.');
                    } else {
                        return value;
                    }
                }

                // else: current expression is neither empty nor zero
                // check first if the input value is a decimal point
                if (!isInputDecimal) {
                    // if the input value is not a decimal point - that is
                    // the input value is a regular integr, then just concatenate it to the current expression
                    return prevExpression.concat(value);
                } else {
                    // the input value is a decimal point, check if the last number entered already has a decimal point
                    const matchedArr = prevExpression.match(operatorRegex);
                    const lastNumber = matchedArr[matchedArr.length - 1];
                    if (lastNumber.includes('.')) {
                        return prevExpression;
                    }
                    // if the current expression's last character is already a decimal point, return current expression
                    if (isLastCharOperator) {
                        return prevExpression.concat('0.');
                    } else {

                        if (lastChar === '.') {
                            return prevExpression;
                        } else {
                            // if the last character is not a decimal point, check the last series of characters only contain one decimal point
                            prevExpression.concat('value');
                            // console.log("The last number:", prevExpression.match(operatorRegex));
                        }

                    }

                }

                
                return prevExpression.concat(value);
            })

        } else {
            setDisplay(prevDisplay => {
                const lastChar = prevDisplay[prevDisplay.length - 1];

                if (!operators.includes(lastChar)) {
                    return value;
                } 

                return value;
            })

            setExpression(prevExpression => {
                
                const lastChar = prevExpression[prevExpression.length - 1];

                // if there is no operator at the end of the current expression, concat the clicked operator
                // if there is already an operator at the end of the current expression, and if the clicked operator is the same as the existing operator, don't change anything
                if (!operators.includes(lastChar) && lastChar !== '.') {
                    return prevExpression.concat(value);
                } else if (lastChar === value) {
                    return prevExpression;
                } else if (lastChar === '.') {
                    return prevExpression.concat(`0${value}`);
                }

            })
        }

    }
    
    // when users click 'equals', calculate and display results
    const handleCalculation = () => {

        const operators = ['÷', '×', '-', '+'];
        
        setExpression(prevExpression => {
            console.log(`current expression is ${prevExpression}`);
            // dissect current expression into several expressions
            const operatorRegex = /(\d+(\.\d+)?|[+-÷×])/g;
            const expressionArr = prevExpression.match(operatorRegex);
            console.log("expression array after tokenization: ", expressionArr);
            const hasOperatorAtEnd = operators.includes(expressionArr[expressionArr.length - 1]) ? true: false;
            
            // if the last element of expressionArr is an operator, remove it
            if (hasOperatorAtEnd) expressionArr.pop();

            // convert number strings to numbers 
            const numbers = expressionArr.map(element => isNaN(element) ? element: parseFloat(element));

            result = numbers[0];
            let currentOperator = null;

            for (let i = 1; i < numbers.length; i++) {
                const element = numbers[i];

                if (typeof element === 'string') {
                    currentOperator = element;
                } else {
                    result = operate(result, element, currentOperator);
                }
            }

            return prevExpression.concat(`= ${result}`);
        });
        
        setDisplay(prevDisplay => {
            if (result !== null) {
                prevDisplay = result;
            }
            return prevDisplay;
        });
    }

    const clear = () => {
        setDisplay('0');
        setExpression('');
        result = null;
    }

    return (
        <>
        <header>
            <h1>Calculator</h1>
        </header>
        <main>
            <div id='calculator-container'>
                <div id='display-container'>
                    <div id='expression'>
                        {expression}
                    </div>
                    <div id='display'>
                        {display}
                    </div>
                </div>

                <div id='buttons-container'>
                    <div className='button-wrapper'>
                        <button id='clear' className='function' onClick={clear}>AC</button>
                        <button id='minus-or-plus' className='function'>&#177;</button>
                        <button id='percent' className='function'>&#37;</button>
                        <button id='divide' className='operator' value='÷' onClick={handleClickedInput}>÷</button>
                    </div>
                    <div className='button-wrapper'>
                        <button id='seven' className='number-btn' value='7' onClick={handleClickedInput}>7</button>
                        <button id='eight' className='number-btn' value='8' onClick={handleClickedInput}>8</button>
                        <button id='nine' className='number-btn' value='9' onClick={handleClickedInput}>9</button>
                        <button id='multiply' className='operator' value='×' onClick={handleClickedInput}>×</button>
                    </div>
                    <div className='button-wrapper'>
                        <button id='four' className='number-btn' value='4' onClick={handleClickedInput}>4</button>
                        <button id='five' className='number-btn' value='5' onClick={handleClickedInput}>5</button>
                        <button id='six' className='number-btn' value='6' onClick={handleClickedInput}>6</button>
                        <button id='subtract' className='operator' value='-' onClick={handleClickedInput}>-</button>
                    </div>
                    <div className='button-wrapper'>
                        <button id='one' className='number-btn' value='1' onClick={handleClickedInput}>1</button>
                        <button id='two' className='number-btn' value='2' onClick={handleClickedInput}>2</button>
                        <button id='three' className='number-btn' value='3' onClick={handleClickedInput}>3</button>
                        <button id='add' className='operator' value='+' onClick={handleClickedInput}>+</button>
                    </div>
                    <div className='button-wrapper'>
                        <button id='zero' className='number-btn' value='0' onClick={handleClickedInput}>0</button>            
                        <button id='decimal' className='number-btn' value='.' onClick={handleClickedInput}>.</button>
                        <button id='equals' className='operator' onClick={handleCalculation}>&#61;</button>
                    </div>


                </div>
            </div>
            <footer>
                <p>Inspired by Apple Design</p>
                <p>&copy; {new Date().getFullYear()} <span id='author'>Katereverie</span></p>
            </footer>
        </main>
        </>
    )
}

export default App
