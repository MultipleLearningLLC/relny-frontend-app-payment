import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import AcceptedCardLogos from '../../checkout/assets/accepted-card-logos.png';

import PayPalLogo from './assets/paypal-logo.png';
import messages from './PayPalButton.messages';

const PayPalButton = ({ intl, isProcessing, ...props }) => (
  <button type="button" {...props}>
    { isProcessing ? <span className="button-spinner-icon text-primary mr-2" /> : null }
    {/*
     <img
      src={AcceptedCardLogos}
      alt={intl.formatMessage(messages['payment.page.method.type.credit'])}
      style={{'marginRight': '10px'}}
    />
    
    <img
      src={PayPalLogo}
      alt={intl.formatMessage(messages['payment.type.paypal'])}
    />
    */}
    Proceed with Payment
  </button>
);

PayPalButton.propTypes = {
  intl: intlShape.isRequired,
  isProcessing: PropTypes.bool,
};

PayPalButton.defaultProps = {
  isProcessing: false,
};

export default injectIntl(PayPalButton);
