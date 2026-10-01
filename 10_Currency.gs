/** Currency Master */
function listCurrencies() {
  return getTableObjects_('07_currencies');
}
function createCurrency(data) {
  requireAuthenticated_();
  const now=now_(), id=uuid_('CUR');
  appendRecord_('07_currencies',[id,normalizeText_(data.code),normalizeText_(data.name),normalizeText_(data.country),normalizeText_(data.isoNumeric),normalizeText_(data.symbol),normalizeText_(data.flagUrl),'ACTIVE',normalizeText_(data.createdBy),now,'',now]);
  return {success:true,id:id};
}
