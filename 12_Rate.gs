/** Currency Rate */
function listRates() {
  return getTableObjects_('09_currency_rates');
}
function createRate(data) {
  requireAuthenticated_();
  const id=uuid_('RATE'), now=now_();
  appendRecord_('09_currency_rates',[id,data.currencyId,data.rateDate||now_(),normalizeText_(data.source),Number(data.referenceRate)||0,Number(data.buyRate)||0,Number(data.sellRate)||0,'ACTIVE',normalizeText_(data.createdBy),now,'',now]);
  return {success:true,id:id};
}
