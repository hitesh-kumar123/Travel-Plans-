/**
 * Payment Verification Module
 * Handles payment verification, receipt validation, and payment reconciliation
 * Prevents booking confirmation before successful payment processing
 */

/**
 * Payment verification statuses
 */
const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  VERIFIED: 'verified',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * Booking statuses tied to payment verification
 */
const BOOKING_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_VERIFIED: 'payment_verified',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

/**
 * In-memory storage for payment records (in production, use database)
 */
const paymentRecords = new Map();
const bookingPaymentLinks = new Map();

/**
 * Generates a unique payment transaction ID
 */
const generatePaymentTransactionId = () => {
  return 'PAY' + Date.now() + Math.random().toString(36).substr(2, 9);
};

/**
 * Initiates payment verification process
 * Called before booking confirmation
 *
 * @param {string} bookingId - Unique booking identifier
 * @param {number} amount - Payment amount in cents
 * @param {string} currency - Currency code (USD, EUR, etc)
 * @param {object} customerInfo - Customer payment information
 * @returns {object} Payment verification response with transaction ID
 */
const initiatePaymentVerification = (bookingId, amount, currency, customerInfo) => {
  // Validate payment details
  if (!bookingId || !amount || !currency) {
    throw new Error('Missing required payment details: bookingId, amount, currency');
  }

  if (amount <= 0) {
    throw new Error('Payment amount must be greater than zero');
  }

  if (!customerInfo || !customerInfo.email) {
    throw new Error('Customer email is required for payment verification');
  }

  // Generate unique transaction ID
  const transactionId = generatePaymentTransactionId();

  // Create payment record
  const paymentRecord = {
    transactionId,
    bookingId,
    amount,
    currency,
    customerInfo,
    status: PAYMENT_STATUS.PENDING,
    initiatedAt: new Date(),
    receiptUrl: null,
    webhookReceived: false,
    webhookReceivedAt: null,
    error: null
  };

  // Store payment record
  paymentRecords.set(transactionId, paymentRecord);
  bookingPaymentLinks.set(bookingId, transactionId);

  return {
    success: true,
    transactionId,
    paymentUrl: `/payment/checkout?transactionId=${transactionId}`,
    status: PAYMENT_STATUS.PENDING,
    message: 'Payment verification initiated. Please complete payment.'
  };
};

/**
 * Verifies payment receipt from payment processor
 * Called by webhook handler after payment processor confirms payment
 *
 * @param {string} transactionId - Payment transaction ID
 * @param {object} receiptData - Receipt data from payment processor
 * @returns {boolean} True if verification successful
 */
const verifyPaymentReceipt = (transactionId, receiptData) => {
  // Validate transaction exists
  if (!paymentRecords.has(transactionId)) {
    throw new Error('Transaction ID not found: ' + transactionId);
  }

  const paymentRecord = paymentRecords.get(transactionId);

  // Validate receipt data
  if (!receiptData || !receiptData.receiptId || !receiptData.amount) {
    throw new Error('Invalid receipt data: missing receiptId or amount');
  }

  // Validate receipt amount matches payment amount
  if (receiptData.amount !== paymentRecord.amount) {
    const error = `Amount mismatch: expected ${paymentRecord.amount}, received ${receiptData.amount}`;
    paymentRecord.error = error;
    paymentRecord.status = PAYMENT_STATUS.FAILED;
    return false;
  }

  // Validate receipt status
  if (receiptData.status !== 'completed' && receiptData.status !== 'succeeded') {
    const error = `Invalid receipt status: ${receiptData.status}`;
    paymentRecord.error = error;
    paymentRecord.status = PAYMENT_STATUS.FAILED;
    return false;
  }

  // Receipt validation successful
  paymentRecord.status = PAYMENT_STATUS.VERIFIED;
  paymentRecord.receiptUrl = receiptData.receiptUrl || null;
  paymentRecord.webhookReceived = true;
  paymentRecord.webhookReceivedAt = new Date();

  return true;
};

/**
 * Gets payment status for a booking
 * Used to verify if payment has been confirmed before finalizing booking
 *
 * @param {string} bookingId - Booking ID
 * @returns {object} Payment status object
 */
const getPaymentStatus = (bookingId) => {
  const transactionId = bookingPaymentLinks.get(bookingId);

  if (!transactionId) {
    return {
      status: PAYMENT_STATUS.PENDING,
      verified: false,
      transactionId: null,
      message: 'No payment record found for this booking'
    };
  }

  const paymentRecord = paymentRecords.get(transactionId);

  if (!paymentRecord) {
    return {
      status: PAYMENT_STATUS.PENDING,
      verified: false,
      transactionId,
      message: 'Payment record expired or not found'
    };
  }

  return {
    transactionId,
    status: paymentRecord.status,
    verified: paymentRecord.status === PAYMENT_STATUS.VERIFIED,
    amount: paymentRecord.amount,
    currency: paymentRecord.currency,
    receiptUrl: paymentRecord.receiptUrl,
    webhookReceived: paymentRecord.webhookReceived,
    initiatedAt: paymentRecord.initiatedAt,
    error: paymentRecord.error
  };
};

/**
 * Validates that payment is verified before finalizing booking
 * Prevents booking confirmation if payment verification has not completed
 *
 * @param {string} bookingId - Booking ID
 * @returns {boolean} True if payment is verified
 */
const isPaymentVerified = (bookingId) => {
  const transactionId = bookingPaymentLinks.get(bookingId);

  if (!transactionId) {
    return false;
  }

  const paymentRecord = paymentRecords.get(transactionId);

  return paymentRecord && paymentRecord.status === PAYMENT_STATUS.VERIFIED;
};

/**
 * Reconciles payment records with booking database
 * Ensures consistency between payment system and booking records
 *
 * @param {string} bookingId - Booking ID
 * @param {object} bookingData - Current booking data
 * @returns {object} Reconciliation result
 */
const reconcilePaymentWithBooking = (bookingId, bookingData) => {
  const paymentStatus = getPaymentStatus(bookingId);

  // Check if payment exists
  if (!paymentStatus.transactionId) {
    return {
      reconciled: false,
      status: bookingData.status,
      issue: 'No payment record found for booking',
      recommendation: 'Payment must be verified before booking confirmation'
    };
  }

  // Check if payment is verified
  if (!paymentStatus.verified) {
    return {
      reconciled: false,
      status: bookingData.status,
      paymentStatus: paymentStatus.status,
      issue: `Payment not verified. Current status: ${paymentStatus.status}`,
      recommendation: 'Booking cannot be confirmed until payment is verified'
    };
  }

  // Check if amounts match
  if (bookingData.totalPrice !== paymentStatus.amount) {
    return {
      reconciled: false,
      status: bookingData.status,
      issue: `Price mismatch: booking amount ${bookingData.totalPrice} vs payment ${paymentStatus.amount}`,
      recommendation: 'Amounts must match for reconciliation'
    };
  }

  // Reconciliation successful
  return {
    reconciled: true,
    status: BOOKING_STATUS.CONFIRMED,
    transactionId: paymentStatus.transactionId,
    receiptUrl: paymentStatus.receiptUrl,
    message: 'Payment verified and reconciled successfully'
  };
};

/**
 * Handles webhook callback from payment processor
 * Updates payment status when payment processor confirms payment
 *
 * @param {object} webhookData - Webhook data from payment processor
 * @returns {object} Webhook handling result
 */
const handlePaymentWebhook = (webhookData) => {
  // Validate webhook data
  if (!webhookData || !webhookData.transactionId) {
    return {
      success: false,
      message: 'Invalid webhook data: missing transactionId'
    };
  }

  const { transactionId, receiptData, eventType } = webhookData;

  // Only process payment.completed events
  if (eventType !== 'payment.completed' && eventType !== 'charge.succeeded') {
    return {
      success: false,
      message: `Unsupported event type: ${eventType}`
    };
  }

  try {
    // Verify payment receipt
    const verified = verifyPaymentReceipt(transactionId, receiptData);

    if (verified) {
      return {
        success: true,
        transactionId,
        status: PAYMENT_STATUS.VERIFIED,
        message: 'Payment verified successfully from webhook'
      };
    } else {
      const paymentRecord = paymentRecords.get(transactionId);
      return {
        success: false,
        transactionId,
        status: PAYMENT_STATUS.FAILED,
        message: paymentRecord.error
      };
    }
  } catch (error) {
    return {
      success: false,
      transactionId,
      message: error.message
    };
  }
};

/**
 * Processes booking finalization
 * Only confirms booking after payment verification
 *
 * @param {string} bookingId - Booking ID
 * @param {object} bookingData - Booking data
 * @returns {object} Final booking confirmation
 */
const finalizeBookingAfterPayment = (bookingId, bookingData) => {
  // Step 1: Verify payment status
  if (!isPaymentVerified(bookingId)) {
    throw new Error('Booking cannot be confirmed: payment not verified');
  }

  // Step 2: Reconcile payment with booking
  const reconciliation = reconcilePaymentWithBooking(bookingId, bookingData);

  if (!reconciliation.reconciled) {
    throw new Error(`Booking reconciliation failed: ${reconciliation.issue}`);
  }

  // Step 3: Return finalized booking
  return {
    success: true,
    bookingId,
    status: BOOKING_STATUS.CONFIRMED,
    transactionId: reconciliation.transactionId,
    receiptUrl: reconciliation.receiptUrl,
    totalPrice: bookingData.totalPrice,
    currency: bookingData.currency,
    confirmedAt: new Date(),
    message: 'Booking confirmed after payment verification'
  };
};

module.exports = {
  // Constants
  PAYMENT_STATUS,
  BOOKING_STATUS,

  // Payment verification functions
  initiatePaymentVerification,
  verifyPaymentReceipt,
  getPaymentStatus,
  isPaymentVerified,

  // Reconciliation and webhook handling
  reconcilePaymentWithBooking,
  handlePaymentWebhook,

  // Booking finalization
  finalizeBookingAfterPayment
};
