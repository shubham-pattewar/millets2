# 🛠️ Complete Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

## Setup Steps

### 1. Create Project Structure
```bash
mkdir millets-platform
cd millets-platform
```

### 2. Initialize Root
```bash
npm init -y
npm install --save-dev concurrently
```

### 3. Setup Backend
```bash
mkdir backend
cd backend
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken dotenv cors multer nodemailer express-validator express-rate-limit helmet morgan qrcode socket.io uuid compression

# Install dev dependencies
npm install --save-dev nodemon

# Create folder structure
mkdir -p src/controllers src/models src/routes src/middleware src/utils src/config uploads/products uploads/certifications uploads/reviews database/seeds
```

### 4. Setup Frontend
```bash
cd ../
npx create-react-app frontend

cd frontend
npm install react-router-dom axios i18next react-i18next react-toastify react-icons socket.io-client qrcode.react react-intersection-observer
```

### 5. Create All Files
Copy all 71 files provided in this conversation to their respective locations.

### 6. Configure Environment Variables

**backend/.env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/millets-platform
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**frontend/.env:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 7. Start Application

**Terminal 1 - MongoDB (if local):**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### 8. Seed Data (Optional)
```bash
cd backend
npm run seed
```

## Verification

✅ Backend: http://localhost:5000/api/health
✅ Frontend: http://localhost:3000

## Troubleshooting

**Port in use:**
```bash
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

**MongoDB connection failed:**
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Use MongoDB Atlas as alternative

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Success!
You should now have a fully functional Millets Platform running! 🎉