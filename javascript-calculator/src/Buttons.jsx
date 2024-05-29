import Button from './Button';

function Buttons({ handleClickedInput, handleCalculation, clear, percentize }) {
    return (
        <div id='buttons-container'>
            <div className='button-wrapper'>
                <Button id='clear' className='function' onClick={clear}>AC</Button>
                <Button id='easter-btn' className='function'>
                    <a href='https://github.com/Katereverie' target='_blank'>
                        <img src='/avatar-square.png' alt='avatar' />
                    </a>
                </Button>
                <Button id='percent' className='function' onClick={percentize}>&#37;</Button>
                <Button id='divide' className='operator' value='÷' onClick={handleClickedInput}>÷</Button>
            </div>
            <div className='button-wrapper'>
                <Button id='seven' className='number-btn' value='7' onClick={handleClickedInput}>7</Button>
                <Button id='eight' className='number-btn' value='8' onClick={handleClickedInput}>8</Button>
                <Button id='nine' className='number-btn' value='9' onClick={handleClickedInput}>9</Button>
                <Button id='multiply' className='operator' value='×' onClick={handleClickedInput}>×</Button>
            </div>
            <div className='button-wrapper'>
                <Button id='four' className='number-btn' value='4' onClick={handleClickedInput}>4</Button>
                <Button id='five' className='number-btn' value='5' onClick={handleClickedInput}>5</Button>
                <Button id='six' className='number-btn' value='6' onClick={handleClickedInput}>6</Button>
                <Button id='subtract' className='operator' value='−' onClick={handleClickedInput}>−</Button>
            </div>
            <div className='button-wrapper'>
                <Button id='one' className='number-btn' value='1' onClick={handleClickedInput}>1</Button>
                <Button id='two' className='number-btn' value='2' onClick={handleClickedInput}>2</Button>
                <Button id='three' className='number-btn' value='3' onClick={handleClickedInput}>3</Button>
                <Button id='add' className='operator' value='+' onClick={handleClickedInput}>+</Button>
            </div>
            <div className='button-wrapper'>
                <Button id='zero' className='number-btn' value='0' onClick={handleClickedInput}>0</Button>
                <Button id='decimal' className='number-btn' value='.' onClick={handleClickedInput}>.</Button>
                <Button id='equals' className='operator' onClick={handleCalculation}>&#61;</Button>
            </div>
        </div>
    );
}

export default Buttons;
