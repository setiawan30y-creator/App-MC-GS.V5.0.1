/** Settlement */
function settleTransaction(data) {
  requireAuthenticated_();
  const id=uuid_('SET'), now=now_();
  appendRecord_('21_transaction_settlement',[id,data.transactionId,data.settlementType||'',data.cashAccountId||'',data.bankAccountId||'',Number(data.amountRp)||0,'SETTLED',data.settledBy||'',now]);
  appendRecord_('22_transaction_status',[uuid_('TRXSTS'),data.transactionId,TRANSACTION_STATUS.SETTLED,'SETTLEMENT',data.settledBy||'',now]);
  return {success:true,id:id,status:TRANSACTION_STATUS.SETTLED};
}
