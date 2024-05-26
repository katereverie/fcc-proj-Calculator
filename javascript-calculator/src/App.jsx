import { useState } from 'react';
import './App.css';

function App() {
    
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    
    const handleInput = (e) => {
        setDisplay(prevState => {
            if (prevState === '0') {
                return e.target.value;
            }
            return prevState.concat(e.target.value);
        });
    }

    const handleCalculation = () => {
        setDisplay('calculating...')
    }

    const handleExpression = () => {
        
        setExpression(display);
    }

    const clear = () => {
        setDisplay('0');
        setExpression('');
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
                        <button id='divide' className='operator'>&#247;</button>
                    </div>
                    <div className='button-wrapper'>
                        <button id='seven' className='number-btn' value='7' onClick={handleInput}>7</button>
                        <button id='eight' className='number-btn' value='8' onClick={handleInput}>8</button>
                        <button id='nine' className='number-btn' value='9' onClick={handleInput}>9</button>
                        <button id='multiply' className='operator'>&#215;</button>
                    </div>
                    <div className='button-wrapper'>
                        <button id='four' className='number-btn' value='4' onClick={handleInput}>4</button>
                        <button id='five' className='number-btn' value='5' onClick={handleInput}>5</button>
                        <button id='six' className='number-btn' value='6' onClick={handleInput}>6</button>
                        <button id='subtract' className='operator' >&#8722;</button>
                    </div>
                    <div className='button-wrapper'>
                        <button id='one' className='number-btn' value='1' onClick={handleInput}>1</button>
                        <button id='two' className='number-btn' value='2' onClick={handleInput}>2</button>
                        <button id='three' className='number-btn' value='3' onClick={handleInput}>3</button>
                        <button id='add' className='operator'>&#43;</button>
                    </div>
                    <div className='button-wrapper'>
                        <button id='zero' className='number-btn' value='0' onClick={handleInput}>0</button>            
                        <button id='decimal' className='number-btn'>&#46;</button>
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
