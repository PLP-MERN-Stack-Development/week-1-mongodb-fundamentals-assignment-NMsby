[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19992435&assignment_repo_type=AssignmentRepo)

# MongoDB Fundamentals Assignment

This assignment demonstrates MongoDB fundamentals including database setup, CRUD operations, advanced queries, aggregation pipelines, and indexing.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB installed locally
- MongoDB Compass (optional)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd week-1-mongodb-fundamentals-assignment-NMsby
   ```

2. **Install dependencies**:
   ```bash
   npm install mongodb
   ```

3. **Start MongoDB service and connect via Compass at**: `mongodb://127.0.0.1:27017`

4. **Populate the database**:
   ```bash
   node src/insert_books.js
   ```

5. **Run all queries**:
   ```bash
   node src/queries.js
   ```

## Files

- `src/insert_books.js` - Populates MongoDB with 12 sample books
- `src/queries.js` - Contains all required MongoDB operations and queries
- `docs/Week1-Assignment.md` - Assignment instructions

## Database Structure

- **Database**: `plp_bookstore`
- **Collection**: `books`
- **Documents**: 12 books with fields: title, author, genre, published_year, price, in_stock, pages, publisher

## Assignment Completion

[x] **Task 1**: MongoDB Setup  
[x] **Task 2**: Basic CRUD operations  
[x] **Task 3**: Advanced queries with filtering, projection, sorting  
[x] **Task 4**: Aggregation pipelines for data analysis  
[x] **Task 5**: Indexing and performance optimization  

## Environment

- **OS**: Windows 10
- **Node.js**: v22.12.0
- **npm**: v11.0.0
- **MongoDB**: Local installation with Compass GUI