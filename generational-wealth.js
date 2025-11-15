const numChildrenInput = document.querySelector("#numChildren");
const rateInput = document.querySelector("#rate");
const frequencySelect = document.querySelector("#frequency");
const yearsToMaturityInput = document.querySelector("#yearsToMaturity");
const monthlyContributionInput = document.querySelector("#monthlyContribution");
const merInput = document.querySelector("#mer");
const childrenContainer = document.querySelector("#childrenContainer");
const childrenResultsContainer = document.querySelector("#childrenResultsContainer");

const totalInvestedDisplay = document.querySelector("#totalInvested");
const totalProjectedValueDisplay = document.querySelector("#totalProjectedValue");
const averagePerChildDisplay = document.querySelector("#averagePerChild");
const totalGrowthDisplay = document.querySelector("#totalGrowth");

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
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
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

const calculateFutureValue = (principal, monthlyContribution, rate, mer, periodsPerYear, years) => {
  const totalPeriods = periodsPerYear * years;
  const netRate = Math.max(0, rate - mer);
  const ratePerPeriod = netRate / periodsPerYear;

  // Calculate future value of principal (lump sum)
  let futureValuePrincipal = principal;
  if (principal > 0 && ratePerPeriod > 0 && totalPeriods > 0) {
    futureValuePrincipal = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
  }

  // Calculate future value of monthly contributions
  const monthsTotal = years * 12;
  let futureValueContributions = 0;
  
  if (monthlyContribution > 0 && ratePerPeriod > 0) {
    for (let month = 1; month <= monthsTotal; month++) {
      const periodsRemaining = (monthsTotal - month) * (periodsPerYear / 12);
      futureValueContributions += monthlyContribution * Math.pow(1 + ratePerPeriod, periodsRemaining);
    }
  } else if (monthlyContribution > 0) {
    futureValueContributions = monthlyContribution * monthsTotal;
  }

  return futureValuePrincipal + futureValueContributions;
};

const calculateMilestones = (principal, monthlyContribution, rate, mer, periodsPerYear, targetAmounts) => {
  const netRate = Math.max(0, rate - mer);
  const ratePerPeriod = netRate / periodsPerYear;
  const milestones = [];

  if (ratePerPeriod <= 0) return milestones;

  for (const target of targetAmounts) {
    let years = 0;
    let balance = principal;
    const monthsPerPeriod = 12 / periodsPerYear;
    
    while (balance < target && years < 100) {
      // Add monthly contributions for this period
      for (let i = 0; i < monthsPerPeriod; i++) {
        balance += monthlyContribution;
      }
      // Apply compound interest
      balance = balance * (1 + ratePerPeriod);
      years += 1 / periodsPerYear;
    }

    if (balance >= target) {
      milestones.push({ amount: target, years: Math.ceil(years) });
    }
  }

  return milestones;
};

const createChildInputs = (index) => {
  const childDiv = document.createElement("div");
  childDiv.className = "child-input-group";
  childDiv.innerHTML = `
    <h3>Child ${index + 1}</h3>
    <div class="form-section form-section-single-row">
      <div class="field">
        <label for="childName${index}">Name (optional)</label>
        <input
          id="childName${index}"
          type="text"
          placeholder="Child ${index + 1}"
          aria-describedby="childName${index}-help"
        />
        <small id="childName${index}-help">Optional name for this child.</small>
      </div>

      <div class="field">
        <label for="childAge${index}">Current Age</label>
        <div class="field-input">
          <input
            id="childAge${index}"
            type="number"
            min="0"
            max="100"
            step="1"
            value="0"
            aria-describedby="childAge${index}-help"
          />
          <span class="suffix">yrs</span>
        </div>
        <small id="childAge${index}-help">Current age of child.</small>
      </div>

      <div class="field">
        <label for="childPrincipal${index}">Initial Investment</label>
        <div class="field-input">
          <span class="prefix">$</span>
          <input
            id="childPrincipal${index}"
            type="number"
            step="1000"
            min="0"
            value="10000"
            aria-describedby="childPrincipal${index}-help"
          />
        </div>
        <small id="childPrincipal${index}-help">Upfront investment for this child.</small>
      </div>

      <div class="field">
        <label for="childYears${index}">Years Until Maturity</label>
        <div class="field-input">
          <input
            id="childYears${index}"
            type="number"
            min="1"
            step="1"
            value="25"
            aria-describedby="childYears${index}-help"
          />
          <span class="suffix">yrs</span>
        </div>
        <small id="childYears${index}-help">Years until this child's investment matures.</small>
      </div>
    </div>
  `;
  return childDiv;
};

const generateChildrenInputs = () => {
  const numChildren = Math.max(1, Math.min(10, safeNumber(numChildrenInput.value)));
  childrenContainer.innerHTML = "";

  for (let i = 0; i < numChildren; i++) {
    const childDiv = createChildInputs(i);
    childrenContainer.appendChild(childDiv);

    // Add event listeners to new inputs
    const nameInput = document.querySelector(`#childName${i}`);
    const ageInput = document.querySelector(`#childAge${i}`);
    const principalInput = document.querySelector(`#childPrincipal${i}`);
    const yearsInput = document.querySelector(`#childYears${i}`);

    [nameInput, ageInput, principalInput, yearsInput].forEach(input => {
      if (input) {
        input.addEventListener("input", recalculate);
      }
    });
  }

  recalculate();
};

const recalculate = () => {
  const rate = safeNumber(rateInput.value) / 100;
  const mer = safeNumber(merInput.value) / 100;
  const periodsPerYear = Math.max(1, safeNumber(frequencySelect.value));
  const defaultYears = safeNumber(yearsToMaturityInput.value);
  const monthlyContribution = safeNumber(monthlyContributionInput.value);
  const numChildren = Math.max(1, Math.min(10, safeNumber(numChildrenInput.value)));

  const children = [];
  let totalInvested = 0;
  let totalProjectedValue = 0;

  for (let i = 0; i < numChildren; i++) {
    const nameInput = document.querySelector(`#childName${i}`);
    const ageInput = document.querySelector(`#childAge${i}`);
    const principalInput = document.querySelector(`#childPrincipal${i}`);
    const yearsInput = document.querySelector(`#childYears${i}`);

    if (!principalInput) continue;

    const name = nameInput?.value.trim() || `Child ${i + 1}`;
    const age = safeNumber(ageInput?.value || 0);
    const principal = safeNumber(principalInput.value);
    const years = safeNumber(yearsInput?.value || defaultYears);

    const futureValue = calculateFutureValue(
      principal,
      monthlyContribution,
      rate,
      mer,
      periodsPerYear,
      years
    );

    const totalContributed = principal + (monthlyContribution * years * 12);
    const growth = Math.max(futureValue - totalContributed, 0);

    totalInvested += totalContributed;
    totalProjectedValue += futureValue;

    children.push({
      name,
      age,
      principal,
      years,
      futureValue,
      totalContributed,
      growth,
    });
  }

  // Update summary displays
  totalInvestedDisplay.textContent = currencyFormatter.format(totalInvested);
  totalProjectedValueDisplay.textContent = currencyFormatter.format(totalProjectedValue);
  const averageValue = numChildren > 0 ? totalProjectedValue / numChildren : 0;
  averagePerChildDisplay.textContent = currencyFormatter.format(averageValue);
  const totalGrowth = totalProjectedValue - totalInvested;
  totalGrowthDisplay.textContent = currencyFormatter.format(Math.max(totalGrowth, 0));

  adjustFontSize(totalInvestedDisplay);
  adjustFontSize(totalProjectedValueDisplay);
  adjustFontSize(averagePerChildDisplay);
  adjustFontSize(totalGrowthDisplay);

  // Update individual child results
  updateChildrenResults(children, rate, mer, periodsPerYear, monthlyContribution);
};

const updateChildrenResults = (children, rate, mer, periodsPerYear, monthlyContribution) => {
  childrenResultsContainer.innerHTML = "";

  if (children.length === 0) {
    return;
  }

  const milestoneTargets = [100000, 250000, 500000, 1000000, 2500000];

  children.forEach((child) => {
    const milestones = calculateMilestones(
      child.principal,
      monthlyContribution,
      rate,
      mer,
      periodsPerYear,
      milestoneTargets
    );

    const childCard = document.createElement("div");
    childCard.className = "child-result-card";
    
    const milestonesHtml = milestones.length > 0
      ? `<div class="milestones">
          <h4>Milestones</h4>
          <ul>
            ${milestones.map(m => `<li>Reaches ${currencyFormatter.format(m.amount)} in ${m.years} years</li>`).join("")}
          </ul>
        </div>`
      : "";

    childCard.innerHTML = `
      <div class="child-result-header">
        <h3>${child.name}</h3>
        <span class="child-age">Age ${child.age}</span>
      </div>
      <div class="child-result-grid">
        <div class="child-result-item">
          <span class="label">Initial Investment</span>
          <span class="value">${currencyFormatter.format(child.principal)}</span>
        </div>
        <div class="child-result-item">
          <span class="label">Years Until Maturity</span>
          <span class="value">${child.years} years</span>
        </div>
        <div class="child-result-item">
          <span class="label">Total Contributed</span>
          <span class="value">${currencyFormatter.format(child.totalContributed)}</span>
        </div>
        <div class="child-result-item">
          <span class="label">Projected Value</span>
          <span class="value highlight">${currencyFormatter.format(child.futureValue)}</span>
        </div>
        <div class="child-result-item">
          <span class="label">Total Growth</span>
          <span class="value">${currencyFormatter.format(child.growth)}</span>
        </div>
        <div class="child-result-item">
          <span class="label">Maturity Age</span>
          <span class="value">${child.age + child.years} years old</span>
        </div>
      </div>
      ${milestonesHtml}
    `;

    childrenResultsContainer.appendChild(childCard);
  });
};

// Initialize
numChildrenInput.addEventListener("input", generateChildrenInputs);
rateInput.addEventListener("input", recalculate);
frequencySelect.addEventListener("change", recalculate);
yearsToMaturityInput.addEventListener("input", recalculate);
monthlyContributionInput.addEventListener("input", recalculate);
merInput.addEventListener("input", recalculate);

generateChildrenInputs();

