import React from 'react';

import {R} from '../utils/aliases.js';

const Button = props => {
    return(
    R('button',{'classname:': 'btn btn-default',
                'onClick': props.handleClick},
                props.label));
};

export default Button;
