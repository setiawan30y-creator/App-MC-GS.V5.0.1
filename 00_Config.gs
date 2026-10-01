/** MC-App-Almara V5.0.1 — Configuration */
const MC_CONFIG = Object.freeze({
  APP_NAME: 'MC-App-Almara',
  COMPANY_NAME: 'PT ALMARA PUTRA VALASINDO',
  VERSION: '5.0.1',
  TIMEZONE: 'Asia/Jakarta',
  DATE_FORMAT: 'dd MMM yyyy',
  DATETIME_FORMAT: 'dd MMM yyyy HH:mm:ss',
  INVOICE_PREFIX: 'APV',
  DEFAULT_CURRENCY: 'IDR'
});

function getAppInfo() {
  return {
    appName: MC_CONFIG.APP_NAME,
    companyName: MC_CONFIG.COMPANY_NAME,
    version: MC_CONFIG.VERSION,
    timezone: MC_CONFIG.TIMEZONE
  };
}
