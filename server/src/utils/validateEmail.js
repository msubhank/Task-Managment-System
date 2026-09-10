const dns = require('dns').promises;

/**
 * RFC 5322 Compliant Email Format Validator (Layer 1)
 * 
 * Validates:
 * 1. Total length <= 254 characters (RFC 5321 limit)
 * 2. Local-part length <= 64 characters
 * 3. Proper placement of '@' and no consecutive dots '..'
 * 4. Valid domain with at least one dot and a 2+ character Top-Level Domain (TLD e.g. .com, .org, .edu)
 * 5. Rejects invalid characters and malformed structures (e.g., user@com, user@.com, @domain.com)
 * 
 * @param {string} email
 * @returns {boolean} true if valid, false otherwise
 */
const isValidEmailFormat = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmed = email.trim();

  // RFC 5321 Length Limits
  if (trimmed.length > 254) {
    return false;
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domainPart] = parts;

  // Local part constraints (1-64 characters)
  if (!localPart || localPart.length > 64) {
    return false;
  }

  // Reject consecutive dots
  if (trimmed.includes('..')) {
    return false;
  }

  // Reject local-part starting or ending with a dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }

  // RFC 5322 regex requiring a domain with a 2+ letter TLD (e.g. .com, .org, .co.uk)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

  return emailRegex.test(trimmed);
};

/**
 * Real-Time DNS MX Record Verification (Layer 2)
 * Queries global DNS servers to verify that the domain actually exists
 * and has configured Mail Exchange (MX) servers capable of receiving emails.
 * 
 * @param {string} email
 * @returns {Promise<{ isValid: boolean, domain: string, message?: string }>}
 */
const verifyEmailDomain = async (email) => {
  if (!email || !email.includes('@')) {
    return { isValid: false, message: 'Invalid email address provided.' };
  }

  const domain = email.trim().split('@')[1].toLowerCase();

  // Fast-path whitelist for top email providers (guarantees sub-millisecond response)
  const trustedProviders = [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'yahoo.com',
    'icloud.com',
    'proton.me',
    'protonmail.com',
    'aol.com',
    'zoho.com',
    'live.com',
    'msn.com'
  ];

  if (trustedProviders.includes(domain)) {
    return { isValid: true, domain };
  }

  // Allow demo domain in development mode for seeded demo testing
  if (process.env.NODE_ENV !== 'production' && domain === 'example.com') {
    return { isValid: true, domain };
  }

  // Live DNS lookup for MX records on all other custom or unknown domains
  try {
    const mxRecords = await dns.resolveMx(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return {
        isValid: false,
        domain,
        message: `The domain "@${domain}" does not have any active mail servers configured to receive emails.`
      };
    }

    return { isValid: true, domain, mxRecords };
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA' || error.code === 'SERVFAIL') {
      return {
        isValid: false,
        domain,
        message: `The domain "@${domain}" does not exist on the internet or cannot receive email.`
      };
    }

    // Graceful fallback for network/DNS timeouts in restricted dev environments
    console.warn(`[DNS Warning] MX resolution skipped for "${domain}": ${error.message}`);
    return { isValid: true, domain, warning: 'DNS verification bypassed due to network timeout' };
  }
};

module.exports = {
  isValidEmailFormat,
  verifyEmailDomain
};
