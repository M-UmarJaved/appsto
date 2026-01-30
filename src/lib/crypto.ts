import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

/**
 * Generate a unique license token in format: APPSTO-XXXX-XXXX-XXXX
 */
export function generateLicenseToken(): string {
  const part1 = generateRandomString(4)
  const part2 = generateRandomString(4)
  const part3 = generateRandomString(4)
  
  return `APPSTO-${part1}-${part2}-${part3}`
}

/**
 * Generate random alphanumeric string
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const randomBytes = crypto.randomBytes(length)
  
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length]
  }
  
  return result
}

/**
 * Encrypt sensitive data using AES-256-GCM (modern, secure algorithm)
 * 
 * SECURITY: Uses proper initialization vector (IV) and authenticated encryption
 * Format: iv:authTag:encryptedData (all hex-encoded)
 */
export function encryptData(data: string): string {
  const secret = process.env.LICENSE_SECRET_KEY!
  
  // Derive a 32-byte key from the secret using SHA-256
  const key = crypto.createHash('sha256').update(secret).digest()
  
  // Generate a random IV (12 bytes for GCM)
  const iv = crypto.randomBytes(12)
  
  // Create cipher with IV
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  
  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  // Get authentication tag (for data integrity)
  const authTag = cipher.getAuthTag().toString('hex')
  
  // Return format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

/**
 * Decrypt sensitive data
 * 
 * SECURITY: Verifies authentication tag to detect tampering
 */
export function decryptData(encryptedData: string): string {
  const secret = process.env.LICENSE_SECRET_KEY!
  
  try {
    // Parse the encrypted data format: iv:authTag:encryptedData
    const parts = encryptedData.split(':')
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format')
    }
    
    const [ivHex, authTagHex, encrypted] = parts
    
    // Derive the same key
    const key = crypto.createHash('sha256').update(secret).digest()
    
    // Convert hex strings back to buffers
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    console.error('❌ Decryption failed:', error)
    throw new Error('Failed to decrypt data - data may be corrupted or tampered with')
  }
}

/**
 * Generate unique ID
 */
export function generateUniqueId(): string {
  return uuidv4()
}

/**
 * Verify Paddle webhook signature
 */
export function verifyPaddleWebhook(
  webhookSecret: string,
  signature: string,
  body: string
): boolean {
  const hmac = crypto.createHmac('sha256', webhookSecret)
  hmac.update(body)
  const digest = hmac.digest('hex')
  
  return digest === signature
}
