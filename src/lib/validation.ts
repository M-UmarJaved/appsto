import { z } from 'zod';

/**
 * Input Validation Schemas
 * 
 * Using Zod for runtime type validation and sanitization
 * Prevents type confusion attacks and ensures data integrity
 */

// Email validation
export const EmailSchema = z.string().email('Invalid email address').toLowerCase().trim();

// UUID validation
export const UUIDSchema = z.string().uuid('Invalid UUID format');

// Product slug validation
export const ProductSlugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Invalid product slug').min(2).max(50);

// Plan slug validation
export const PlanSlugSchema = z.enum(['solo', 'squad', 'studio'], {
  errorMap: () => ({ message: 'Plan must be solo, squad, or studio' })
});

// License key validation
export const LicenseKeySchema = z.string().regex(/^DS24-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Invalid license key format');

// Test Purchase Request Schema
export const TestPurchaseSchema = z.object({
  userId: UUIDSchema,
  email: EmailSchema,
  name: z.string().min(1).max(100).trim().optional(),
  productSlug: ProductSlugSchema.default('desksweep'),
  planSlug: PlanSlugSchema.default('solo'),
});

// License Activation Request Schema
export const LicenseActivationSchema = z.object({
  licenseKey: LicenseKeySchema,
  deviceId: z.string().min(10).max(200),
  deviceName: z.string().min(1).max(100).optional(),
  platform: z.enum(['windows', 'macos', 'linux']).optional(),
  hardwareId: z.string().min(10).max(200).optional(),
});

// Contact Form Schema
export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: EmailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200).trim(),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000).trim(),
});

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * Validate and parse request body
 * 
 * @example
 * const result = validateRequest(TestPurchaseSchema, body);
 * if (!result.success) {
 *   return NextResponse.json({ error: result.error }, { status: 400 });
 * }
 * const data = result.data;
 */
export function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: `${firstError.path.join('.')}: ${firstError.message}`,
      };
    }
    return { success: false, error: 'Invalid request data' };
  }
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize URL
 */
export function validateUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only allow https URLs
    if (parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}
