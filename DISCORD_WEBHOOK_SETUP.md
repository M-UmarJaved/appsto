# Discord Webhook Setup Guide for Appsto

## 🎯 Goal
Set up Discord to receive instant mobile notifications whenever someone purchases from your Appsto marketplace - just like Shopify notifications!

---

## 📱 Step 1: Install Discord (If You Don't Have It)

### On Mobile:
- **iOS**: Download from App Store
- **Android**: Download from Google Play Store

### On Desktop:
- Download from [discord.com](https://discord.com/download)
- Or use the web version at [discord.com/app](https://discord.com/app)

**Create an account** if you don't have one (takes 2 minutes).

---

## 🏠 Step 2: Create Your Appsto Notifications Server

1. **Open Discord** (mobile or desktop)

2. **Create a New Server:**
   - Click the **"+"** button on the left sidebar
   - Select **"Create My Own"**
   - Choose **"For me and my friends"** (or skip this)
   - Name it: **"Appsto Notifications"** (or any name you like)
   - Click **"Create"**

✅ **You now have your notification server!**

---

## 🔔 Step 3: Create a Text Channel for Sales

1. **In your Appsto Notifications server**, you'll see a default channel called **#general**

2. **Create a dedicated sales channel:**
   - Right-click on your server name (top left)
   - Select **"Create Channel"**
   - Choose **"Text Channel"**
   - Name it: **"sales-notifications"**
   - Click **"Create Channel"**

✅ **Your sales notification channel is ready!**

---

## 🔗 Step 4: Generate Webhook URL

### On Desktop (Easiest):

1. **Right-click** on your **#sales-notifications** channel
2. Select **"Edit Channel"**
3. Click **"Integrations"** in the left sidebar
4. Click **"Webhooks"**
5. Click **"New Webhook"**
6. **Name the webhook:** `Appsto Sales Bot`
7. **Optional**: Upload a custom avatar (use your Appsto logo)
8. Click **"Copy Webhook URL"** button
9. Click **"Save Changes"**

### On Mobile:

1. **Tap** on your **#sales-notifications** channel
2. Tap the **channel name** at the top
3. Tap **"Settings"** → **"Integrations"**
4. Tap **"Webhooks"** → **"New Webhook"**
5. Name it: `Appsto Sales Bot`
6. Tap **"Copy Webhook URL"**
7. Tap **"Save"**

---

## 📋 Step 5: Save Your Webhook URL

**Your webhook URL will look like this:**
```
https://discord.com/api/webhooks/1234567890123456789/AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz
```

⚠️ **IMPORTANT:** Keep this URL **SECRET**! Anyone with this URL can send messages to your Discord channel.

**Paste your webhook URL here for reference:**
```
YOUR_WEBHOOK_URL:https://discordapp.com/api/webhooks/1467858661736054947/9W8DO8nHMrTJQXiz2nzOba5mUknUJwbIyuO0BfVEhPJ5TK3jfZ3hYF6YMLMatcVasqz6

```

---

## 🔧 Step 6: Add Webhook to Your Appsto Project

1. **Open your `.env` file** in your Appsto project:
   ```
   d:\University\CS 2024-2028\SP\Appsto\.env
   ```

2. **Add this line at the bottom:**
   ```env
   # Discord Notifications
   DISCORD_WEBHOOK_URL=https://discordapp.com/api/webhooks/1467858661736054947/9W8DO8nHMrTJQXiz2nzOba5mUknUJwbIyuO0BfVEhPJ5TK3jfZ3hYF6YMLMatcVasqz6
   ```

3. **Replace `paste_your_webhook_url_here`** with your actual webhook URL from Step 5

4. **Save the file** (Ctrl+S or Cmd+S)

**Example:**
```env
# Discord Notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1234567890123456789/AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz
```

✅ **Your webhook is now configured!**

---

## ✅ Step 7: Enable Mobile Notifications (IMPORTANT!)

### To Get Push Notifications with Sound:

1. **Open Discord Mobile App**
2. Go to your **Appsto Notifications** server
3. Tap the **server name** at the top
4. Tap **"Notifications"**
5. Set **"Mobile Push Notifications"** to **ON**
6. Set **"Notification Override"** to **"All Messages"**
7. Enable **"Suppress @everyone and @here"** to OFF (so you get all notifications)

### On Desktop:
1. Open Discord
2. Right-click your **Appsto Notifications** server icon
3. Select **"Notification Settings"**
4. Set to **"All Messages"**
5. Enable **"Desktop Notifications"** and **"Notification Sound"**

✅ **You'll now get instant alerts with sound for every sale!**

---

## 🧪 Step 8: Test Your Webhook (Optional but Recommended)

You can test if your webhook works using this PowerShell command:

1. **Open PowerShell** in your project directory
2. **Run this command** (replace `YOUR_WEBHOOK_URL` with your actual URL):

```powershell
$webhook = "https://discord.com/api/webhooks/1234567890123456789/AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz"
$body = @{
    embeds = @(
        @{
            title = "🎉 Test Sale - DeskSweep"
            description = "This is a test notification to verify your Discord webhook is working!"
            color = 3447003
            fields = @(
                @{ name = "Customer"; value = "test@email.com"; inline = $true }
                @{ name = "Amount"; value = "$29.99 USD"; inline = $true }
                @{ name = "Plan"; value = "Solo Plan"; inline = $true }
            )
            footer = @{ text = "Appsto Sales Notification • Test" }
            timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri $webhook -Method Post -Body $body -ContentType 'application/json'
```

3. **Check your Discord channel** - You should see a beautiful notification card appear!
4. **Check your mobile phone** - You should get a push notification with sound!

---

## ✅ Verification Checklist

Before proceeding, make sure:

- [ ] Discord app installed on your mobile phone
- [ ] Created "Appsto Notifications" server
- [ ] Created "#sales-notifications" channel
- [ ] Generated webhook URL and saved it somewhere safe
- [ ] Added `DISCORD_WEBHOOK_URL` to your `.env` file
- [ ] Enabled mobile push notifications in Discord settings
- [ ] Tested webhook and received notification (optional but recommended)

---

## 🎯 What's Next?

Once you've completed all steps above, **tell me you're done** and I'll implement:

1. **Discord notification library** (`/lib/discord.ts`)
2. **Integrate with purchase flow** - Auto-send notifications on every sale
3. **Beautiful notification embeds** - With product image, customer info, amount, timestamp
4. **Test purchase flow** - Send yourself a real notification

---

## 📞 Need Help?

**Common Issues:**

**Q: I don't see "Copy Webhook URL" button**
- A: Make sure you clicked "New Webhook" first, then the Copy button appears

**Q: Can I use an existing Discord server?**
- A: Yes! Just create a new channel in your existing server and follow the same steps

**Q: Will this work if Discord is closed on my phone?**
- A: Yes! Discord sends push notifications even when the app is closed

**Q: Can multiple people receive notifications?**
- A: Yes! Just invite team members to your server and they'll get notifications too

**Q: Is this free forever?**
- A: Yes! Discord webhooks have no limits and no costs

---

## 🔐 Security Note

⚠️ **Never share your webhook URL publicly!** 
- Don't commit it to GitHub (it's in `.env` which is in `.gitignore`)
- Don't share it in Discord or public channels
- If compromised, delete the webhook and create a new one

---

**Ready to continue? Let me know when you've completed these steps!** 🚀
