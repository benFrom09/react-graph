import React, { useState } from 'react';
import FormInput from '../form-input/FormInput';

import './plotting-form.scss';

const PlottingForm = ({plot,handleChange}) => {

    
    return (
        <div className="plotting-form">
        <span>f(x):</span>
          <FormInput label="Type your function here" name="plot" type="text" value={plot} handleChange={handleChange} required />
        </div>
    );
};
export default PlottingForm;
