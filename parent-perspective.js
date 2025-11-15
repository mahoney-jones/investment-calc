// Initialize variables
let numKidsInput, investmentPerKidInput, rateInput, frequencySelect, merInput;
let kidMonthlyContributionInput, oldestKidAgeInput, kidSpacingInput;
let grandkidsPerKidInput, grandkidSeedAgeInput, grandkidSeedAmountInput, grandkidMonthlyContributionInput;
let totalInvestmentDisplay, totalGrandkidsDisplay, totalGrandkidSeedsDisplay;
let childrenResultsContainer;

const initializeElements = () => {
  numKidsInput = document.querySelector("#numKids");
  investmentPerKidInput = document.querySelector("#investmentPerKid");
  rateInput = document.querySelector("#rate");
  frequencySelect = document.querySelector("#frequency");
  merInput = document.querySelector("#mer");
  kidMonthlyContributionInput = document.querySelector("#kidMonthlyContribution");
  oldestKidAgeInput = document.querySelector("#oldestKidAge");
  kidSpacingInput = document.querySelector("#kidSpacing");
  grandkidsPerKidInput = document.querySelector("#grandkidsPerKid");
  grandkidSeedAgeInput = document.querySelector("#grandkidSeedAge");
  grandkidSeedAmountInput = document.querySelector("#grandkidSeedAmount");
  grandkidMonthlyContributionInput = document.querySelector("#grandkidMonthlyContribution");
  
  totalInvestmentDisplay = document.querySelector("#totalInvestment");
  totalGrandkidsDisplay = document.querySelector("#totalGrandkids");
  totalGrandkidSeedsDisplay = document.querySelector("#totalGrandkidSeeds");
  childrenResultsContainer = document.querySelector("#childrenResultsContainer");
  
  const requiredElements = [
    numKidsInput, investmentPerKidInput, rateInput, frequencySelect, merInput,
    kidMonthlyContributionInput, oldestKidAgeInput, kidSpacingInput,
    grandkidsPerKidInput, grandkidSeedAgeInput, grandkidSeedAmountInput,
    grandkidMonthlyContributionInput,
    totalInvestmentDisplay, totalGrandkidsDisplay, totalGrandkidSeedsDisplay,
    childrenResultsContainer
  ];
  
  const missingElements = requiredElements.filter(el => !el);
  if (missingElements.length > 0) {
    console.error('Missing required elements:', missingElements);
    return false;
  }
  
  return true;
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const safeNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const calculateFutureValue = (principal, rate, mer, periodsPerYear, years) => {
  const netRate = Math.max(0, rate - mer);
  const ratePerPeriod = netRate / periodsPerYear;
  const totalPeriods = periodsPerYear * years;
  
  if (ratePerPeriod <= 0 || totalPeriods <= 0) {
    return principal;
  }
  
  return principal * Math.pow(1 + ratePerPeriod, totalPeriods);
};

const calculateFutureValueOfContributions = (monthlyContribution, rate, mer, periodsPerYear, startAge, endAge) => {
  if (monthlyContribution <= 0 || startAge >= endAge) {
    return 0;
  }

  const netRate = Math.max(0, rate - mer);
  const ratePerPeriod = netRate / periodsPerYear;
  const years = endAge - startAge;
  const monthsTotal = years * 12;

  if (ratePerPeriod <= 0) {
    return monthlyContribution * monthsTotal;
  }

  let futureValue = 0;
  for (let month = 1; month <= monthsTotal; month++) {
    const periodsRemaining = (monthsTotal - month) * (periodsPerYear / 12);
    futureValue += monthlyContribution * Math.pow(1 + ratePerPeriod, periodsRemaining);
  }

  return futureValue;
};

const adjustFontSize = (element) => {
  const length = element.textContent.replace(/[^0-9]/g, "").length;
  element.classList.remove("long-value", "very-long-value");
  if (length > 15) {
    element.classList.add("very-long-value");
  } else if (length > 10) {
    element.classList.add("long-value");
  }
};

const recalculate = () => {
  try {
    if (!initializeElements()) {
      return;
    }
    
    const numKids = Math.max(1, Math.min(10, safeNumber(numKidsInput.value)));
    const investmentPerKid = safeNumber(investmentPerKidInput.value);
    const rate = safeNumber(rateInput.value) / 100;
    const mer = safeNumber(merInput.value) / 100;
    const periodsPerYear = Math.max(1, safeNumber(frequencySelect.value));
    const kidMonthlyContribution = safeNumber(kidMonthlyContributionInput.value);
    const oldestKidAge = safeNumber(oldestKidAgeInput.value);
    const kidSpacing = safeNumber(kidSpacingInput.value);
    const grandkidsPerKid = Math.max(0, safeNumber(grandkidsPerKidInput.value));
    const grandkidSeedAge = safeNumber(grandkidSeedAgeInput.value);
    const grandkidSeedAmount = safeNumber(grandkidSeedAmountInput.value);
    const grandkidMonthlyContribution = safeNumber(grandkidMonthlyContributionInput.value);
    
    const totalInvestment = investmentPerKid * numKids;
    const totalGrandkids = numKids * grandkidsPerKid;
    const totalGrandkidSeeds = grandkidSeedAmount * totalGrandkids;
    
    // Update summary displays
    totalInvestmentDisplay.textContent = currencyFormatter.format(totalInvestment);
    totalGrandkidsDisplay.textContent = totalGrandkids.toString();
    totalGrandkidSeedsDisplay.textContent = currencyFormatter.format(totalGrandkidSeeds);
    
    adjustFontSize(totalInvestmentDisplay);
    adjustFontSize(totalGrandkidSeedsDisplay);
    
    // Calculate for each child
    const children = [];
    
    for (let i = 0; i < numKids; i++) {
      const kidAge = oldestKidAge - (i * kidSpacing);
      const investmentStartAge = 5; // Fund starts when kid is 5
      
      // If kid is already past 5, investment starts now (at current age)
      const actualInvestmentStartAge = Math.max(investmentStartAge, kidAge);
      const yearsTo65 = 65 - actualInvestmentStartAge;
      
      // Calculate future value of initial investment
      const futureValueOfInvestment = calculateFutureValue(
        investmentPerKid,
        rate,
        mer,
        periodsPerYear,
        yearsTo65
      );
      
      // Calculate future value of monthly contributions (from age 20 to 65)
      const contributionsFV = calculateFutureValueOfContributions(
        kidMonthlyContribution,
        rate,
        mer,
        periodsPerYear,
        20,
        65
      );
      
      // Total value at age 65 (theoretical, before withdrawals)
      const valueAt65 = futureValueOfInvestment + contributionsFV;
      
      // Calculate grandkid seedings and simulate forward
      const grandkidSeedings = [];
      let totalSeededForGrandkids = 0;
      
      // Simulate forward: track balance as it grows and withdrawals happen
      let currentBalance = investmentPerKid;
      let yearsElapsed = 0;
      const actualStartAge = actualInvestmentStartAge;
      
      if (grandkidsPerKid > 0 && grandkidSeedAge < 65 && grandkidSeedAge >= actualStartAge) {
        // Grandkids are seeded when child reaches grandkidSeedAge
        // Each grandkid is seeded 2 years apart (standard assumption)
        const grandkidSpacing = 2;
        
        for (let g = 0; g < grandkidsPerKid; g++) {
          const seedAge = grandkidSeedAge + (g * grandkidSpacing);
          if (seedAge < 65 && seedAge >= actualStartAge) {
            const yearsToSeed = seedAge - (actualStartAge + yearsElapsed);
            
            if (yearsToSeed > 0) {
              // Grow balance to seed age
              currentBalance = calculateFutureValue(
                currentBalance,
                rate,
                mer,
                periodsPerYear,
                yearsToSeed
              );
              
              // Add contributions in this period (from age 20 or last age to seed age)
              const contributionStartAge = Math.max(20, actualStartAge + yearsElapsed);
              if (seedAge > contributionStartAge) {
                const contributionsInPeriod = calculateFutureValueOfContributions(
                  kidMonthlyContribution,
                  rate,
                  mer,
                  periodsPerYear,
                  contributionStartAge,
                  seedAge
                );
                currentBalance += contributionsInPeriod;
              }
            }
            
            const balanceBeforeSeed = currentBalance;
            const balanceAfterSeed = Math.max(0, balanceBeforeSeed - grandkidSeedAmount);
            
            // Calculate grandchild's investment value at age 65 (assuming 0 kids)
            // Grandchild's fund starts at age 5 (when seeded), matures at 65 (60 years)
            const grandkidInvestmentStartAge = 5;
            const grandkidYearsTo65 = 65 - grandkidInvestmentStartAge; // 60 years
            
            // Future value of seed investment
            const grandkidSeedFV = calculateFutureValue(
              grandkidSeedAmount,
              rate,
              mer,
              periodsPerYear,
              grandkidYearsTo65
            );
            
            // Future value of grandchild's monthly contributions (age 20-65)
            const grandkidContributionsFV = calculateFutureValueOfContributions(
              grandkidMonthlyContribution,
              rate,
              mer,
              periodsPerYear,
              20,
              65
            );
            
            // Total value at age 65
            const grandkidValueAt65 = grandkidSeedFV + grandkidContributionsFV;
            
            grandkidSeedings.push({
              grandkidNumber: g + 1,
              seedAge: seedAge,
              seedAmount: grandkidSeedAmount,
              balanceAtSeedAge: balanceBeforeSeed,
              balanceAfterSeed: balanceAfterSeed,
              grandkidValueAt65: grandkidValueAt65,
              grandkidSeedFV: grandkidSeedFV,
              grandkidContributionsFV: grandkidContributionsFV,
            });
            
            currentBalance = balanceAfterSeed;
            yearsElapsed = seedAge - actualStartAge;
            totalSeededForGrandkids += grandkidSeedAmount;
          }
        }
      }
      
      // Calculate final value at 65 after all withdrawals
      const remainingYearsTo65 = 65 - (actualStartAge + yearsElapsed);
      let finalValueAt65 = currentBalance;
      
      if (remainingYearsTo65 > 0) {
        // Grow remaining balance to 65
        finalValueAt65 = calculateFutureValue(
          currentBalance,
          rate,
          mer,
          periodsPerYear,
          remainingYearsTo65
        );
        
        // Add final contributions (from last seed age or age 20 to 65)
        const contributionStartAge = Math.max(20, actualStartAge + yearsElapsed);
        if (65 > contributionStartAge) {
          const finalContributions = calculateFutureValueOfContributions(
            kidMonthlyContribution,
            rate,
            mer,
            periodsPerYear,
            contributionStartAge,
            65
          );
          finalValueAt65 += finalContributions;
        }
      }
      
      children.push({
        kidNumber: i + 1,
        currentAge: kidAge,
        investmentStartAge: actualInvestmentStartAge,
        investmentAmount: investmentPerKid,
        futureValueOfInvestment: futureValueOfInvestment,
        contributionsFV: contributionsFV,
        valueAt65: valueAt65,
        finalValueAt65: finalValueAt65,
        grandkidSeedings: grandkidSeedings,
        totalSeededForGrandkids: totalSeededForGrandkids,
      });
    }
    
    // Update children results
    updateChildrenResults(children, rate, mer, periodsPerYear, kidMonthlyContribution, grandkidMonthlyContribution);
    
  } catch (error) {
    console.error('Error in recalculate:', error);
  }
};

const updateChildrenResults = (children, rate, mer, periodsPerYear, kidMonthlyContribution, grandkidMonthlyContribution) => {
  childrenResultsContainer.innerHTML = "";
  
  if (children.length === 0) {
    return;
  }
  
  children.forEach((child) => {
    const childCard = document.createElement("div");
    childCard.className = "child-result-card";
    
    const grandkidsDetailHtml = child.grandkidSeedings && child.grandkidSeedings.length > 0
      ? `<div class="grandkids-detail">
          <h4>Grandchildren Seedings</h4>
          <div class="grandkids-table-container">
            <table class="grandkids-table">
              <thead>
                <tr>
                  <th>Grandkid</th>
                  <th>Seed Age</th>
                  <th>Seed Amount</th>
                  <th>Balance Before Seed</th>
                  <th>Balance After Seed</th>
                  <th>Value at Age 65*</th>
                </tr>
              </thead>
              <tbody>
                ${child.grandkidSeedings.map(gk => `
                  <tr>
                    <td><strong>Grandkid ${gk.grandkidNumber}</strong></td>
                    <td>${gk.seedAge} years old</td>
                    <td>${currencyFormatter.format(gk.seedAmount)}</td>
                    <td>${currencyFormatter.format(gk.balanceAtSeedAge)}</td>
                    <td>${currencyFormatter.format(gk.balanceAfterSeed)}</td>
                    <td>
                      <strong>${currencyFormatter.format(gk.grandkidValueAt65)}</strong>
                      ${gk.grandkidContributionsFV > 0 ? `<br/><small>(${currencyFormatter.format(gk.grandkidSeedFV)} from seed + ${currencyFormatter.format(gk.grandkidContributionsFV)} from contributions)</small>` : `<br/><small>(${currencyFormatter.format(gk.grandkidSeedFV)} from seed)</small>`}
                    </td>
                  </tr>
                `).join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="6" style="font-size: 0.85em; color: #666; padding-top: 0.5rem;">
                    * Assumes grandchild has 0 kids (no withdrawals from their fund)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>`
      : "";
    
    childCard.innerHTML = `
      <h3>Child ${child.kidNumber} (Currently ${child.currentAge} years old)</h3>
      <div class="child-result-grid">
        <div class="child-result-item">
          <span class="label">Investment Start Age</span>
          <span class="value">${child.investmentStartAge} years</span>
        </div>
        <div class="child-result-item">
          <span class="label">Initial Investment</span>
          <span class="value">${currencyFormatter.format(child.investmentAmount)}</span>
        </div>
        <div class="child-result-item">
          <span class="label">From Initial Investment (at 65)</span>
          <span class="value">${currencyFormatter.format(child.futureValueOfInvestment)}</span>
        </div>
        ${kidMonthlyContribution > 0 ? `
        <div class="child-result-item">
          <span class="label">From Monthly Contributions (age 20-65)</span>
          <span class="value">${currencyFormatter.format(child.contributionsFV)}</span>
        </div>
        ` : ''}
        <div class="child-result-item">
          <span class="label">Total Value at Age 65</span>
          <span class="value highlight">${currencyFormatter.format(child.valueAt65)}</span>
        </div>
        ${child.totalSeededForGrandkids > 0 ? `
        <div class="child-result-item">
          <span class="label">Total Seeded for Grandkids</span>
          <span class="value">${currencyFormatter.format(child.totalSeededForGrandkids)}</span>
        </div>
        <div class="child-result-item">
          <span class="label">Final Value at Age 65 (after seeds)</span>
          <span class="value highlight">${currencyFormatter.format(child.finalValueAt65)}</span>
        </div>
        ` : ''}
      </div>
      ${grandkidsDetailHtml}
    `;
    
    childrenResultsContainer.appendChild(childCard);
  });
};

// Initialize on page load
const initialize = () => {
  if (!initializeElements()) {
    console.error('Failed to initialize elements');
    return;
  }
  
  // Set up event listeners
  numKidsInput.addEventListener("input", recalculate);
  investmentPerKidInput.addEventListener("input", recalculate);
  rateInput.addEventListener("input", recalculate);
  frequencySelect.addEventListener("change", recalculate);
  merInput.addEventListener("input", recalculate);
  kidMonthlyContributionInput.addEventListener("input", recalculate);
  oldestKidAgeInput.addEventListener("input", recalculate);
  kidSpacingInput.addEventListener("input", recalculate);
  grandkidsPerKidInput.addEventListener("input", recalculate);
  grandkidSeedAgeInput.addEventListener("input", recalculate);
  grandkidSeedAmountInput.addEventListener("input", recalculate);
  grandkidMonthlyContributionInput.addEventListener("input", recalculate);
  
  // Initial calculation
  recalculate();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

