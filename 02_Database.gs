/** MC-App-Almara V5.0.1 — Database Access Layer */
function getDatabase_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Spreadsheet aktif tidak ditemukan.');
  return ss;
}

function getSheet_(name) {
  const sh = getDatabase_().getSheetByName(name);
  if (!sh) throw new Error('Sheet database tidak ditemukan: ' + name);
  return sh;
}

function getTable_(name) {
  const sh = getSheet_(name);
  return sh.getDataRange().getValues();
}

function appendRecord_(name, record) {
  getSheet_(name).appendRow(record);
}

function getHeaders_(name) {
  const sh = getSheet_(name);
  if (sh.getLastColumn() === 0) return [];
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
}

function rowToObject_(headers, row) {
  const obj = {};
  headers.forEach(function(header, i) {
    obj[header] = row[i];
  });
  return obj;
}
