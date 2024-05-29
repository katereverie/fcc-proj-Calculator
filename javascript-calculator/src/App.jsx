import { useState } from 'react';
import './App.css';
import Display from './Display';
import Buttons from './Buttons';

function App() {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');

    const operators = ['÷', '×', '−', '+'];
    const numberRegex = /(\d+(\.\d+)?)/g;
    const operatorRegex = /(\d+(\.\d+)?|[+−÷×])/g;

    const isResultDisplayed = expression.includes('=');

    const operate = (a, b, operator) => {
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
    };

    const handleClickedInput = (e) => {
        const value = e.target.value;

        const isValueOperator = operators.includes(value);
        const isValueDecimal = value === '.';
        const isValueZero = value === '0';
        const isValueMinus = value === '−';

        if (!isValueOperator) {
            isValueDecimal ?
                (
                    setDisplay(prevDisplay => {
                        const hasDecimal = prevDisplay.includes('.');
                        const isPrevDisplayOperator = operators.includes(prevDisplay);

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
                (
                    setDisplay(prevDisplay => {
                        const isPrevDisplayOperator = operators.includes(prevDisplay);

                        if (isPrevDisplayOperator || (prevDisplay === '0' && !isValueZero) || isResultDisplayed) {
                            return value;
                        } else if (prevDisplay === '0' && isValueZero) {
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
            const lastChar = expression[expression.length - 1];
            const secondLastChar = expression[expression.length - 2];
            const isLastCharOperator = operators.includes(lastChar);
            const areLastTwoCharsOperators = operators.includes(lastChar) && operators.includes(secondLastChar);

            if (isResultDisplayed) {
                setExpression(prevExpression => {
                    prevExpression = String(result);
                    return prevExpression.concat(value);
                });
            } else {
                setExpression(prevExpression => {
                    if (prevExpression === '') return value;
                    if (!isLastCharOperator) {
                        return prevExpression.concat(value);
                    } else if (areLastTwoCharsOperators) {
                        if (isValueMinus) {
                            return prevExpression;
                        } else {
                            return prevExpression.slice(0, -2).concat(value);
                        }
                    } else {
                        if (isValueMinus) return prevExpression.concat(value);
                        if (!isValueMinus && lastChar === value) return prevExpression;
                        if (!isValueMinus && lastChar !== value) return prevExpression.slice(0, -1).concat(value);
                    }
                });
            }

            setDisplay(value);
        }
    };

    const handleCalculation = () => {
        if (isResultDisplayed) {
            setDisplay(prevDisplay => prevDisplay);
            setExpression(prevExpression => prevExpression);
        } else {
            const tokens = expression.match(operatorRegex);
            const hasOperatorAtEnd = operators.includes(tokens[tokens.length - 1]);
            if (hasOperatorAtEnd) tokens.pop;

            // convert number strings to numbers
            const convertedTokens = tokens.map(token => isNaN(token) ? token : Number(token));
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

            // handle multiplication and division first:
            let preliminaryResult = [];
            let currentOperator = null;

            for (let i = 0; i < convertedTokens.length; i++) {
                const currentToken = convertedTokens[i];
                if (typeof currentToken === 'string' && (currentToken === '×' || currentToken === '÷')) {
                    currentOperator = convertedTokens[i];
                } else if (currentOperator) {
                    const prevValue = preliminaryResult.pop();
                    const newValue = operate(prevValue, currentToken, currentOperator);
                    preliminaryResult.push(newValue);
                    currentOperator = null;
                } else {
                    preliminaryResult.push(currentToken);
                }
            }

            let finalResult = preliminaryResult[0];

            for (let i = 1; i < preliminaryResult.length; i++) {
                const currentToken = preliminaryResult[i];

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
    };

    const clear = () => {
        setDisplay('0');
        setExpression('');
        setResult('');
    };

    const percentize = () => {
        if (display === '0' & expression === '') {
            setDisplay('0');
            setExpression('0');
        } else {
            const isDisplayOperator = operators.includes(display);
            const isLastCharOfExpressionOperator = operators.includes(expression[expression.length - 1]);

            isDisplayOperator ? setDisplay(display) : setDisplay(String(Number(display) / 100));

            if (expression === '0') {
                setExpression(prevExpression => {
                    return String(Number(prevExpression) / 100);
                });
            } else {
                isResultDisplayed ?
                    setExpression(prevExpression => {
                        prevExpression = result;
                        return String(Number(prevExpression) / 100);
                    })
                    :
                    setExpression(prevExpression => {
                        return isLastCharOfExpressionOperator ? prevExpression : String(Number(prevExpression) / 100);
                    });
            }
        }
    };

    return (
        <>
            <header>
                <h1>Calculator</h1>
            </header>
            <main>
                <div id='calculator-container'>
                    <Display display={display} expression={expression} />
                    <Buttons 
                        handleClickedInput={handleClickedInput} 
                        handleCalculation={handleCalculation} 
                        clear={clear} 
                        percentize={percentize} 
                    />
                </div>
                <footer>
                    <p>Inspired by Apple Design</p>
                    <p>&copy; {new Date().getFullYear()} <span id='author'>Katereverie</span></p>
                </footer>
            </main>
        </>
    );
}

export default App;
