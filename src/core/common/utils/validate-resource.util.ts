import { AnyZodObject } from "zod";

const validateResource = (
  schema: AnyZodObject,
  body?: Record<string, string | number | boolean | null | undefined | any>,
  query?: Record<string, string | number | boolean | null>,
  params?: string | number | null
) => {
  try {
    schema.parse({
      body: body,
      query: query,
      params: params
    });
  } catch (error: any) {
    throw error;
  }
};

export default validateResource;
