import React from 'react';

const Loading = (text)=>(
    <div className="loading">
        {
            text ? <span>{text}</span> : null
        }
    </div>
);
export default Loading;