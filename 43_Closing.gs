/** Closing foundation */
function calculateClosing(data) {
  const expected=Number(data.expectedCash)||0;
  const physical=Number(data.physicalCash)||0;
  const gantungan=Number(data.outstandingGantungan)||0;
  const actual=physical+gantungan;
  return {expectedCash:expected,physicalCash:physical,outstandingGantungan:gantungan,actualAccountedCash:actual,difference:actual-expected};
}
