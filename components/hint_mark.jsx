export default function _hint_mark({ setTooltip, tooltip }) {
    if (!tooltip) {
        return;
    }

    return (
        <span className="hint-mark" onMouseEnter={() => setTooltip(tooltip)} onMouseLeave={() => setTooltip(null)}>?</span>
    );
};