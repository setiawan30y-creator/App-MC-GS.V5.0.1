/** Internal helpers */
function getTableObjects_(name) {
  const rows=getTable_(name);
  if(rows.length<2) return [];
  const headers=rows[0];
  return rows.slice(1).filter(function(row){return row.some(function(v){return v!=='' && v!==null;});}).map(function(row){return rowToObject_(headers,row);});
}
