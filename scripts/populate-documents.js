const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection string
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/packabroad";

const documentsData = [
  {
    documents_required: {
      travel_visa: [
        "Valid Passport",
        "Visa Application Form", 
        "Passport Photos",
        "Travel Insurance",
        "Flight Itinerary",
        "Hotel Reservations",
        "Bank Statements",
        "Employment Letter"
      ],
      student_visa: [
        "Valid Passport",
        "Student Visa Grant/Approval Letter",
        "University Admission/Offer Letter", 
        "CAS/Enrollment Confirmation",
        "Proof of Tuition Fee Payment",
        "Financial Evidence (Bank Statements, Scholarship Letters)",
        "Accommodation Proof (Dorm/Lease Agreement)",
        "Academic Certificates & Transcripts",
        "English Proficiency Test Results (IELTS/TOEFL etc.)",
        "Medical Insurance",
        "Passport-size Photographs"
      ],
      work_visa: [
        "Valid Passport",
        "Work Visa Grant/Approval Letter",
        "Job Offer Letter",
        "Employment Contract",
        "Professional Qualifications/Certificates",
        "Financial Evidence (Bank Statements)",
        "Accommodation Proof",
        "Medical Insurance",
        "Passport-size Photographs",
        "Company Registration Documents"
      ],
      permanent_residency: [
        "Valid Passport",
        "Permanent Residency Application",
        "Proof of Residence",
        "Employment History",
        "Financial Statements",
        "Medical Examination Results",
        "Police Clearance Certificate",
        "Language Proficiency Test Results",
        "Integration Course Certificate",
        "Family Documents (if applicable)",
        "Health Insurance",
        "Passport-size Photographs"
      ]
    }
  }
];

async function populateDocuments() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('packabroad');
    const collection = db.collection('documents');
    
    // Clear existing documents
    await collection.deleteMany({});
    console.log('Cleared existing documents');
    
    // Insert new documents
    const result = await collection.insertMany(documentsData);
    console.log(`Successfully inserted ${result.insertedCount} documents`);
    
    // Verify the data
    const count = await collection.countDocuments();
    console.log(`Total documents in collection: ${count}`);
    
    // Show sample documents for each visa type
    const allDocs = await collection.find({}).toArray();
    if (allDocs.length > 0) {
      const doc = allDocs[0];
      const travelCount = doc.documents_required?.travel_visa?.length || 0;
      const studentCount = doc.documents_required?.student_visa?.length || 0;
      const workCount = doc.documents_required?.work_visa?.length || 0;
      const permanentCount = doc.documents_required?.permanent_residency?.length || 0;
      
      console.log(`\nTravel visa documents: ${travelCount}`);
      console.log(`Student visa documents: ${studentCount}`);
      console.log(`Work visa documents: ${workCount}`);
      console.log(`Permanent residency documents: ${permanentCount}`);
    }
    
  } catch (error) {
    console.error('Error populating documents:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
populateDocuments().catch(console.error);
