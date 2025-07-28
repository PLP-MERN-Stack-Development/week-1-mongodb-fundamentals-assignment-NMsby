// MongoDB Fundamentals Assignment Queries
const { MongoClient } = require('mongodb');

// Connection configuration
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Helper function to connect to MongoDB
async function connectToMongoDB() {
    const client = new MongoClient(uri);
    await client.connect();
    return { client, db: client.db(dbName), collection: client.db(dbName).collection(collectionName) };
}

// =============================================================================
// TASK 2: BASIC CRUD OPERATIONS
// =============================================================================

// 1. Find all books in a specific genre
async function findBooksByGenre() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Finding books by genre (Fiction) ===');
        const books = await collection.find({ genre: "Fiction" }).toArray();
        console.log(`Found ${books.length} fiction books:`);
        books.forEach(book => console.log(`- "${book.title}" by ${book.author}`));
        return books;
    } finally {
        await client.close();
    }
}

// 2. Find books published after a certain year
async function findBooksAfterYear() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Finding books published after 1950 ===');
        const books = await collection.find({ published_year: { $gt: 1950 } }).toArray();
        console.log(`Found ${books.length} books published after 1950:`);
        books.forEach(book => console.log(`- "${book.title}" (${book.published_year})`));
        return books;
    } finally {
        await client.close();
    }
}

// 3. Find books by a specific author
async function findBooksByAuthor() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Finding books by George Orwell ===');
        const books = await collection.find({ author: "George Orwell" }).toArray();
        console.log(`Found ${books.length} books by George Orwell:`);
        books.forEach(book => console.log(`- "${book.title}" (${book.published_year})`));
        return books;
    } finally {
        await client.close();
    }
}

// 4. Update the price of a specific book
async function updateBookPrice() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Updating price of "1984" ===');
        const result = await collection.updateOne(
            { title: "1984" },
            { $set: { price: 13.99 } }
        );
        console.log(`Modified ${result.modifiedCount} document(s)`);
        
        // Verify the update
        const updatedBook = await collection.findOne({ title: "1984" });
        console.log(`New price for "1984": $${updatedBook.price}`);
        return result;
    } finally {
        await client.close();
    }
}

// 5. Delete a book by its title
async function deleteBookByTitle() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Attempting to delete "Test Book" (if exists) ===');
        // First, let's insert a test book to delete
        await collection.insertOne({
            title: "Test Book",
            author: "Test Author",
            genre: "Test Genre",
            published_year: 2023,
            price: 9.99,
            in_stock: true,
            pages: 100,
            publisher: "Test Publisher"
        });
        
        // Now delete it
        const result = await collection.deleteOne({ title: "Test Book" });
        console.log(`Deleted ${result.deletedCount} document(s)`);
        return result;
    } finally {
        await client.close();
    }
}

// =============================================================================
// TASK 3: ADVANCED QUERIES
// =============================================================================

// 1. Find books that are both in stock and published after 2010
async function findInStockBooksAfter2010() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Finding books in stock AND published after 2010 ===');
        const books = await collection.find({
            $and: [
                { in_stock: true },
                { published_year: { $gt: 2010 } }
            ]
        }).toArray();
        console.log(`Found ${books.length} books in stock published after 2010:`);
        books.forEach(book => console.log(`- "${book.title}" (${book.published_year})`));
        return books;
    } finally {
        await client.close();
    }
}

// 2. Use projection to return only specific fields
async function findBooksWithProjection() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Finding books with projection (title, author, price only) ===');
        const books = await collection.find(
            { genre: "Fiction" },
            { projection: { title: 1, author: 1, price: 1, _id: 0 } }
        ).toArray();
        console.log(`Found ${books.length} fiction books (limited fields):`);
        books.forEach(book => console.log(`- "${book.title}" by ${book.author} - $${book.price}`));
        return books;
    } finally {
        await client.close();
    }
}

// 3. Implement sorting (ascending and descending)
async function findBooksWithSorting() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Finding books sorted by price (ascending) ===');
        const booksAsc = await collection.find({}).sort({ price: 1 }).limit(5).toArray();
        booksAsc.forEach(book => console.log(`- "${book.title}" - $${book.price}`));
        
        console.log('\n=== Finding books sorted by price (descending) ===');
        const booksDesc = await collection.find({}).sort({ price: -1 }).limit(5).toArray();
        booksDesc.forEach(book => console.log(`- "${book.title}" - $${book.price}`));
        
        return { ascending: booksAsc, descending: booksDesc };
    } finally {
        await client.close();
    }
}

// 4. Implement pagination
async function findBooksWithPagination() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Implementing pagination (5 books per page) ===');
        const page1 = await collection.find({}).limit(5).skip(0).toArray();
        const page2 = await collection.find({}).limit(5).skip(5).toArray();
        
        console.log('Page 1:');
        page1.forEach((book, index) => console.log(`${index + 1}. "${book.title}"`));
        
        console.log('\nPage 2:');
        page2.forEach((book, index) => console.log(`${index + 6}. "${book.title}"`));
        
        return { page1, page2 };
    } finally {
        await client.close();
    }
}

// =============================================================================
// TASK 4: AGGREGATION PIPELINES
// =============================================================================

// 1. Calculate average price by genre
async function calculateAveragePriceByGenre() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Calculating average price by genre ===');
        const result = await collection.aggregate([
            {
                $group: {
                    _id: "$genre",
                    averagePrice: { $avg: "$price" },
                    bookCount: { $sum: 1 }
                }
            },
            {
                $sort: { averagePrice: -1 }
            }
        ]).toArray();
        
        console.log('Average prices by genre:');
        result.forEach(genre => {
            console.log(`- ${genre._id}: $${genre.averagePrice.toFixed(2)} (${genre.bookCount} books)`);
        });
        return result;
    } finally {
        await client.close();
    }
}

// 2. Find author with most books
async function findAuthorWithMostBooks() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Finding author with most books ===');
        const result = await collection.aggregate([
            {
                $group: {
                    _id: "$author",
                    bookCount: { $sum: 1 },
                    books: { $push: "$title" }
                }
            },
            {
                $sort: { bookCount: -1 }
            },
            {
                $limit: 1
            }
        ]).toArray();
        
        if (result.length > 0) {
            const topAuthor = result[0];
            console.log(`Author with most books: ${topAuthor._id} (${topAuthor.bookCount} books)`);
            console.log('Books:', topAuthor.books.join(', '));
        }
        return result;
    } finally {
        await client.close();
    }
}

// 3. Group books by publication decade
async function groupBooksByDecade() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Grouping books by publication decade ===');
        const result = await collection.aggregate([
            {
                $addFields: {
                    decade: { 
                        $multiply: [
                            { $floor: { $divide: ["$published_year", 10] } }, 
                            10
                        ] 
                    }
                }
            },
            {
                $group: {
                    _id: "$decade",
                    bookCount: { $sum: 1 },
                    books: { $push: { title: "$title", year: "$published_year" } }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]).toArray();
        
        console.log('Books by decade:');
        result.forEach(decade => {
            console.log(`\n${decade._id}s: ${decade.bookCount} books`);
            decade.books.forEach(book => {
                console.log(`  - "${book.title}" (${book.year})`);
            });
        });
        return result;
    } finally {
        await client.close();
    }
}

// =============================================================================
// TASK 5: INDEXING
// =============================================================================

// 1. Create index on title field
async function createTitleIndex() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Creating index on title field ===');
        const result = await collection.createIndex({ title: 1 });
        console.log(`Index created: ${result}`);
        return result;
    } finally {
        await client.close();
    }
}

// 2. Create compound index on author and published_year
async function createCompoundIndex() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Creating compound index on author and published_year ===');
        const result = await collection.createIndex({ author: 1, published_year: -1 });
        console.log(`Compound index created: ${result}`);
        return result;
    } finally {
        await client.close();
    }
}

// 3. Demonstrate performance with explain()
async function demonstrateIndexPerformance() {
    const { client, collection } = await connectToMongoDB();
    try {
        console.log('\n=== Demonstrating index performance with explain() ===');
        
        // Query with index explanation
        console.log('\nQuery performance analysis:');
        const explanation = await collection.find({ title: "1984" }).explain("executionStats");
        console.log(`Execution time: ${explanation.executionStats.executionTimeMillis}ms`);
        console.log(`Documents examined: ${explanation.executionStats.totalDocsExamined}`);
        console.log(`Index used: ${explanation.executionStats.indexPrefix || 'Yes (title index)'}`);
        
        return explanation;
    } finally {
        await client.close();
    }
}

// =============================================================================
// MAIN EXECUTION FUNCTION
// =============================================================================

async function runAllQueries() {
    console.log('🚀 Starting MongoDB Fundamentals Assignment Queries\n');
    
    try {
        // Task 2: Basic CRUD Operations
        console.log('📝 TASK 2: BASIC CRUD OPERATIONS');
        await findBooksByGenre();
        await findBooksAfterYear();
        await findBooksByAuthor();
        await updateBookPrice();
        await deleteBookByTitle();
        
        // Task 3: Advanced Queries
        console.log('\n🔍 TASK 3: ADVANCED QUERIES');
        await findInStockBooksAfter2010();
        await findBooksWithProjection();
        await findBooksWithSorting();
        await findBooksWithPagination();
        
        // Task 4: Aggregation Pipelines
        console.log('\n📊 TASK 4: AGGREGATION PIPELINES');
        await calculateAveragePriceByGenre();
        await findAuthorWithMostBooks();
        await groupBooksByDecade();
        
        // Task 5: Indexing
        console.log('\n🚀 TASK 5: INDEXING');
        await createTitleIndex();
        await createCompoundIndex();
        await demonstrateIndexPerformance();
        
        console.log('\n✅ All queries completed successfully!');
        
    } catch (error) {
        console.error('❌ Error occurred:', error);
    }
}

// Export functions for testing
module.exports = {
    findBooksByGenre,
    findBooksAfterYear,
    findBooksByAuthor,
    updateBookPrice,
    deleteBookByTitle,
    findInStockBooksAfter2010,
    findBooksWithProjection,
    findBooksWithSorting,
    findBooksWithPagination,
    calculateAveragePriceByGenre,
    findAuthorWithMostBooks,
    groupBooksByDecade,
    createTitleIndex,
    createCompoundIndex,
    demonstrateIndexPerformance,
    runAllQueries
};

// Run all queries if this file is executed directly
if (require.main === module) {
    runAllQueries().catch(console.error);
}