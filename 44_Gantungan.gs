/** Gantungan — independent Rupiah cash accountability */
const GANTUNGAN_STATUS=Object.freeze({OUTSTANDING:'OUTSTANDING',RETURNED:'RETURNED',CANCELLED:'CANCELLED'});

function createGantungan(data) {
  requireAuthenticated_();
  const id=uuid_('GNT'), now=now_();
  appendRecord_('35_gantungan',[id,data.date||now_,data.type||'',data.recipientName||'',data.description||'',Number(data.amountRp)||0,data.returnDate||'',GANTUNGAN_STATUS.OUTSTANDING,data.notes||'',data.createdBy||'', '',now,now]);
  return {success:true,id:id,status:GANTUNGAN_STATUS.OUTSTANDING};
}
