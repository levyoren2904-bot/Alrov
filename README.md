# Alrov Careers Portal

Production-grade Proof of Concept for a luxury hotel group Careers Portal, built with modern web technologies.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** Auth.js (NextAuth) v5
- **Validation:** Zod
- **UI:** Custom design system (RTL, Hebrew)

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (local, Neon, or Supabase)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

Edit `.env` with your database URL and secrets:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/alrov_careers"
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
STORAGE_ADAPTER=local
STORAGE_LOCAL_PATH=./uploads
EMAIL_ADAPTER=mock
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npx prisma db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Seeded Credentials

| Role      | Email                  | Password   |
|-----------|------------------------|------------|
| Admin     | admin@alrov.co.il      | Alrov2024! |
| HR Manager| hr@alrov.co.il         | Alrov2024! |
| Recruiter | recruiter@alrov.co.il  | Alrov2024! |

## Routes

### Public

| Route              | Description                |
|--------------------|----------------------------|
| `/`                | Careers landing page       |
| `/jobs`            | Jobs listing with filters  |
| `/jobs/[slug]`     | Job detail page            |
| `/apply/[jobId]`   | Application form           |
| `/privacy`         | Privacy policy             |

### Admin

| Route                        | Description              |
|------------------------------|--------------------------|
| `/admin/login`               | Admin login              |
| `/admin`                     | Dashboard with KPIs      |
| `/admin/jobs`                | Jobs management          |
| `/admin/jobs/new`            | Create new job           |
| `/admin/jobs/[id]/edit`      | Edit job                 |
| `/admin/applications`        | Applications list        |
| `/admin/applications/[id]`   | Application detail       |

## Deploy to Vercel (לייב בלי דומיין)

כדי להעלות את האתר ללייב עם כתובת של Vercel (למשל `alrov-careers.vercel.app`) בלי דומיין מותאם:

### 1. דחיפת הקוד ל-Git

```bash
git init
git add .
git commit -m "Initial commit"
```

צור ריפו ב-GitHub/GitLab/Bitbucket ודחוף:

```bash
git remote add origin https://github.com/YOUR_USER/alrov-careers.git
git branch -M main
git push -u origin main
```

### 2. ייבוא הפרויקט ב-Vercel

1. היכנס ל-[vercel.com](https://vercel.com) (או התחבר עם GitHub).
2. **Add New** → **Project**.
3. ייבא את הריפו של הפרויקט.
4. **Framework Preset:** Next.js (יזוהה אוטומטית).
5. **Root Directory:** השאר ריק.
6. אל תלחץ עדיין Deploy – קודם הגדר משתנים.

### 3. משתני סביבה (Environment Variables)

ב-Vercel: **Settings** → **Environment Variables**. הוסף:

| Name | Value | הערה |
|------|--------|------|
| `DATABASE_URL` | `postgresql://...` | מחרוזת החיבור ל-Neon (או Supabase) – **חובה** |
| `NEXTAUTH_SECRET` | מחרוזת אקראית ארוכה | הרץ: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://YOUR-PROJECT.vercel.app` | **אחרי הדיפלוי הראשון** – החלף בכתובת האמיתית שהתקבלה |
| `STORAGE_ADAPTER` | `local` | לאחסון קבצים (זמני – ראה למטה) |
| `EMAIL_ADAPTER` | `mock` | שליחת מייל (mock = לוג בלבד) |

**חשוב:** אחרי הדיפלוי הראשון, Vercel ייתן לך כתובת כמו `alrov-careers-abc123.vercel.app`. עדכן את `NEXTAUTH_URL` ל-`https://alrov-careers-abc123.vercel.app` (בלי סלאש בסוף) ועשה **Redeploy** מהטאב Deployments.

### 4. דיפלוי

לחץ **Deploy**. Vercel יריץ `npm run build` ויעלה את האתר.

- האתר יהיה זמין בכתובת שהתקבלה (למשל `https://alrov-careers.vercel.app`).
- התחברות אדמין: `/admin/login` עם המשתמשים seed (admin@alrov.co.il וכו').

### 5. מגבלות בשלב הראשון (בלי דומיין)

- **קבצים (CV):** אחסון `local` ב-Vercel לא נשמר בין דיפלויים – קבצים שהועלו ייעלמו ב-redeploy. לשלב מתקדם: מעבר ל-S3/R2.
- **מייל:** עם `EMAIL_ADAPTER=mock` לא נשלחים מיילים אמיתיים – רק לוג. לשלב מתקדם: SendGrid / Resend וכו'.
- **דומיין:** אפשר later ב-Vercel: Settings → Domains להוסיף דומיין מותאם.

### דיפלוי מהטרמינל (CLI)

אם מותקן אצלך Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel
```

עקוב אחרי ההנחיות והגדר את אותם משתני סביבה כשנשאל.

## Production Hardening TODOs

- [ ] **Storage:** Replace local file storage with S3/R2 (Cloudflare R2, AWS S3, or MinIO)
- [ ] **Email:** Replace mock email adapter with SendGrid, Resend, or AWS SES
- [ ] **Auth:** Add SSO (Google Workspace, Azure AD) for corporate login
- [ ] **Audit Logging:** Persist audit logs to a dedicated table or external service
- [ ] **Rate Limiting:** Add rate limiting to public endpoints (application submission)
- [ ] **CSRF:** Enable CSRF protection on all forms
- [ ] **File Scanning:** Add malware scanning for uploaded CVs
- [ ] **Monitoring:** Add error tracking (Sentry) and analytics
- [ ] **Caching:** Add Redis caching for frequently accessed data
- [ ] **Search:** Implement full-text search with PostgreSQL or Elasticsearch
- [ ] **i18n:** Add multi-language support if needed
- [ ] **Testing:** Add unit tests, integration tests, and E2E tests
- [ ] **CI/CD:** Set up GitHub Actions for automated testing and deployment
- [ ] **Backup:** Configure automated database backups
- [ ] **GDPR/Privacy:** Implement automated data retention and deletion policies

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/           # Public-facing pages
│   ├── admin/              # Admin panel pages
│   ├── api/                # API routes (auth, files)
│   └── actions/            # Server actions
├── components/
│   ├── ui/                 # Design system components
│   ├── public/             # Public page components
│   └── admin/              # Admin page components
├── lib/
│   ├── auth.ts             # Auth.js configuration
│   ├── db.ts               # Prisma client
│   ├── auth/               # Role guards
│   ├── design/             # Design tokens
│   ├── email/              # Email adapter (mock)
│   ├── storage/            # Storage adapter (local)
│   ├── validations/        # Zod schemas
│   └── utils.ts            # Shared utilities
└── types/                  # TypeScript declarations
```

## License

Proprietary - Alrov Properties & Lodgings Ltd.
