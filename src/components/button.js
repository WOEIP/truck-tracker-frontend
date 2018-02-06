import React from 'react';

const R = React.createElement;

const Button = props => {
    return(
    R('button',{'classname:': 'btn btn-default',
                'onClick': props.handleClick},
                props.label));
};

export default Button;
