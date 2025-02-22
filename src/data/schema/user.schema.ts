import { z } from "zod";

const userSchema = {
  body: z.object({
    name: z.string(),
    dob: z.string(),
    age: z.number(),
    email: z.string().email(),
    phone_number: z.string(),
    password: z.string()
  })
};

const UserSchema = z.object({ ...userSchema });
export default UserSchema;
