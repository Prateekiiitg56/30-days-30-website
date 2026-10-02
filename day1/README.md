# 👗 ORVAN — Fashion That Moves With You

> **Day 1** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

A premium, editorial fashion e-commerce website built with **Next.js 15**, featuring a unique **Virtual Closet** — an AI-powered try-on experience that lets you see your cart on *you* before you buy.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## ✨ Features

- 🎥 **Cinematic Hero** — Full-screen video hero with parallax scrolling
- 🛍️ **Product Catalogue** — Men, Women, Kids & Beauty categories
- 🧥 **Virtual Closet** — Upload your photo and try on items from your cart using AI (Leffa model via HuggingFace)
- 🛒 **Cart & Checkout** — Full shopping flow with mini-cart drawer
- ❤️ **Wishlist** — Save items for later
- 🎨 **Editorial Design** — Oxblood + blush color palette, Jost typography, smooth animations (anime.js)
- 📱 **Fully Responsive** — Mobile-first design

## 🗂️ Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, new arrivals, trust bar |
| `/shop/:category` | Category listing (men, women, kids, beauty) |
| `/product/:id` | Product detail with image gallery |
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/checkout/confirmation` | Order confirmation |
| `/wishlist` | Saved items |
| `/closet` | Virtual Closet — AI try-on studio |
| `/help` | Help & FAQ |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Animations**: anime.js
- **AI Try-On**: Gradio Client → HuggingFace Leffa model
- **Font**: Jost (Google Fonts)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Prateekiiitg56/30-days-30-website.git
cd 30-days-30-website/day1

# Install dependencies
npm install

# Create .env.local (for Virtual Closet AI feature)
echo "HF_TOKEN=your_huggingface_token" > .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy on Vercel

This project is configured for one-click Vercel deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Prateekiiitg56/30-days-30-website&root-directory=day1)

> **Note**: Add your `HF_TOKEN` in Vercel → Project Settings → Environment Variables for the Virtual Closet feature to work.

## 📁 Project Structure

```
day1/
├── public/
│   └── images/          # Product & editorial images (webp)
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── (shop)/      # Main shop routes
│   │   ├── closet/      # Virtual Closet AI try-on
│   │   └── api/tryon/   # API route for AI try-on
│   ├── components/      # React components
│   │   ├── home/        # Hero, Marquee
│   │   ├── closet/      # Studio, PhotoStep, LookPreview
│   │   └── cart/        # CartParts
│   └── lib/             # Utilities, catalogue data, store
├── package.json
└── README.md
```

---

Made with ❤️ by [Prateek](https://github.com/Prateekiiitg56)
