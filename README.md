# 🌾 Millets Value Chain Platform

A comprehensive B2B and B2C marketplace platform for millets with multilingual support, designed with a farmer-friendly interface.

## 🚀 Quick Start for GitHub Codespaces

### Step 1: Choose Template
Select **"Node.js"** template when creating a new Codespace

### Step 2: Setup
```bash
# Install all dependencies
npm run install-all

# Configure environment variables
# Copy .env.example files and update values
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Step 3: Start MongoDB
Use MongoDB Atlas (recommended) or local MongoDB

### Step 4: Run Application
```bash
# Option 1: Run both frontend and backend
npm run dev

# Option 2: Run separately
# Terminal 1
npm run server

# Terminal 2
npm run client
```

### Step 5: Seed Sample Data (Optional)
```bash
npm run seed
```

## 📦 Features

- ✅ Multi-role authentication (Farmer, Processor, Customer, Admin)
- ✅ Product management with admin verification
- ✅ B2B and B2C marketplace
- ✅ Shopping cart and wishlist
- ✅ QR code payments
- ✅ Order tracking
- ✅ Multilingual support (English, Hindi)
- ✅ Educational content (Benefits, Recipes, Quiz)
- ✅ Real-time notifications
- ✅ Mobile-responsive design

## 🛠️ Tech Stack

**Frontend:** React 18, React Router, Context API, Axios
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Authentication:** JWT
**File Upload:** Multer
**Real-time:** Socket.io

## 📝 Default Test Accounts

After seeding:
- **Admin:** admin@millets.com / admin123
- **Farmer:** farmer@example.com / farmer123
- **Processor:** processor@example.com / processor123
- **Customer:** customer@example.com / customer123

## 📂 Project Structure
```
millets-platform/
├── frontend/          # React application
├── backend/           # Express API
├── database/          # Seed data
└── docs/              # Documentation
```

## 🌐 API Endpoints

- Auth: `/api/auth/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`
- Users: `/api/users/*`
- Admin: `/api/admin/*`

## 📱 Mobile Support

Fully responsive design optimized for:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)

## 🔒 Security

- Password hashing with bcrypt
- JWT authentication
- Rate limiting
- Input validation
- XSS protection
- CORS enabled

## 🚢 Deployment

**Frontend:** Vercel, Netlify
**Backend:** Heroku, Railway, DigitalOcean
**Database:** MongoDB Atlas

## 📄 License

MIT License

## 🙏 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for the Millets Revolution** 🌾