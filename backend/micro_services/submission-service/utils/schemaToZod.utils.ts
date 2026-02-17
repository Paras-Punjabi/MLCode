import { z } from 'zod';

export function getZodDataType(dataType: string) {
  switch (dataType) {
    case 'string':
      return z.string();
    case 'number':
      return z.coerce.number();
    default:
      return z.string();
  }
}

export function getZodSchema(schema: Record<string, string>) {
  let zodSchema: Record<string, z.ZodTypeAny> = {};
  for (let item of Object.keys(schema)) {
    zodSchema[item] = getZodDataType(schema[item]);
  }
  return z.object(zodSchema);
}
