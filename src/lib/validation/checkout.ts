import { z } from 'zod';

export const CheckoutSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pincode: z.string().length(6, "Pincode must be exactly 6 digits"),
  addressLine1: z.string().min(5, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

export type CheckoutFormData = z.infer<typeof CheckoutSchema>;
