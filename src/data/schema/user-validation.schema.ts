import { z } from "zod";

const userSchema = {
  body: z.object({
    username: z.string().min(1).max(50),
    email: z.string().email().max(100),
    password: z.string().min(8).max(255),
    first_name: z.string().max(50).optional(),
    last_name: z.string().max(50).optional(),
    phone_number: z.string().max(20).optional(),
    address_line1: z.string().max(100).optional(),
    address_line2: z.string().max(100).optional(),
    city: z.string().max(50).optional(),
    state_province: z.string().max(50).optional(),
    postal_code: z.string().max(10).optional(),
    country: z.string().max(50).optional()
  })
};

const UserValidationSchema = z.object({ ...userSchema });
export default UserValidationSchema;
