# 🎓 Sharif AI Soft - AI Education Platform

A modern, fast, and beautiful React application for AI courses and education, powered by Sanity CMS.

---

## 🚀 Features

- ✅ **Sanity CMS Integration** - Dynamic course content management
- ✅ **Modern UI** - Built with Shadcn UI components
- ✅ **Fast Performance** - Powered by Vite
- ✅ **Responsive Design** - Works on all devices
- ✅ **Optimized Build** - Code splitting & asset optimization
- ✅ **Type-Safe** - Written in TypeScript
- ✅ **Production Ready** - Configured for Vercel deployment

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Sanity project (from sharifgpt-website)

### Installation

```bash
# Clone or navigate to the project
cd sharif-ai-soft-main

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and add your Sanity Project ID
# VITE_SANITY_PROJECT_ID=your-project-id-here

# Start development server
npm run dev
```

Visit http://localhost:8080

---

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide for Vercel
- **[INTEGRATION-SUMMARY.md](./INTEGRATION-SUMMARY.md)** - Technical implementation details

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
npm run clean        # Clean dist folder
```

---

## 🏗️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Language:** TypeScript
- **UI Components:** Shadcn UI + Radix UI
- **Styling:** Tailwind CSS
- **CMS:** Sanity
- **Routing:** React Router 6
- **Forms:** React Hook Form + Zod
- **State:** React Query

---

## 📁 Project Structure

```
sharif-ai-soft-main/
├── src/
│   ├── lib/                 # Utilities & Sanity config
│   │   ├── sanity.*.ts     # Sanity integration
│   │   └── utils.ts        # Helper functions
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── CourseCard.tsx # Course card component
│   │   ├── Header.tsx     # Site header
│   │   └── Footer.tsx     # Site footer
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Homepage (with Sanity)
│   │   ├── Courses.tsx    # Courses listing
│   │   └── ...            # Other pages
│   ├── assets/            # Images & static files
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Public static files
├── .env.example           # Environment template
├── vercel.json            # Vercel configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-06-21
```

### Sanity CMS

This project fetches course data from Sanity CMS. Make sure:
1. Your Sanity project has a "Home" singleton
2. The Home document has "Bestselling Courses" field
3. Courses are published in Sanity Studio

---

## 🚀 Deployment

### Deploy to Vercel

1. **Via GitHub:**
   - Push to GitHub
   - Import in Vercel
   - Add environment variables
   - Deploy

2. **Via CLI:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 📊 Build Output

Production build generates:
- Optimized bundle (~148 KB gzipped)
- Code-split chunks (vendor, UI, Sanity)
- Compressed assets
- Source maps (dev only)

---

## 🤝 Contributing

This is a project for Sharif AI Soft education platform. For internal development only.

---

## 📝 License

Private project. All rights reserved.

---

## 🆘 Support

- Check browser console for detailed logs
- See documentation files for troubleshooting
- Verify Sanity configuration and data

---

## 🎉 Status

✅ **Production Ready**  
✅ **Sanity Integrated**  
✅ **Build Tested**  
✅ **Documentation Complete**

---

**Built with ❤️ for AI Education**
