/** Denomination Master */
function listDenominations() {
  return getTableObjects_('08_denominations');
}
function createDenomination(data) {
  requireAuthenticated_();
  const id=uuid_('DEN'), now=now_();
  appendRecord_('08_denominations',[id,data.currencyId,Number(data.nominal)||0,normalizeText_(data.unit),normalizeText_(data.year),normalizeText_(data.series),'ACTIVE',normalizeText_(data.frontImageUrl),normalizeText_(data.backImageUrl),normalizeText_(data.createdBy),now,'',now]);
  return {success:true,id:id};
}
