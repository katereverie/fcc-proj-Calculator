export default function Button({ id, className, value, onClick, children }) {
    return (
        <button id={id} className={className} value={value} onClick={onClick}>
            {children ? children : value}
        </button>
    );
}
