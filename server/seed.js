const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Job = require('./models/Job');

// Load environment variables (path needs to be correct relative to where we run this)
dotenv.config({ path: './.env' });

connectDB();

const jobs = [
    {
        title: "Senior Product Designer",
        company: "Linear",
        location: "Remote",
        type: "Full-time",
        tags: ["Design", "UI/UX", "Figma"],
        field: "Design",
        postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        about: "We are looking for a Senior Product Designer to join our team..."
    },
    {
        title: "Frontend Engineer",
        company: "Vercel",
        location: "San Francisco / Remote",
        type: "Full-time",
        tags: ["React", "Next.js", "TypeScript"],
        field: "Engineering",
        postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        about: "Join our frontend team to build the next generation of web tools..."
    },
    {
        title: "Staff Software Engineer",
        company: "Stripe",
        location: "Dublin",
        type: "Full-time",
        tags: ["Backend", "Java", "Infrastructure"],
        field: "Engineering",
        postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        about: "Help us build the financial infrastructure of the internet..."
    },
    {
        title: "Marketing Designer",
        company: "Notion",
        location: "New York",
        type: "Contract",
        tags: ["Marketing", "Visual Design", "Brand"],
        field: "Design",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        about: "We need a creative designer to help with our marketing campaigns..."
    },
    {
        title: "Developer Advocate",
        company: "Supabase",
        location: "Remote",
        type: "Full-time",
        tags: ["DevRel", "PostgreSQL", "Content"],
        field: "Engineering",
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        about: "Engage with the developer community and create educational content..."
    },
    {
        title: "Senior Accountant",
        company: "Deloitte",
        location: "Chicago",
        type: "Full-time",
        tags: ["CPA", "Audit", "Finance"],
        field: "Finance",
        postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        about: "Manage financial audits and ensure compliance with regulations..."
    },
    {
        title: "Registered Nurse",
        company: "Kaiser Permanente",
        location: "Oakland",
        type: "Full-time",
        tags: ["Nursing", "Patient Care", "ICU"],
        field: "Healthcare",
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        about: "Provide high-quality care to patients in the intensive care unit..."
    },
    {
        title: "High School Math Teacher",
        company: "Public Schools",
        location: "Boston",
        type: "Contract",
        tags: ["Education", "Math", "Teaching"],
        field: "Education",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        about: "Teach mathematics to high school students and develop curriculum..."
    },
    {
        title: "Legal Counsel",
        company: "Google",
        location: "Mountain View",
        type: "Full-time",
        tags: ["Corporate Law", "Tech", "Legal"],
        field: "Legal",
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        about: "Advise on legal matters related to corporate operations and technology..."
    },
    {
        title: "Operations Manager",
        company: "Amazon",
        location: "Seattle",
        type: "Full-time",
        tags: ["Operations", "Logistics", "Management"],
        field: "Operations",
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        about: "Oversee daily operations and improve efficiency in logistics..."
    },
    {
        title: "Sales Representative",
        company: "Salesforce",
        location: "San Francisco",
        type: "Full-time",
        tags: ["Sales", "B2B", "CRM"],
        field: "Sales",
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        about: "Drive sales revenue and build relationships with B2B clients..."
    },
    {
        title: "Physical Therapist",
        company: "Athletico",
        location: "Austin",
        type: "Part-time",
        tags: ["Healthcare", "Therapy", "Rehab"],
        field: "Healthcare",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        about: "Assist patients in recovering from injuries through physical therapy..."
    },
    {
        title: "Financial Analyst",
        company: "Goldman Sachs",
        location: "New York",
        type: "Full-time",
        tags: ["Finance", "Analysis", "Investment"],
        field: "Finance",
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        about: "Analyze financial data and provide investment recommendations..."
    },
    {
        title: "UX Researcher",
        company: "Airbnb",
        location: "Remote",
        type: "Contract",
        tags: ["Design", "User Research", "Usability"],
        field: "Design",
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        about: "Conduct user research to inform product design decisions..."
    },
    {
        title: "English Teacher",
        company: "International School",
        location: "Tokyo",
        type: "Full-time",
        tags: ["Education", "ESL", "Teaching"],
        field: "Education",
        postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        about: "Teach English as a second language to international students..."
    },
    {
        title: "Corporate Attorney",
        company: "Law Firm LLP",
        location: "Chicago",
        type: "Full-time",
        tags: ["Legal", "Litigation", "Corporate"],
        field: "Legal",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        about: "Represent corporate clients in litigation and legal proceedings..."
    },
    {
        title: "Supply Chain Analyst",
        company: "Nike",
        location: "Portland",
        type: "Full-time",
        tags: ["Operations", "Supply Chain", "Logistics"],
        field: "Operations",
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        about: "Analyze and optimize supply chain processes for efficiency..."
    },
    {
        title: "Account Executive",
        company: "HubSpot",
        location: "Boston",
        type: "Full-time",
        tags: ["Sales", "SaaS", "Closing"],
        field: "Sales",
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        about: "Close deals and manage relationships with enterprise clients..."
    },
    {
        title: "Dentist",
        company: "Smile Care",
        location: "Los Angeles",
        type: "Full-time",
        tags: ["Healthcare", "Dental", "Medicine"],
        field: "Healthcare",
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        about: "Diagnose and treat dental issues for patients of all ages..."
    },
    {
        title: "University Professor",
        company: "Stanford University",
        location: "Palo Alto",
        type: "Full-time",
        tags: ["Education", "Research", "Academia"],
        field: "Education",
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        about: "Conduct research and teach advanced courses in your field..."
    }
];

const importData = async () => {
    try {
        await Job.deleteMany(); // Clear existing data
        await Job.insertMany(jobs);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
