import { z } from 'zod';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected ISO date (YYYY-MM-DD)');

export const dateRangeSchema = z
  .object({
    from: isoDate,
    to: isoDate,
  })
  .refine((v) => v.from <= v.to, {
    message: 'from must be on or before to',
    path: ['from'],
  });

export const departmentSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .optional();

export const wardSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .optional();

export const limitSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(200)
  .default(50);

export const dailyPatientsQuerySchema = dateRangeSchema;

export const revenueQuerySchema = dateRangeSchema.extend({
  department: departmentSchema,
});

export const doctorPerformanceQuerySchema = dateRangeSchema.extend({
  department: departmentSchema,
  limit: limitSchema,
});

export const queueStatisticsQuerySchema = dateRangeSchema.extend({
  department: departmentSchema,
});

export const bedOccupancyQuerySchema = z.object({
  ward: wardSchema,
});

export const overviewQuerySchema = dateRangeSchema;

export type DateRange = z.infer<typeof dateRangeSchema>;
