/** MC-App-Almara V5.0.1 — Canonical 44-Sheet Installer */
const MC_DATABASE_SCHEMA = {
  '01_settings':'setting_id,key,value,description,type,status,updated_by,updated_at',
  '02_users':'user_id,username,password_hash,name,email,role_id,status,last_login,created_at,updated_at',
  '03_roles':'role_id,role_name,permissions,status,created_at,updated_at',
  '04_sessions':'session_id,user_id,token_hash,created_at,expires_at,last_seen,status,ip_info,user_agent',
  '05_branches':'branch_id,code,name,address,phone,status,created_at,updated_at',
  '06_counters':'counter_id,branch_id,code,name,status,created_at,updated_at',
  '07_currencies':'currency_id,code,name,country,iso_numeric,symbol,flag_url,status,created_by,created_at,updated_by,updated_at',
  '08_denominations':'denomination_id,currency_id,nominal,unit,year,series,status,front_image_url,back_image_url,created_by,created_at,updated_by,updated_at',
  '09_currency_rates':'rate_id,currency_id,rate_date,source,reference_rate,buy_rate,sell_rate,status,created_by,created_at,updated_by,updated_at',
  '10_rate_history':'rate_history_id,rate_id,currency_id,rate_date,reference_rate,buy_rate,sell_rate,changed_by,changed_at,reason',
  '11_currency_gallery':'gallery_id,currency_id,denomination_id,image_type,image_url,caption,status,created_by,created_at',
  '12_coin_old_money':'item_id,currency_id,denomination_id,category,type,country,nominal,year,series,condition,quantity,buy_price,sell_price,front_image_url,back_image_url,notes,status,created_by,created_at,updated_by,updated_at',
  '13_customers':'customer_id,customer_code,name,birth_place,birth_date,address,nationality,gender,occupation,phone,email,id_type,id_number,tax_number,cif,local_id,status,created_at,updated_at',
  '14_customer_documents':'document_id,customer_id,document_type,document_number,file_name,file_id,file_url,uploaded_at,uploaded_by,ocr_status,verification_status,verified_by,verified_at',
  '15_kyc_records':'kyc_id,customer_id,kyc_status,risk_level,source,reviewed_by,reviewed_at,notes,created_at,updated_at',
  '16_ocr_results':'ocr_id,document_id,customer_id,engine,raw_text,confidence,extracted_json,ocr_at,verified_by,verified_at,status',
  '17_customer_risk':'risk_id,customer_id,risk_level,score,reasons,status,reviewed_by,reviewed_at,created_at,updated_at',
  '18_transactions':'transaction_id,transaction_number,branch_id,counter_id,customer_id,transaction_date,source_funds,purpose,total_sell,total_buy,net_amount,status,created_by,created_at,updated_by,updated_at',
  '19_transaction_items':'item_id,transaction_id,currency_id,denomination_id,side,quantity,face_value,reference_rate,transaction_rate,spread,total_rp,override_reason',
  '20_transaction_payments':'payment_id,transaction_id,payment_method,currency_id,amount,amount_rp,bank_account_id,payment_status,paid_at,created_by',
  '21_transaction_settlement':'settlement_id,transaction_id,settlement_type,cash_account_id,bank_account_id,amount_rp,status,settled_by,settled_at',
  '22_transaction_status':'status_id,transaction_id,status,reason,changed_by,changed_at',
  '23_transaction_holds':'hold_id,transaction_id,reason,held_by,held_at,released_by,released_at,status',
  '24_transaction_numbers':'number_id,branch_id,counter_id,number_date,prefix,last_number,updated_at',
  '25_currency_stock':'stock_id,currency_id,total_quantity,total_value_rp,updated_at',
  '26_denomination_stock':'denomination_stock_id,currency_id,denomination_id,quantity,value_rp,updated_at',
  '27_stock_movements':'movement_id,currency_id,denomination_id,movement_date,movement_type,quantity,value_rp,source_type,source_id,notes,created_by,created_at',
  '28_stock_adjustments':'adjustment_id,currency_id,denomination_id,adjustment_date,system_quantity,physical_quantity,difference,value_rp,reason,approved_by,approved_at,created_by,created_at',
  '29_cash_accounts':'cash_account_id,branch_id,currency_id,name,opening_balance,current_balance,status,created_at,updated_at',
  '30_cash_movements':'cash_movement_id,cash_account_id,movement_date,movement_type,category,debit,credit,balance,transaction_id,closing_id,notes,created_by,created_at',
  '31_bank_accounts':'bank_account_id,branch_id,account_code,bank_name,account_number,account_name,currency_id,account_type,branch_name,opening_balance,current_balance,status,created_by,created_at,updated_by,updated_at',
  '32_bank_movements':'bank_movement_id,bank_account_id,movement_date,value_date,reference_number,bank_reference,movement_type,category,notes,debit,credit,balance,source_type,source_id,reconciliation_status,external_movement_id,reconciled_at,reconciled_by,created_by,created_at',
  '33_closing':'closing_id,branch_id,counter_id,closing_date,shift_id,cashier_id,started_at,finished_at,opening_cash,expected_cash,physical_cash,outstanding_gantungan,difference,status,notes,created_by,created_at,approved_by,approved_at',
  '34_closing_cash_count':'count_id,closing_id,denomination,unit_type,quantity,subtotal,created_at',
  '35_gantungan':'gantungan_id,date,type,recipient_name,description,amount_rp,return_date,status,notes,created_by,returned_by,created_at,updated_at',
  '36_closing_reconciliation':'reconciliation_id,closing_id,expected_cash,physical_cash,outstanding_gantungan,actual_accounted_cash,difference,status,reconciled_by,reconciled_at,notes',
  '37_closing_history':'history_id,closing_id,action,old_status,new_status,reason,changed_by,changed_at',
  '38_suppliers':'supplier_id,code,name,contact,address,currency_id,status,created_by,created_at,updated_by,updated_at',
  '39_supplier_transactions':'supplier_transaction_id,supplier_id,transaction_date,type,currency_id,quantity,value_rp,reference,notes,created_by,created_at',
  '40_bi_reporting':'report_id,report_type,period_start,period_end,version,status,file_id,file_url,payload_hash,created_by,created_at,finalized_by,finalized_at',
  '41_compliance':'compliance_id,customer_id,transaction_id,rule_code,case_type,severity,reason,status,assigned_to,reviewed_by,reviewed_at,created_at,updated_at',
  '42_audit_log':'audit_id,event_at,user_id,action,module,record_id,old_value,new_value,reason,session_info',
  '43_whatsapp_queue':'queue_id,transaction_id,customer_id,phone,message_type,payload,status,attempts,last_attempt_at,sent_at,error_message,created_at,updated_at',
  '44_print_queue':'print_id,transaction_id,document_type,template,payload,status,attempts,last_attempt_at,printed_at,error_message,created_at,updated_at'
};

function installDatabase() {
  const ss = getDatabase_();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    let created=0, valid=0;
    Object.keys(MC_DATABASE_SCHEMA).forEach(function(name) {
      const headers=MC_DATABASE_SCHEMA[name].split(',');
      let sh=ss.getSheetByName(name);
      if (!sh) {
        sh=ss.insertSheet(name);
        sh.getRange(1,1,1,headers.length).setValues([headers]);
        sh.setFrozenRows(1);
        sh.getRange(1,1,1,headers.length).setFontWeight('bold');
        created++;
      } else if (headersMatch_(sh,headers)) {
        valid++;
      } else {
        throw new Error('Schema mismatch pada sheet '+name+'. Installer dihentikan agar data tidak tertimpa.');
      }
    });
    SpreadsheetApp.flush();
    return {success:true,total:Object.keys(MC_DATABASE_SCHEMA).length,created:created,valid:valid};
  } finally {
    lock.releaseLock();
  }
}

function headersMatch_(sh,headers) {
  if (sh.getLastRow()<1 || sh.getLastColumn()!==headers.length) return false;
  const current=sh.getRange(1,1,1,headers.length).getValues()[0];
  return headers.every(function(h,i){return String(current[i]||'').trim()===h;});
}

function databaseStatus() {
  const ss=getDatabase_();
  return Object.keys(MC_DATABASE_SCHEMA).map(function(name){
    const sh=ss.getSheetByName(name);
    const headers=MC_DATABASE_SCHEMA[name].split(',');
    return {sheet:name,exists:!!sh,valid:!!sh&&headersMatch_(sh,headers),rows:sh?Math.max(0,sh.getLastRow()-1):0};
  });
}
