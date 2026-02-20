import { customAlphabet } from 'nanoid';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase clients
const appsto = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const productDB = createClient(
  process.env.PRODUCT_DB_SUPABASE_URL!,
  process.env.PRODUCT_DB_SUPABASE_KEY!
);

/**
 * Generate a unique, human-friendly license key based on plan
 * Format: PREFIX-XXXX-XXXX-XXXX-XXXX
 * - Solo Plan: SOLO-XXXX-XXXX-XXXX-XXXX
 * - Squad Plan: SQAD-XXXX-XXXX-XXXX-XXXX
 * - Studio Plan: STDO-XXXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(plan: string = 'solo'): string {
  const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 4);
  
  // Determine prefix based on plan
  let prefix = 'SOLO';
  const planLower = plan.toLowerCase();
  
  if (planLower.includes('squad')) {
    prefix = 'SQAD';
  } else if (planLower.includes('studio')) {
    prefix = 'STDO';
  }
  
  const parts = [
    prefix,
    nanoid(4),
    nanoid(4),
    nanoid(4),
    nanoid(4),
  ];
  return parts.join('-');
}

/**
 * Generate multiple unique license keys based on plan
 */
export async function generateLicenseKeys(count: number, plan: string = 'solo'): Promise<string[]> {
  const keys: string[] = [];
  const maxAttempts = count * 3; // Prevent infinite loop
  let attempts = 0;

  while (keys.length < count && attempts < maxAttempts) {
    const key = generateLicenseKey(plan);
    
    // Check if key already exists in database
    const { data: existing } = await appsto
      .from('licenses')
      .select('license_key')
      .eq('license_key', key)
      .single();

    if (!existing && !keys.includes(key)) {
      keys.push(key);
    }
    
    attempts++;
  }

  if (keys.length < count) {
    throw new Error(`Could only generate ${keys.length} unique keys out of ${count} requested`);
  }

  return keys;
}

/**
 * Create license records in Appsto database
 */
export async function createLicenses(params: {
  purchaseId: string;
  productId: string;
  userId: string | null;
  count: number;
  plan?: string;
  licenseType?: 'standard' | 'trial' | 'lifetime';
  expiresAt?: Date | null;
}) {
  const { purchaseId, productId, userId, count, plan = 'solo', licenseType = 'standard', expiresAt = null } = params;

  // Generate unique license keys based on plan
  const licenseKeys = await generateLicenseKeys(count, plan);

  // Create license records
  const licenses = licenseKeys.map((key) => ({
    purchase_id: purchaseId,
    product_id: productId,
    user_id: userId,
    license_key: key,
    license_type: licenseType,
    is_active: true,
    is_used: false,
    activation_count: 0,
    max_activations: 1,
    expires_at: expiresAt?.toISOString() || null,
    synced_to_product_db: false,
  }));

  const { data, error } = await appsto
    .from('licenses')
    .insert(licenses)
    .select();

  if (error) {
    console.error('Error creating licenses:', error);
    throw new Error(`Failed to create licenses: ${error.message}`);
  }

  return data;
}

/**
 * Sync license to "My Softwares" database (tokens table)
 * This is what DeskSweep software reads from
 */
export async function syncLicenseToProductDB(licenseId: string) {
  try {
    // Get license from Appsto DB
    const { data: license, error: fetchError } = await appsto
      .from('licenses')
      .select('*')
      .eq('id', licenseId)
      .single();

    if (fetchError || !license) {
      throw new Error(`License not found: ${licenseId}`);
    }

    // Insert into My Softwares database tokens table
    const { error: insertError } = await productDB
      .from('tokens')
      .insert({
        token_value: license.license_key,
        is_used: license.is_used,
        created_at: license.created_at,
      });

    if (insertError) {
      // Check if it's a duplicate key error (already synced)
      if (insertError.code === '23505') {
        console.log(`License ${license.license_key} already synced to product DB`);
      } else {
        throw insertError;
      }
    }

    // Mark as synced in Appsto DB
    const { error: updateError } = await appsto
      .from('licenses')
      .update({
        synced_to_product_db: true,
        synced_at: new Date().toISOString(),
      })
      .eq('id', licenseId);

    if (updateError) {
      console.error('Error updating sync status:', updateError);
    }

    return true;
  } catch (error) {
    console.error('Error syncing license to product DB:', error);
    throw error;
  }
}

/**
 * Sync all licenses for a purchase
 */
export async function syncPurchaseLicenses(purchaseId: string) {
  const { data: licenses, error } = await appsto
    .from('licenses')
    .select('id')
    .eq('purchase_id', purchaseId)
    .eq('synced_to_product_db', false);

  if (error) {
    console.error('Error fetching licenses for sync:', error);
    throw error;
  }

  if (!licenses || licenses.length === 0) {
    console.log('No licenses to sync for purchase:', purchaseId);
    return;
  }

  // Sync each license
  const syncPromises = licenses.map((license) => syncLicenseToProductDB(license.id));
  await Promise.all(syncPromises);

  console.log(`✅ Synced ${licenses.length} licenses for purchase ${purchaseId}`);
}

/**
 * Validate a license key (used by DeskSweep software)
 */
export async function validateLicenseKey(licenseKey: string) {
  const { data: license, error } = await appsto
    .from('licenses')
    .select('*')
    .eq('license_key', licenseKey)
    .single();

  if (error || !license) {
    return {
      valid: false,
      reason: 'License key not found',
    };
  }

  // Check if active
  if (!license.is_active) {
    return {
      valid: false,
      reason: 'License has been deactivated',
    };
  }

  // Check if already used
  if (license.is_used && license.activation_count >= license.max_activations) {
    return {
      valid: false,
      reason: 'License has reached maximum activations',
    };
  }

  // Check expiration
  if (license.expires_at) {
    const expiryDate = new Date(license.expires_at);
    if (expiryDate < new Date()) {
      return {
        valid: false,
        reason: 'License has expired',
      };
    }
  }

  return {
    valid: true,
    license,
  };
}

/**
 * Activate a license (called when user enters key in DeskSweep)
 */
export async function activateLicense(params: {
  licenseKey: string;
  deviceName?: string;
  deviceId?: string;
  osInfo?: string;
  appVersion?: string;
}) {
  const { licenseKey, deviceName, deviceId, osInfo, appVersion } = params;

  // Validate license first
  const validation = await validateLicenseKey(licenseKey);
  if (!validation.valid) {
    return validation;
  }

  const license = validation.license;

  try {
    // Create activation record
    const { data: activation, error: activationError } = await appsto
      .from('license_activations')
      .insert({
        license_id: license.id,
        device_name: deviceName,
        device_id: deviceId,
        os_info: osInfo,
        app_version: appVersion,
        is_active: true,
        last_seen_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (activationError) {
      throw activationError;
    }

    // Update license
    const { error: updateError } = await appsto
      .from('licenses')
      .update({
        is_used: true,
        activation_count: license.activation_count + 1,
        activated_at: license.activated_at || new Date().toISOString(),
      })
      .eq('id', license.id);

    if (updateError) {
      throw updateError;
    }

    // Also update the tokens table in My Softwares DB
    await productDB
      .from('tokens')
      .update({ is_used: true })
      .eq('token_value', licenseKey);

    return {
      valid: true,
      activated: true,
      activation,
    };
  } catch (error) {
    console.error('Error activating license:', error);
    return {
      valid: false,
      reason: 'Failed to activate license',
      error,
    };
  }
}

/**
 * Deactivate a license on a specific device
 */
export async function deactivateLicense(licenseKey: string, deviceId: string) {
  const { data: activation, error } = await appsto
    .from('license_activations')
    .update({
      is_active: false,
      deactivated_at: new Date().toISOString(),
    })
    .eq('license_id', (
      await appsto.from('licenses').select('id').eq('license_key', licenseKey).single()
    ).data?.id)
    .eq('device_id', deviceId);

  if (error) {
    console.error('Error deactivating license:', error);
    throw error;
  }

  // Decrement activation count
  const { data: license } = await appsto
    .from('licenses')
    .select('activation_count')
    .eq('license_key', licenseKey)
    .single();

  if (license) {
    await appsto
      .from('licenses')
      .update({
        activation_count: Math.max(0, license.activation_count - 1),
      })
      .eq('license_key', licenseKey);
  }

  return activation;
}

/**
 * Get all licenses for a user
 */
export async function getUserLicenses(userId: string) {
  const { data, error } = await appsto
    .from('licenses')
    .select(`
      *,
      product:products(name, slug),
      purchase:purchases(created_at, amount, currency),
      activations:license_activations(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user licenses:', error);
    throw error;
  }

  return data;
}

/**
 * Get all licenses for a purchase
 */
export async function getPurchaseLicenses(purchaseId: string) {
  const { data, error } = await appsto
    .from('licenses')
    .select('*')
    .eq('purchase_id', purchaseId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching purchase licenses:', error);
    throw error;
  }

  return data;
}
