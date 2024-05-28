import { useState } from 'react';
import './App.css';


let result = null;

function App() {
    
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');

    const operators = ['÷', '×', '-', '+'];
    const numberRegex = /(\d+(\.\d+)?)/g;
    const operatorRegex = /(\d+(\.\d+)?|[+-÷×])/g;

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
                throw new Error("something is off");
        }
    }
    
    const handleClickedInput = (e) => {

        const value = e.target.value;

        // since the programmers do not know if the users input a digit or a decimal point,
        // it is necessary for the programmers to check it.
        const isValueOperator = operators.includes(value) ? true : false;
        const isValueDecimal = value === '.' ? true: false;
        const isValueZero = value === '0'? true: false;
        

        // if operators are clicked, preserve result for expression; replace result with input value
        // if a number input (including decimal) is clicked, clear result for both display and expression

        if (!isValueOperator) {
            // input value is not an operator (but a digit [0-9] or a decimal point ".")
            isValueDecimal? 
            (
                setDisplay(prevDisplay => {
                    const hasDecimal = prevDisplay.includes('.') ? true: false;
                    const isPrevDisplayOperator = operators.includes(prevDisplay)? true: false;
                    
                    if (isPrevDisplayOperator) {
                        return `0.`;
                    } else if (hasDecimal) {
                        return prevDisplay;
                    } else {
                        return prevDisplay.concat('.');
                    }
                }),
                setExpression(prevExpression => {

                    if (prevExpression === '' || prevExpression === "0") return '0.';

                    const numberToken = prevExpression.match(numberRegex);
                    const lastNumber = numberToken[numberToken.length - 1];
                    const hasDecimalNumber = numberToken.some(num => num.includes('.'));
                    const isLastNumberDecimalNumber = lastNumber.includes('.');

                    // console.log("number token:", numberToken);
                    // console.log("last number", lastNumber);
                    // console.log("hasDecimalNumber", hasDecimalNumber);
                    // console.log("is last number decimal number", isLastNumberDecimalNumber);

                    if (prevExpression[prevExpression.length - 1] === '.') return prevExpression;
                    if (hasDecimalNumber && isLastNumberDecimalNumber) return prevExpression;
                    
                    return prevExpression.concat(value);
                })
            )
            :
            (
                setDisplay(prevDisplay => {
                
                    const isPrevDisplayOperator = operators.includes(prevDisplay)? true: false;

                    if (isPrevDisplayOperator || (prevDisplay == '0' && !isValueZero)) {
                        return value;
                    } else if (prevDisplay == '0' && isValueZero) {
                        return '0';
                    } else {
                        return prevDisplay.concat(value);
                    }
                }),
                setExpression(prevExpression => {
                    if (prevExpression === '' || prevExpression === '0') return value;
                    return prevExpression.concat(value);
                })
            );

        } else {
            // input value is an operator
            setDisplay(value);
            setExpression(prevExpression => {

                const lastChar = prevExpression[prevExpression.length - 1];
                const isLastCharOperator = operators.includes(lastChar)? true : false;
            

                if (prevExpression === '') return value;
                if (isLastCharOperator && lastChar === value ) return prevExpression;
                if (isLastCharOperator && lastChar !== value) return prevExpression.slice(0, -1).concat(value);
                return prevExpression.concat(value);
            });
        }

    }
    
    // when users click 'equals', calculate and display results
    const handleCalculation = () => {
        
        setExpression(prevExpression => {
    
            
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

            return prevExpression.concat(`=${result}`);
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
