
'use server';
// Razorpay integration removed
export async function createRazorpayOrder(amount: number) {
  return { orderId: 'mock_order_' + Date.now() };
}
