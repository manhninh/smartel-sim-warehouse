import { z } from 'zod'

export const updatePriceSchema = z.object({
  purchasePrice: z.number().nonnegative(),
  salePrice: z.number().nonnegative(),
})
