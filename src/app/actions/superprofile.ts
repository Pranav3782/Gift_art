'use server';
/**
 * @fileOverview SuperProfile Server Actions
 * Orchestrates order initiation and server-side processing.
 */

import { superProfile } from '@/lib/superprofile';
import { CheckoutFormData } from '@/lib/validation/checkout';

export async function initiateSuperProfilePayment(amount: number, formData: CheckoutFormData) {
  try {
    const order = await superProfile.createOrder({
      amount: amount * 100, // Convert to paise/cents if required by gateway
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone
      }
    });

    return { success: true, checkoutUrl: order.checkout_url, orderId: order.id };
  } catch (error: any) {
    console.error('SuperProfile Payment Error:', error);
    return { success: false, error: error.message };
  }
}
