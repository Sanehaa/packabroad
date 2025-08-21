# Database Population Scripts

This directory contains scripts to populate your MongoDB database with sample data.

## Populate Documents Collection

The `populate-documents.js` script will create a `documents` collection in your MongoDB database with sample document requirements for different visa types.

### How to run:

1. Make sure you have your MongoDB connection string set in your environment variables:
   ```bash
   export MONGODB_URI="your_mongodb_connection_string"
   ```

2. Run the script:
   ```bash
   node scripts/populate-documents.js
   ```

### What the script does:

- Creates a `documents` collection in your `packabroad` database
- Populates it with sample document requirements for:
  - **Tourist visas**: Basic travel documents, insurance, accommodation
  - **Student visas**: Academic documents, financial support, housing
  - **Work visas**: Employment documents, professional qualifications, work permits

### Document Structure:

The documents collection uses a nested structure with a single document containing all visa types:

```javascript
{
  documents_required: {
    travel_visa: [
      "Valid Passport",
      "Visa Application Form",
      "Passport Photos",
      // ... more documents as strings
    ],
    student_visa: [
      "Valid Passport", 
      "Student Visa Grant/Approval Letter",
      "University Admission/Offer Letter",
      // ... more documents as strings
    ],
    work_visa: [
      "Valid Passport",
      "Work Visa Grant/Approval Letter", 
      "Job Offer Letter",
      // ... more documents as strings
    ],
    permanent_residency: [
      "Valid Passport",
      "Permanent Residency Application",
      // ... more documents as strings
    ]
  }
}
```

### Visa Types Supported:

- `tourist` - For travel/tourism purposes
- `student` - For educational purposes  
- `work` - For employment purposes

### Categories:

Documents are organized into sub-categories:
- Travel Documents
- Academic Documents
- Employment Documents
- Financial Documents
- Insurance
- Accommodation

The API will automatically filter documents based on the visa type selected by the user, showing only relevant documents for their specific visa category.

## API Behavior

The API now supports category-based filtering:

- **When "Documents" category is selected**: Only fetches from the `documents` collection, filtered by visa type
- **When other categories are selected**: Fetches from both `personal` and `documents` collections, filtered by visa type

This ensures that when users click on the "Documents" section, they only see document requirements relevant to their visa type, not personal items.

## Testing the API

After populating the database, you can test the API to ensure it's working correctly:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. In another terminal, run the test script:
   ```bash
   npm run test-api
   ```

This will test the API with all three visa types and show you how many items are returned for each category.
