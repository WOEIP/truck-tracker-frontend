import React, {Component} from 'react';

import '../styles/registration-page.scss';

class RegistrationSent extends Component {
  constructor() {
    super();
    };

  render() {
    return (
      <div id="registration-sent">
        <p>
          Thank you for taking the time to make Oakland air quality better! Your data has been sent for verification. We will be in touch with you shortly.
        </p>
       </div>
    );
  }
}

export default RegistrationSent;
