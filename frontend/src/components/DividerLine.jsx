import React from "react";
const DividerLine = ({ children }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0px 8px 0px'}}>
            <div style={{ flex: 1, height: '2px', background: 'var(--color-green)' }} />
                {children}
            <div style={{ flex: 1, height: '2px', background: 'var(--color-green)' }} />
        </div>
    );
}
export default DividerLine;