// Database configuration
const config = {
    // Local MongoDB connection
    local: {
        uri: 'mongodb://127.0.0.1:27017',
        dbName: 'plp_bookstore',
        options: {
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }
    },
    
    // MongoDB Atlas configuration (for cloud deployment)
    atlas: {
        uri: process.env.MONGODB_ATLAS_URI || '',
        dbName: 'plp_bookstore',
        options: {
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        }
    }
};

// Export the configuration to use
module.exports = process.env.NODE_ENV === 'production' ? config.atlas : config.local;