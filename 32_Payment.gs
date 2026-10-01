/** Payment */
function createPayment(data) {
  requireAuthenticated_();
  const id=uuid_('PAY'), now=now_();
  appendRecord_('20_transaction_payments',[id,data.transactionId,data.paymentMethod||'',data.currencyId||'IDR',Number(data.amount)||0,Number(data.amountRp)||0,data.bankAccountId||'', 'PENDING',now,data.createdBy||'']);
  return {success:true,id:id};
}
