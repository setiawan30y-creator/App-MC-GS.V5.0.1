/** Transaction Engine — foundation */
const TRANSACTION_STATUS = Object.freeze({
  DRAFT:'DRAFT', HOLD:'HOLD', READY:'READY', PAYMENT_READY:'PAYMENT_READY',
  PROCESSING:'PROCESSING', SETTLED:'SETTLED', COMPLETED:'COMPLETED', CANCELLED:'CANCELLED'
});

function createTransaction(data) {
  requireAuthenticated_();
  const lock=LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const id=uuid_('TRX'), now=now_();
    const number=nextTransactionNumber_(data.branchId,data.counterId,now);
    appendRecord_('18_transactions',[id,number,data.branchId||'',data.counterId||'',data.customerId||'',now,data.sourceFunds||'',data.purpose||'',0,0,0,TRANSACTION_STATUS.DRAFT,data.createdBy||'',now,'',now]);
    appendRecord_('22_transaction_status',[uuid_('TRXSTS'),id,TRANSACTION_STATUS.DRAFT,'CREATED',data.createdBy||'',now]);
    return {success:true,transactionId:id,transactionNumber:number,status:TRANSACTION_STATUS.DRAFT};
  } finally { lock.releaseLock(); }
}

function nextTransactionNumber_(branchId,counterId,date) {
  const sh=getSheet_('24_transaction_numbers');
  const rows=sh.getDataRange().getValues(), headers=rows[0];
  const idx={}; headers.forEach((h,i)=>idx[h]=i);
  const day=Utilities.formatDate(date,MC_CONFIG.TIMEZONE,'yyyyMMdd');
  const prefix=MC_CONFIG.INVOICE_PREFIX;
  for(let i=1;i<rows.length;i++){
    if(String(rows[i][idx.branch_id])===String(branchId||'') &&
       String(rows[i][idx.counter_id])===String(counterId||'') &&
       Utilities.formatDate(new Date(rows[i][idx.number_date]),MC_CONFIG.TIMEZONE,'yyyyMMdd')===day) {
      const n=Number(rows[i][idx.last_number]||0)+1;
      sh.getRange(i+1,idx.last_number+1).setValue(n);
      sh.getRange(i+1,idx.updated_at+1).setValue(now_());
      return prefix+'-'+day+'-'+String(n).padStart(5,'0');
    }
  }
  sh.appendRow([uuid_('NUM'),branchId||'',counterId||'',date,prefix,1,now_()]);
  return prefix+'-'+day+'-00001';
}
