/** Audit foundation */
function writeAudit_(action,module,recordId,oldValue,newValue,reason,userId) {
  appendRecord_('42_audit_log',[uuid_('AUD'),now_(),userId||'',action||'',module||'',recordId||'',JSON.stringify(oldValue||null),JSON.stringify(newValue||null),reason||'','']);
}
