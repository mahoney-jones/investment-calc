// Wait for DOM to be ready before accessing elements
const summaryNode = document.querySelector("#summary");
const bodyNode = document.querySelector("#scheduleBody");
const tableHeadersNode = document.querySelector("#tableHeaders");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const params = new URLSearchParams(window.location.search);

const toPositiveNumber = (value, fallback = 0) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const principal = toPositiveNumber(params.get("principal"));
const ratePercent = toPositiveNumber(params.get("rate"));
const monthlyContribution = toPositiveNumber(params.get("monthlyContribution"));
const merPercent = toPositiveNumber(params.get("mer"));
const frequency = Math.max(1, toPositiveNumber(params.get("frequency"), 1));
const years = toPositiveNumber(params.get("years"));

const nominalRate = ratePercent / 100;
const mer = merPercent / 100;
const netRate = Math.max(0, nominalRate - mer);
const totalPeriods = Math.round(frequency * years);
const ratePerPeriod = netRate / frequency;
const periodsPerMonth = frequency / 12;

const renderSummary = () => {
  if (!summaryNode) {
    return;
  }

  const summaryCards = [
    { label: "Principal", value: currencyFormatter.format(principal) },
    { label: "Annual Rate", value: percentFormatter.format(nominalRate) },
  ];

  if (mer > 0) {
    summaryCards.push({ label: "MER", value: percentFormatter.format(mer) });
    summaryCards.push({ label: "Net Rate", value: percentFormatter.format(netRate) });
  }

  summaryCards.push(
    { label: "Monthly Contribution", value: currencyFormatter.format(monthlyContribution) },
    { label: "Compounds / Year", value: frequency.toLocaleString() },
    { label: "Years Invested", value: years.toLocaleString() },
    { label: "Rate / Period", value: percentFormatter.format(ratePerPeriod) },
    { label: "Total Periods", value: totalPeriods.toLocaleString() }
  );

  summaryNode.innerHTML = summaryCards
    .map((card) => `
      <div class="summary-card">
        <span class="label">${card.label}</span>
        <span class="value">${card.value}</span>
      </div>
    `)
    .join("");
};

const renderSchedule = () => {
  if (!bodyNode) {
    return;
  }

  if (principal <= 0 || years <= 0 || totalPeriods === 0) {
    bodyNode.innerHTML = `
      <tr>
        <td colspan="${monthlyContribution > 0 ? '8' : '4'}" class="empty">
          Add a principal amount and investment length in the calculator to see the schedule.
        </td>
      </tr>
    `;
    return;
  }

  let balance = principal;
  let cumulativeInterest = 0;
  let cumulativeContributions = 0;
  const rows = [];
  const monthsTotal = years * 12;
  
  // Calculate which months should receive contributions in each period
  // Contributions happen monthly, but compounding may happen at different frequencies
  const getMonthsInPeriod = (period) => {
    // Calculate the start and end month for this period
    const startMonth = Math.floor(((period - 1) / frequency) * 12) + 1;
    const endMonth = Math.floor((period / frequency) * 12);
    return { startMonth, endMonth };
  };

  // Track which months have already had contributions added
  const contributedMonths = new Set();

  for (let period = 1; period <= totalPeriods; period += 1) {
    const startingBalance = balance;
    let contributionThisPeriod = 0;
    
    // Add contributions for any new months that fall within this period
    // This ensures contributions happen monthly regardless of compounding frequency
    if (monthlyContribution > 0) {
      const { startMonth, endMonth } = getMonthsInPeriod(period);
      
      // Add contributions for all months in this period that haven't been contributed yet
      for (let month = startMonth; month <= endMonth && month <= monthsTotal; month++) {
        if (!contributedMonths.has(month)) {
          contributionThisPeriod += monthlyContribution;
          balance += monthlyContribution;
          cumulativeContributions += monthlyContribution;
          contributedMonths.add(month);
        }
      }
    }

    const balanceAfterContribution = balance;
    const interestThisPeriod = balance * ratePerPeriod;
    balance += interestThisPeriod;
    cumulativeInterest += interestThisPeriod;

    if (monthlyContribution > 0) {
      rows.push(`
        <tr>
          <th scope="row">${period}</th>
          <td>${currencyFormatter.format(startingBalance)}</td>
          <td>${currencyFormatter.format(contributionThisPeriod)}</td>
          <td>${currencyFormatter.format(balanceAfterContribution)}</td>
          <td>${currencyFormatter.format(interestThisPeriod)}</td>
          <td>${currencyFormatter.format(balance)}</td>
          <td>${currencyFormatter.format(cumulativeContributions)}</td>
          <td>${currencyFormatter.format(cumulativeInterest)}</td>
        </tr>
      `);
    } else {
      rows.push(`
        <tr>
          <th scope="row">${period}</th>
          <td>${currencyFormatter.format(balance)}</td>
          <td>${currencyFormatter.format(interestThisPeriod)}</td>
          <td>${currencyFormatter.format(cumulativeInterest)}</td>
        </tr>
      `);
    }
  }

  bodyNode.innerHTML = rows.join("");
};

// Update table headers dynamically based on whether contributions are present
const updateTableHeaders = () => {
  if (!tableHeadersNode) {
    console.warn("Table headers element not found");
    return;
  }
  
  if (monthlyContribution > 0) {
    tableHeadersNode.innerHTML = `
      <th scope="col">Period</th>
      <th scope="col">Starting Balance</th>
      <th scope="col">Contribution</th>
      <th scope="col">Balance After Contribution</th>
      <th scope="col">Interest This Period</th>
      <th scope="col">Ending Balance</th>
      <th scope="col">Total Contributed</th>
      <th scope="col">Cumulative Interest</th>
    `;
  } else {
    tableHeadersNode.innerHTML = `
      <th scope="col">Period</th>
      <th scope="col">Balance After Interest</th>
      <th scope="col">Interest This Period</th>
      <th scope="col">Cumulative Interest</th>
    `;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    updateTableHeaders();
    renderSummary();
    renderSchedule();
  });
} else {
  updateTableHeaders();
  renderSummary();
  renderSchedule();
}
