const principalInput = document.querySelector("#principal");
const rateInput = document.querySelector("#rate");
const monthlyContributionInput = document.querySelector("#monthlyContribution");
const merInput = document.querySelector("#mer");
const frequencySelect = document.querySelector("#frequency");
const yearsInput = document.querySelector("#years");
const futureValueDisplay = document.querySelector("#futureValue");
const totalContributedDisplay = document.querySelector("#totalContributed");
const interestEarnedDisplay = document.querySelector("#interestEarned");
const scheduleLink = document.querySelector("#scheduleLink");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const safeNumber = (value) => {
  // Treat invalid or negative entries as zero to keep calculations stable.
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const recalculate = () => {
  const principal = safeNumber(principalInput.value);
  const nominalRate = safeNumber(rateInput.value) / 100;
  const monthlyContribution = safeNumber(monthlyContributionInput.value);
  const mer = safeNumber(merInput.value) / 100;
  const periodsPerYear = Math.max(1, safeNumber(frequencySelect.value));
  const years = safeNumber(yearsInput.value);

  const totalPeriods = periodsPerYear * years;

  // Calculate the net return after MER
  const netRate = Math.max(0, nominalRate - mer);
  const ratePerPeriod = netRate / periodsPerYear;

  // Calculate future value of principal (lump sum)
  let futureValuePrincipal = principal;
  if (principal > 0 && ratePerPeriod > 0 && totalPeriods > 0) {
    futureValuePrincipal = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
  }

  // Calculate future value of monthly contributions (annuity)
  // We need to convert monthly contributions to match the compounding frequency
  const monthsTotal = years * 12;
  let futureValueContributions = 0;
  
  if (monthlyContribution > 0 && ratePerPeriod > 0) {
    // For each month's contribution, calculate its future value
    for (let month = 1; month <= monthsTotal; month++) {
      const periodsRemaining = (monthsTotal - month) * (periodsPerYear / 12);
      futureValueContributions += monthlyContribution * Math.pow(1 + ratePerPeriod, periodsRemaining);
    }
  } else if (monthlyContribution > 0) {
    // If no interest, just sum contributions
    futureValueContributions = monthlyContribution * monthsTotal;
  }

  const futureValue = futureValuePrincipal + futureValueContributions;
  const totalContributed = principal + (monthlyContribution * monthsTotal);
  const interestEarned = Math.max(futureValue - totalContributed, 0);

  // Update display values
  futureValueDisplay.textContent = currencyFormatter.format(futureValue);
  totalContributedDisplay.textContent = currencyFormatter.format(totalContributed);
  interestEarnedDisplay.textContent = currencyFormatter.format(interestEarned);

  // Dynamically adjust font size based on text length
  const adjustFontSize = (element) => {
    const length = element.textContent.length;
    element.classList.remove("long-value", "very-long-value");
    if (length > 12) {
      element.classList.add("very-long-value");
    } else if (length > 10) {
      element.classList.add("long-value");
    }
  };

  adjustFontSize(futureValueDisplay);
  adjustFontSize(totalContributedDisplay);
  adjustFontSize(interestEarnedDisplay);

  if (scheduleLink) {
    const params = new URLSearchParams({
      principal: principalInput.value || "0",
      rate: rateInput.value || "0",
      monthlyContribution: monthlyContributionInput.value || "0",
      mer: merInput.value || "0",
      frequency: frequencySelect.value || "1",
      years: yearsInput.value || "0",
    });
    scheduleLink.href = `schedule.html?${params.toString()}`;
  }
};

for (const input of [principalInput, rateInput, monthlyContributionInput, merInput, yearsInput]) {
  input.addEventListener("input", recalculate);
}

frequencySelect.addEventListener("change", recalculate);

recalculate();
