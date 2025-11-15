const summaryNode = document.querySelector("#summary");
const bodyNode = document.querySelector("#scheduleBody");

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
const frequency = Math.max(1, toPositiveNumber(params.get("frequency"), 1));
const years = toPositiveNumber(params.get("years"));

const nominalRate = ratePercent / 100;
const totalPeriods = Math.round(frequency * years);
const ratePerPeriod = nominalRate / frequency;

const renderSummary = () => {
  if (!summaryNode) {
    return;
  }

  summaryNode.innerHTML = `
    <div class="summary-card">
      <span class="label">Principal</span>
      <span class="value">${currencyFormatter.format(principal)}</span>
    </div>
    <div class="summary-card">
      <span class="label">Annual Rate</span>
      <span class="value">${percentFormatter.format(nominalRate)}</span>
    </div>
    <div class="summary-card">
      <span class="label">Compounds / Year</span>
      <span class="value">${frequency.toLocaleString()}</span>
    </div>
    <div class="summary-card">
      <span class="label">Years Invested</span>
      <span class="value">${years.toLocaleString()}</span>
    </div>
    <div class="summary-card">
      <span class="label">Rate / Period</span>
      <span class="value">${percentFormatter.format(ratePerPeriod)}</span>
    </div>
    <div class="summary-card">
      <span class="label">Total Periods</span>
      <span class="value">${totalPeriods.toLocaleString()}</span>
    </div>
  `;
};

const renderSchedule = () => {
  if (!bodyNode) {
    return;
  }

  if (principal <= 0 || years <= 0 || totalPeriods === 0) {
    bodyNode.innerHTML = `
      <tr>
        <td colspan="4" class="empty">
          Add a principal amount and investment length in the calculator to see the schedule.
        </td>
      </tr>
    `;
    return;
  }

  let balance = principal;
  let cumulativeInterest = 0;
  const rows = [];

  for (let period = 1; period <= totalPeriods; period += 1) {
    const interestThisPeriod = balance * ratePerPeriod;
    balance += interestThisPeriod;
    cumulativeInterest += interestThisPeriod;

    rows.push(`
      <tr>
        <th scope="row">${period}</th>
        <td>${currencyFormatter.format(balance)}</td>
        <td>${currencyFormatter.format(interestThisPeriod)}</td>
        <td>${currencyFormatter.format(cumulativeInterest)}</td>
      </tr>
    `);
  }

  bodyNode.innerHTML = rows.join("");
};

renderSummary();
renderSchedule();
