# MongoDB Assignment Setup Guide

## Prerequisites Verification

### System Requirements
- **Node.js**: v18.0.0
- **npm**: v8.0.0
- **MongoDB**: Community Edition or Atlas
- **MongoDB Compass**: Optional

### Verify Installation
```bash
# Check versions
node --version    # Should show v18+ 
npm --version     # Should show v8+
mongod --version  # Should show MongoDB version
```

## Quick Start

### Option 1: Automated Setup
```bash
npm run setup    # Installs dependencies and populates database
npm start        # Runs all queries
```

### Option 2: Manual Setup
```bash
npm install      # Install dependencies
npm run populate # Populate database
npm test         # Run all queries
```

## Connection Troubleshooting

### Local MongoDB Connection Issues
If you get `ECONNREFUSED` errors:

1. **Check MongoDB Service**:
   ```bash
   # Windows
   sc query MongoDB
   
   # macOS/Linux
   brew services list | grep mongodb
   ```

2. **Start MongoDB Service**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Try Alternative Connection**:
   Change URI from `localhost` to `127.0.0.1` in source files.

### MongoDB Atlas Setup (Alternative)
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Update URI in `src/config/database.js`

## Expected Results

### Database Population
```
12 books were successfully inserted into the database
```

### Query Execution
- [x] 4 Fiction books found
- [x] 2 George Orwell books found  
- [x] Advanced filtering and aggregation working
- [x] Indexes created successfully
- [x] Performance optimization confirmed