/**
 * Payment Verification Tests
 * Comprehensive test suite for payment verification, receipt validation, and reconciliation
 */

const paymentVerification = require('../utils/paymentVerification');

// Test Suite: Payment Initiation
describe('Payment Verification - Initiation', () => {
  test('Should initiate payment verification with valid data', () => {
    const result = paymentVerification.initiatePaymentVerification(
      'BK123456',
      29999,
      'USD',
      { email: 'user@example.com' }
    );

    expect(result.success).toBe(true);
    expect(result.transactionId).toMatch(/^PAY/);
    expect(result.status).toBe('pending');
    expect(result.paymentUrl).toContain('transactionId');
  });

  test('Should reject payment initiation without booking ID', () => {
    expect(() => {
      paymentVerification.initiatePaymentVerification(
        null,
        29999,
        'USD',
        { email: 'user@example.com' }
      );
    }).toThrow('Missing required payment details');
  });

  test('Should reject payment initiation with zero amount', () => {
    expect(() => {
      paymentVerification.initiatePaymentVerification(
        'BK123456',
        0,
        'USD',
        { email: 'user@example.com' }
      );
    }).toThrow('Payment amount must be greater than zero');
  });

  test('Should reject payment initiation without customer email', () => {
    expect(() => {
      paymentVerification.initiatePaymentVerification(
        'BK123456',
        29999,
        'USD',
        { name: 'User' }
      );
    }).toThrow('Customer email is required');
  });
});

// Test Suite: Receipt Verification
describe('Payment Verification - Receipt Validation', () => {
  let transactionId;

  beforeEach(() => {
    const result = paymentVerification.initiatePaymentVerification(
      'BK123456',
      29999,
      'USD',
      { email: 'user@example.com' }
    );
    transactionId = result.transactionId;
  });

  test('Should verify valid payment receipt', () => {
    const receiptData = {
      receiptId: 'RCP123456',
      amount: 29999,
      status: 'completed',
      receiptUrl: 'https://example.com/receipt/123'
    };

    const verified = paymentVerification.verifyPaymentReceipt(
      transactionId,
      receiptData
    );

    expect(verified).toBe(true);
    const status = paymentVerification.getPaymentStatus('BK123456');
    expect(status.verified).toBe(true);
  });

  test('Should reject receipt with mismatched amount', () => {
    const receiptData = {
      receiptId: 'RCP123456',
      amount: 39999,
      status: 'completed'
    };

    const verified = paymentVerification.verifyPaymentReceipt(
      transactionId,
      receiptData
    );

    expect(verified).toBe(false);
    const status = paymentVerification.getPaymentStatus('BK123456');
    expect(status.verified).toBe(false);
  });

  test('Should reject receipt with invalid status', () => {
    const receiptData = {
      receiptId: 'RCP123456',
      amount: 29999,
      status: 'pending'
    };

    const verified = paymentVerification.verifyPaymentReceipt(
      transactionId,
      receiptData
    );

    expect(verified).toBe(false);
  });

  test('Should reject receipt with missing data', () => {
    expect(() => {
      paymentVerification.verifyPaymentReceipt(transactionId, {});
    }).toThrow('Invalid receipt data');
  });
});

// Test Suite: Payment Status Retrieval
describe('Payment Verification - Status Retrieval', () => {
  test('Should return correct payment status for verified payment', () => {
    const initResult = paymentVerification.initiatePaymentVerification(
      'BK789012',
      49999,
      'USD',
      { email: 'user@example.com' }
    );

    const receiptData = {
      receiptId: 'RCP789012',
      amount: 49999,
      status: 'completed'
    };

    paymentVerification.verifyPaymentReceipt(
      initResult.transactionId,
      receiptData
    );

    const status = paymentVerification.getPaymentStatus('BK789012');

    expect(status.verified).toBe(true);
    expect(status.amount).toBe(49999);
    expect(status.status).toBe('verified');
  });

  test('Should return pending status for non-existent booking', () => {
    const status = paymentVerification.getPaymentStatus('BK999999');

    expect(status.verified).toBe(false);
    expect(status.status).toBe('pending');
  });
});

// Test Suite: Payment Reconciliation
describe('Payment Verification - Reconciliation', () => {
  test('Should reconcile matching payment and booking', () => {
    const initResult = paymentVerification.initiatePaymentVerification(
      'BK345678',
      59999,
      'USD',
      { email: 'user@example.com' }
    );

    const receiptData = {
      receiptId: 'RCP345678',
      amount: 59999,
      status: 'completed'
    };

    paymentVerification.verifyPaymentReceipt(
      initResult.transactionId,
      receiptData
    );

    const bookingData = {
      totalPrice: 59999,
      currency: 'USD',
      status: 'payment_verified'
    };

    const reconciliation = paymentVerification.reconcilePaymentWithBooking(
      'BK345678',
      bookingData
    );

    expect(reconciliation.reconciled).toBe(true);
    expect(reconciliation.status).toBe('confirmed');
  });

  test('Should reject reconciliation with unverified payment', () => {
    paymentVerification.initiatePaymentVerification(
      'BK456789',
      69999,
      'USD',
      { email: 'user@example.com' }
    );

    const bookingData = {
      totalPrice: 69999,
      currency: 'USD'
    };

    const reconciliation = paymentVerification.reconcilePaymentWithBooking(
      'BK456789',
      bookingData
    );

    expect(reconciliation.reconciled).toBe(false);
    expect(reconciliation.issue).toContain('not verified');
  });

  test('Should reject reconciliation with price mismatch', () => {
    const initResult = paymentVerification.initiatePaymentVerification(
      'BK567890',
      79999,
      'USD',
      { email: 'user@example.com' }
    );

    const receiptData = {
      receiptId: 'RCP567890',
      amount: 79999,
      status: 'completed'
    };

    paymentVerification.verifyPaymentReceipt(
      initResult.transactionId,
      receiptData
    );

    const bookingData = {
      totalPrice: 89999,
      currency: 'USD'
    };

    const reconciliation = paymentVerification.reconcilePaymentWithBooking(
      'BK567890',
      bookingData
    );

    expect(reconciliation.reconciled).toBe(false);
    expect(reconciliation.issue).toContain('Price mismatch');
  });
});

// Test Suite: Webhook Handling
describe('Payment Verification - Webhook Handling', () => {
  test('Should process valid payment webhook', () => {
    const initResult = paymentVerification.initiatePaymentVerification(
      'BK678901',
      99999,
      'USD',
      { email: 'user@example.com' }
    );

    const webhookData = {
      transactionId: initResult.transactionId,
      eventType: 'payment.completed',
      receiptData: {
        receiptId: 'RCP678901',
        amount: 99999,
        status: 'completed'
      }
    };

    const result = paymentVerification.handlePaymentWebhook(webhookData);

    expect(result.success).toBe(true);
    expect(result.status).toBe('verified');
  });

  test('Should reject webhook with invalid transaction ID', () => {
    const webhookData = {
      transactionId: 'INVALID123',
      eventType: 'payment.completed',
      receiptData: {
        amount: 99999,
        status: 'completed'
      }
    };

    const result = paymentVerification.handlePaymentWebhook(webhookData);

    expect(result.success).toBe(false);
  });

  test('Should reject webhook with unsupported event type', () => {
    const initResult = paymentVerification.initiatePaymentVerification(
      'BK789012',
      99999,
      'USD',
      { email: 'user@example.com' }
    );

    const webhookData = {
      transactionId: initResult.transactionId,
      eventType: 'charge.refunded',
      receiptData: {}
    };

    const result = paymentVerification.handlePaymentWebhook(webhookData);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Unsupported event type');
  });
});

// Test Suite: Booking Finalization
describe('Payment Verification - Booking Finalization', () => {
  test('Should finalize booking after payment verification', () => {
    const initResult = paymentVerification.initiatePaymentVerification(
      'BK890123',
      199999,
      'USD',
      { email: 'user@example.com' }
    );

    const receiptData = {
      receiptId: 'RCP890123',
      amount: 199999,
      status: 'completed',
      receiptUrl: 'https://example.com/receipt/890123'
    };

    paymentVerification.verifyPaymentReceipt(
      initResult.transactionId,
      receiptData
    );

    const bookingData = {
      totalPrice: 199999,
      currency: 'USD'
    };

    const finalized = paymentVerification.finalizeBookingAfterPayment(
      'BK890123',
      bookingData
    );

    expect(finalized.success).toBe(true);
    expect(finalized.status).toBe('confirmed');
    expect(finalized.receiptUrl).toBe('https://example.com/receipt/890123');
  });

  test('Should reject finalization without payment verification', () => {
    paymentVerification.initiatePaymentVerification(
      'BK901234',
      199999,
      'USD',
      { email: 'user@example.com' }
    );

    const bookingData = {
      totalPrice: 199999,
      currency: 'USD'
    };

    expect(() => {
      paymentVerification.finalizeBookingAfterPayment(
        'BK901234',
        bookingData
      );
    }).toThrow('payment not verified');
  });
});
