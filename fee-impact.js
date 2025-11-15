// Common inputs
const principalInput = document.querySelector("#comparisonPrincipal");
const rateInput = document.querySelector("#comparisonRate");
const yearsInput = document.querySelector("#comparisonYears");
const frequencySelect = document.querySelector("#comparisonFrequency");

// Scenario 1 inputs
const scenario1Name = document.querySelector("#scenario1Name");
const scenario1Starter = document.querySelector("#scenario1Starter");
const scenario1MER = document.querySelector("#scenario1MER");
const scenario1Advisory = document.querySelector("#scenario1Advisory");
const scenario1Trading = document.querySelector("#scenario1Trading");
const scenario1Other = document.querySelector("#scenario1Other");
const scenario1Final = document.querySelector("#scenario1Final");
const scenario1Fees = document.querySelector("#scenario1Fees");
const scenario1Net = document.querySelector("#scenario1Net");

// Scenario 2 inputs
const scenario2Name = document.querySelector("#scenario2Name");
const scenario2Starter = document.querySelector("#scenario2Starter");
const scenario2MER = document.querySelector("#scenario2MER");
const scenario2Advisory = document.querySelector("#scenario2Advisory");
const scenario2Trading = document.querySelector("#scenario2Trading");
const scenario2Other = document.querySelector("#scenario2Other");
const scenario2Final = document.querySelector("#scenario2Final");
const scenario2Fees = document.querySelector("#scenario2Fees");
const scenario2Net = document.querySelector("#scenario2Net");

// Scenario 3 inputs
const scenario3Name = document.querySelector("#scenario3Name");
const scenario3Starter = document.querySelector("#scenario3Starter");
const scenario3MER = document.querySelector("#scenario3MER");
const scenario3Advisory = document.querySelector("#scenario3Advisory");
const scenario3Trading = document.querySelector("#scenario3Trading");
const scenario3Other = document.querySelector("#scenario3Other");
const scenario3Final = document.querySelector("#scenario3Final");
const scenario3Fees = document.querySelector("#scenario3Fees");
const scenario3Net = document.querySelector("#scenario3Net");

// Summary table elements
const summaryHeader1 = document.querySelector("#summaryHeader1");
const summaryHeader2 = document.querySelector("#summaryHeader2");
const summaryHeader3 = document.querySelector("#summaryHeader3");
const summaryFinal1 = document.querySelector("#summaryFinal1");
const summaryFinal2 = document.querySelector("#summaryFinal2");
const summaryFinal3 = document.querySelector("#summaryFinal3");
const summaryFees1 = document.querySelector("#summaryFees1");
const summaryFees2 = document.querySelector("#summaryFees2");
const summaryFees3 = document.querySelector("#summaryFees3");
const summaryNet1 = document.querySelector("#summaryNet1");
const summaryNet2 = document.querySelector("#summaryNet2");
const summaryNet3 = document.querySelector("#summaryNet3");
const summaryDiff1 = document.querySelector("#summaryDiff1");
const summaryDiff2 = document.querySelector("#summaryDiff2");
const summaryDiff3 = document.querySelector("#summaryDiff3");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const safeNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const calculateScenario = (starterPercent, merPercent, advisoryPercent, tradingFees, otherFees) => {
  const principal = safeNumber(principalInput.value);
  const grossRate = safeNumber(rateInput.value) / 100;
  const years = safeNumber(yearsInput.value);
  const frequency = Math.max(1, safeNumber(frequencySelect.value));

  const starter = safeNumber(starterPercent) / 100;
  const mer = safeNumber(merPercent) / 100;
  const advisory = safeNumber(advisoryPercent) / 100;
  const trading = safeNumber(tradingFees);
  const other = safeNumber(otherFees);

  // Calculate starter fee and reduce initial investment
  const starterFee = principal * starter;
  const actualStartingPrincipal = principal - starterFee;

  // Calculate net rate after MER and advisory fee
  const totalAnnualFeePercent = mer + advisory;
  const netRate = Math.max(0, grossRate - totalAnnualFeePercent);

  // Calculate future value with compound interest
  let balance = actualStartingPrincipal;
  let totalFeesPaid = starterFee; // Start with starter fee

  // Simulate year by year to account for fixed fees
  for (let year = 1; year <= years; year++) {
    // Compound interest for this year
    const periodsThisYear = frequency;
    if (netRate > 0) {
      balance = balance * Math.pow(1 + netRate / frequency, periodsThisYear);
    }

    // Deduct fixed annual fees
    const annualFixedFees = trading + other;
    balance = Math.max(0, balance - annualFixedFees);
    totalFeesPaid += annualFixedFees;

    // Calculate percentage-based fees for this year
    // (MER + advisory are already accounted for in netRate, but we want to show total fees paid)
    const percentageFeesThisYear = balance * totalAnnualFeePercent;
    totalFeesPaid += percentageFeesThisYear;
  }

  return {
    finalBalance: balance,
    totalFees: totalFeesPaid,
    netReturn: netRate,
  };
};

const adjustFontSize = (element) => {
  const length = element.textContent.length;
  element.classList.remove("long-value", "very-long-value");
  if (length > 12) {
    element.classList.add("very-long-value");
  } else if (length > 10) {
    element.classList.add("long-value");
  }
};

const recalculateAll = () => {
  console.log('=== recalculateAll called ===');
  console.log('Principal:', principalInput?.value);
  console.log('Rate:', rateInput?.value);
  console.log('Years:', yearsInput?.value);
  console.log('Scenario 1 Starter:', scenario1Starter?.value);
  console.log('Scenario 1 MER:', scenario1MER?.value);
  
  try {
    // Calculate all scenarios
    const result1 = calculateScenario(
      scenario1Starter.value,
      scenario1MER.value,
      scenario1Advisory.value,
      scenario1Trading.value,
      scenario1Other.value
    );
    console.log('Result 1:', result1);
    
    const result2 = calculateScenario(
      scenario2Starter.value,
      scenario2MER.value,
      scenario2Advisory.value,
      scenario2Trading.value,
      scenario2Other.value
    );
    console.log('Result 2:', result2);
    
    const result3 = calculateScenario(
      scenario3Starter.value,
      scenario3MER.value,
      scenario3Advisory.value,
      scenario3Trading.value,
      scenario3Other.value
    );
    console.log('Result 3:', result3);

  // Update scenario cards
  scenario1Final.textContent = currencyFormatter.format(result1.finalBalance);
  scenario1Fees.textContent = currencyFormatter.format(result1.totalFees);
  scenario1Net.textContent = percentFormatter.format(result1.netReturn);

  scenario2Final.textContent = currencyFormatter.format(result2.finalBalance);
  scenario2Fees.textContent = currencyFormatter.format(result2.totalFees);
  scenario2Net.textContent = percentFormatter.format(result2.netReturn);

  scenario3Final.textContent = currencyFormatter.format(result3.finalBalance);
  scenario3Fees.textContent = currencyFormatter.format(result3.totalFees);
  scenario3Net.textContent = percentFormatter.format(result3.netReturn);

  // Adjust font sizes for scenario cards
  adjustFontSize(scenario1Final);
  adjustFontSize(scenario1Fees);
  adjustFontSize(scenario2Final);
  adjustFontSize(scenario2Fees);
  adjustFontSize(scenario3Final);
  adjustFontSize(scenario3Fees);

  // Update summary table headers
  summaryHeader1.textContent = scenario1Name.value || "Scenario 1";
  summaryHeader2.textContent = scenario2Name.value || "Scenario 2";
  summaryHeader3.textContent = scenario3Name.value || "Scenario 3";

  // Update summary table values
  summaryFinal1.textContent = currencyFormatter.format(result1.finalBalance);
  summaryFinal2.textContent = currencyFormatter.format(result2.finalBalance);
  summaryFinal3.textContent = currencyFormatter.format(result3.finalBalance);

  summaryFees1.textContent = currencyFormatter.format(result1.totalFees);
  summaryFees2.textContent = currencyFormatter.format(result2.totalFees);
  summaryFees3.textContent = currencyFormatter.format(result3.totalFees);

  summaryNet1.textContent = percentFormatter.format(result1.netReturn);
  summaryNet2.textContent = percentFormatter.format(result2.netReturn);
  summaryNet3.textContent = percentFormatter.format(result3.netReturn);

  // Adjust font sizes for summary table
  [summaryFinal1, summaryFinal2, summaryFinal3, 
   summaryFees1, summaryFees2, summaryFees3].forEach(adjustFontSize);

  // Calculate differences from best scenario
  const bestBalance = Math.max(
    result1.finalBalance,
    result2.finalBalance,
    result3.finalBalance
  );

  const diff1 = result1.finalBalance - bestBalance;
  const diff2 = result2.finalBalance - bestBalance;
  const diff3 = result3.finalBalance - bestBalance;

  summaryDiff1.textContent =
    diff1 === 0 ? "Best!" : currencyFormatter.format(diff1);
  summaryDiff2.textContent =
    diff2 === 0 ? "Best!" : currencyFormatter.format(diff2);
  summaryDiff3.textContent =
    diff3 === 0 ? "Best!" : currencyFormatter.format(diff3);

  // Add visual styling to best option
  [summaryDiff1, summaryDiff2, summaryDiff3].forEach((el) => {
    el.classList.remove("best-option");
    if (el.textContent === "Best!") {
      el.classList.add("best-option");
    }
  });
  
  console.log('=== Update complete ===');
  console.log('Summary Final 1:', summaryFinal1?.textContent);
  console.log('Summary Final 2:', summaryFinal2?.textContent);
  console.log('Summary Final 3:', summaryFinal3?.textContent);
  
  } catch (error) {
    console.error('Error in recalculateAll:', error);
    console.error('Error stack:', error.stack);
    alert('Error calculating results. Please check the browser console for details.');
  }
};

// Add event listeners to all inputs
const allInputs = [
  principalInput,
  rateInput,
  yearsInput,
  scenario1Starter,
  scenario1MER,
  scenario1Advisory,
  scenario1Trading,
  scenario1Other,
  scenario2Starter,
  scenario2MER,
  scenario2Advisory,
  scenario2Trading,
  scenario2Other,
  scenario3Starter,
  scenario3MER,
  scenario3Advisory,
  scenario3Trading,
  scenario3Other,
];

allInputs.forEach((input) => {
  if (input) {
    input.addEventListener("input", recalculateAll);
  } else {
    console.warn('Missing input element');
  }
});

if (frequencySelect) {
  frequencySelect.addEventListener("change", recalculateAll);
}

// Update headers when names change
[scenario1Name, scenario2Name, scenario3Name].forEach((nameInput) => {
  if (nameInput) {
    nameInput.addEventListener("input", recalculateAll);
  }
});

// Add button event listener
const recalculateBtn = document.querySelector("#recalculateBtn");
if (recalculateBtn) {
  recalculateBtn.addEventListener("click", () => {
    // Visual feedback
    recalculateBtn.textContent = '✓ Updated!';
    recalculateBtn.style.background = '#15803d';
    
    recalculateAll();
    
    // Reset button after a moment
    setTimeout(() => {
      recalculateBtn.textContent = '↻ Recalculate';
      recalculateBtn.style.background = '';
    }, 1000);
  });
}

// Test calculation with known values
console.log('===== MATH TEST =====');
const testResult = calculateScenario(10, 0.11, 0, 20, 0); // 10% starter, 0.11% MER, 0% advisory, $20 trading, $0 other
console.log('Test calculation (10% starter fee on $10,000):', testResult);
console.log('Expected: starter fee = $1000, so starting with $9000');
console.log('====================');

// Initial calculation
console.log('===== DOM ELEMENT CHECK =====');
console.log('principalInput:', principalInput);
console.log('scenario1Starter:', scenario1Starter);
console.log('scenario1MER:', scenario1MER);
console.log('scenario1Final:', scenario1Final);
console.log('summaryFinal1:', summaryFinal1);
console.log('recalculateBtn:', recalculateBtn);
console.log('===========================');

try {
  recalculateAll();
  console.log('Initial calculation completed successfully');
} catch (error) {
  console.error('Error in initial calculation:', error);
  console.error('Error stack:', error.stack);
  alert('Failed to load calculator. Error: ' + error.message);
}

