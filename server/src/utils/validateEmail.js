/**
 * RFC 5322 Compliant Email Format Validator
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

module.exports = { isValidEmailFormat };
