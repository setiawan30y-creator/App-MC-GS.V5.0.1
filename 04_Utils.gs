/** MC-App-Almara V5.0.1 — Utilities */
function now_() {
  return new Date();
}

function formatDate_(value, pattern) {
  return Utilities.formatDate(
    value instanceof Date ? value : new Date(value),
    MC_CONFIG.TIMEZONE,
    pattern || MC_CONFIG.DATETIME_FORMAT
  );
}

function uuid_(prefix) {
  return (prefix || 'ID') + '-' + Utilities.getUuid();
}

function normalizeText_(value) {
  return String(value == null ? '' : value).trim();
}

function upper_(value) {
  return normalizeText_(value).toUpperCase();
}
