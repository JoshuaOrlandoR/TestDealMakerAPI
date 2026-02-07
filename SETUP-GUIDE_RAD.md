# RAD Intel Investment Form - Complete Setup Guide

This guide will walk you through everything from the moment you receive the project files to having the investment form live on your Webflow site. Even if you haven't worked with code before, you should be able to follow along.

---

## What You're Working With

When you download or receive the project package, you'll get a folder containing a Next.js application. This is a self-contained web app that handles the entire investment checkout flow -- selecting an investment amount, collecting investor details, confirming the investment, and processing payment.

The key things to know:
- The form runs as its own standalone site that you'll host separately
- It connects to DealMaker using API credentials you'll provide
- Once hosted, you embed it into your Webflow site (similar to embedding a YouTube video)
- If DealMaker credentials aren't added yet, the form still works using built-in fallback values

---

## Part 1: Opening and Understanding the Project

### First Steps After Download

1. **Unzip the package** if it came as a ZIP file. You'll see a folder structure that looks something like this:

```
rad-checkout/
├── app/                    (pages and API routes)
│   ├── api/
│   │   ├── deal/           (fetches deal config from DealMaker)
│   │   └── investor/       (creates investor records in DealMaker)
│   ├── layout.tsx
│   └── page.tsx
├── components/             (all the UI pieces)
│   ├── step-one-invest.tsx (investment amount selection)
│   ├── step-two-details.tsx(contact, confirmation, payment)
│   └── ui/                 (shared interface components)
├── lib/
│   ├── dealmaker.ts        (DealMaker API client)
│   └── investment-utils.ts (pricing, share calculations, fallback values)
├── styles/
│   ├── fonts.css           (Rink and Aptos font definitions)
│   ├── globals.css         (base styles)
│   └── investment-flow.css (all visual styling for the form)
├── package.json
└── ... other config files
```

2. **The files you're most likely to touch:**
   - `lib/investment-utils.ts` -- where share price, minimum investment, preset amounts, and bonus tiers are defined as fallback values
   - `styles/investment-flow.css` -- all colors and visual styling (uses CSS variables at the top for easy changes)
   - Environment variables (covered in the deployment section)

### If You Want to Preview Locally (Optional)

This step is optional but helpful if you want to see the form before deploying. You'll need Node.js installed on your computer.

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to the project folder:
   ```
   cd path/to/rad-checkout
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser to `http://localhost:3000`

You'll see the full investment form working with fallback values. It won't create real investor records in DealMaker until you add your API credentials.

---

## Part 2: Getting Your DealMaker API Credentials

Before the form can create real investors and pull live deal data, you need to connect it to your DealMaker account. This requires three pieces of information.

### Finding Your Client ID and Client Secret

1. Log into your DealMaker dashboard at `app.dealmaker.tech`
2. Look for **Integrations** in the left sidebar and click it
3. Select **API Applications**
4. If you already have an application listed, click on it to view the credentials. If not:
   - Click **Create New Application**
   - Give it a name like "RAD Intel Checkout"
   - Click Create
5. You'll now see two values:
   - **Client ID** -- a long string of letters and numbers
   - **Client Secret** -- another long string (treat this like a password)

Copy these somewhere safe. You'll need them shortly.

### Finding Your Deal ID

1. Still in DealMaker, go to **Deals** in the sidebar
2. Click on the specific deal you want investors to flow into
3. Look at the URL in your browser -- it will look like:
   ```
   https://app.dealmaker.tech/deals/12345/overview
   ```
4. The number in the middle (`12345` in this example) is your **Deal ID**

### What These Credentials Do

Once connected, the form will:
- Pull the current share price, minimum/maximum investment, and security type directly from your deal
- Pull bonus share tiers from your incentive plan
- Create investor profiles and deal investor records when someone completes the checkout flow

If any of these API calls fail (or credentials aren't set), the form falls back to the hardcoded values in `lib/investment-utils.ts` so it never shows a broken state.

### A Note on Security

Your Client Secret is sensitive -- anyone with it could access your DealMaker account through the API.

- Never put these credentials directly in the code files
- Never share them over email or chat if you can avoid it
- Only enter them into secure places like Vercel's environment variables (covered next)
- If you ever think they've been compromised, generate new ones in DealMaker immediately

---

## Part 3: Deploying the Project

The investment form needs to live on the internet before you can embed it in Webflow. We recommend Vercel because it's free, fast, and designed for exactly this type of project.

### Setting Up Vercel (First Time Only)

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** and choose to sign up with GitHub
   - If you don't have a GitHub account, create one at [github.com](https://github.com) first
   - This is free and takes about 2 minutes
3. Authorize Vercel to access your GitHub account when prompted

### Uploading Your Project to GitHub

Your project needs to be on GitHub so Vercel can access it.

1. Go to [github.com](https://github.com) and log in
2. Click the **+** icon in the top right, then **New repository**
3. Name it something like `rad-checkout`
4. Keep it set to **Private** (recommended for security)
5. Click **Create repository**
6. You'll see instructions for uploading files. The easiest method:
   - Download [GitHub Desktop](https://desktop.github.com/) if you haven't already
   - Clone your new empty repository
   - Copy all the project files into that folder
   - In GitHub Desktop, you'll see all the new files listed
   - Write a commit message like "Initial upload" and click **Commit to main**
   - Click **Push origin** to upload everything

### Deploying to Vercel

1. Go back to [vercel.com](https://vercel.com) and click **Add New Project**
2. You should see your GitHub repository listed -- click **Import** next to it
3. Before clicking Deploy, click on **Environment Variables** to expand that section
4. Add your three credentials:

   | Name (copy exactly)        | Value                     |
   |----------------------------|---------------------------|
   | `DEALMAKER_CLIENT_ID`      | Paste your Client ID      |
   | `DEALMAKER_CLIENT_SECRET`  | Paste your Client Secret  |
   | `DEALMAKER_DEAL_ID`        | Paste your Deal ID        |

   There is also an optional fourth variable if DealMaker ever changes their API URL:

   | Name (optional)            | Value                     |
   |----------------------------|---------------------------|
   | `DEALMAKER_API_URL`        | Defaults to `https://app.dealmaker.tech/api/v1` |

5. Click **Deploy**

Vercel will take about 1-2 minutes to build and deploy your project. When it's done, you'll see a success screen with a URL like:
```
https://rad-checkout.vercel.app
```

Click that URL to see your live investment form. Save this URL -- you'll need it for the Webflow embed.

### Verifying It Works

1. Visit your new Vercel URL
2. Select an investment amount and click Continue
3. Fill out contact information and proceed through the steps
4. Check your DealMaker dashboard -- you should see a new investor appear under the deal

If the investor shows up in DealMaker, everything is connected properly.

---

## Part 4: Embedding in Webflow

Now for the final step -- getting the form onto your actual website.

### Option A: Simple Iframe Embed (Recommended)

This is the most straightforward approach and works reliably.

1. Open your Webflow project and go to the page where you want the investment form
2. In the left panel, find **Components** (or press `A` to open Add Elements)
3. Drag an **Embed** element onto your page where you want the form
4. Double-click the Embed element to open the code editor
5. Paste this code:

```html
<iframe
  src="https://YOUR-VERCEL-URL.vercel.app"
  width="100%"
  height="1000"
  frameborder="0"
  style="border: none; border-radius: 12px; max-width: 800px; margin: 0 auto; display: block;"
></iframe>
```

6. Replace `YOUR-VERCEL-URL` with your actual Vercel URL
7. Click **Save & Close**
8. Publish your Webflow site to see it live

**Adjusting the height:** The form is fairly tall, especially when all accordion sections are open. Start with `height="1000"` and adjust up or down based on how it looks. Typical values range from 900 to 1200.

### Option B: Responsive Iframe (Better for Mobile)

If Option A looks awkward on mobile devices, try this responsive version:

```html
<div style="position: relative; width: 100%; max-width: 800px; margin: 0 auto;">
  <iframe
    src="https://YOUR-VERCEL-URL.vercel.app"
    style="width: 100%; height: 100vh; min-height: 900px; max-height: 1200px; border: none; border-radius: 12px;"
  ></iframe>
</div>
```

This version adapts to the screen height while staying within reasonable bounds.

### Option C: Full-Page Embed

If you want the investment form to be its own dedicated page without any Webflow elements around it:

1. Create a new page in Webflow (e.g., `/invest`)
2. Remove all default sections so the page is empty
3. Add an Embed element
4. Use this code:

```html
<iframe
  src="https://YOUR-VERCEL-URL.vercel.app"
  style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none;"
></iframe>
```

This makes the form take over the entire page.

### Option D: Custom Domain (Professional Touch)

Instead of showing `rad-checkout.vercel.app` in the embed, you can use your own subdomain like `invest.radintel.ai`.

1. In Vercel, go to your project's **Settings** tab
2. Click **Domains** in the sidebar
3. Click **Add** and enter your desired subdomain (e.g., `invest.radintel.ai`)
4. Vercel will show you DNS records to add
5. Go to your domain registrar (wherever you bought your domain) and add those DNS records
6. Wait 5-30 minutes for DNS to propagate
7. Update your Webflow embed to use the new domain

---

## Troubleshooting Common Issues

**The form appears but looks squished or cut off**
- Increase the `height` value in your iframe code
- Make sure the Webflow container isn't restricting the width

**The form shows a blank white or gray screen**
- Visit your Vercel URL directly to make sure the deployment is working
- Check that you're using `https://` not `http://` in the iframe src

**Investments aren't appearing in DealMaker**
- Go to Vercel > Your Project > Settings > Environment Variables
- Verify all three variables are present and spelled exactly right (they're case-sensitive)
- Make sure there are no extra spaces before or after the values
- After any changes, you need to redeploy: Vercel > Deployments > click the three dots on the latest > Redeploy

**Share price or tiers seem wrong**
- If DealMaker credentials are set, the form pulls pricing from the API on page load
- If credentials are missing or the API call fails, the form falls back to the values in `lib/investment-utils.ts`
- Check the Vercel function logs (Vercel > Your Project > Logs) to see if API calls are succeeding

**Getting a CORS error in the browser console**
- This usually means the API routes didn't deploy correctly
- Try redeploying the project in Vercel
- Make sure the `app/api` folder structure is intact in your GitHub repository

**The iframe has a white border or doesn't match the site**
- Add `border: none;` to the iframe style
- The form uses a warm beige background (#eee9e2) by default
- You can wrap the iframe in a div with a matching background if you want seamless edges

**Mobile layout looks off**
- Use Option B (responsive iframe) instead of Option A
- Check that your Webflow container allows full width on mobile
- The form itself is responsive and should adapt, but the iframe container needs room

---

## Making Changes Later

### Updating Share Price, Minimum Investment, or Bonus Tiers

If DealMaker is connected, these values are pulled from the API automatically. The form reads them from your deal settings and incentive plan.

If you need to change the **fallback values** (used when DealMaker is unavailable):

1. Open the project in your code editor (or edit directly on GitHub)
2. Navigate to `lib/investment-utils.ts`
3. Find the `FALLBACK_CONFIG` object near the top:

```typescript
export const FALLBACK_CONFIG: InvestmentConfig = {
  sharePrice: 0.85,
  minInvestment: 998.75,
  investorFeePercent: 2,
  campaignRaised: 14000000,
  campaignGoal: 17000000,
  presetAmounts: [2500, 5000, 10000, 25000, 50000, 100000, 250000],
  volumeTiers: [
    { threshold: 25000, bonusPercent: 15 },
    { threshold: 10000, bonusPercent: 10 },
    { threshold: 5000, bonusPercent: 5 },
  ],
}
```

4. Change the numbers as needed
5. Commit and push to GitHub
6. Vercel will automatically redeploy with the new values (takes about 1-2 minutes)

### Updating Colors or Styling

All visual styling lives in `styles/investment-flow.css`. Colors are defined as CSS variables at the top of the file, so you can change the entire theme by updating a handful of values:

```css
--inv-primary: var(--brand-medium-rad-blue);     /* buttons, CTAs */
--inv-primary-hover: var(--brand-dark-rad-blue);  /* hover states */
--inv-primary-border: var(--brand-rad-blue);      /* accent borders */
--inv-bg-step1: var(--brand-rad-white);           /* page background */
```

### Updating API Credentials

If you need to rotate your DealMaker credentials:

1. Generate new credentials in DealMaker (Integrations > API Applications)
2. Go to Vercel > Your Project > Settings > Environment Variables
3. Update the values
4. Go to Deployments and redeploy the latest deployment

---

## Quick Reference

| What                     | Where                                                        |
|--------------------------|--------------------------------------------------------------|
| DealMaker credentials    | DealMaker > Integrations > API Applications                  |
| Deal ID                  | DealMaker > Deals > (your deal) > look at the URL            |
| Environment variables    | Vercel > Your Project > Settings > Environment Variables      |
| Fallback pricing config  | `lib/investment-utils.ts` (FALLBACK_CONFIG)                   |
| DealMaker API client     | `lib/dealmaker.ts`                                            |
| Visual styling / colors  | `styles/investment-flow.css`                                  |
| Fonts                    | `styles/fonts.css`                                            |
| Deployment logs          | Vercel > Your Project > Logs                                  |

---

## Need Help?

If you run into issues not covered here:
- DealMaker documentation: https://docs.dealmaker.tech
- Vercel documentation: https://vercel.com/docs
- Webflow embed guide: https://university.webflow.com/lesson/custom-code-embed
