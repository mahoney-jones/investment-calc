const currentAgeInput = document.querySelector("#currentAge");
const currentSavingsInput = document.querySelector("#currentSavings");
const monthlySavingsInput = document.querySelector("#monthlySavings");
const expectedReturnInput = document.querySelector("#expectedReturn");
const targetRetirementAgeInput = document.querySelector("#targetRetirementAge");
const desiredAnnualIncomeInput = document.querySelector("#desiredAnnualIncome");
const withdrawalRateInput = document.querySelector("#withdrawalRate");
const inflationRateInput = document.querySelector("#inflationRate");
const lifeExpectancyInput = document.querySelector("#lifeExpectancy");
const frequencySelect = document.querySelector("#frequency");

const yearsUntilRetirementDisplay = document.querySelector("#yearsUntilRetirement");
const retirementAgeDisplay = document.querySelector("#retirementAge");
const portfolioAtRetirementDisplay = document.querySelector("#portfolioAtRetirement");
const requiredPortfolioDisplay = document.querySelector("#requiredPortfolio");
const annualWithdrawalDisplay = document.querySelector("#annualWithdrawal");
const monthlySavingsNeededDisplay = document.querySelector("#monthlySavingsNeeded");
const timelineSection = document.querySelector("#timelineSection");
const timelineContent = document.querySelector("#timelineContent");

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const safeNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

// Calculate future value with monthly contributions
const calculateFutureValue = (principal, monthlyContribution, rate, periodsPerYear, years) => {
  const netRate = Math.max(0, rate);
  const ratePerPeriod = netRate / periodsPerYear;
  const totalPeriods = periodsPerYear * years;

  // Future value of principal
  let fvPrincipal = principal;
  if (principal > 0 && ratePerPeriod > 0 && totalPeriods > 0) {
    fvPrincipal = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
  }

  // Future value of monthly contributions
  let fvContributions = 0;
  if (monthlyContribution > 0 && totalPeriods > 0) {
    const monthsTotal = years * 12;
    if (ratePerPeriod > 0) {
      // Each monthly contribution compounds for different periods
      for (let month = 1; month <= monthsTotal; month++) {
        const periodsRemaining = totalPeriods - (month * (periodsPerYear / 12));
        if (periodsRemaining > 0) {
          fvContributions += monthlyContribution * Math.pow(1 + ratePerPeriod, periodsRemaining);
        } else {
          fvContributions += monthlyContribution;
        }
      }
    } else {
      fvContributions = monthlyContribution * monthsTotal;
    }
  }

  return fvPrincipal + fvContributions;
};

// Calculate present value needed for future value
const calculatePresentValue = (futureValue, rate, periodsPerYear, years) => {
  const netRate = Math.max(0, rate);
  const ratePerPeriod = netRate / periodsPerYear;
  const totalPeriods = periodsPerYear * years;

  if (ratePerPeriod > 0 && totalPeriods > 0) {
    return futureValue / Math.pow(1 + ratePerPeriod, totalPeriods);
  }
  return futureValue;
};

// Calculate required monthly savings to reach a target
const calculateRequiredMonthlySavings = (currentSavings, targetValue, rate, periodsPerYear, years) => {
  const netRate = Math.max(0, rate);
  const ratePerPeriod = netRate / periodsPerYear;
  const totalPeriods = periodsPerYear * years;
  const monthsTotal = years * 12;

  // Future value of current savings
  let fvCurrent = currentSavings;
  if (currentSavings > 0 && ratePerPeriod > 0 && totalPeriods > 0) {
    fvCurrent = currentSavings * Math.pow(1 + ratePerPeriod, totalPeriods);
  }

  // How much we need from contributions
  const neededFromContributions = Math.max(0, targetValue - fvCurrent);

  if (neededFromContributions <= 0) {
    return 0;
  }

  if (ratePerPeriod > 0) {
    // Calculate present value of annuity
    // Sum of (PMT * (1+r)^n) for each period
    let pvAnnuity = 0;
    for (let month = 1; month <= monthsTotal; month++) {
      const periodsRemaining = totalPeriods - (month * (periodsPerYear / 12));
      if (periodsRemaining > 0) {
        pvAnnuity += Math.pow(1 + ratePerPeriod, periodsRemaining);
      } else {
        pvAnnuity += 1;
      }
    }
    return neededFromContributions / pvAnnuity;
  } else {
    return neededFromContributions / monthsTotal;
  }
};

// Calculate when retirement is possible
const calculateRetirementAge = (currentAge, currentSavings, monthlySavings, desiredIncome, withdrawalRate, rate, periodsPerYear, inflationRate) => {
  const netRate = Math.max(0, rate);
  const withdrawalRateDecimal = withdrawalRate / 100;
  const inflationRateDecimal = inflationRate / 100;

  // Try different retirement ages
  for (let retirementAge = currentAge + 1; retirementAge <= 100; retirementAge++) {
    const years = retirementAge - currentAge;
    const portfolioValue = calculateFutureValue(currentSavings, monthlySavings, netRate, periodsPerYear, years);
    
    // Check if this portfolio can support the required income
    const inflationMultiplier = Math.pow(1 + inflationRateDecimal, years);
    const requiredIncomeInFutureDollars = desiredIncome * inflationMultiplier;
    const requiredPortfolio = requiredIncomeInFutureDollars / withdrawalRateDecimal;

    if (portfolioValue >= requiredPortfolio) {
      return retirementAge;
    }
  }

  return null; // Cannot retire with current plan
};

const recalculate = () => {
  const currentAge = safeNumber(currentAgeInput.value);
  const currentSavings = safeNumber(currentSavingsInput.value);
  const monthlySavings = safeNumber(monthlySavingsInput.value);
  const expectedReturn = safeNumber(expectedReturnInput.value) / 100;
  const targetRetirementAge = safeNumber(targetRetirementAgeInput.value);
  const desiredAnnualIncome = safeNumber(desiredAnnualIncomeInput.value);
  const withdrawalRate = safeNumber(withdrawalRateInput.value);
  const inflationRate = safeNumber(inflationRateInput.value) / 100;
  const lifeExpectancy = safeNumber(lifeExpectancyInput.value);
  const periodsPerYear = Math.max(1, safeNumber(frequencySelect.value));

  // Calculate years until retirement
  let yearsUntilRetirement = 0;
  let retirementAge = targetRetirementAge;
  let canRetire = true;

  if (targetRetirementAge > currentAge && targetRetirementAge <= 100) {
    yearsUntilRetirement = targetRetirementAge - currentAge;
    retirementAge = targetRetirementAge;
  } else {
    // Calculate when retirement is possible based on savings
    const calculatedAge = calculateRetirementAge(
      currentAge,
      currentSavings,
      monthlySavings,
      desiredAnnualIncome,
      withdrawalRate,
      expectedReturn,
      periodsPerYear,
      inflationRate * 100
    );
    
    if (calculatedAge) {
      retirementAge = calculatedAge;
      yearsUntilRetirement = retirementAge - currentAge;
    } else {
      canRetire = false;
      yearsUntilRetirement = 65 - currentAge; // Default for display
      retirementAge = 65;
    }
  }

  // Calculate portfolio value at retirement
  const portfolioAtRetirement = calculateFutureValue(
    currentSavings,
    monthlySavings,
    expectedReturn,
    periodsPerYear,
    yearsUntilRetirement
  );

  // Calculate required portfolio value (accounting for inflation)
  const inflationMultiplier = Math.pow(1 + inflationRate, yearsUntilRetirement);
  const requiredIncomeInFutureDollars = desiredAnnualIncome * inflationMultiplier;
  const requiredPortfolio = requiredIncomeInFutureDollars / (withdrawalRate / 100);

  // Calculate annual withdrawal amount
  const annualWithdrawal = portfolioAtRetirement * (withdrawalRate / 100);

  // Calculate required monthly savings to reach goal (only if we have a valid retirement age)
  let monthlySavingsNeeded = 0;
  if (yearsUntilRetirement > 0 && canRetire) {
    monthlySavingsNeeded = calculateRequiredMonthlySavings(
      currentSavings,
      requiredPortfolio,
      expectedReturn,
      periodsPerYear,
      yearsUntilRetirement
    );
  } else if (yearsUntilRetirement > 0) {
    // Calculate what's needed even if current plan doesn't work
    monthlySavingsNeeded = calculateRequiredMonthlySavings(
      currentSavings,
      requiredPortfolio,
      expectedReturn,
      periodsPerYear,
      yearsUntilRetirement
    );
  }

  // Update displays
  yearsUntilRetirementDisplay.textContent = canRetire ? yearsUntilRetirement.toString() : "Not achievable";
  retirementAgeDisplay.textContent = retirementAge.toString();
  portfolioAtRetirementDisplay.textContent = currencyFormatter.format(portfolioAtRetirement);
  requiredPortfolioDisplay.textContent = currencyFormatter.format(requiredPortfolio);
  annualWithdrawalDisplay.textContent = currencyFormatter.format(annualWithdrawal);
  monthlySavingsNeededDisplay.textContent = currencyFormatter.format(monthlySavingsNeeded);

  // Update help text
  const helpText = canRetire 
    ? "Years until you reach your retirement goal."
    : "Your current savings rate is insufficient. Increase monthly savings or adjust goals.";
  yearsUntilRetirementDisplay.parentElement.querySelector("small").textContent = helpText;

  // Generate timeline
  generateTimeline(
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlySavings,
    expectedReturn,
    periodsPerYear,
    withdrawalRate,
    inflationRate,
    portfolioAtRetirement
  );
};

const generateTimeline = (currentAge, retirementAge, lifeExpectancy, currentSavings, monthlySavings, rate, periodsPerYear, withdrawalRate, inflationRate, portfolioAtRetirement) => {
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
  
  if (yearsInRetirement <= 0) {
    timelineSection.style.display = "none";
    return;
  }

  timelineSection.style.display = "block";

  // Accumulation phase milestones
  const accumulationMilestones = [];
  const accumulationYears = retirementAge - currentAge;
  const milestoneInterval = Math.max(1, Math.floor(accumulationYears / 5));
  
  for (let i = 0; i <= accumulationYears; i += milestoneInterval) {
    if (i === 0) continue;
    const age = currentAge + i;
    const portfolioValue = calculateFutureValue(currentSavings, monthlySavings, rate, periodsPerYear, i);
    accumulationMilestones.push({ age, portfolioValue, phase: "accumulation" });
  }
  
  // Add retirement milestone
  accumulationMilestones.push({ 
    age: retirementAge, 
    portfolioValue: portfolioAtRetirement, 
    phase: "retirement-start" 
  });

  // Withdrawal phase milestones
  const withdrawalMilestones = [];
  const withdrawalInterval = Math.max(1, Math.floor(yearsInRetirement / 5));
  
  let remainingPortfolio = portfolioAtRetirement;
  const ratePerPeriod = rate / periodsPerYear;
  
  for (let i = 0; i <= yearsInRetirement; i += withdrawalInterval) {
    if (i === 0) continue;
    const age = retirementAge + i;
    const yearsElapsed = i;
    
    // Calculate withdrawal amount (inflation-adjusted) for this milestone
    const withdrawalAmount = portfolioAtRetirement * (withdrawalRate / 100) * Math.pow(1 + inflationRate, yearsElapsed - 1);
    
    // Simulate portfolio growth and withdrawals year by year up to this milestone
    let portfolioAtStartOfInterval = (i === withdrawalInterval) ? portfolioAtRetirement : remainingPortfolio;
    
    for (let year = 0; year < withdrawalInterval; year++) {
      const yearInRetirement = yearsElapsed - withdrawalInterval + year;
      if (yearInRetirement >= 0) {
        // Annual growth (compound over all periods in the year)
        portfolioAtStartOfInterval = portfolioAtStartOfInterval * Math.pow(1 + ratePerPeriod, periodsPerYear);
        
        // Annual withdrawal (inflation-adjusted)
        const annualWithdrawal = portfolioAtRetirement * (withdrawalRate / 100) * Math.pow(1 + inflationRate, yearInRetirement);
        portfolioAtStartOfInterval = Math.max(0, portfolioAtStartOfInterval - annualWithdrawal);
      }
    }
    
    remainingPortfolio = portfolioAtStartOfInterval;
    
    withdrawalMilestones.push({ 
      age, 
      portfolioValue: remainingPortfolio, 
      withdrawalAmount,
      phase: "withdrawal" 
    });
  }

  // Combine and format timeline
  const allMilestones = [...accumulationMilestones, ...withdrawalMilestones];
  
  const timelineHtml = `
    <div class="timeline-container">
      <div class="timeline-accumulation">
        <h3>Accumulation Phase (Age ${currentAge} - ${retirementAge})</h3>
        <div class="timeline-table-container">
          <table class="timeline-table">
            <thead>
              <tr>
                <th>Age</th>
                <th>Portfolio Value</th>
                <th>Years to Retirement</th>
              </tr>
            </thead>
            <tbody>
              ${accumulationMilestones.map(m => `
                <tr>
                  <td><strong>${m.age}</strong></td>
                  <td>${currencyFormatter.format(m.portfolioValue)}</td>
                  <td>${retirementAge - m.age} years</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="timeline-withdrawal">
        <h3>Withdrawal Phase (Age ${retirementAge} - ${lifeExpectancy})</h3>
        <div class="timeline-table-container">
          <table class="timeline-table">
            <thead>
              <tr>
                <th>Age</th>
                <th>Portfolio Value</th>
                <th>Annual Withdrawal</th>
                <th>Years in Retirement</th>
              </tr>
            </thead>
            <tbody>
              ${withdrawalMilestones.map(m => `
                <tr>
                  <td><strong>${m.age}</strong></td>
                  <td>${currencyFormatter.format(m.portfolioValue)}</td>
                  <td>${currencyFormatter.format(m.withdrawalAmount)}</td>
                  <td>${m.age - retirementAge} years</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  timelineContent.innerHTML = timelineHtml;
};

// Add event listeners
[currentAgeInput, currentSavingsInput, monthlySavingsInput, expectedReturnInput, 
 targetRetirementAgeInput, desiredAnnualIncomeInput, withdrawalRateInput, 
 inflationRateInput, lifeExpectancyInput, frequencySelect].forEach(input => {
  input.addEventListener("input", recalculate);
  input.addEventListener("change", recalculate);
});

// Initial calculation
recalculate();

