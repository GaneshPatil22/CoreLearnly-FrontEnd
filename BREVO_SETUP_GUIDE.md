# Brevo (SendinBlue) Setup Guide for CoreLearnly

This guide will help you set up automated email sequences for your workshop using Brevo's free plan.

---

## Step 1: Create Brevo Account (5 minutes)

1. Go to https://www.brevo.com/
2. Click "Sign up free" at the top right
3. Fill in your details:
   - Email: Use your business email or Gmail
   - Password: Choose a strong password
   - Company name: CoreLearnly
4. Verify your email (check inbox for verification link)
5. Complete the onboarding questionnaire:
   - Business type: "Education" or "Online Services"
   - Purpose: "Transactional emails" and "Marketing emails"
   - Team size: "Just me"

**Free Plan Includes:**
- 300 emails per day (9,000/month)
- Unlimited contacts
- Email templates
- Basic automation
- Email support

---

## Step 2: Verify Your Sender Email (10 minutes)

### Option A: Use Gmail (Easiest)

1. In Brevo dashboard, go to **Settings → Senders & IP**
2. Click **Add a sender**
3. Enter:
   - Sender name: "Ganesh from CoreLearnly" (or just "Ganesh Patil")
   - Sender email: your Gmail address
   - Verify email address
4. Check your Gmail for verification email from Brevo
5. Click the verification link

**Pros:** Quick setup, works immediately
**Cons:** Shows Gmail address (less professional)

### Option B: Use Custom Domain (Recommended but takes more time)

If you have corelearnly.com domain:

1. In Brevo, go to **Settings → Senders & IP**
2. Click **Add a sender**
3. Enter:
   - Sender name: "Ganesh from CoreLearnly"
   - Sender email: hello@corelearnly.com (or support@corelearnly.com)
4. Brevo will show you DNS records to add
5. Go to your domain provider (GoDaddy, Namecheap, etc.)
6. Add the DNS records Brevo provides:
   - SPF record
   - DKIM record
7. Wait 24-48 hours for DNS propagation
8. Verify in Brevo

**Pros:** Professional, branded email
**Cons:** Requires domain access, takes time

**Recommendation:** Start with Gmail (Option A) to test everything. Move to custom domain later when you have time.

---

## Step 3: Create Contact Lists (2 minutes)

1. Go to **Contacts → Lists**
2. Click **Create a list**
3. Create these lists:

**List 1: Workshop Registrants**
- Name: "Workshop Jan 2025"
- Description: "Students registered for Jan 10-11 workshop"

**List 2: Attended Workshop**
- Name: "Workshop Attendees Jan 2025"
- Description: "Students who actually attended"

**List 3: Enrolled in Course**
- Name: "Course Students"
- Description: "Students enrolled in full 6-month course"

---

## Step 4: Create Email Templates (30 minutes)

1. Go to **Campaigns → Templates**
2. Click **Create a template**
3. Choose **Drag & drop editor** (easiest) or **Rich text editor**
4. For each template:
   - Name it clearly (e.g., "01_Workshop_Confirmation")
   - Use the content from EMAIL_TEMPLATES.md
   - Add personalization: {{ contact.FIRSTNAME }}
   - Preview and test

**Templates to Create:**

1. **01_Workshop_Confirmation**
   - Subject: You're Registered! CoreLearnly FREE Workshop - Jan 10-11
   - Copy content from EMAIL_TEMPLATES.md Template #1

2. **02_Reminder_5Days**
   - Subject: Workshop Starts in 5 Days! Are You Ready?
   - Copy content from EMAIL_TEMPLATES.md Template #2

3. **03_Reminder_1Day_Zoom**
   - Subject: Tomorrow! Here's Your Zoom Link
   - Copy content from EMAIL_TEMPLATES.md Template #3
   - **IMPORTANT:** Add your Zoom link here

4. **04_Morning_Reminder_Day1**
   - Subject: Starting in 2 Hours! Workshop Day 1 Today
   - Copy content from EMAIL_TEMPLATES.md Template #4

5. **05_Morning_Reminder_Day2**
   - Subject: Starting in 2 Hours! Workshop Day 2 Today
   - Copy content from EMAIL_TEMPLATES.md Template #4

6. **06_Thank_You_Offer**
   - Subject: Thank You for Attending! Resources + Special Offer
   - Copy content from EMAIL_TEMPLATES.md Template #5

7. **07_Follow_Up_Undecided**
   - Subject: [First Name], Quick Question About Your Goals
   - Copy content from EMAIL_TEMPLATES.md Template #6

**Pro Tips:**
- Use personalization: {{ contact.FIRSTNAME }}
- Test every template by sending to yourself
- Make sure all links work
- Check mobile preview
- Keep it simple and scannable

---

## Step 5: Set Up Automation Workflow (20 minutes)

### Method 1: Using Brevo Automation (Recommended)

1. Go to **Automation → Create an automation**
2. Choose **Custom automation**
3. Set up the workflow:

**Trigger:** Contact added to list "Workshop Jan 2025"

**Actions:**

**Action 1: Send Confirmation Email**
- Type: Send email
- Template: 01_Workshop_Confirmation
- Delay: Immediately (0 minutes)

**Action 2: Send Reminder 1**
- Type: Send email
- Template: 02_Reminder_5Days
- Delay: Wait until January 6, 2025, 9:00 AM IST

**Action 3: Send Reminder 2 with Zoom Link**
- Type: Send email
- Template: 03_Reminder_1Day_Zoom
- Delay: Wait until January 10, 2025, 6:00 PM IST

**Action 4: Send Day 1 Morning Reminder**
- Type: Send email
- Template: 04_Morning_Reminder_Day1
- Delay: Wait until January 10, 2026, 8:00 AM IST

**Action 5: Send Day 2 Morning Reminder**
- Type: Send email
- Template: 05_Morning_Reminder_Day2
- Delay: Wait until January 11, 2026, 8:00 AM IST

**Action 6: Send Thank You + Offer**
- Type: Send email
- Template: 06_Thank_You_Offer
- Delay: Wait until January 13, 2025, 11:00 AM IST

**Action 7: Send Follow-up**
- Type: Send email
- Template: 07_Follow_Up_Undecided
- Delay: Wait 3 days after previous email (January 16, 2025)

4. **Activate the automation**

**Important Notes:**
- Brevo Free plan has limited automation features
- If date-based triggers don't work, you'll need to send emails manually or upgrade to paid plan
- Test with your own email first before going live

### Method 2: Manual Sending (Backup if automation doesn't work)

If automation is limited on free plan, you can send emails manually:

1. **Dec 20 onwards:** As people register, add them to "Workshop Jan 2025" list
2. **Immediately after registration:** Send Template #1 (Confirmation) manually to each new contact
3. **Jan 6:** Send Template #2 (Reminder 1) to entire "Workshop Jan 2025" list
4. **Jan 10:** Send Template #3 (Zoom link) to entire list
5. **Jan 10 morning:** Send Template #4 (Day 1 reminder) to entire list
6. **Jan 11 morning:** Send Template #5 (Day 2 reminder) to entire list
7. **Jan 13:** Send Template #6 (Thank you) to entire list
8. **Jan 16:** Send Template #7 (Follow-up) to those who haven't replied

---

## Step 6: Connect Tally to Brevo (15 minutes)

You have 3 options to connect your Tally form to Brevo:

### Option 1: Tally Native Integration (Easiest)

1. In Tally, go to your form settings
2. Click **Integrations**
3. Search for "Brevo" or "SendinBlue"
4. If available, connect it:
   - Enter your Brevo API key (from Brevo Settings → API Keys)
   - Select list: "Workshop Jan 2025"
   - Map fields: Email → Email, Name → First Name, etc.

### Option 2: Using Zapier (Most Reliable)

1. Go to https://zapier.com/ and create free account
2. Create new Zap:
   - **Trigger:** Tally - New Form Response
   - Connect your Tally account
   - Select your workshop form
3. **Action:** Brevo - Add Contact to List
   - Connect your Brevo account (use API key)
   - Select list: "Workshop Jan 2025"
   - Map fields:
     - Email → contact.EMAIL
     - First Name → contact.FIRSTNAME
     - Last Name → contact.LASTNAME
     - Phone → contact.PHONE
     - Experience Level → contact.EXPERIENCE
4. Test the Zap
5. Turn it on

**Zapier Free Plan:** 100 tasks/month (enough for workshop)

### Option 3: Using Make (Integromat) - Free Alternative

1. Go to https://www.make.com/ and create account
2. Create new scenario:
   - **Trigger:** Webhooks - Custom Webhook
   - Copy webhook URL
3. In Tally:
   - Go to form → Integrations → Webhooks
   - Paste the webhook URL
4. In Make:
   - **Action:** Brevo - Add Contact
   - Map fields similar to Zapier
5. Test and activate

**Make Free Plan:** 1,000 operations/month

### Option 4: Manual Import (Temporary)

While setting up automation:

1. Download responses from Tally as CSV
2. In Brevo, go to **Contacts → Import contacts**
3. Upload CSV file
4. Map columns to contact attributes
5. Select list: "Workshop Jan 2025"

**Do this daily** until automation is set up.

---

## Step 7: Test Everything (15 minutes)

Before going live, test the entire flow:

1. **Create test contact** in Brevo with your own email
2. **Add to list** "Workshop Jan 2025"
3. **Check if automation triggers** and you receive confirmation email
4. **Check email formatting** on desktop and mobile
5. **Test all links** in the email
6. **Remove test contact** after successful test

**Testing Checklist:**
- [ ] Confirmation email arrives within 1 minute
- [ ] Personalization works ({{ contact.FIRSTNAME }} shows correct name)
- [ ] All links work (workshop page, terms, privacy)
- [ ] Email looks good on mobile
- [ ] Sender name and email are correct
- [ ] Unsubscribe link is present (required by law)
- [ ] Zoom link is correct (for reminder emails)

---

## Step 8: Go Live (5 minutes)

Once testing is successful:

1. **Activate automation workflow**
2. **Connect Tally to Brevo** (using one of the methods above)
3. **Test with real registration:**
   - Register yourself on the form
   - Check if you receive confirmation email
   - Verify contact is added to Brevo list
4. **Monitor daily:**
   - Check Brevo dashboard for deliverability
   - Look for bounced emails
   - Respond to replies

---

## Monitoring & Maintenance

### Daily Tasks (Dec 20 - Jan 16)
- Check Brevo dashboard for new contacts
- Monitor email deliverability (open rates, bounce rates)
- Respond to email replies personally
- Check if automation is working correctly

### Before Workshop (Jan 10)
- [ ] Verify all registered students received Zoom link
- [ ] Check for bounced emails and contact those students directly
- [ ] Test Zoom meeting link yourself
- [ ] Send personal message to students who haven't opened emails

### After Workshop (Jan 13)
- [ ] Upload recordings to Google Drive
- [ ] Update thank you email with recording links
- [ ] Send thank you email manually if automation failed
- [ ] Track who opens and clicks (interested students)

### Week After Workshop (Jan 16-20)
- [ ] Follow up with interested students personally
- [ ] Track enrollment numbers
- [ ] Update LAUNCH_PLAN.md with metrics

---

## Troubleshooting

### Problem: Emails going to spam

**Solution:**
- Use verified sender email
- Avoid spam trigger words in subject (FREE, URGENT, ACT NOW)
- Include unsubscribe link (Brevo adds this automatically)
- Warm up your sender email by sending gradually increasing volumes
- Ask recipients to add you to contacts

### Problem: Low open rates

**Solution:**
- Improve subject lines (make them personal and specific)
- Send at optimal times (morning 9-11 AM IST)
- Use personalization (first name in subject)
- Send from a person's name, not "CoreLearnly" or "noreply"

### Problem: Automation not triggering

**Solution:**
- Check if workflow is activated
- Verify contact is in correct list
- Check date/time settings (use IST timezone)
- Use manual sending as backup
- Consider upgrading to paid plan for better automation

### Problem: Tally-Brevo connection not working

**Solution:**
- Use Zapier or Make as intermediary
- Check API key is correct and active
- Verify field mappings
- Test with manual CSV import first
- Use Tally's respondent notification as backup

---

## Cost Breakdown

### Free Setup (Recommended for Start)
- Brevo: FREE (300 emails/day limit)
- Tally: FREE (unlimited forms)
- Zapier: FREE (100 tasks/month) OR Make: FREE (1,000 ops/month)
- **Total: ₹0/month**

### Paid Setup (When You Scale)
- Brevo Lite: ~₹1,800/month (20,000 emails, better automation)
- Tally Pro: ~$29/month (~₹2,400) (for custom branding)
- Zapier Starter: ~$20/month (~₹1,650) (750 tasks)
- **Total: ~₹5,850/month** (only needed after 100+ students)

**Recommendation:** Start with free tools. Upgrade when:
- You have 50+ workshop registrations
- You're sending 200+ emails/day
- You need advanced automation
- You want white-label forms

---

## Quick Start Checklist

Use this for fast setup:

**Day 1 (Today - 30 minutes):**
- [ ] Create Brevo account
- [ ] Verify Gmail as sender
- [ ] Create "Workshop Jan 2025" contact list

**Day 2 (Tomorrow - 1 hour):**
- [ ] Create all 7 email templates in Brevo
- [ ] Test templates by sending to yourself
- [ ] Fix any formatting issues

**Day 3 (1 hour):**
- [ ] Set up automation workflow (or prepare manual sending schedule)
- [ ] Test automation with your email
- [ ] Verify triggers and delays

**Day 4 (30 minutes):**
- [ ] Connect Tally to Brevo (Zapier recommended)
- [ ] Test end-to-end: Form submit → Email received
- [ ] Fix any integration issues

**Day 5 (Go Live!):**
- [ ] Activate automation
- [ ] Start promoting workshop
- [ ] Monitor first few registrations closely

---

## Support Resources

**Brevo Help:**
- Help Center: https://help.brevo.com/
- Video Tutorials: https://www.youtube.com/@brevo
- Support: help@brevo.com (email support on free plan)

**Zapier Help:**
- Zapier Help: https://help.zapier.com/
- Tally + Brevo: Search "Tally Brevo Zapier integration"

**Community:**
- Brevo Community: https://community.brevo.com/
- Indie Hackers: https://www.indiehackers.com/ (for EdTech advice)

---

## Next Steps After Email Setup

Once email system is working, move to:
1. WhatsApp Business setup (for closer communication)
2. Zoom Pro account (for longer workshops and recordings)
3. Payment gateway setup (Razorpay for course enrollment)
4. Content creation (LinkedIn, Instagram, YouTube)

Refer to LAUNCH_PLAN.md for detailed next steps.

---

**Last Updated:** November 30, 2024
**Next Review:** December 5, 2024 (before workshop registration opens)
