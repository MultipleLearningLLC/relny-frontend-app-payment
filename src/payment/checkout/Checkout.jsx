import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import messages from './Checkout.messages';
import { paymentSelector, updateCaptureKeySelector } from '../data/selectors';
import { submitPayment } from '../data/actions';
import AcceptedCardLogos from './assets/accepted-card-logos.png';

import CheckoutStep1 from "./assets/checkoutstep1.png"
import CheckoutStep2 from "./assets/checkoutstep2.png"
import CheckoutStep3 from "./assets/checkoutstep3.png"
import CheckoutStep4 from "./assets/checkoutstep4.png"
import SecurePayments from "./assets/securepayments.png"

import PaymentForm from './payment-form/PaymentForm';
import FreeCheckoutOrderButton from './FreeCheckoutOrderButton';
import { PayPalButton } from '../payment-methods/paypal';
import { ORDER_TYPES } from '../data/constants';

class Checkout extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showImage1: false,
      showImage2: false,
      showImage3: false,
      showImage4: false
    }
  }
  handleSubmitPayPal = () => {
    // TO DO: after event parity, track data should be
    // sent only if the payment is processed, not on click
    // Check for ApplePay and Free Basket as well
    sendTrackEvent(
      'edx.bi.ecommerce.basket.payment_selected',
      { type: 'click', category: 'checkout', paymentMethod: 'PayPal' },
    );

    this.props.submitPayment({ method: 'paypal' });
  }

  handleSubmitApplePay = () => {
    // TO DO: after event parity, track data should be
    // sent only if the payment is processed, not on click
    // Check for PayPal and Free Basket as well
    sendTrackEvent(
      'edx.bi.ecommerce.basket.payment_selected',
      { type: 'click', category: 'checkout', paymentMethod: 'Apple Pay' },
    );

    this.props.submitPayment({ method: 'apple-pay' });
  }

  handleSubmitCybersource = (formData) => {
    this.props.submitPayment({ method: 'cybersource', ...formData });
  }

  // The payment form does client side validation that happens before
  // the submit handler above is fired. We send the tracking event here
  // on click of the submit button for parity with the old page.
  handleSubmitCybersourceButtonClick = () => {
    // TO DO: after event parity, track data should be
    // sent only if the payment is processed, not on click
    // Check for PayPal, ApplePay and Free Basket as well
    sendTrackEvent(
      'edx.bi.ecommerce.basket.payment_selected',
      {
        type: 'click',
        category: 'checkout',
        paymentMethod: 'Credit Card',
        checkoutType: 'client_side',
        flexMicroformEnabled: true,
      },
    );
  }

  handleSubmitFreeCheckout = () => {
    sendTrackEvent(
      'edx.bi.ecommerce.basket.free_checkout',
      { type: 'click', category: 'checkout' },
    );
  }

  renderCheckoutOptions() {
    const {
      intl,
      isFreeBasket,
      isBasketProcessing,
      loading,
      loaded,
      paymentMethod,
      submitting,
      orderType,
    } = this.props;

    const submissionDisabled = loading || isBasketProcessing;
    const isBulkOrder = orderType === ORDER_TYPES.BULK_ENROLLMENT;
    const isQuantityUpdating = isBasketProcessing && loaded;


    // istanbul ignore next
    const payPalIsSubmitting = submitting && paymentMethod === 'paypal';
    // istanbul ignore next
    const cybersourceIsSubmitting = submitting && paymentMethod === 'cybersource';

    if (isFreeBasket) {
      return (
        <FreeCheckoutOrderButton
          onClick={this.handleSubmitFreeCheckout}
        />
      );
    }

    const basketClassName = 'basket-section';
    return (
      <>
        <div className={'basket-section-custom'} style={{marginBottom: '10px!important'}}>
          
          
          <h5 aria-level="2">
            <FormattedMessage
              id="payment.select.payment.method.heading"
              defaultMessage="Click the Button Below To Proceed with Payment"
              description="The heading for the payment type selection section"
            />
          </h5>

          <p className="d-flex d-2">
            {/*
            <button type="button" className="payment-method-button active">
              <img
                src={AcceptedCardLogos}
                alt={intl.formatMessage(messages['payment.page.method.type.credit'])}
              />
            </button>
            */}

            <PayPalButton
              onClick={this.handleSubmitPayPal}
              className={classNames('btn btn-warning text-center btn-lg d-flex align-items-center justify-content-center', { 'skeleton-pulse': loading })}
              disabled={submissionDisabled}
              style={{color: 'white', maxWidth: "450px", width: "100%"}}
              isProcessing={payPalIsSubmitting}
            />

            

            {/* Apple Pay temporarily disabled per REV-927  - https://github.com/edx/frontend-app-payment/pull/256 */}
          </p>
          <img style={{width: "100%", maxWidth: "450px"}} src={SecurePayments} />
        </div>
        {/* 
        <div>
          <h5 aria-level="2">
            Dont have a PayPal Account? 
          </h5>
          <p>
          Follow this step-by-step guide to pay through PayPal with your credit card!
          </p>

          <h5>Step 1</h5>
          <p>
            Click on the PayPal Button and then click <b>"Pay with Debit or Credit Card"</b> - {" "}
            {this.state.showImage1 ? <a href="#" onClick={(e) => { e.preventDefault(); this.setState({showImage1: false})}}>Hide Image</a>: <a href="#" onClick={(e) => { e.preventDefault(); this.setState({showImage1: true})}}>View Image</a>}
          </p>

          {this.state.showImage1 ? <img style={{marginBottom: "10px"}} src={CheckoutStep1} /> : ''}

          <h5>Step 2</h5>
          <p>
            Enter you email address and click on <b>"Continue to Payment"</b> - {" "}
            {this.state.showImage2 ? <a href="#" onClick={(e) => { e.preventDefault(); this.setState({showImage2: false})}}>Hide Image</a>: <a href="#" onClick={(e) => { e.preventDefault(); this.setState({showImage2: true})}}>View Image</a>}
          </p>

          {this.state.showImage2 ? <img style={{marginBottom: "10px"}} src={CheckoutStep2} /> : ''}

          <h5>Step 3</h5>
          <p>
            Fill in your billing address and credit card details. - {" "}
            {this.state.showImage3 ? <a href="#" onClick={(e) => { e.preventDefault(); this.setState({showImage3: false})}}>Hide Image</a>: <a href="#" onClick={(e) => { e.preventDefault(); this.setState({showImage3: true})}}>View Image</a>}
          </p>

          {this.state.showImage3 ? <img style={{marginBottom: "10px"}} src={CheckoutStep3} /> : ''}

          <h5>Step 4</h5>
          <p>
            After filling out all the details, click on <b>"Continue as a Guest"</b> and enjoy your purchase! - {" "}
            {this.state.showImage4 ? <a href="#" onClick={(e) => { e.preventDefault(); this.setState({showImage4: false})}}>Hide Image</a>: <a href="#" onClick={(e) => { e.preventDefault(); this.setState({showImage4: true})}}>View Image</a>}
          </p>

          {this.state.showImage4 ? <img style={{marginBottom: "10px"}} src={CheckoutStep4} /> : ''}

          <p style={{marginTop: "3rem"}}>If you have any issues following this process feel free to contact us at <a href="#">payments@relny.com</a></p>
        </div>
        */}
        {/*
        <PaymentForm
          onSubmitPayment={this.handleSubmitCybersource}
          onSubmitButtonClick={this.handleSubmitCybersourceButtonClick}
          disabled={submitting}
          loading={loading}
          loaded={loaded}
          isProcessing={cybersourceIsSubmitting}
          isBulkOrder={isBulkOrder}
          isQuantityUpdating={isQuantityUpdating}
        />
        */}
      </>
    );
  }

  render() {
    const { intl } = this.props;

    return (
      <section
        aria-label={intl.formatMessage(messages['payment.section.payment.details.label'])}
      >
        {this.renderCheckoutOptions()}
      </section>
    );
  }
}

Checkout.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  submitPayment: PropTypes.func.isRequired,
  isFreeBasket: PropTypes.bool,
  submitting: PropTypes.bool,
  isBasketProcessing: PropTypes.bool,
  paymentMethod: PropTypes.oneOf(['paypal', 'apple-pay', 'cybersource']),
  orderType: PropTypes.oneOf(Object.values(ORDER_TYPES)),
};

Checkout.defaultProps = {
  loading: false,
  loaded: false,
  submitting: false,
  isBasketProcessing: false,
  isFreeBasket: false,
  paymentMethod: undefined,
  orderType: ORDER_TYPES.SEAT,
};

const mapStateToProps = (state) => ({
  ...paymentSelector(state),
  ...updateCaptureKeySelector(state),
});

export default connect(mapStateToProps, { submitPayment })(injectIntl(Checkout));
