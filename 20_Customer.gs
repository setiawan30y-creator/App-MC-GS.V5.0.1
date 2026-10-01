/** Customer Master */
function listCustomers() {
  return getTableObjects_('13_customers');
}
function createCustomer(data) {
  requireAuthenticated_();
  const id=uuid_('CUS'), now=now_();
  appendRecord_('13_customers',[id,normalizeText_(data.customerCode),normalizeText_(data.name),normalizeText_(data.birthPlace),data.birthDate||'',normalizeText_(data.address),normalizeText_(data.nationality),normalizeText_(data.gender),normalizeText_(data.occupation),normalizeText_(data.phone),normalizeText_(data.email),normalizeText_(data.idType),normalizeText_(data.idNumber),normalizeText_(data.taxNumber),normalizeText_(data.cif),normalizeText_(data.localId),'ACTIVE',now,now]);
  return {success:true,id:id};
}
