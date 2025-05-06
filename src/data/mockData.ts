import { ContentArticle, ContentCategory, MasterPrompt, Role, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@nextrend.ai",
    phone: "(555) 123-4567",
    company: "NEXTREND AI",
    nmls: "12345",
    brandVoice: "Professional, concise, and approachable with a focus on clarity and simplicity.",
    role: "admin",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@nextrend.ai",
    phone: "(555) 987-6543",
    company: "NEXTREND AI",
    brandVoice: "Friendly and informative with a personal touch. Uses stories to illustrate points.",
    role: "team",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael@realestatefirm.com",
    phone: "(555) 567-8901",
    company: "Premier Real Estate",
    nmls: "67890",
    brandVoice: "Authoritative and expert. Focuses on data and market analysis with factual presentation.",
    role: "team",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@mortgageexperts.com",
    phone: "(555) 234-5678",
    company: "Mortgage Experts LLC",
    nmls: "54321",
    brandVoice: "Educational and helpful. Breaks down complex topics into bite-sized information.",
    role: "team",
    createdAt: new Date("2024-04-05"),
  },
];

export const mockPrompts = [
  {
    id: "1",
    name: "Master Prompt",
    content: "This is a master prompt that controls the AI behavior across all platforms.",
    type: "Master Prompt",
    version: "v1.2",
    updatedAt: new Date('2023-12-20'),
    history: [
      {
        version: "v1.2",
        content: "This is a master prompt that controls the AI behavior across all platforms.",
        updatedAt: new Date('2023-12-20'),
      },
      {
        version: "v1.1",
        content: "This is a master prompt that controls the AI behavior.",
        updatedAt: new Date('2023-12-10'),
      },
      {
        version: "v1.0",
        content: "This is a master prompt.",
        updatedAt: new Date('2023-12-01'),
      }
    ]
  },
  {
    id: "2",
    name: "LinkedIn Prompt",
    content: "Generate professional LinkedIn posts focused on mortgage and real estate industry insights.",
    type: "LinkedIn Prompt",
    version: "v1.0",
    updatedAt: new Date('2023-12-15'),
    history: [
      {
        version: "v1.0",
        content: "Generate professional LinkedIn posts focused on mortgage and real estate industry insights.",
        updatedAt: new Date('2023-12-15'),
      }
    ]
  },
  {
    id: "3",
    name: "Blog Post Prompt",
    content: "Create informative blog posts about mortgage trends, interest rates, and housing market analysis.",
    type: "Blog Post Prompt", 
    version: "v1.1",
    updatedAt: new Date('2023-12-18'),
    history: [
      {
        version: "v1.1",
        content: "Create informative blog posts about mortgage trends, interest rates, and housing market analysis.",
        updatedAt: new Date('2023-12-18'),
      },
      {
        version: "v1.0",
        content: "Create informative blog posts about mortgage trends.",
        updatedAt: new Date('2023-12-05'),
      }
    ]
  },
  {
    id: "4",
    name: "Video Script Prompt",
    content: "Generate engaging video scripts explaining mortgage concepts and market updates.",
    type: "Video Script Prompt",
    version: "v1.0",
    updatedAt: new Date('2023-12-13'),
    history: [
      {
        version: "v1.0",
        content: "Generate engaging video scripts explaining mortgage concepts and market updates.",
        updatedAt: new Date('2023-12-13'),
      }
    ]
  },
  {
    id: "5",
    name: "Email Prompt",
    content: "Create personalized email templates for client outreach and follow-up communications.",
    type: "Email Prompt",
    version: "v1.0",
    updatedAt: new Date('2023-12-10'),
    history: [
      {
        version: "v1.0",
        content: "Create personalized email templates for client outreach and follow-up communications.",
        updatedAt: new Date('2023-12-10'),
      }
    ]
  },
  {
    id: "6",
    name: "Social Prompt",
    content: "Generate engaging social media content for multiple platforms focused on mortgage and real estate topics.",
    type: "Social Prompt",
    version: "v1.0",
    updatedAt: new Date('2023-12-08'),
    history: [
      {
        version: "v1.0",
        content: "Generate engaging social media content for multiple platforms focused on mortgage and real estate topics.",
        updatedAt: new Date('2023-12-08'),
      }
    ]
  },
  {
    id: "7",
    name: "X/Twitter Prompt",
    content: "Create concise, informative tweets about mortgage rates, housing market updates, and financial tips.",
    type: "X/Twitter Prompt",
    version: "v1.0",
    updatedAt: new Date('2023-12-05'),
    history: [
      {
        version: "v1.0",
        content: "Create concise, informative tweets about mortgage rates, housing market updates, and financial tips.",
        updatedAt: new Date('2023-12-05'),
      }
    ]
  },
  {
    id: "8",
    name: "SMS Client Prompt",
    content: "Generate short, personalized SMS messages for client communication and updates.",
    type: "SMS Client Prompt",
    version: "v1.0",
    updatedAt: new Date('2023-12-03'),
    history: [
      {
        version: "v1.0",
        content: "Generate short, personalized SMS messages for client communication and updates.",
        updatedAt: new Date('2023-12-03'),
      }
    ]
  },
  {
    id: "9",
    name: "SMS Realtor Prompt",
    content: "Create professional SMS templates for realtor partner communications and referrals.",
    type: "SMS Realtor Prompt",
    version: "v1.0",
    updatedAt: new Date('2023-12-01'),
    history: [
      {
        version: "v1.0",
        content: "Create professional SMS templates for realtor partner communications and referrals.",
        updatedAt: new Date('2023-12-01'),
      }
    ]
  },
  {
    id: "10",
    name: "Motivational Quote Prompt",
    content: "Generate inspirational quotes related to homeownership, financial success, and personal growth.",
    type: "Motivational Quote Prompt",
    version: "v1.0",
    updatedAt: new Date('2023-11-28'),
    history: [
      {
        version: "v1.0",
        content: "Generate inspirational quotes related to homeownership, financial success, and personal growth.",
        updatedAt: new Date('2023-11-28'),
      }
    ]
  },
];

export const mockMBSCommentary: ContentArticle[] = [
  {
    id: "1",
    date: new Date("2024-05-05"),
    title: "MBS Market Steadies After Fed Announcement",
    brief: "Today's mortgage-backed securities market showed resilience following the Federal Reserve's latest policy statement, with minimal rate impacts for borrowers.",
    content: `
# MBS Market Steadies After Fed Announcement

Today's mortgage-backed securities (MBS) market demonstrated remarkable stability following the Federal Reserve's latest policy announcement. Despite some initial volatility, prices settled into a narrow range by mid-afternoon.

## Market Movements

MBS prices improved by approximately 15 basis points from yesterday's close, suggesting slight downward pressure on mortgage rates. This modest gain comes after three consecutive days of price deterioration and provides welcome relief for market participants.

## Rate Impact

Today's modest MBS price improvement could translate to minor enhancements in rate offerings from lenders, though many may choose to hold steady until a clearer trend emerges. Borrowers currently in the market might see rates improved by approximately 0.01-0.03%, depending on the lender.

## Key Factors Today

The primary driver of today's market conditions was the Federal Reserve's policy statement, which maintained the federal funds rate at its current level but signaled a continued commitment to bringing inflation down to their 2% target. Additionally, weaker-than-expected employment data released this morning contributed to the bond market's positive performance.

## What This Means for Consumers

For homebuyers and those considering refinancing, today's market conditions present a relatively stable environment. While we're not seeing dramatic improvements in rates, the pause in recent upward pressure is welcome news. Homebuyers currently shopping should note this stabilization, but shouldn't necessarily delay decisions expecting significant improvements in the near term.

Homeowners considering refinancing should continue to evaluate opportunities based on their specific financial goals rather than trying to perfectly time the market.

As always, consulting with your mortgage professional about your specific situation is the best course of action.
    `,
    category: "Market Trends",
    createdBy: "1", // John Doe (admin)
    updatedAt: new Date("2024-05-05"),
    published: true,
  },
  {
    id: "2",
    date: new Date("2024-05-04"),
    title: "Mortgage Rates Edge Higher Amid Economic Data",
    brief: "Bond market volatility pushed mortgage rates upward today as investors digest new employment and inflation indicators.",
    content: `
# Mortgage Rates Edge Higher Amid Economic Data

Today's MBS market faced downward pressure as new economic data exceeded market expectations, causing a modest setback for mortgage-backed securities.

## Market Movements

MBS prices declined by approximately 28 basis points today, continuing a troubling trend we've observed throughout the week. This drop represents one of the more significant daily declines in recent weeks.

## Rate Impact

Today's MBS weakness will likely translate to higher rate offerings from most lenders. Borrowers might see rates increase by approximately 0.05-0.07% compared to yesterday's offerings, though actual changes will vary by lender and loan program.

## Key Factors Today

Multiple factors contributed to today's market conditions:

1. This morning's jobs report showed unemployment dropping to 3.8%, beating expectations
2. Average hourly earnings increased more than analysts predicted, raising inflation concerns
3. The 10-year Treasury yield climbed to 4.43%, putting pressure on the broader bond market
4. Comments from several Federal Reserve officials suggested rates may stay higher for longer than previously anticipated

## What This Means for Consumers

For potential homebuyers, today's rate increases may impact affordability calculations. Those who have been pre-approved should check with their mortgage professional to understand how these changes affect their purchasing power.

Homeowners considering refinancing may want to reassess timing. While rates remain historically reasonable, the recent upward trend suggests caution rather than urgency when considering a new loan.

Remember that daily market movements are normal, and long-term housing decisions should consider multiple factors beyond just today's interest rate environment.
    `,
    category: "Market Trends",
    createdBy: "2", // Jane Smith (team)
    updatedAt: new Date("2024-05-04"),
    published: true,
  },
  {
    id: "3",
    date: new Date("2024-05-06"),
    title: "Weekly MBS Outlook: Focus on Inflation Data",
    brief: "This week's upcoming inflation reports could significantly impact mortgage rates with market participants anxiously awaiting CPI and PPI figures.",
    content: `
# Weekly MBS Outlook: Focus on Inflation Data

As we begin a new week in the MBS markets, all eyes are turning toward key inflation reports scheduled for release in the coming days. These data points could significantly influence mortgage rates through their impact on mortgage-backed securities pricing.

## Current Market Position

MBS prices begin the week in a relatively neutral technical position following last week's mixed performance. The Fannie Mae 4.0% coupon is currently trading near 99-18, which represents a slight improvement from last week's closing levels.

## Anticipated Rate Movements

Mortgage rates are starting the week holding relatively steady, with the average 30-year fixed rate for top-tier scenarios hovering around 6.62%. If upcoming economic data meets expectations, we may see relative stability in rates. However, significant surprises in inflation figures could drive volatility in either direction.

## Key Factors This Week

This week's market will be primarily driven by:

1. Consumer Price Index (CPI) report on Wednesday, with core inflation expected at 3.4% annually
2. Producer Price Index (PPI) on Thursday, forecasted to show modest wholesale inflation
3. Consumer Sentiment data on Friday, which includes consumer inflation expectations
4. Several Federal Reserve speakers scheduled throughout the week

## What This Means for Consumers

For homebuyers and refinancers, this week represents a period of potential volatility. Those who need rate locks in the immediate future might consider securing them before Wednesday's CPI data, which poses the greatest risk for sudden market movements.

Conversely, those with more flexibility might watch how markets digest the inflation data before making decisions. As always, maintaining regular communication with your mortgage professional is advisable during periods of potential market volatility.
    `,
    category: "Finance",
    createdBy: "1", // John Doe (admin)
    updatedAt: new Date("2024-05-06"),
    published: false, // Draft
  },
];

export const mockTrendingTopics: ContentArticle[] = [
  {
    id: "1",
    date: new Date("2024-05-03"),
    title: "How AI is Transforming the Mortgage Application Process",
    brief: "Artificial intelligence is revolutionizing mortgage lending, making applications faster and more accessible while reducing human error.",
    content: `
# How AI is Transforming the Mortgage Application Process

The mortgage industry is experiencing a technological revolution, with artificial intelligence (AI) at the forefront of changes that benefit both lenders and borrowers. This transformation is making the historically complex mortgage process faster, more accessible, and increasingly accurate.

## The End of Paperwork Mountains

Remember when applying for a mortgage meant printing, signing, and scanning countless documents? Those days are rapidly disappearing. AI-powered document processing systems now:

- Extract information automatically from uploaded documents
- Verify data consistency across multiple forms
- Flag missing information immediately rather than days later
- Reduce document processing time from days to minutes

For homebuyers, this means less time spent on administrative tasks and more time focused on finding the right home.

## Faster Underwriting Decisions

One of the most significant impacts of AI in the mortgage industry is in the underwriting process:

Traditional underwriting often took 1-2 weeks as human underwriters manually reviewed applications. Today, AI systems can analyze the same information in minutes, considering thousands of variables simultaneously to assess borrower risk.

Several major lenders now offer "instant" pre-approvals that give buyers greater confidence when making offers. These systems don't replace human judgment entirely but handle routine applications efficiently while allowing underwriters to focus on more complex cases.

## More Accurate Risk Assessment

AI excels at identifying patterns in large datasets, which has revolutionized how lenders assess borrower risk:

- Traditional models relied heavily on credit scores and debt-to-income ratios
- AI models can consider hundreds of additional factors, including spending patterns, employment stability, and economic trends
- This more comprehensive analysis often identifies qualified borrowers who might be overlooked by traditional methods

The result? More accurate pricing and expanded access to homeownership for borrowers with non-traditional financial profiles.

## What This Means For You

As a homebuyer or homeowner, AI's growing role in the mortgage industry offers several advantages:

1. **Faster approvals**: What once took weeks may now take days or even hours
2. **More convenient application process**: Many steps can be completed from your smartphone
3. **Potentially better rates**: More accurate risk assessment may result in better pricing for qualified borrowers
4. **Greater accessibility**: Borrowers with non-traditional income or credit histories may find more options

While technology continues to advance, the mortgage process still benefits from human guidance. Working with a knowledgeable mortgage professional remains valuable, especially when navigating the numerous options available in today's market.

The future of mortgage lending is increasingly automated but ultimately aims to create a more accessible path to homeownership—combining technological efficiency with human expertise for the best possible outcomes.
    `,
    category: "Technology",
    createdBy: "2", // Jane Smith (team)
    updatedAt: new Date("2024-05-03"),
    published: true,
  },
  {
    id: "2",
    date: new Date("2024-05-02"),
    title: "Home Equity Trends: How Homeowners Are Tapping Record Equity in 2024",
    brief: "With property values at record highs, homeowners are strategically accessing their equity through various methods while avoiding the refinance trap.",
    content: `
# Home Equity Trends: How Homeowners Are Tapping Record Equity in 2024

American homeowners are sitting on an unprecedented amount of home equity in 2024, with collective equity reaching $30 trillion according to recent Federal Reserve data. This wealth accumulation, driven by years of strong home price appreciation, presents significant financial opportunities for property owners.

## The Equity Boom by the Numbers

The average homeowner who purchased their property prior to 2020 has seen their equity position strengthen dramatically:

- Median home equity for owners who purchased in 2018-2019: $185,000
- Median home equity for owners who purchased in 2015-2017: $230,000
- Median home equity for owners who purchased before 2015: $325,000

This accumulated wealth represents an important financial resource, particularly in an economic environment characterized by persistent inflation and economic uncertainty.

## Popular Methods for Accessing Equity

With mortgage rates significantly higher than they were two years ago, homeowners are avoiding cash-out refinances that would replace their entire mortgage at today's rates. Instead, they're turning to alternative methods:

### Home Equity Lines of Credit (HELOCs)

HELOC volume has increased 30% year-over-year as homeowners seek flexible access to funds without disturbing their primary mortgage. Benefits include:

- Interest paid only on amounts actually borrowed
- Flexible draw periods, typically 10 years
- Variable rates that may be lower than fixed second mortgages
- Interest potentially tax-deductible when used for home improvements

### Fixed-Rate Second Mortgages

For homeowners seeking payment certainty, fixed-rate second mortgages (sometimes called home equity loans) have also seen resurgence:

- One-time lump sum with fixed interest rate
- Predictable monthly payments
- Typically shorter terms (5-20 years) than primary mortgages
- Often lower closing costs than refinancing the primary mortgage

## How Homeowners Are Using Their Equity

Recent surveys reveal several common uses for accessed home equity:

1. **Home improvements and renovations** (64% of borrowers)
2. **Debt consolidation** of higher-interest obligations (38%)
3. **Emergency funds** creation (21%)
4. **Education expenses** (17%)
5. **Investment opportunities** outside of real estate (12%)

## Strategic Considerations Before Tapping Equity

Before accessing home equity, financial experts recommend considering:

- **Long-term housing plans**: If you might sell within 2-3 years, the closing costs of equity financing may outweigh benefits
- **Current debt obligations**: Ensure additional monthly payments fit comfortably within your budget
- **Interest tax deductibility**: Consult a tax professional to understand potential deductions based on how funds will be used
- **Alternative funding sources**: Compare rates with personal loans or other financing options

## Looking Ahead

As property values stabilize in many markets, the rapid equity accumulation of recent years may slow. This makes thoughtful planning around existing equity particularly important.

For homeowners considering accessing their equity, working with both mortgage and financial planning professionals can help ensure decisions align with both short-term needs and long-term financial goals.

Home equity represents not just accumulated wealth but financial flexibility—when used strategically, it can significantly enhance overall financial health and help achieve important personal goals.
    `,
    category: "Real Estate",
    createdBy: "3", // Michael Johnson (team)
    updatedAt: new Date("2024-05-02"),
    published: true,
  },
  {
    id: "3",
    date: new Date("2024-05-06"),
    title: "First-Time Homebuyer Strategies in a High-Rate Environment",
    brief: "Creative approaches for new homebuyers facing the dual challenges of elevated mortgage rates and persistent home price appreciation.",
    content: `
# First-Time Homebuyer Strategies in a High-Rate Environment

First-time homebuyers face a challenging market in 2024, with mortgage rates higher than they've been in over a decade and home prices that continue to rise in many markets. Despite these obstacles, homeownership remains achievable with strategic planning and creative approaches.

## Understanding Today's Market Challenges

First-time buyers in today's environment face a three-fold challenge:

1. **Higher mortgage rates** increasing monthly payments
2. **Continued home price appreciation** in most markets
3. **Limited inventory** of starter homes

This combination has significantly impacted affordability, with the typical mortgage payment approximately 40% higher than it would have been on the same home three years ago.

## Down Payment Assistance Programs See Surge in Popularity

One bright spot for first-time buyers is the increasing availability and awareness of down payment assistance programs:

- Over 2,000 active programs exist nationwide
- Many have income limits up to 120% of area median income, making them accessible to middle-income buyers
- Available assistance typically ranges from $5,000 to $25,000, with some programs offering even more

First-time buyers should research options specific to their state, county, and even city, as programs vary significantly by location. Many state housing finance agencies offer excellent starting resources.

## Alternative Financing Structures

Beyond traditional 30-year fixed-rate mortgages, several alternative structures are gaining popularity:

### 2-1 Buydown Mortgages

These arrangements reduce the interest rate by 2% in the first year and 1% in the second year, before settling at the note rate for the remaining term. Benefits include:

- Lower payments during initial years of homeownership
- Time to grow income or adjust budget
- Often funded through seller concessions

### Adjustable-Rate Mortgages (ARMs)

ARM products, particularly 5/1, 7/1, and 10/1 options, can offer rates 0.5%-1.0% lower than 30-year fixed products:

- Initial fixed period provides payment stability
- Can be ideal for those who plan to move or refinance within the fixed period
- Include rate caps to limit adjustment risk

## Co-Buying Arrangements

Many first-time buyers are exploring shared ownership models:

- **Friends purchasing together** to combine financial resources
- **Family equity-sharing** where parents become co-investors rather than simply providing gifts
- **Co-buying services** that match compatible buyers or connect investors with occupant buyers

These arrangements require careful legal planning but can make homeownership possible when it wouldn't be individually attainable.

## Location Flexibility & Remote Work Advantage

The rise of remote work has opened new possibilities:

- Expanding search areas to more affordable markets within commuting distance
- Considering relocation to significantly more affordable housing markets
- Exploring emerging neighborhoods before major price appreciation

Some first-time buyers are purchasing in more affordable markets while continuing to rent in their preferred location, building equity while waiting for the right opportunity.

## The Waiting Game: Strategic Planning

For those not ready to buy immediately, this time can be valuable for strategic preparation:

1. **Aggressive savings** to build a larger down payment
2. **Credit optimization** to qualify for better rates
3. **Career advancement** to increase purchasing power
4. **Market education** to identify opportunities quickly when they arise

## Looking Ahead

While today's market presents challenges, historical patterns suggest that those who can find a path to homeownership typically benefit from long-term appreciation and wealth building. Working with knowledgeable professionals—including loan officers who specialize in first-time buyer programs—can help identify the most viable path given your specific circumstances.

The journey to first-time homeownership in 2024 requires more creativity and planning than in years past, but remains an achievable goal with the right approach and resources.
    `,
    category: "Real Estate",
    createdBy: "4", // Sarah Williams (team)
    updatedAt: new Date("2024-05-06"),
    published: false, // Draft
  },
];
