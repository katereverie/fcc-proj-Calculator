import { useState } from 'react';
import './App.css';

function App() {
    
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    
    const operators = ['÷', '×', '−', '+'];
    const numberRegex = /(\d+(\.\d+)?)/g;
    const operatorRegex = /(\d+(\.\d+)?|[+−÷×])/g;

    const isResultDisplayed = expression.includes('=');

    const operate = (a, b, operator) => {

        console.log(`operator is: ${operator}`);
        console.log(`the values are ${a} and ${b}`);
        switch (operator) {
            case '+':
                return a + b;
            case '−':
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
        const isValueOperator = operators.includes(value);
        const isValueDecimal = value === '.';
        const isValueZero = value === '0';
        const isValueMinus = value === '−';
        // const isResultDisplayed = expression.includes('=');

        // if operators are clicked, preserve result for expression; replace result with input value
        // if a number input (including decimal) is clicked, clear result for both display and expression
        if (!isValueOperator) {

            isValueDecimal?
            // input is a decimal point 
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

                    if (prevExpression[prevExpression.length - 1] === '.') return prevExpression;
                    if (hasDecimalNumber && isLastNumberDecimalNumber) return prevExpression;
                    
                    return prevExpression.concat(value);
                })
            )
            :
            // input is between [0-9]
            (
                setDisplay(prevDisplay => {

                    const isPrevDisplayOperator = operators.includes(prevDisplay);

                    if (isPrevDisplayOperator || (prevDisplay == '0' && !isValueZero) || isResultDisplayed) {
                        return value;
                    } else if (prevDisplay == '0' && isValueZero) {
                        return '0';
                    } else {
                        return prevDisplay.concat(value);
                    }
                }),
                setExpression(prevExpression => {

                    if (prevExpression === '' || prevExpression === '0' || isResultDisplayed) return value;
                    return prevExpression.concat(value);
                })
            );

        } else {
            // input value is an operator

            const lastChar = expression[expression.length - 1];
            const secondLastChar= expression[expression.length - 2];
            const isLastCharOperator = operators.includes(lastChar);
            const areLastTwoCharsOperators = operators.includes(lastChar) && operators.includes(secondLastChar);

            if (isResultDisplayed) {
                setExpression(prevExpression => {
                    prevExpression = String(result);
                    return prevExpression.concat(value);
                });
            } else {
            // no result displayed
                
                setExpression(prevExpression => {

                    if (prevExpression === '') return value;
                    if (!isLastCharOperator) {
                        return prevExpression.concat(value);
                    } else if (areLastTwoCharsOperators) {
                        console.log("reached here");
                        if (isValueMinus) {
                            return prevExpression;
                        } else {
                            return prevExpression.slice(0, -2).concat(value);
                        }
                    } else {
                        if (isValueMinus) return prevExpression.concat(value);
                        if (!isValueMinus && lastChar === value) return prevExpression;
                        if (!isValueMinus && lastChar !== value) return  prevExpression.slice(0, -1).concat(value); 
                    }

                });
            }

            setDisplay(value);

        }

    }
    
    // when users click 'equals', calculate and display results
    const handleCalculation = () => {

        // const isResultDisplayed = expression.includes('=');

        if (isResultDisplayed) {
            setDisplay(prevDisplay => prevDisplay);
            setExpression(prevExpression => prevExpression);
        } else {
            const tokens = expression.match(operatorRegex);
            console.log("tokens now before handling: ", tokens)
            const hasOperatorAtEnd = operators.includes(tokens[tokens.length - 1]);
    
            // if the last element of tokens is an operator, remove it
            if (hasOperatorAtEnd) console.log("tokens without =: ", tokens.pop);
            
    
            // convert number strings to numbers
            const convertedTokens = tokens.map(token => isNaN(token) ? token: Number(token));
            // handle consecutive operators excluding "-"
            for (let i = 0; i < convertedTokens.length; i++) {
                const currentToken = convertedTokens[i];
                const nextToken = convertedTokens[i + 1];
                if (i === 0 && currentToken === '−') {
                    convertedTokens[i + 1] = -convertedTokens[i + 1];
                    convertedTokens.splice(i, 1);
                } else if (typeof currentToken === 'string' && typeof nextToken === 'string' && nextToken === '−') {
                    convertedTokens[i + 2] = -convertedTokens[i + 2];
                    convertedTokens.splice(i + 1, 1);
                }
            }

            console.log(`after handling consecutive operators: `, convertedTokens);

            // handle multiplication and division first:
            let primaryResult = [];
            let currentOperator = null;

            for (let i = 0; i < convertedTokens.length; i++) {
                const currentToken = convertedTokens[i];
                console.log(`current token being examined is ${currentToken}`)
                if (typeof currentToken === 'string' && (currentToken === '×' || currentToken === '÷')) {
                    currentOperator = convertedTokens[i];
                    console.log(`we found an operator with primary precedence: ${currentOperator}. We make it the most current operator for later calculation.`)
                } else if (currentOperator) {
                    console.log(`our current operator is not null, it is ${currentOperator}`);
                    const prevValue = primaryResult.pop();
                    console.log(`here is the prevValue: ${prevValue}`)
                    console.log(`here are the expression to be sent for calculation: ${prevValue} ${currentOperator} ${currentToken}`)
                    const newValue = operate(prevValue, currentToken, currentOperator);
                    console.log(`here's the result: ${newValue}`)
                    primaryResult.push(newValue);
                    console.log(`we added the result to the expression for secondary calculation: ${primaryResult}`)
                    currentOperator = null;
                    console.log(`we reassign null to our currentOperator for the next loop`);
                } else {
                    console.log(`the current token being examined is either not an operator or an operator which is neither x nor ÷, it could be a number or an operator + or -, it is : ${currentToken}, we add it to the primary result`)
                    primaryResult.push(currentToken);
                    console.log(`here's the primary result after pushing the current token to it: ${primaryResult}`);
                }
            }

            console.log(`the first round of calculation is finished`);
            console.log("ready for secondary processing:", primaryResult);
            console.log("what about the converted tokens?", convertedTokens)
    

            let finalResult = primaryResult[0];
            
            // let currentResult = convertedTokens[0];
            // let currentOperator = null;
            

            for (let i = 1; i < primaryResult.length; i++) {
                const currentToken = primaryResult[i];
    
                if (typeof currentToken === 'string') {
                    currentOperator = currentToken;
                } else {
                    finalResult = operate(finalResult, currentToken, currentOperator);
                }
            }
    
            setResult(finalResult);
            setExpression(prevExpression => prevExpression.concat(`=${finalResult}`));
            setDisplay(String(finalResult));
        }


    }

    const clear = () => {
        setDisplay('0');
        setExpression('');
        setResult('');
    }

    const percentize = () => {

        if (display === '0' & expression === '') {
            setDisplay('0');
            setExpression('0');
        } else {
            const isDisplayOperator = operators.includes(display);
            const isLastCharOfExpressionOperator = operators.includes(expression[expression.length - 1]);

            isDisplayOperator? setDisplay(display): setDisplay(String(Number(display) / 100));

            if (expression === '0') {
                    setExpression(prevExpression => {
                        return String(Number(prevExpression) / 100);
                    });
                } else {

                    // const isResultDisplayed = expression.includes('=');

                    isResultDisplayed?
                    setExpression(prevExpression => {
                        prevExpression = result;
                        return String(Number(prevExpression) / 100);
                    })
                    :
                    setExpression(prevExpression => {
                        console.log("here! is the last character")
                        return isLastCharOfExpressionOperator? prevExpression: String(Number(prevExpression) / 100);
                    })
                }
        }
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
                        <button id='easter-btn' className='function'><a href='https://github.com/Katereverie' target='__blank'><img src='/avatar-square.png' alt='avatar'/></a></button>
                        <button id='percent' className='function' value='&#37;' onClick={percentize}>&#37;</button>
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
                        <button id='subtract' className='operator' value='−' onClick={handleClickedInput}>−</button>
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
