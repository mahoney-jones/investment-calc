// Initialize variables - will be set when DOM is ready
let numChildrenInput, grandkidsPerChildInput, rateInput, frequencySelect;
let childTargetInput, grandkidTargetInput, childMonthlyContributionInput, grandkidMonthlyContributionInput;
let merInput, childSpacingInput;
let childrenContainer, childrenResultsContainer, grandkidsSummaryContainer;
let totalInvestmentDisplay, totalGrandkidsDisplay, grandkidsSeedTotalDisplay, averagePerChildDisplay;

const initializeElements = () => {
  numChildrenInput = document.querySelector("#numChildren");
  grandkidsPerChildInput = document.querySelector("#grandkidsPerChild");
  rateInput = document.querySelector("#rate");
  frequencySelect = document.querySelector("#frequency");
  childTargetInput = document.querySelector("#childTarget");
  grandkidTargetInput = document.querySelector("#grandkidTarget");
  childMonthlyContributionInput = document.querySelector("#childMonthlyContribution");
  grandkidMonthlyContributionInput = document.querySelector("#grandkidMonthlyContribution");
  merInput = document.querySelector("#mer");
  childSpacingInput = document.querySelector("#childSpacing");
  childrenContainer = document.querySelector("#childrenContainer");
  childrenResultsContainer = document.querySelector("#childrenResultsContainer");
  grandkidsSummaryContainer = document.querySelector("#grandkidsSummaryContainer");
  
  totalInvestmentDisplay = document.querySelector("#totalInvestment");
  totalGrandkidsDisplay = document.querySelector("#totalGrandkids");
  grandkidsSeedTotalDisplay = document.querySelector("#grandkidsSeedTotal");
  averagePerChildDisplay = document.querySelector("#averagePerChild");
  
  // Verify all elements exist
  const requiredElements = [
    numChildrenInput, grandkidsPerChildInput, rateInput, frequencySelect,
    childTargetInput, grandkidTargetInput, childrenContainer,
    childrenResultsContainer, grandkidsSummaryContainer,
    totalInvestmentDisplay, totalGrandkidsDisplay, grandkidsSeedTotalDisplay, averagePerChildDisplay
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

// Calculate present value needed to reach future value
const calculatePresentValue = (futureValue, rate, mer, periodsPerYear, years) => {
  const netRate = Math.max(0, rate - mer);
  const ratePerPeriod = netRate / periodsPerYear;
  const totalPeriods = periodsPerYear * years;
  
  if (ratePerPeriod <= 0 || totalPeriods <= 0) {
    return futureValue; // No growth, PV equals FV
  }
  
  return futureValue / Math.pow(1 + ratePerPeriod, totalPeriods);
};

// Calculate future value from present value
const calculateFutureValue = (presentValue, rate, mer, periodsPerYear, years) => {
  const netRate = Math.max(0, rate - mer);
  const ratePerPeriod = netRate / periodsPerYear;
  const totalPeriods = periodsPerYear * years;
  
  if (ratePerPeriod <= 0 || totalPeriods <= 0) {
    return presentValue; // No growth, FV equals PV
  }
  
  return presentValue * Math.pow(1 + ratePerPeriod, totalPeriods);
};

// Calculate future value of monthly contributions
const calculateFutureValueOfContributions = (monthlyContribution, rate, mer, periodsPerYear, startAge, endAge) => {
  if (monthlyContribution <= 0 || startAge >= endAge) {
    return 0;
  }
  
  const netRate = Math.max(0, rate - mer);
  const ratePerPeriod = netRate / periodsPerYear;
  const years = endAge - startAge;
  const monthsTotal = years * 12;
  
  if (ratePerPeriod <= 0) {
    // No growth, just sum contributions
    return monthlyContribution * monthsTotal;
  }
  
  let futureValue = 0;
  // For each month's contribution, calculate its future value
  for (let month = 1; month <= monthsTotal; month++) {
    const periodsRemaining = (monthsTotal - month) * (periodsPerYear / 12);
    futureValue += monthlyContribution * Math.pow(1 + ratePerPeriod, periodsRemaining);
  }
  
  return futureValue;
};

// Calculate present value of future monthly contributions
const calculatePresentValueOfContributions = (monthlyContribution, rate, mer, periodsPerYear, startAge, endAge, discountYears) => {
  const fvOfContributions = calculateFutureValueOfContributions(
    monthlyContribution,
    rate,
    mer,
    periodsPerYear,
    startAge,
    endAge
  );
  
  if (discountYears <= 0) {
    return fvOfContributions;
  }
  
  return calculatePresentValue(fvOfContributions, rate, mer, periodsPerYear, discountYears);
};

const createChildAgeInput = (index, oldestAge, spacing) => {
  const childDiv = document.createElement("div");
  childDiv.className = "child-input-group";
  const calculatedAge = Math.max(0, oldestAge - (index * spacing));
  
  childDiv.innerHTML = `
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
            value="${calculatedAge}"
            aria-describedby="childAge${index}-help"
          />
          <span class="suffix">yrs</span>
        </div>
        <small id="childAge${index}-help">Current age of child ${index + 1}.</small>
      </div>
    </div>
  `;
  return childDiv;
};

const generateChildrenInputs = () => {
  // Check if elements are initialized
  if (!numChildrenInput || !childSpacingInput || !childrenContainer) {
    console.error('Elements not initialized in generateChildrenInputs');
    return;
  }
  
  const numChildren = Math.max(1, Math.min(10, safeNumber(numChildrenInput.value)));
  const spacing = safeNumber(childSpacingInput.value);
  const oldestAgeInput = document.querySelector("#oldestChildAge");
  const oldestAge = oldestAgeInput ? safeNumber(oldestAgeInput.value) : 10;
  
  childrenContainer.innerHTML = "";
  
  // Add input for oldest child age
  const oldestDiv = document.createElement("div");
  oldestDiv.className = "field";
  oldestDiv.innerHTML = `
    <label for="oldestChildAge">Oldest Child's Current Age</label>
    <div class="field-input">
      <input
        id="oldestChildAge"
        type="number"
        min="0"
        max="100"
        step="1"
        value="${oldestAge}"
        aria-describedby="oldestChildAge-help"
      />
      <span class="suffix">yrs</span>
    </div>
    <small id="oldestChildAge-help">Enter the age of your oldest child. Other children's ages will be calculated.</small>
  `;
  childrenContainer.appendChild(oldestDiv);
  
  const oldestInput = document.querySelector("#oldestChildAge");
  oldestInput.addEventListener("input", () => {
    generateChildrenInputs();
    recalculate();
  });
  
  // Generate inputs for each child
  for (let i = 0; i < numChildren; i++) {
    const childDiv = createChildAgeInput(i, oldestAge, spacing);
    childrenContainer.appendChild(childDiv);
    
    const nameInput = document.querySelector(`#childName${i}`);
    const ageInput = document.querySelector(`#childAge${i}`);
    
    [nameInput, ageInput].forEach(input => {
      if (input) {
        input.addEventListener("input", recalculate);
      }
    });
  }
  
  recalculate();
};

const recalculate = () => {
  try {
    // Check if required elements exist
    if (!numChildrenInput || !rateInput || !childTargetInput || !grandkidTargetInput) {
      console.error('Required input elements not found');
      return;
    }
    
    // Ensure inputs exist - if not, generate them first
    const numChildren = Math.max(1, Math.min(10, safeNumber(numChildrenInput.value)));
    const oldestAgeInput = document.querySelector("#oldestChildAge");
    if (!oldestAgeInput || childrenContainer.children.length === 0) {
      console.log('Generating child inputs...');
      generateChildrenInputs();
      return; // generateChildrenInputs will call recalculate() at the end
    }
    
    const rate = safeNumber(rateInput.value) / 100;
    const mer = safeNumber(merInput.value) / 100;
    const periodsPerYear = Math.max(1, safeNumber(frequencySelect.value));
    const childTarget = safeNumber(childTargetInput.value);
    const grandkidTarget = safeNumber(grandkidTargetInput.value);
    const grandkidsPerChild = Math.max(0, safeNumber(grandkidsPerChildInput.value));
    const spacing = safeNumber(childSpacingInput.value);
    
    const totalGrandkids = numChildren * grandkidsPerChild;
    const childMonthlyContribution = safeNumber(childMonthlyContributionInput.value);
    const grandkidMonthlyContribution = safeNumber(grandkidMonthlyContributionInput.value);
    
    console.log('Recalculate called:', { 
      numChildren, 
      grandkidsPerChild, 
      childTarget, 
      grandkidTarget, 
      totalGrandkids,
      rate,
      currentAge: safeNumber(oldestAgeInput.value)
    });
    
    // Calculate PV needed at age 5 for each grandkid to reach target at 65 (60 years)
    // Account for grandkid's monthly contributions from age 20-65
    const grandkidContributionsFV = calculateFutureValueOfContributions(
      grandkidMonthlyContribution,
      rate,
      mer,
      periodsPerYear,
      20,
      65
    );
    // Amount needed from seed investment (target minus contributions)
    const grandkidTargetFromSeed = Math.max(0, grandkidTarget - grandkidContributionsFV);
    const grandkidSeedAtAge5 = calculatePresentValue(grandkidTargetFromSeed, rate, mer, periodsPerYear, 60);
    
    const children = [];
    let totalInvestment = 0;
    let totalGrandkidsSeed = 0;
    
    // Assume grandkids are born when child is 30, so first grandkid turns 5 when child is 35
    const grandkidBirthAge = 30; // When child has first grandkid
    const firstGrandkidSeedAge = 35; // When first grandkid turns 5 and investment starts
    const grandkidSpacing = 2; // Years between grandkids
    
    for (let i = 0; i < numChildren; i++) {
      const nameInput = document.querySelector(`#childName${i}`);
      const ageInput = document.querySelector(`#childAge${i}`);
      
      if (!ageInput) {
        // If inputs don't exist yet, we need to generate them first
        // This can happen if recalculate is called before generateChildrenInputs
        console.warn(`Child ${i} input not found, generating inputs...`);
        generateChildrenInputs();
        return; // generateChildrenInputs will call recalculate() at the end
      }
      
      const name = nameInput?.value.trim() || `Child ${i + 1}`;
      const currentAge = safeNumber(ageInput.value);
      const yearsTo65 = Math.max(0, 65 - currentAge);
      
      console.log(`Processing child ${i}:`, { name, currentAge, yearsTo65 });
      
      // Calculate individual grandkid seedings
      // Grandkids are born 2 years apart, starting when child is 30
      // Each grandkid turns 5 when child is 35, 37, 39, etc.
      const grandkidSeedings = [];
      for (let g = 0; g < grandkidsPerChild; g++) {
        const grandkidBirthAgeForChild = grandkidBirthAge + (g * grandkidSpacing);
        const grandkidSeedAgeForChild = grandkidBirthAgeForChild + 5; // Grandkid turns 5
        const yearsUntilThisSeed = Math.max(0, grandkidSeedAgeForChild - currentAge);
        
        grandkidSeedings.push({
          grandkidNumber: g + 1,
          childAgeAtSeed: grandkidSeedAgeForChild,
          yearsFromNow: yearsUntilThisSeed,
          seedAmount: grandkidSeedAtAge5,
          grandkidBirthAge: grandkidBirthAgeForChild,
        });
      }
      
      // Work backwards from age 65, accounting for contributions and withdrawals
      // Strategy: Start with target at 65, work backwards through each withdrawal
      // At each withdrawal, we need enough to: withdraw seed amount + have balance that grows to next point
      // Key: Contributions help, but we must ensure we always have enough from initial investment
      
      const withdrawals = [];
      
      // Sort seedings by age (oldest first, so we work backwards from 65)
      const sortedSeedings = [...grandkidSeedings].sort((a, b) => b.childAgeAtSeed - a.childAgeAtSeed);
      
      // Start with target at 65 - this is what we need to reach
      // We'll work backwards, ensuring we have enough at each step
      let requiredAtNextPoint = childTarget;
      let ageAtNextPoint = 65;
      
      // Calculate balance needed at each withdrawal point, working backwards from 65
      for (const seeding of sortedSeedings) {
        if (seeding.yearsFromNow > 0 && seeding.childAgeAtSeed < 65) {
          const withdrawalAge = seeding.childAgeAtSeed;
          const yearsFromWithdrawalToNextPoint = ageAtNextPoint - withdrawalAge;
          
          // Calculate contributions that happen between this withdrawal and the next point
          const contributionsBetween = childMonthlyContribution > 0 && withdrawalAge >= 20
            ? calculateFutureValueOfContributions(
                childMonthlyContribution,
                rate,
                mer,
                periodsPerYear,
                withdrawalAge,
                ageAtNextPoint
              )
            : 0;
          
          // At the next point (ageAtNextPoint), we need requiredAtNextPoint total
          // This comes from: balance after withdrawal (grown) + contributions between
          // So: requiredAtNextPoint = FV(balanceAfterWithdrawal) + contributionsBetween
          // Therefore: balanceAfterWithdrawal = PV(requiredAtNextPoint - contributionsBetween)
          
          const targetFromBalanceAfterWithdrawal = Math.max(0, requiredAtNextPoint - contributionsBetween);
          
          // Balance needed AFTER withdrawal to reach targetFromBalanceAfterWithdrawal at next point
          const balanceAfterWithdrawal = calculatePresentValue(
            targetFromBalanceAfterWithdrawal,
            rate,
            mer,
            periodsPerYear,
            yearsFromWithdrawalToNextPoint
          );
          
          // Total balance needed BEFORE withdrawal (balance after + withdrawal amount)
          const balanceBeforeWithdrawal = balanceAfterWithdrawal + seeding.seedAmount;
          
          withdrawals.unshift({
            ...seeding,
            balanceNeededAtWithdrawal: balanceBeforeWithdrawal,
            balanceAfterWithdrawal: balanceAfterWithdrawal,
          });
          
          // For next iteration (earlier withdrawal), we need balanceBeforeWithdrawal at this withdrawal age
          // This becomes our new required amount at the next point (this withdrawal age)
          requiredAtNextPoint = balanceBeforeWithdrawal;
          ageAtNextPoint = withdrawalAge;
        }
      }
      
      // After processing all withdrawals, requiredAtNextPoint is what we need at the first withdrawal (or at current age if no withdrawals)
      // ageAtNextPoint is the age of the first withdrawal (or 65 if no withdrawals)
      // Now calculate PV needed now to reach requiredAtNextPoint at ageAtNextPoint
      
      // Calculate total contributions from 20-65 for display purposes
      const childContributionsFV = calculateFutureValueOfContributions(
        childMonthlyContribution,
        rate,
        mer,
        periodsPerYear,
        20,
        65
      );
      const childTargetFromSeed = Math.max(0, childTarget - childContributionsFV);
      
      // Calculate PV needed now
      let pvNeededNow = 0;
      const contributionStartAge = Math.max(20, currentAge);
      
      if (withdrawals.length > 0) {
        // requiredAtNextPoint is what we need at the first withdrawal age (ageAtNextPoint)
        const firstWithdrawal = withdrawals[0];
        const yearsUntilFirstWithdrawal = firstWithdrawal.yearsFromNow;
        const firstWithdrawalAge = firstWithdrawal.childAgeAtSeed;
        
        if (yearsUntilFirstWithdrawal > 0) {
          // At first withdrawal age, we need requiredAtNextPoint total
          // This comes from: initial investment (grown) + contributions from now to first withdrawal
          // So: requiredAtNextPoint = FV(initialInvestment) + contributionsBeforeFirstWithdrawalFV
          // Therefore: initialInvestment = PV(requiredAtNextPoint - contributionsBeforeFirstWithdrawalFV)
          
          // Contributions from now to first withdrawal
          const contributionsBeforeFirstWithdrawalFV = childMonthlyContribution > 0 && firstWithdrawalAge > contributionStartAge
            ? calculateFutureValueOfContributions(
                childMonthlyContribution,
                rate,
                mer,
                periodsPerYear,
                contributionStartAge,
                firstWithdrawalAge
              )
            : 0;
          
          // Amount needed at first withdrawal from initial investment (after accounting for contributions)
          const targetFromInitialInvestment = Math.max(0, requiredAtNextPoint - contributionsBeforeFirstWithdrawalFV);
          
          // PV of this amount needed now
          pvNeededNow = calculatePresentValue(
            targetFromInitialInvestment,
            rate,
            mer,
            periodsPerYear,
            yearsUntilFirstWithdrawal
          );
        } else if (yearsUntilFirstWithdrawal === 0) {
          // Child is at first withdrawal age now
          pvNeededNow = requiredAtNextPoint;
        } else {
          // Child is past first withdrawal age - use remaining withdrawals
          const futureWithdrawals = withdrawals.filter(w => w.yearsFromNow > 0);
          if (futureWithdrawals.length > 0) {
            // Recalculate from remaining withdrawals
            let remainingTarget = childTarget;
            let remainingAge = 65;
            for (const seeding of [...grandkidSeedings].sort((a, b) => b.childAgeAtSeed - a.childAgeAtSeed)) {
              if (seeding.yearsFromNow > 0 && seeding.childAgeAtSeed < 65 && seeding.childAgeAtSeed > currentAge) {
                const yearsFromWithdrawalToNext = remainingAge - seeding.childAgeAtSeed;
                const contributionsBetween = childMonthlyContribution > 0 && seeding.childAgeAtSeed >= 20
                  ? calculateFutureValueOfContributions(
                      childMonthlyContribution,
                      rate,
                      mer,
                      periodsPerYear,
                      seeding.childAgeAtSeed,
                      remainingAge
                    )
                  : 0;
                const targetFromBalanceAfter = Math.max(0, remainingTarget - contributionsBetween);
                const balanceAfter = calculatePresentValue(
                  targetFromBalanceAfter,
                  rate,
                  mer,
                  periodsPerYear,
                  yearsFromWithdrawalToNext
                );
                remainingTarget = balanceAfter + seeding.seedAmount;
                remainingAge = seeding.childAgeAtSeed;
              }
            }
            pvNeededNow = calculatePresentValue(
              remainingTarget,
              rate,
              mer,
              periodsPerYear,
              remainingAge - currentAge
            );
          } else {
            // No more withdrawals, just need target at 65
            const contributionsFV = calculateFutureValueOfContributions(
              childMonthlyContribution,
              rate,
              mer,
              periodsPerYear,
              contributionStartAge,
              65
            );
            const targetFromSeed = Math.max(0, childTarget - contributionsFV);
            pvNeededNow = calculatePresentValue(
              targetFromSeed,
              rate,
              mer,
              periodsPerYear,
              yearsTo65
            );
          }
        }
      } else {
        // No withdrawals needed - simple case: need target at 65
        const contributionsFV = calculateFutureValueOfContributions(
          childMonthlyContribution,
          rate,
          mer,
          periodsPerYear,
          contributionStartAge,
          65
        );
        const targetFromSeed = Math.max(0, childTarget - contributionsFV);
        pvNeededNow = calculatePresentValue(
          targetFromSeed,
          rate,
          mer,
          periodsPerYear,
          yearsTo65
        );
      }
      
      const totalGrandkidSeedAmount = grandkidSeedAtAge5 * grandkidsPerChild;
      totalInvestment += pvNeededNow;
      totalGrandkidsSeed += totalGrandkidSeedAmount;
      
      console.log(`Child ${i} (${name}):`, { 
        pvNeededNow, 
        totalGrandkidSeedAmount, 
        grandkidsPerChild,
        currentAge,
        yearsTo65 
      });
      
      // Build timeline including all withdrawals
      const timeline = [];
      for (const withdrawal of withdrawals) {
        if (withdrawal.yearsFromNow >= 0) {
          timeline.push({
            age: withdrawal.childAgeAtSeed,
            yearsFromNow: withdrawal.yearsFromNow,
            event: `Seed Grandkid ${withdrawal.grandkidNumber} (born when child was ${withdrawal.grandkidBirthAge})`,
            withdrawal: withdrawal.seedAmount,
            balanceAfter: withdrawal.balanceAfterWithdrawal,
            balanceBefore: withdrawal.balanceNeededAtWithdrawal,
          });
        }
      }
      
      timeline.push({
        age: 65,
        yearsFromNow: yearsTo65,
        event: "Reach target at age 65",
        withdrawal: 0,
        balanceAfter: childTarget, // Show full target (seed + contributions)
      });
      
      children.push({
        name,
        currentAge,
        pvNeededNow,
        grandkidSeedAmount: totalGrandkidSeedAmount,
        grandkidsCount: grandkidsPerChild,
        yearsUntilGrandkidSeed: grandkidSeedings.length > 0 ? Math.min(...grandkidSeedings.map(s => s.yearsFromNow)) : 0,
        yearsTo65,
        timeline,
        grandkidSeedings,
        childContributionsFV,
        childTargetFromSeed,
        grandkidContributionsFV,
      });
    }
    
    console.log('Final totals:', { 
      totalInvestment, 
      totalGrandkids, 
      totalGrandkidsSeed, 
      childrenProcessed: children.length 
    });
    
    // Update summary displays
    totalInvestmentDisplay.textContent = currencyFormatter.format(totalInvestment);
    totalGrandkidsDisplay.textContent = totalGrandkids.toString();
    grandkidsSeedTotalDisplay.textContent = currencyFormatter.format(totalGrandkidsSeed);
    const averageValue = numChildren > 0 ? totalInvestment / numChildren : 0;
    averagePerChildDisplay.textContent = currencyFormatter.format(averageValue);
    
    adjustFontSize(totalInvestmentDisplay);
    adjustFontSize(grandkidsSeedTotalDisplay);
    adjustFontSize(averagePerChildDisplay);
    
    // Update children results
    updateChildrenResults(children, rate, mer, periodsPerYear, childMonthlyContribution, childTarget);
    
    // Update grandkids summary
    updateGrandkidsSummary(totalGrandkids, grandkidSeedAtAge5, grandkidTarget, rate, mer, periodsPerYear, grandkidContributionsFV);
  } catch (error) {
    console.error('Error in recalculate:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error occurred at:', new Error().stack);
    
    // Show error to user only if elements exist
    try {
      if (totalInvestmentDisplay) {
        totalInvestmentDisplay.textContent = 'Error';
      }
      if (totalGrandkidsDisplay) {
        totalGrandkidsDisplay.textContent = 'Error';
      }
      if (grandkidsSeedTotalDisplay) {
        grandkidsSeedTotalDisplay.textContent = '$0.00';
      }
      if (averagePerChildDisplay) {
        averagePerChildDisplay.textContent = '$0.00';
      }
    } catch (displayError) {
      console.error('Error updating display:', displayError);
    }
  }
};

const updateChildrenResults = (children, rate, mer, periodsPerYear, childMonthlyContribution, childTarget) => {
  childrenResultsContainer.innerHTML = "";
  
  if (children.length === 0) {
    return;
  }
  
  // Get rate and mer from inputs if not provided (for safety)
  const actualRate = rate !== undefined ? rate : safeNumber(rateInput.value) / 100;
  const actualMer = mer !== undefined ? mer : safeNumber(merInput.value) / 100;
  const actualPeriodsPerYear = periodsPerYear !== undefined ? periodsPerYear : Math.max(1, safeNumber(frequencySelect.value));
  const actualChildMonthlyContribution = childMonthlyContribution !== undefined ? childMonthlyContribution : safeNumber(childMonthlyContributionInput.value);
  const actualChildTarget = childTarget !== undefined ? childTarget : safeNumber(childTargetInput.value);
  
  children.forEach((child) => {
    const childCard = document.createElement("div");
    childCard.className = "child-result-card";
    
    // Grandkids detail section
    const grandkidsDetailHtml = child.grandkidSeedings && child.grandkidSeedings.length > 0
      ? `<div class="grandkids-detail">
          <h4>Grandchildren Seedings Detail</h4>
          <div class="grandkids-table-container">
            <table class="grandkids-table">
              <thead>
                <tr>
                  <th>Grandkid</th>
                  <th>Born When Child Is</th>
                  <th>Seeded When Child Is</th>
                  <th>Years From Now</th>
                  <th>Seed Amount</th>
                  <th>Target at Age 65</th>
                  <th>From Contributions</th>
                </tr>
              </thead>
              <tbody>
                ${child.grandkidSeedings.map(gk => {
                  const targetAt65 = safeNumber(document.querySelector("#grandkidTarget").value);
                  const grandkidMonthlyContribution = safeNumber(document.querySelector("#grandkidMonthlyContribution").value);
                  // Calculate contributions from age 20 to 65 (45 years)
                  const grandkidContributionsFV = grandkidMonthlyContribution > 0
                    ? calculateFutureValueOfContributions(
                        grandkidMonthlyContribution,
                        actualRate,
                        actualMer,
                        actualPeriodsPerYear,
                        20,
                        65
                      )
                    : 0;
                  return `<tr>
                    <td><strong>Grandkid ${gk.grandkidNumber}</strong></td>
                    <td>${gk.grandkidBirthAge} years old</td>
                    <td>${gk.childAgeAtSeed} years old</td>
                    <td>${gk.yearsFromNow} years</td>
                    <td>${currencyFormatter.format(gk.seedAmount)}</td>
                    <td>${currencyFormatter.format(targetAt65)}</td>
                    <td>${grandkidContributionsFV > 0 ? currencyFormatter.format(grandkidContributionsFV) : '-'}</td>
                  </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>`
      : "";
    
    // Calculate detailed investment growth breakdown
    const investmentBreakdown = [];
    
    // Initial investment (now)
    const yearsTo20 = Math.max(0, 20 - child.currentAge);
    const valueAt20 = yearsTo20 > 0 
      ? calculateFutureValue(child.pvNeededNow, actualRate, actualMer, actualPeriodsPerYear, yearsTo20)
      : child.pvNeededNow;
    
    investmentBreakdown.push({
      age: child.currentAge,
      yearsFromNow: 0,
      label: "Initial Investment",
      value: child.pvNeededNow,
      contributions: 0,
      withdrawals: 0,
      netChange: 0,
    });
    
    // Track current balance as we go through withdrawals
    // We'll simulate forward from initial investment to verify the plan works
    let currentBalance = child.currentAge >= 20 ? child.pvNeededNow : valueAt20;
    let yearsElapsed = child.currentAge >= 20 ? 0 : yearsTo20;
    let lastAge = child.currentAge >= 20 ? child.currentAge : 20;
    let previousValue = child.currentAge >= 20 ? child.pvNeededNow : valueAt20;
    
    // Age 20 - when contributions start
    if (child.currentAge < 20) {
      investmentBreakdown.push({
        age: 20,
        yearsFromNow: yearsTo20,
        label: "Age 20 - Contributions Begin",
        value: valueAt20,
        contributions: 0,
        withdrawals: 0,
        netChange: valueAt20 - child.pvNeededNow, // Net increase from initial investment to age 20
      });
      previousValue = valueAt20; // Update for next period
    }
    let hasInsufficientFunds = false;
    const warnings = [];
    
    // Add each withdrawal point
    for (const withdrawal of child.timeline.filter(t => t.withdrawal > 0)) {
      const yearsToWithdrawal = withdrawal.yearsFromNow;
      const yearsSinceLast = yearsToWithdrawal - yearsElapsed;
      
      // Calculate contributions added in this period
      let contributionsAdded = 0;
      if (withdrawal.age >= 20 && actualChildMonthlyContribution > 0) {
        const contributionStartAge = Math.max(20, lastAge);
        if (withdrawal.age > contributionStartAge) {
          // Calculate contributions from contributionStartAge to withdrawal.age
          // These contributions happen monthly and grow
          const contributionMonths = (withdrawal.age - contributionStartAge) * 12;
          const ratePerPeriod = Math.max(0, actualRate - actualMer) / actualPeriodsPerYear;
          
          if (ratePerPeriod > 0) {
            for (let month = 1; month <= contributionMonths; month++) {
              const periodsRemaining = (contributionMonths - month) * (actualPeriodsPerYear / 12);
              contributionsAdded += actualChildMonthlyContribution * Math.pow(1 + ratePerPeriod, periodsRemaining);
            }
          } else {
            contributionsAdded = actualChildMonthlyContribution * contributionMonths;
          }
        }
      }
      
      // Grow balance to withdrawal point
      if (yearsSinceLast > 0) {
        // Grow existing balance
        currentBalance = calculateFutureValue(currentBalance, actualRate, actualMer, actualPeriodsPerYear, yearsSinceLast);
        // Add contributions (they're already at future value at withdrawal age)
        currentBalance += contributionsAdded;
      } else if (yearsSinceLast === 0 && contributionsAdded > 0) {
        // Same age, just add contributions
        currentBalance += contributionsAdded;
      }
      
      const balanceBeforeWithdrawal = currentBalance;
      const withdrawalAmount = withdrawal.withdrawal;
      
      // Check if withdrawal is possible
      if (balanceBeforeWithdrawal < withdrawalAmount) {
        hasInsufficientFunds = true;
        warnings.push(`Age ${withdrawal.age}: Cannot withdraw ${currencyFormatter.format(withdrawalAmount)} from balance of ${currencyFormatter.format(balanceBeforeWithdrawal)}`);
      }
      
      const balanceAfterWithdrawal = Math.max(0, balanceBeforeWithdrawal - withdrawalAmount);
      
      // Net change is the increase from previous period's value to current value (before withdrawal)
      // This shows growth + contributions between periods
      const netIncrease = balanceBeforeWithdrawal - previousValue;
      
      investmentBreakdown.push({
        age: withdrawal.age,
        yearsFromNow: withdrawal.yearsFromNow,
        label: `Age ${withdrawal.age} - ${withdrawal.event}`,
        value: balanceAfterWithdrawal, // Show balance AFTER withdrawal (what goes into next period)
        valueBeforeWithdrawal: balanceBeforeWithdrawal, // Keep track of balance before for display
        contributions: contributionsAdded,
        withdrawals: withdrawalAmount,
        netChange: netIncrease, // Net increase from previous period to this period (before withdrawal)
        insufficientFunds: balanceBeforeWithdrawal < withdrawalAmount,
      });
      
      currentBalance = balanceAfterWithdrawal;
      previousValue = balanceAfterWithdrawal; // Update for next period
      yearsElapsed = yearsToWithdrawal;
      lastAge = withdrawal.age;
    }
    
    // Final value at age 65
    const yearsTo65 = child.yearsTo65;
    const yearsSinceLastWithdrawal = yearsTo65 - yearsElapsed;
    
    // Calculate contributions from last withdrawal to 65
    let finalContributions = 0;
    if (lastAge < 65 && actualChildMonthlyContribution > 0) {
      const contributionMonths = (65 - Math.max(20, lastAge)) * 12;
      const ratePerPeriod = Math.max(0, actualRate - actualMer) / actualPeriodsPerYear;
      
      if (ratePerPeriod > 0) {
        for (let month = 1; month <= contributionMonths; month++) {
          const periodsRemaining = (contributionMonths - month) * (actualPeriodsPerYear / 12);
          finalContributions += actualChildMonthlyContribution * Math.pow(1 + ratePerPeriod, periodsRemaining);
        }
      } else {
        finalContributions = actualChildMonthlyContribution * contributionMonths;
      }
    }
    
    // Grow balance to 65
    if (yearsSinceLastWithdrawal > 0) {
      currentBalance = calculateFutureValue(currentBalance, actualRate, actualMer, actualPeriodsPerYear, yearsSinceLastWithdrawal);
      currentBalance += finalContributions;
    } else if (yearsSinceLastWithdrawal === 0 && finalContributions > 0) {
      currentBalance += finalContributions;
    }
    
    const finalValue = currentBalance;
    const targetShortfall = Math.max(0, actualChildTarget - finalValue);
    
    // Only warn if there's an actual shortfall (greater than a small rounding tolerance)
    // If final value meets or exceeds target, no warning needed
    // Allow for small rounding differences (e.g., $0.01) to avoid false positives
    if (finalValue < actualChildTarget - 0.01) {
      hasInsufficientFunds = true;
      warnings.push(`Age 65: Calculated plan shows shortfall of ${currencyFormatter.format(targetShortfall)}. Final value: ${currencyFormatter.format(finalValue)}, Target: ${currencyFormatter.format(actualChildTarget)}. This may indicate the plan parameters are not achievable with the given return rate, or there may be a calculation discrepancy.`);
    }
    
    // Net change from last period to age 65
    const netIncreaseTo65 = finalValue - previousValue;
    
    investmentBreakdown.push({
      age: 65,
      yearsFromNow: yearsTo65,
      label: "Age 65 - Final Target",
      value: finalValue,
      contributions: finalContributions,
      withdrawals: 0,
      netChange: netIncreaseTo65, // Net increase from previous period to age 65
      targetShortfall: targetShortfall,
    });
    
    // Warning message if plan is not feasible
    const warningHtml = hasInsufficientFunds
      ? `<div class="warning-box">
          <h4>⚠️ Warning: Plan Validation Issue</h4>
          <p>The forward simulation of the calculated plan shows discrepancies. This may indicate:</p>
          <ul>
            ${warnings.map(w => `<li>${w}</li>`).join("")}
          </ul>
          <p><strong>Possible causes:</strong> The plan parameters may not be achievable with the given return rate and contribution schedule. Consider adjusting: target amounts, number of grandchildren, grandkid seed amounts, monthly contribution amounts, or return rate assumptions.</p>
          <p><em>Note: The initial investment shown above is calculated by the reverse calculator. If there's a shortfall, it suggests the plan may need parameter adjustments rather than simply increasing the initial investment.</em></p>
        </div>`
      : "";
    
    const investmentBreakdownHtml = `
      <div class="investment-breakdown">
        <h4>Detailed Investment Growth Breakdown</h4>
        ${warningHtml}
        <div class="breakdown-table-container">
          <table class="breakdown-table">
            <thead>
              <tr>
                <th>Age</th>
                <th>Years From Now</th>
                <th>Event</th>
                <th>Investment Value</th>
                <th>Contributions Added</th>
                <th>Withdrawals</th>
                <th>Net Change</th>
              </tr>
            </thead>
            <tbody>
              ${investmentBreakdown.map((bd, idx) => {
                const isInsufficient = bd.insufficientFunds || (bd.targetShortfall && bd.targetShortfall > 0);
                // For withdrawal rows, show both before and after withdrawal
                const valueDisplay = bd.valueBeforeWithdrawal && bd.withdrawals > 0
                  ? `${currencyFormatter.format(bd.valueBeforeWithdrawal)} → ${currencyFormatter.format(bd.value)}`
                  : (isNaN(bd.value) ? 'N/A' : currencyFormatter.format(bd.value));
                return `<tr class="${isInsufficient ? 'insufficient-funds' : ''}">
                  <td><strong>${bd.age}</strong></td>
                  <td>${bd.yearsFromNow}</td>
                  <td>${bd.label}</td>
                  <td class="value-cell">${valueDisplay}</td>
                  <td class="contribution-cell">${bd.contributions > 0 ? currencyFormatter.format(bd.contributions) : '-'}</td>
                  <td class="withdrawal-cell">${bd.withdrawals > 0 ? currencyFormatter.format(bd.withdrawals) : '-'}</td>
                  <td class="change-cell ${bd.netChange >= 0 ? 'positive' : 'negative'}">${isNaN(bd.netChange) ? 'N/A' : (bd.netChange !== 0 ? currencyFormatter.format(bd.netChange) : '-')}</td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    const timelineHtml = child.timeline.length > 0
      ? `<div class="timeline">
          <h4>Investment Timeline</h4>
          <ul>
            ${child.timeline.map(t => {
              const fvAtWithdrawal = t.balanceBefore || calculateFutureValue(
                child.pvNeededNow,
                actualRate,
                actualMer,
                actualPeriodsPerYear,
                t.yearsFromNow
              );
              return `<li>
                <strong>Age ${t.age}</strong> (${t.yearsFromNow} years from now): ${t.event}
                ${t.withdrawal > 0 ? `<br/>Balance before withdrawal: ${currencyFormatter.format(fvAtWithdrawal)}` : ''}
                ${t.withdrawal > 0 ? `<br/>Withdraw: ${currencyFormatter.format(t.withdrawal)}` : ''}
                ${t.withdrawal > 0 ? `<br/>Balance after withdrawal: ${currencyFormatter.format(t.balanceAfter)}` : ''}
                ${t.withdrawal === 0 ? `<br/>Final balance: ${currencyFormatter.format(t.balanceAfter)}` : ''}
              </li>`;
            }).join("")}
          </ul>
        </div>`
      : "";
    
    childCard.innerHTML = `
      <div class="child-result-header">
        <h3>${child.name}</h3>
        <span class="child-age">Age ${child.currentAge}</span>
      </div>
      <div class="child-result-grid">
        <div class="child-result-item">
          <span class="label">Investment Required Now</span>
          <span class="value highlight">${currencyFormatter.format(child.pvNeededNow)}</span>
        </div>
        <div class="child-result-item">
          <span class="label">Years Until Grandkids Seed</span>
          <span class="value">${child.yearsUntilGrandkidSeed} years</span>
        </div>
        <div class="child-result-item">
          <span class="label">Grandkids Count</span>
          <span class="value">${child.grandkidsCount}</span>
        </div>
        <div class="child-result-item">
          <span class="label">Amount to Seed Grandkids</span>
          <span class="value">${currencyFormatter.format(child.grandkidSeedAmount)}</span>
        </div>
        <div class="child-result-item">
          <span class="label">Years Until Age 65</span>
          <span class="value">${child.yearsTo65} years</span>
        </div>
        <div class="child-result-item">
          <span class="label">Target at Age 65</span>
          <span class="value">${currencyFormatter.format(actualChildTarget)}</span>
        </div>
        ${child.childContributionsFV > 0 ? `
        <div class="child-result-item">
          <span class="label">From Monthly Contributions</span>
          <span class="value">${currencyFormatter.format(child.childContributionsFV)}</span>
        </div>
        <div class="child-result-item">
          <span class="label">From Seed Investment</span>
          <span class="value">${currencyFormatter.format(child.childTargetFromSeed)}</span>
        </div>
        ` : ''}
      </div>
      ${investmentBreakdownHtml}
      ${grandkidsDetailHtml}
      ${timelineHtml}
    `;
    
    childrenResultsContainer.appendChild(childCard);
  });
};

const updateGrandkidsSummary = (totalGrandkids, seedAtAge5, targetAt65, rate, mer, periodsPerYear, grandkidContributionsFV) => {
  grandkidsSummaryContainer.innerHTML = "";
  
  if (totalGrandkids === 0) {
    grandkidsSummaryContainer.innerHTML = '<p class="empty">No grandchildren configured.</p>';
    return;
  }
  
  const summaryCard = document.createElement("div");
  summaryCard.className = "child-result-card";
  
  // Calculate target from seed (what seed needs to grow to)
  const targetFromSeed = Math.max(0, targetAt65 - grandkidContributionsFV);
  
  // Verify the calculation: seedAtAge5 should grow to targetFromSeed in 60 years
  const verificationFV = calculateFutureValue(seedAtAge5, rate, mer, periodsPerYear, 60);
  
  summaryCard.innerHTML = `
    <h3>Grandchildren Investment Details</h3>
    <div class="child-result-grid">
      <div class="child-result-item">
        <span class="label">Total Grandchildren</span>
        <span class="value">${totalGrandkids}</span>
      </div>
      <div class="child-result-item">
        <span class="label">Seed Amount per Grandchild (at age 5)</span>
        <span class="value">${currencyFormatter.format(seedAtAge5)}</span>
      </div>
      <div class="child-result-item">
        <span class="label">Target at Age 65</span>
        <span class="value highlight">${currencyFormatter.format(targetAt65)}</span>
      </div>
      ${grandkidContributionsFV > 0 ? `
      <div class="child-result-item">
        <span class="label">From Monthly Contributions (age 20-65)</span>
        <span class="value">${currencyFormatter.format(grandkidContributionsFV)}</span>
      </div>
      <div class="child-result-item">
        <span class="label">From Seed Investment</span>
        <span class="value">${currencyFormatter.format(targetFromSeed)}</span>
      </div>
      ` : ''}
      <div class="child-result-item">
        <span class="label">Growth Period</span>
        <span class="value">60 years</span>
      </div>
      <div class="child-result-item">
        <span class="label">Verification: Seed → Target</span>
        <span class="value">${currencyFormatter.format(verificationFV)}</span>
      </div>
      <div class="child-result-item">
        <span class="label">Total Seed Amount</span>
        <span class="value">${currencyFormatter.format(seedAtAge5 * totalGrandkids)}</span>
      </div>
    </div>
  `;
  
  grandkidsSummaryContainer.appendChild(summaryCard);
};

// Initialize on page load
const initialize = () => {
  if (!initializeElements()) {
    console.error('Failed to initialize elements');
    return;
  }
  
  // Set up event listeners
  numChildrenInput.addEventListener("input", () => {
    generateChildrenInputs();
    recalculate();
  });

  grandkidsPerChildInput.addEventListener("input", recalculate);
  rateInput.addEventListener("input", recalculate);
  frequencySelect.addEventListener("change", recalculate);
  childTargetInput.addEventListener("input", recalculate);
  grandkidTargetInput.addEventListener("input", recalculate);
  childMonthlyContributionInput.addEventListener("input", recalculate);
  grandkidMonthlyContributionInput.addEventListener("input", recalculate);
  merInput.addEventListener("input", recalculate);
  childSpacingInput.addEventListener("input", () => {
    generateChildrenInputs();
    recalculate();
  });
  
  // Generate initial inputs and calculate
  generateChildrenInputs();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

