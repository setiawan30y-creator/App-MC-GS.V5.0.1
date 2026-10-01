/** Transaction Items */
function addTransactionItem(data) {
  requireAuthenticated_();
  const id=uuid_('ITEM');
  const qty=Number(data.quantity)||0, face=Number(data.faceValue)||0, rate=Number(data.transactionRate)||0;
  const total=Number(data.totalRp)||qty*face*rate;
  appendRecord_('19_transaction_items',[id,data.transactionId,data.currencyId||'',data.denominationId||'',data.side||'',qty,face,Number(data.referenceRate)||0,rate,Number(data.spread)||0,total,data.overrideReason||'']);
  return {success:true,id:id,totalRp:total};
}
