export default function Display({ display, expression }) {
    return (
        <div id='display-container'>
            <div id='expression'>
                {expression}
            </div>
            <div id='display'>
                {display}
            </div>
        </div>
    );
}