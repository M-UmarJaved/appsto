# System Architecture - appsto.software

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER FLOW                            │
└─────────────────────────────────────────────────────────────┘

1. User visits website
2. Browses products
3. Clicks "Buy Now"
4. Completes payment (Paddle)
5. Receives email with license
6. Downloads desktop app
7. Activates with token
8. Uses app offline forever
```

## 📊 System Components

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │ ◄──► │   Next.js    │ ◄──► │   Supabase   │
│  (Browser)   │      │  API Routes  │      │  (Database)  │
└──────────────┘      └──────────────┘      └──────────────┘
       │                      │                      
       │                      │                      
       ▼                      ▼                      
┌──────────────┐      ┌──────────────┐             
│    Paddle    │      │    Email     │             
│  (Payments)  │      │   Service    │             
└──────────────┘      └──────────────┘             
```

## 🔄 Purchase Flow (One-Time Product)

```
┌─────────┐
│  USER   │ Clicks "Buy Now"
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Paddle Checkout │ User enters payment details
└────┬────────────┘
     │ Payment Successful
     ▼
┌──────────────────┐
│ Paddle Webhook   │ POST to /api/webhooks/paddle
└────┬─────────────┘
     │
     ▼
┌────────────────────┐
│ Webhook Handler    │ Validates signature
└────┬───────────────┘
     │
     ▼
┌────────────────────┐     ┌──────────────┐
│ Check Product Type │────►│ ONE-TIME?    │
└────────────────────┘     └──────┬───────┘
                                  │ YES
                                  ▼
┌──────────────────────────┐
│ Generate License Token   │ APPSTO-XXXX-XXXX-XXXX
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Save to Database         │ Insert into 'licenses' table
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Send Email               │ Token + Download Link
└────┬─────────────────────┘
     │
     ▼
┌─────────────────┐
│  USER RECEIVES  │ Email in inbox
│     EMAIL       │
└─────────────────┘
```

## 🔐 License Activation Flow

```
┌──────────────────┐
│  Desktop App     │ User launches app
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Prompt for Token │ User pastes: APPSTO-XXXX-XXXX-XXXX
└────┬─────────────┘
     │
     ▼
┌──────────────────────────┐
│ POST /api/license/activate│
│ Body: { token, deviceInfo }│
└────┬─────────────────────┘
     │
     ▼
┌──────────────────┐
│  API Validates   │ Check token exists & not used
└────┬─────────────┘
     │
     ├─► Invalid Token ──► Return Error 404
     │
     ├─► Already Used ──► Return Error 400
     │
     └─► Valid ──────────►┌──────────────────┐
                          │ Mark as Used     │
                          │ Store Device Info│
                          └────┬─────────────┘
                               │
                               ▼
                          ┌──────────────────┐
                          │ Return Success   │
                          └────┬─────────────┘
                               │
                               ▼
                          ┌──────────────────┐
                          │ App Stores       │
                          │ License Locally  │
                          └────┬─────────────┘
                               │
                               ▼
                          ┌──────────────────┐
                          │ App Works        │
                          │ Offline Forever  │
                          └──────────────────┘
```

## 🗄️ Database Schema

```
┌─────────────────────────┐
│      PRODUCTS           │
├─────────────────────────┤
│ id (UUID)               │
│ name                    │
│ slug                    │
│ description             │
│ price                   │
│ product_type ◄──────────┼─── "one_time" or "subscription"
│ paddle_product_id       │
│ features (JSON)         │
│ system_requirements     │
│ is_active               │
└────────┬────────────────┘
         │
         │ Referenced by
         │
         ▼
┌─────────────────────────┐
│      LICENSES           │
├─────────────────────────┤
│ id (UUID)               │
│ token ◄─────────────────┼─── APPSTO-XXXX-XXXX-XXXX
│ product_id (FK)         │
│ user_email              │
│ is_used ◄───────────────┼─── false → true (after activation)
│ activated_at            │
│ device_info (JSON)      │
│ paddle_transaction_id   │
└─────────────────────────┘

┌─────────────────────────┐
│      PURCHASES          │
├─────────────────────────┤
│ id (UUID)               │
│ product_id (FK)         │
│ user_email              │
│ amount                  │
│ paddle_transaction_id   │
│ paddle_subscription_id  │
│ status                  │
└─────────────────────────┘
```

## 📧 Email System

```
┌──────────────────┐
│ License Created  │
└────┬─────────────┘
     │
     ▼
┌─────────────────────────┐
│ Generate Email HTML     │
│ - Professional template │
│ - License token         │
│ - Download button       │
│ - Setup instructions    │
│ - Support info          │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│ Send via SMTP           │
│ (Gmail/SendGrid/etc)    │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│ User Receives Email     │
└─────────────────────────┘
```

## 🔀 Critical Decision Tree: Token Generation

```
                 ┌───────────────────┐
                 │ Purchase Complete │
                 └────────┬──────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Check product_type    │
              └───────┬───────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌────────────────┐        ┌────────────────┐
│ "one_time"     │        │ "subscription" │
└────┬───────────┘        └────┬───────────┘
     │                         │
     │ YES                     │ NO
     │                         │
     ▼                         ▼
┌────────────────┐        ┌────────────────┐
│ GENERATE TOKEN │        │ NO TOKEN       │
│ Send Email     │        │ Record Purchase│
└────────────────┘        └────────────────┘
```

## 🚀 Deployment Architecture

```
┌────────────────────────────────────────┐
│         DigitalOcean / Vercel          │
│  ┌──────────────────────────────────┐  │
│  │      Next.js Application         │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │   Frontend (React/Next)    │  │  │
│  │  └────────────────────────────┘  │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │   API Routes               │  │  │
│  │  │   - /api/webhooks/paddle   │  │  │
│  │  │   - /api/license/activate  │  │  │
│  │  └────────────────────────────┘  │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
              │
              │ Connects to
              ▼
┌─────────────────────────────────────────┐
│            External Services             │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐      │
│  │  Supabase   │  │   Paddle    │      │
│  │ (Database)  │  │  (Payments) │      │
│  └─────────────┘  └─────────────┘      │
│  ┌─────────────┐                        │
│  │    SMTP     │                        │
│  │   (Email)   │                        │
│  └─────────────┘                        │
└─────────────────────────────────────────┘
```

## 📡 API Endpoints

```
┌──────────────────────────────────────────┐
│           API Endpoints                  │
├──────────────────────────────────────────┤
│                                          │
│  POST /api/webhooks/paddle               │
│  ├─ Receives payment confirmations      │
│  ├─ Validates webhook signature          │
│  ├─ Generates license tokens             │
│  └─ Triggers email delivery              │
│                                          │
│  POST /api/license/activate              │
│  ├─ Activates license tokens             │
│  ├─ Marks token as used                  │
│  ├─ Stores device information            │
│  └─ Returns activation status            │
│                                          │
│  GET /api/license/activate?token=X       │
│  ├─ Verifies license token               │
│  ├─ Checks activation status             │
│  └─ Returns license info                 │
│                                          │
└──────────────────────────────────────────┘
```

## 🔒 Security Layers

```
┌────────────────────────────────────┐
│        Security Measures           │
├────────────────────────────────────┤
│ 1. Environment Variables           │
│    └─ All secrets in .env          │
│                                    │
│ 2. Webhook Verification            │
│    └─ Paddle signature check       │
│                                    │
│ 3. Database Security               │
│    └─ Row Level Security (RLS)     │
│                                    │
│ 4. License Tokens                  │
│    └─ Cryptographically secure     │
│                                    │
│ 5. Single-Use Enforcement          │
│    └─ Token marked after use       │
│                                    │
│ 6. HTTPS/SSL                       │
│    └─ All traffic encrypted        │
│                                    │
│ 7. Device Tracking                 │
│    └─ Store activation device      │
└────────────────────────────────────┘
```

## 📊 Data Flow Summary

```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌─────────┐
│ USER │────►│  PADDLE  │────►│ WEBHOOK  │────►│DATABASE │
└──────┘     └──────────┘     └──────────┘     └─────────┘
                                     │               │
                                     ▼               │
                              ┌───────────┐         │
                              │   EMAIL   │         │
                              └───────────┘         │
                                     │               │
                                     ▼               │
                              ┌───────────┐         │
                              │   USER    │         │
                              │ (INBOX)   │         │
                              └───────────┘         │
                                     │               │
                                     ▼               │
                              ┌───────────┐         │
                              │ DESKTOP   │         │
                              │   APP     │─────────┘
                              └───────────┘
                                     │
                                     ▼
                              ┌───────────┐
                              │  OFFLINE  │
                              │  FOREVER  │
                              └───────────┘
```

## 🎯 Key Business Rules

```
┌─────────────────────────────────────────────┐
│         CRITICAL BUSINESS RULES             │
├─────────────────────────────────────────────┤
│                                             │
│ 1. Token Generation:                        │
│    ✓ ONLY for product_type = "one_time"    │
│    ✗ NEVER for product_type = "subscription"│
│                                             │
│ 2. Token Format:                            │
│    ✓ Must be: APPSTO-XXXX-XXXX-XXXX        │
│    ✓ Must be unique                         │
│    ✓ Must be secure                         │
│                                             │
│ 3. Token Usage:                             │
│    ✓ Single-use only                        │
│    ✓ Cannot be reactivated                  │
│    ✓ Device info stored                     │
│                                             │
│ 4. Email Delivery:                          │
│    ✓ Sent immediately after token creation  │
│    ✓ Contains token + download link         │
│    ✓ Includes setup instructions            │
│                                             │
│ 5. App Activation:                          │
│    ✓ Requires internet ONCE                 │
│    ✓ Works offline after activation         │
│    ✓ License stored locally                 │
│                                             │
└─────────────────────────────────────────────┘
```

## 🔄 State Machine: License Lifecycle

```
                    ┌─────────────┐
                    │   CREATED   │
                    │ (is_used=F) │
                    └──────┬──────┘
                           │
                           │ User activates
                           │
                           ▼
                    ┌─────────────┐
                    │  ACTIVATED  │
                    │ (is_used=T) │
                    └──────┬──────┘
                           │
                           │ Forever
                           │
                           ▼
                    ┌─────────────┐
                    │   VALID     │
                    │  (Offline)  │
                    └─────────────┘
```

## 🧩 Component Hierarchy

```
┌─────────────────────────────────────────┐
│            RootLayout                    │
│  ┌─────────────────────────────────┐    │
│  │         Navbar                  │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │         Page Content            │    │
│  │  ┌──────────────────────────┐   │    │
│  │  │   HomePage              │   │    │
│  │  │   ProductsPage          │   │    │
│  │  │   ProductDetailPage     │   │    │
│  │  │   SupportPage           │   │    │
│  │  └──────────────────────────┘   │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │         Footer                  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

    UI Components Used:
    ├─ Button
    ├─ Card
    ├─ Badge
    └─ Icons (lucide-react)
```

---

## 📝 Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Secure payment processing
- ✅ Automated license management
- ✅ Reliable email delivery
- ✅ Offline app support
- ✅ Scalable design
- ✅ Production-ready implementation

**Everything works together seamlessly to create a professional SaaS marketplace!**
