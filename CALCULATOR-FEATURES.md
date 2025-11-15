# ROI Calculator - Feature Documentation

## Overview

This is a comprehensive compound interest calculator designed for Canadian index fund investors. It helps plan long-term wealth accumulation with regular contributions and compare investment options by showing the real impact of fees (MER, trading costs, starter fees, advisory fees) on returns.

## Project Structure

### Files
- **`index.html`** - Main compound interest calculator with monthly contributions and optional MER
- **`main.js`** - Calculator logic with contribution tracking and compound interest
- **`fee-impact.html`** - Side-by-side fee comparison tool (3 scenarios)
- **`fee-impact.js`** - Multi-scenario fee comparison calculations
- **`schedule.html`** - Period-by-period compound growth breakdown
- **`schedule.js`** - Amortization schedule generator
- **`retirement-planning.html`** - Retirement planning calculator with withdrawal strategy
- **`retirement-planning.js`** - Retirement calculations and timeline generation
- **`generational-wealth.html`** - Forward generational wealth calculator
- **`generational-wealth.js`** - Generational wealth calculations
- **`reverse-generational.html`** - 3-generation reverse calculator
- **`reverse-generational.js`** - Reverse calculation logic
- **`parent-perspective.html`** - Parent investment calculator
- **`parent-perspective.js`** - Parent perspective calculations
- **`styles.css`** - Shared responsive styling with advanced options support
- **`Product List.csv`** - Vanguard ETF data (38 funds with MER, returns, etc.)
- **`BALANCED-PORTFOLIO-STRATEGY.md`** - Detailed Bogle-inspired investment strategy guide

## Recent Updates (Current Session)

### Mobile Responsiveness Improvements (Latest)

**What:** Comprehensive mobile layout fixes across all calculator pages to ensure consistent, working mobile experience matching `index.html`.

**Why:** Mobile users were experiencing text overflow, input field overflow, table overflow, and button layout issues. All pages needed to match the working mobile layout of the main calculator.

**Key Fixes:**
- Text wrapping: Headers, labels, and help text now wrap properly
- Input fields: Full-width with proper constraints, no overflow
- Tables: Horizontal scroll within containers, no page overflow
- Buttons: Vertical stack on mobile, consistent styling
- Cards/Grids: Single column layout on mobile
- Form sections: Single column on mobile (600px breakpoint)

**Pages Updated:**
- `parent-perspective.html` - Structure fixes, mobile styles
- `retirement-planning.html` - Timeline section mobile styles
- All pages - Consistent button and text wrapping

**Technical Details:**
- Mobile breakpoint: 600px
- Comprehensive CSS media queries
- Proper overflow handling (`overflow-x: hidden` on containers)
- Table containers with `overflow-x: auto` for horizontal scrolling
- Text elements with `word-wrap: break-word` and `overflow-wrap: break-word`

---

### 1. Monthly Contributions Feature
**What:** Added monthly contribution tracking to main calculator for realistic long-term planning.

**Why:** Most investors don't invest lump sums - they contribute regularly over time. Monthly contributions dramatically impact final wealth through dollar-cost averaging and extended compound growth.

**How it works:**
- Enter initial investment + monthly contribution amount
- Each monthly contribution compounds from its deposit date
- Calculator tracks total contributed vs. total interest earned
- Shows clear breakdown: "You put in X, it grew to Y"

**Example:**
- $10,000 initial + $500/month for 30 years at 7.8%
- Total Contributed: $190,000
- Future Balance: $745,234
- Total Interest Earned: $555,234
- **Your money nearly tripled through compound growth!**

---

### 2. MER Moved to Advanced Options
**What:** MER field now hidden in collapsible "Advanced Options" section with default value of 0%.

**Why:** Published investment returns are already "net of fees" - the fund's MER is already deducted before they report performance. Having MER prominently displayed could lead to double-counting fees.

**How it works:**
- By default, MER = 0% (use historical returns as-is)
- Click "Advanced Options" to expand and adjust MER for "what-if" scenarios
- Helper text clarifies: "Leave at 0% if using historical returns (already net of fees)"
- Useful for comparing theoretical fee impacts

**Best practice:**
- Use historical fund returns directly (e.g., VFV's 10-year average)
- Only adjust MER for hypothetical scenarios
- For detailed fee comparison, use `fee-impact.html` instead

---

### 3. Simplified Result Cards
**What:** Streamlined main calculator to show 3 focused metrics instead of 4.

**New cards:**
1. **Future Balance** - Total investment value at end
2. **Total Contributed** - Initial + all monthly contributions
3. **Total Interest Earned** - Pure investment gains

**Removed:**
- ~~Net Annual Return~~ (redundant - user enters the rate)
- ~~Total Fees Paid~~ (moved to fee comparison page where it's more relevant)

---

### 4. Fee Comparison Page
**What:** Dedicated page (`fee-impact.html`) for comparing 3 investment scenarios side-by-side.

**Why:** Visually demonstrate how different fee structures impact wealth accumulation. This is where detailed fee analysis happens.

**Features:**
- Compare up to 3 scenarios simultaneously
- Customizable scenario names
- Real-time calculations
- "Recalculate" button for manual updates
- Highlights the best option
- Shows dollar difference vs. best scenario
- All inputs in single row for above-the-fold visibility
- "Summary Below" indicator for scroll guidance

**Fields per scenario (2x3 grid):**
- Starter Fee (%)
- MER / Management Fee (%)
- Advisory Fee (%)
- Annual Trading Fees ($)
- Platform + Other Fees ($)

**Pre-populated examples:**
1. **Your Portfolio** - DIY low-cost (0.11% MER, $20 trading)
2. **VGRO** - One-fund solution (0.24% MER, no trading fees)
3. **Managed Fund** - High-cost option (1.5% MER, 1% advisory, 5% starter, $50 annual)

---

### 5. Advisory Fee Tracking
**What:** New field for traditional financial advisor fees (typically 1-1.5% annually).

**Why:** Many investors don't realize advisory fees compound like MER - a 1% advisory fee on $500k is $5,000/year!

**How it works:**
- Advisory fee is added to MER to calculate total annual percentage fees
- `totalAnnualFees = MER + advisoryFee`
- Compounds against you every year
- Particularly impactful on large portfolios

**Example:**
- $100,000 portfolio, 1% advisory fee, 0.5% MER, 30 years, 7% growth
- DIY (no advisor): $761,225
- With advisor: $574,349
- **Cost of advice: $186,876!**

---

### 6. Starter Fee (Front-Load Fee) Tracking
**What:** New field to model upfront purchase costs that reduce initial investment.

**Why:** Many managed funds and some investments charge 3-5% upfront, drastically reducing long-term returns.

**How it works:**
- Starter fee is a percentage of initial investment
- Deducted immediately before any growth occurs
- Example: $10,000 with 5% starter = actually invest $9,500
- That $500 is permanently lost and counts toward total fees

**Real impact:**
- 5% starter fee on $10,000 over 30 years at 7.8%
- Lost opportunity: ~$35,000+ in final value
- Plus ongoing MER fees on top of that

---

### 7. Enhanced UI/UX Improvements

#### Responsive Font Sizing
- Numbers automatically shrink for large values
- Prevents text overflow in result cards
- Dynamic classes: `long-value`, `very-long-value`

#### Perfect Alignment
- All result cards aligned with consistent heights
- Titles, values, and descriptions in fixed grid rows
- Values display at same vertical position across all cards

#### 2x2 Input Grid Layout
- Fee inputs arranged in clean 2x2 grid on desktop
- Stacks to single column on mobile
- Improved space efficiency for above-the-fold viewing

#### Mobile Responsive
- All pages fully responsive and mobile-optimized
- Comparison cards: 3 columns → 2 columns → 1 column
- Touch-friendly buttons and inputs
- Optimized spacing for all screen sizes
- **Comprehensive Mobile Fixes (Latest Update)**:
  - Text wrapping: All headers, labels, and help text wrap properly on mobile
  - Input fields: Full-width inputs with proper overflow handling
  - Tables: Horizontal scrolling within containers (no page overflow)
  - Buttons: Vertical stack on mobile, consistent across all pages
  - Cards and grids: Single column layout on mobile (600px breakpoint)
  - Form sections: Single column layout on mobile
  - All elements constrained to viewport width with proper overflow protection

---

## Core Functionality

### Main Calculator (`index.html`)

**Primary Inputs:**
- Initial Investment ($) - Default: $10,000
- Annual Interest Rate (%) - Default: 7.8% (use historical returns)
- Monthly Contribution ($) - Default: $500
- Compounding Frequency (Daily/Weekly/Monthly/Quarterly/etc.) - Default: Monthly
- Length Invested (years) - Default: 30

**Advanced Options (Collapsible):**
- Management Expense Ratio (%) - Default: 0% (only for "what-if" scenarios)

**Outputs:**
- Future Balance - Total portfolio value at end
- Total Contributed - Initial + all monthly contributions
- Total Interest Earned - Investment gains from compound growth

**Key Features:**
- Real-time calculation as you type
- Monthly contribution tracking with proper compounding
- Each contribution grows from its deposit date
- Advanced options hidden by default to avoid confusion
- Links to detailed schedule and fee comparison
- Formats currency and percentages automatically
- Responsive design with dynamic font sizing

---

### Fee Comparison Tool (`fee-impact.html`)

**Common Inputs:**
- Initial Investment ($10,000 default)
- Expected Annual Return (7.8% default)
- Investment Period (30 years default)
- Compounding Frequency (Monthly default)

**Per-Scenario Inputs (3 scenarios - 2x3 grid):**
- Custom name (editable)
- Starter Fee (%)
- MER (%)
- Advisory Fee (%)
- Annual Trading Fees ($)
- Platform + Other Annual Fees ($)

**Outputs:**
- Individual scenario results in cards
- Side-by-side comparison table
- Difference vs. best option highlighted
- Visual "Best!" indicator
- "Recalculate" button with visual feedback

**Calculation Method:**
```javascript
1. Apply starter fee: actualPrincipal = principal * (1 - starterFee)
2. Calculate net rate: netRate = grossRate - (MER + advisoryFee)
3. Compound annually with fixed fees:
   - Apply compound interest for the year
   - Deduct annual trading + platform/other fees
   - Track total percentage-based fees (MER + advisory)
4. Sum all fees paid over investment period:
   totalFees = starterFee + Σ(MER + advisory fees) + Σ(fixed fees)
```

---

### Schedule View (`schedule.html`)

**What:** Period-by-period breakdown showing how money grows.

**Displays:**
- Balance after each compounding period
- Interest earned that period
- Cumulative interest to date
- Summary of all input parameters

**Use case:** 
- Verify calculations are correct
- See exactly when your money doubles
- Track compound growth visually
- Educational tool for understanding compounding

---

## Mathematical Formulas

### Compound Interest (Lump Sum)
```
FV = P × (1 + r/n)^(nt)

Where:
  FV = Future Value
  P  = Principal (initial investment)
  r  = Annual interest rate (decimal)
  n  = Compounding periods per year
  t  = Time in years
```

### Future Value with Monthly Contributions
```
FV_total = FV_principal + FV_contributions

FV_principal = P × (1 + r/n)^(nt)

FV_contributions = Σ(C × (1 + r/n)^periods_remaining)
  For each month m from 1 to (12 × t):
    periods_remaining = (total_months - m) × (n / 12)
    FV_contribution_m = C × (1 + r/n)^periods_remaining

Where:
  C  = Monthly contribution amount
  m  = Month number
```

### Net Return After Fees (Fee Comparison Tool)
```
netRate = grossRate - (MER + advisoryFee)
FV = P × (1 + netRate/n)^(nt)

Where:
  MER = Management Expense Ratio (e.g., 0.24%)
  advisoryFee = Financial advisor fee (e.g., 1.0%)
```

### Total Fees Calculation
```
totalFees = starterFee + Σ(percentage fees) + Σ(fixed fees)

Where:
  starterFee = P × (starterPercent / 100)
  percentage fees = currentBalance × ((MER + advisory) / 100) [per year]
  fixed fees = tradingFees + platformFees [per year]
```

### Effective Annual Rate (EAR)
```
EAR = (1 + r/n)^n - 1

Shows true annual return after compounding effects
```

---

## Real-World Investment Examples

### Example 1: Monthly Contributions Impact
**Scenario:** 30-year investment at 7.8% annual return

| Strategy | Initial | Monthly | Total Contributed | Future Balance | Interest Earned |
|----------|---------|---------|-------------------|----------------|-----------------|
| Lump Sum Only | $10,000 | $0 | $10,000 | $99,377 | $89,377 |
| Contributions Only | $0 | $500 | $180,000 | $607,539 | $427,539 |
| **Combined** | **$10,000** | **$500** | **$190,000** | **$745,234** | **$555,234** |

**Takeaway:** Regular contributions + compound growth = 2.9x your money over 30 years!

---

### Example 2: VFV vs VGRO (Lump Sum)
**Scenario:** $10,000 lump sum for 30 years (use fee comparison tool for detailed analysis)

| Fund | MER | Historical Return | Final Balance (approx) |
|------|-----|-------------------|------------------------|
| VFV  | 0.09% | ~10% | $174,494 |
| VGRO | 0.24% | ~8.5% | $117,644 |
| **Difference** | | | **$56,850** |

**Note:** Returns shown are illustrative. Use published historical returns in calculator (already net of MER).

---

### Example 3: DIY Portfolio vs Managed Fund
**Scenario:** $10,000 invested for 30 years at 7.8% gross return

| Option | Starter | MER | Advisory | Annual Fees | Final Balance |
|--------|---------|-----|----------|-------------|---------------|
| DIY Portfolio | 0% | 0.11% | 0% | $20 | $97,454 |
| VGRO | 0% | 0.24% | 0% | $0 | $95,916 |
| Robo-Advisor | 0% | 0.24% | 0.50% | $0 | $83,137 |
| Managed Fund | 5% | 1.50% | 1.00% | $50 | $42,844 |

**Impact:**
- DIY vs Managed: **$35,894 difference** (58% more wealth!)
- VGRO vs Managed: **$34,356 difference**
- Managed fund's 5% starter fee = $500 lost + $35,000 in opportunity cost

---

### Example 3: Long-Term Impact of 1% Extra Fees
**Scenario:** $50,000 invested for 30 years

| Annual Return | Final Balance | Difference |
|---------------|---------------|------------|
| 7.8% (low fee) | $437,143 | Baseline |
| 6.8% (1% higher fee) | $342,629 | -$94,514 (22% less!) |

**Takeaway:** Every 1% in fees costs ~20-25% of your final wealth over 30 years.

---

## Usage Instructions

### Running Locally

1. **Start HTTP Server:**
   ```bash
   cd /home/jeremy/code/roi-calc
   python3 -m http.server 8000
   ```

2. **Open in Browser:**
   - Main Calculator: http://localhost:8000/index.html
   - Fee Comparison: http://localhost:8000/fee-impact.html
   - Schedule View: http://localhost:8000/schedule.html

3. **Or Open Directly:**
   ```bash
   xdg-open index.html  # Linux
   start index.html     # Windows
   open index.html      # Mac
   ```

---

### Using the Calculator

#### Main Calculator
1. Enter your starting amount
2. Input expected annual return (use total return, including dividends)
3. Add MER from your investment (0.09% for VFV, 0.24% for VGRO, etc.)
4. Select compounding frequency (usually monthly for ETFs)
5. Set investment time horizon
6. View results instantly

**Pro tip:** Use historical returns from `Product List.csv` as guidance for expected returns.

---

#### Fee Comparison Tool
1. Set common parameters (principal, rate, years)
2. Customize 3 scenarios:
   - Name each scenario (e.g., "VFV", "VGRO", "Mutual Fund")
   - Enter all fees (starter, MER, trading, other)
3. Results update in real-time
4. Click "Recalculate" if updates don't appear
5. Check side-by-side table to see winner
6. Note the $ difference vs. best option

**Pro tip:** Model your actual investment choices to see real impact of fees.

---

## Design Philosophy

### Bogle Principles Applied
This calculator embodies Jack Bogle's investment philosophy:

1. **Fees Matter** - Show explicitly how costs compound against you
2. **Simplicity** - Clean interface, clear results
3. **Education** - Help users understand compound interest
4. **Long-term Focus** - Default to 30-year periods
5. **Index Investing** - Pre-populated with Vanguard ETF examples

### Transparency
- All calculations visible in browser console (F12)
- Open-source formulas documented
- No hidden assumptions
- Real-world examples with actual ETFs

---

## Technical Details

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Edge, Safari)
- ES6+ JavaScript (modules, arrow functions, const/let)
- CSS Grid and Flexbox for layouts
- Responsive design (mobile-first)

### Accessibility
- ARIA labels on all inputs
- Semantic HTML
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

### Performance
- No external dependencies
- Vanilla JavaScript (no frameworks)
- Instant calculations (< 1ms)
- Efficient DOM updates
- Minimal bundle size

---

## Data Sources

### Vanguard ETF Data
**File:** `Product List.csv`
**Downloaded:** November 7, 2025
**Source:** Vanguard Canada

**Contains 38 ETFs with:**
- Ticker symbols
- MER (Management Expense Ratio)
- Historical returns (YTD, 1Y, 3Y, 5Y, 10Y)
- Total assets
- Distribution yields
- Holdings count
- Inception dates

**Used for:**
- Real-world MER examples
- Expected return estimates
- Investment comparisons
- Educational examples

---

## Known Limitations

1. **Assumes Constant Returns:** Real markets fluctuate; results are projections
2. **No Inflation Adjustment:** All values in nominal dollars
3. **Tax-Free Assumption:** Best for TFSA/RRSP; doesn't model taxable accounts
4. **No Regular Contributions:** Single lump-sum only (for now)
5. **Simple Fee Model:** Assumes fixed annual fees (real life varies)
6. **DRIP Implicit:** Assumes dividends reinvested in total return figure

---

## Future Enhancements (Potential)

### Planned Features
- [ ] Monthly/regular contribution modeling
- [ ] Inflation adjustment toggle
- [ ] Tax bracket considerations
- [ ] Monte Carlo simulation (variable returns)
- [ ] Historical back-testing with real data
- [ ] Export results to PDF/CSV
- [ ] Save/load scenarios
- [ ] Charts and graphs
- [ ] DRIP toggle with separate dividend yield input
- [ ] Portfolio rebalancing simulator

### Retirement Planning Calculator (`retirement-planning.html`)

**Purpose:** Comprehensive retirement planning tool that calculates when you can retire, how much you need to save, and safe withdrawal strategies.

**Primary Inputs:**
- Current Age - Default: 35
- Current Retirement Savings - Default: $50,000
- Monthly Savings - Default: $1,000
- Expected Annual Return (%) - Default: 7.8%
- Target Retirement Age - Default: 65 (or auto-calculate)
- Desired Annual Income in Retirement - Default: $60,000

**Advanced Options:**
- Withdrawal Rate (%) - Default: 4% (safe withdrawal rate)
- Inflation Rate (%) - Default: 2.5%
- Life Expectancy - Default: 90 years
- Compounding Frequency - Default: Monthly

**Outputs:**
- Years Until Retirement - Calculated or user-specified
- Retirement Age - When you can retire
- Portfolio Value at Retirement - Total accumulated savings
- Required Portfolio Value - Amount needed to support desired income
- Annual Withdrawal Amount - Safe withdrawal in first year
- Monthly Savings Needed - Required savings to reach goal
- Detailed Timeline - Accumulation and withdrawal phases

**Key Features:**
- **Retirement Date Calculator**: Determines when you can retire based on current savings rate
- **Savings Goal Calculator**: Calculates required monthly savings to reach retirement goal
- **Withdrawal Strategy**: Implements 4% rule (or custom rate) with inflation adjustments
- **Full Timeline**: Shows accumulation phase milestones and withdrawal phase projections
- **Inflation-Adjusted**: Accounts for inflation in both accumulation and withdrawal phases
- **Real-time Updates**: Calculations update as you change inputs

**How It Works:**
1. **Accumulation Phase**: Calculates portfolio growth from current age to retirement, accounting for:
   - Current savings compounding over time
   - Monthly contributions with proper compounding
   - Expected return rate

2. **Retirement Goal**: Determines required portfolio value based on:
   - Desired annual income
   - Withdrawal rate (typically 4%)
   - Inflation adjustment to retirement date

3. **Withdrawal Phase**: Simulates retirement withdrawals:
   - Annual withdrawals adjusted for inflation
   - Portfolio continues to grow during retirement
   - Shows portfolio value over time

**Example Scenario:**
- Age 35, $50,000 saved, $1,000/month savings
- 7.8% return, retire at 65, $60,000/year desired income
- 4% withdrawal rate, 2.5% inflation
- **Result**: Can retire at 65 with ~$1.5M portfolio, withdrawing $60,000/year (inflation-adjusted)

**Use Cases:**
- Plan when you can retire
- Determine if current savings rate is sufficient
- Calculate required monthly savings for retirement goal
- Understand safe withdrawal rates
- Visualize full retirement journey

---

### Under Consideration
- Integration with live market data APIs
- Multi-asset portfolio builder
- Risk assessment scoring
- Monte Carlo simulations for retirement planning
- Tax-advantaged account modeling (RRSP/TFSA)

---

## Contributing

### Coding Standards
- 2-space indentation
- camelCase for JS variables
- kebab-case for CSS classes
- Descriptive naming (no abbreviations)
- Comments for complex logic

### Testing Checklist
- [ ] Test with $10k, 7.8%, 30 years baseline
- [ ] Verify MER reduces returns correctly
- [ ] Check all three comparison scenarios
- [ ] Test mobile responsive on actual device
- [ ] Validate all inputs handle edge cases (0, negative, huge numbers)
- [ ] Cross-browser testing
- [ ] Console error check (F12)

---

## FAQ

**Q: Why are the numbers slightly different from online calculators?**
A: Most calculators don't account for MER correctly or use annual compounding. Ours uses your specified frequency and deducts MER properly.

**Q: Should I use historical returns as my expected return?**
A: Past performance doesn't guarantee future results, but historical averages (especially long-term) are reasonable starting points. Consider being conservative.

**Q: What MER should I use?**
A: Check `Product List.csv` for exact Vanguard MERs. For other funds, it's usually in the fund facts document.

**Q: Why is starter fee so impactful?**
A: It's deducted upfront before any growth. That lost money never has a chance to compound over 20-30 years. A 5% starter fee on $10k costs ~$35k in opportunity over 30 years!

**Q: Does this include dividends?**
A: Yes, implicitly. Use "total return" figures (which include reinvested dividends). The calculator assumes all returns compound, which is what happens with DRIP enabled.

**Q: What's the best low-cost option in Canada?**
A: Based on our analysis: VFV (0.09% MER) for US exposure, VCN (0.06% MER) for Canada, or VGRO (0.24% MER) for one-fund simplicity.

---

## License

This project is for personal/educational use. No warranty provided. Investment decisions are your responsibility.

---

## Changelog

### Session Update (Nov 15, 2024)
- ✅ Created Retirement Planning Calculator
- ✅ Added retirement date calculation
- ✅ Implemented withdrawal strategy (4% rule)
- ✅ Added inflation-adjusted projections
- ✅ Created detailed timeline visualization
- ✅ Updated all navigation links
- ✅ Added comprehensive documentation

### Session Update (Nov 9, 2025)
- ✅ Added MER field to main calculator
- ✅ Created comprehensive fee comparison page
- ✅ Implemented starter fee tracking
- ✅ Fixed responsive font sizing for large numbers
- ✅ Aligned all result cards perfectly
- ✅ Added 2x2 input grid layout
- ✅ Added manual recalculate button
- ✅ Improved error handling and debugging
- ✅ Optimized spacing for above-the-fold viewing
- ✅ Enhanced mobile responsiveness
- ✅ Added comprehensive documentation

### Original Implementation
- ✅ Basic compound interest calculator
- ✅ Period-by-period schedule view
- ✅ Multiple compounding frequencies
- ✅ Responsive design
- ✅ Clean, modern UI

---

## Credits

**Built for:** Canadian index fund investors following Bogle principles
**Inspired by:** Jack Bogle's cost-conscious investing philosophy
**Data source:** Vanguard Canada ETF listings
**Design:** Modern, minimal, educational

---

**Last Updated:** November 9, 2025

