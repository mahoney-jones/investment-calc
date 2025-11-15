# Parent Investment Calculator Documentation

## Overview

The **Parent Investment Calculator** (`parent-perspective.html`) is a forward-looking investment calculator designed from the perspective of parents investing money for their children. It calculates how investments grow over time, accounting for children seeding their own children's (grandchildren's) investment funds.

## Purpose

This calculator answers the question: **"If I invest X amount for each of my kids, how much will they have at retirement (age 65), and how much can they seed for their own kids?"**

Unlike the reverse calculator (which calculates how much you need to invest to reach a target), this calculator shows the forward projection of what happens with a given investment amount.

## Key Features

### 1. Parent Investment Parameters
- **Number of Children**: How many children the parent has (1-10)
- **Investment per Child**: Amount invested for each child when they turn 5 years old
- **Interest Rate**: Annual return rate (net of fees, or gross rate)
- **Compounding Frequency**: How often interest compounds (daily, weekly, monthly, quarterly, semiannually, annually)
- **MER (Management Expense Ratio)**: Annual fee percentage deducted from returns
- **Children's Monthly Contribution**: Monthly amount each child contributes starting at age 20

### 2. Child Age Configuration
- **Oldest Child's Current Age**: Starting point for age calculations
- **Years Between Children**: Spacing between each child's birth (default: 2 years)

### 3. Grandchildren Configuration
- **Grandchildren per Child**: Number of grandchildren each child will have
- **Age When Child Seeds Grandkids**: Age when each child seeds their first grandchild's fund (grandkids turn 5 at this age)
- **Seed Amount per Grandchild**: Amount each child seeds for each grandchild
- **Grandchildren's Monthly Contribution**: Monthly contribution each grandchild makes starting at age 20

## Standard Assumptions

1. **Investment Start Age**: Each child's fund starts when they turn 5 years old
2. **Maturity Age**: All funds mature at age 65
3. **Contribution Start**: Monthly contributions begin at age 20 for both children and grandchildren
4. **Grandkid Seeding**: Grandkids are seeded when they turn 5 (which happens when the parent-child reaches the specified seed age)
5. **Grandkid Spacing**: Grandkids are born 2 years apart (standard assumption)

## Calculation Logic

### For Each Child

#### 1. Initial Investment Growth
- Investment starts at age 5 (or current age if child is already past 5)
- Grows from investment start to age 65
- Formula: `FV = PV × (1 + (rate - MER) / periodsPerYear) ^ (periodsPerYear × years)`

#### 2. Monthly Contributions
- Contributions start at age 20
- Continue until age 65 (45 years)
- Each monthly contribution compounds from its contribution date to age 65
- Formula: For each month `m` from 1 to 540 (45 years × 12 months):
  ```
  FV_contribution_m = monthlyContribution × (1 + ratePerPeriod) ^ periodsRemaining
  ```
  Where `periodsRemaining = (540 - m) × (periodsPerYear / 12)`

#### 3. Grandkid Seedings Simulation
The calculator simulates forward through time:

1. **Start with initial investment** at investment start age
2. **Grow balance** to first grandkid seed age
3. **Add contributions** made during this period (from age 20 to seed age)
4. **Withdraw seed amount** for first grandkid
5. **Repeat** for each subsequent grandkid (spaced 2 years apart)
6. **Grow remaining balance** to age 65
7. **Add final contributions** (from last seed age to 65)

#### 4. Final Value Calculation
- **Total Value at 65** (before withdrawals): Initial investment FV + Contributions FV
- **Final Value at 65** (after withdrawals): Remaining balance after all seed withdrawals, grown to 65, plus final contributions

### For Each Grandchild

#### Investment Projection (Assuming 0 Kids)
For each grandchild, the calculator shows what their investment will be worth at age 65:

1. **Seed Investment**: Amount seeded when grandchild turns 5
   - Grows for 60 years (age 5 to 65)
   - Formula: `FV_seed = seedAmount × (1 + ratePerPeriod) ^ (periodsPerYear × 60)`

2. **Grandchild Contributions**: Monthly contributions from age 20 to 65
   - 45 years of contributions
   - Each contribution compounds to age 65

3. **Total at Age 65**: `seedFV + contributionsFV`
   - **Note**: This assumes the grandchild has 0 kids (no withdrawals)

## Output Display

### Summary Section
- **Total Investment**: Sum of all investments made for children
- **Total Grandchildren**: Total number of grandchildren across all children
- **Total Grandkid Seeds**: Total amount that will be seeded for all grandchildren

### Per-Child Details
For each child, displays:

1. **Basic Information**:
   - Child number and current age
   - Investment start age
   - Initial investment amount

2. **Value Breakdown**:
   - From Initial Investment (at 65): Future value of the seed investment
   - From Monthly Contributions (age 20-65): Future value of child's contributions
   - Total Value at Age 65: Sum of investment + contributions (before withdrawals)
   - Total Seeded for Grandkids: Sum of all seed amounts withdrawn
   - Final Value at Age 65 (after seeds): Remaining balance after withdrawals

3. **Grandchildren Seedings Detail Table**:
   - **Grandkid**: Grandchild number
   - **Seed Age**: Age when parent-child seeds this grandchild
   - **Seed Amount**: Amount withdrawn to seed grandchild
   - **Balance Before Seed**: Parent-child's balance before withdrawal
   - **Balance After Seed**: Parent-child's balance after withdrawal
   - **Value at Age 65***: Grandchild's projected value at age 65 (with breakdown showing seed FV + contributions FV)
   - **Footnote**: "* Assumes grandchild has 0 kids (no withdrawals from their fund)"

## Use Cases

### Scenario 1: Planning Initial Investment
**Question**: "If I invest $10,000 for each of my 2 kids when they turn 5, how much will they have at 65?"

**Answer**: The calculator shows:
- Each child's total value at 65 (before withdrawals)
- Final value after seeding their own kids
- How much each grandchild will have at 65

### Scenario 2: Impact of Monthly Contributions
**Question**: "How much difference does it make if my kids contribute $500/month starting at age 20?"

**Answer**: Compare results with and without monthly contributions to see the impact on final values.

### Scenario 3: Grandkid Seeding Impact
**Question**: "If my kids seed $1,000 for each of their 2 kids, how much will they have left at 65?"

**Answer**: The calculator shows:
- Balance before and after each seed withdrawal
- Final value at 65 after all withdrawals
- What each grandchild will have at 65

## Mathematical Formulas

### Compound Interest (Lump Sum)
```
FV = PV × (1 + r/n)^(nt)

Where:
  FV = Future Value
  PV = Present Value (initial investment)
  r = Annual return rate (net of MER)
  n = Compounding periods per year
  t = Time in years
```

### Future Value of Monthly Contributions
```
FV_total = Σ(C × (1 + r/n)^periods_remaining)

For each month m from 1 to total_months:
  periods_remaining = (total_months - m) × (n / 12)
  FV_contribution_m = C × (1 + r/n)^periods_remaining

Where:
  C = Monthly contribution amount
  m = Month number
  total_months = years × 12
```

### Net Return Rate
```
netRate = grossRate - MER

Where:
  grossRate = Annual return rate before fees
  MER = Management Expense Ratio (annual fee percentage)
```

## Example Calculation

### Inputs:
- **Number of Children**: 2
- **Investment per Child**: $10,000
- **Interest Rate**: 7.8%
- **MER**: 0.24%
- **Compounding**: Monthly (12 periods/year)
- **Kid Monthly Contribution**: $500
- **Oldest Child Age**: 10
- **Kid Spacing**: 2 years
- **Grandkids per Child**: 2
- **Seed Age**: 35 (first grandkid seeded when child is 35)
- **Seed Amount**: $1,000
- **Grandkid Monthly Contribution**: $200

### For Child 1 (Age 10):
1. **Investment starts**: Age 5 (already past, so starts now at age 10)
2. **Years to 65**: 55 years
3. **Initial Investment FV**: $10,000 × (1 + 0.0756/12)^(12×55) ≈ $582,000
4. **Contributions FV** (age 20-65): $500/month × 45 years ≈ $1,200,000
5. **Total at 65** (before withdrawals): ≈ $1,782,000
6. **Grandkid Seedings**:
   - Age 35: Seed $1,000 for Grandkid 1
   - Age 37: Seed $1,000 for Grandkid 2
7. **Final Value at 65** (after withdrawals): ≈ $1,780,000

### For Grandkid 1:
1. **Seed Amount**: $1,000 at age 5
2. **Seed FV at 65**: $1,000 × (1 + 0.0756/12)^(12×60) ≈ $58,200
3. **Contributions FV** (age 20-65): $200/month × 45 years ≈ $480,000
4. **Total at 65**: ≈ $538,200

## Differences from Other Calculators

### vs. Reverse Generational Calculator
- **Parent Perspective**: Forward-looking (given investment → see results)
- **Reverse Calculator**: Backward-looking (given target → calculate needed investment)
- **Parent Perspective**: Shows what happens with your investment
- **Reverse Calculator**: Calculates what you need to invest

### vs. Generational Wealth Calculator
- **Parent Perspective**: Focuses on parent's investment for kids, then kids seeding grandkids
- **Generational Wealth**: Forward calculator for multiple children with milestones
- **Parent Perspective**: Includes grandkid seeding withdrawals
- **Generational Wealth**: Single-generation forward projection

## Technical Implementation

### File Structure
- **HTML**: `parent-perspective.html` - Page structure and form inputs
- **JavaScript**: `parent-perspective.js` - Calculation logic and display updates
- **CSS**: Uses shared `styles.css` for consistent styling

### Key Functions

#### `recalculate()`
Main calculation function that:
1. Reads all input values
2. Calculates summary totals
3. Processes each child's investment forward
4. Simulates grandkid seedings
5. Calculates grandchild values at 65
6. Updates display

#### `calculateFutureValue(principal, rate, mer, periodsPerYear, years)`
Calculates future value of a lump sum investment with compound interest.

#### `calculateFutureValueOfContributions(monthlyContribution, rate, mer, periodsPerYear, startAge, endAge)`
Calculates future value of monthly contributions over a period, accounting for compound growth.

#### `updateChildrenResults(children, rate, mer, periodsPerYear, kidMonthlyContribution, grandkidMonthlyContribution)`
Updates the DOM to display results for each child, including grandkid seedings detail.

### Event Listeners
All input fields have event listeners that trigger `recalculate()` on change, providing real-time updates as users adjust parameters.

## Navigation

The calculator is accessible from:
- Main calculator page (`index.html`) footer
- Generational wealth calculator (`generational-wealth.html`) footer
- Reverse generational calculator (`reverse-generational.html`) footer
- Direct URL: `parent-perspective.html`

## Future Enhancements (Potential)

1. **Visual Timeline**: Show a timeline visualization of investments, withdrawals, and growth
2. **Comparison Mode**: Compare different investment scenarios side-by-side
3. **Export Results**: Export calculations to PDF or CSV
4. **Grandchild Seeding**: Extend to show what happens if grandchildren also seed their kids
5. **Inflation Adjustment**: Option to show values in today's dollars
6. **Variable Returns**: Monte Carlo simulation with variable returns
7. **Tax Considerations**: Account for tax-advantaged accounts (TFSA, RRSP)

## Notes

- The calculator assumes all investments are in tax-advantaged accounts (no tax drag)
- Returns are assumed to be consistent (no market volatility modeling)
- Grandkid seedings happen at fixed ages (no early/late seeding scenarios)
- All calculations use the same interest rate and MER for all generations
- The "Value at Age 65" for grandchildren assumes they have 0 kids (no withdrawals)

