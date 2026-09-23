// ============================================
// SKILLBRIDGE - Central Data Store
// ============================================

export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  INDUSTRY: 'industry',
  INSTITUTION: 'institution'
};

export const ROLE_COLORS = {
  student: 'emerald',
  faculty: 'amber',
  industry: 'rose',
  institution: 'cyan'
};

export const ROLE_META = {
  student: { label: 'Student', icon: '🎓', color: '#10b981', accent: 'emerald' },
  faculty: { label: 'Faculty', icon: '👨‍🏫', color: '#f59e0b', accent: 'amber' },
  industry: { label: 'Industry', icon: '🏢', color: '#f43f5e', accent: 'rose' },
  institution: { label: 'Institution', icon: '🏛️', color: '#06b6d4', accent: 'cyan' },
};

export const CURRENT_USER = {
  student: {
    name: 'Arjun Sharma',
    email: 'arjun.sharma@nitk.edu.in',
    avatar: 'AS',
    dept: 'Computer Science & Engineering',
    college: 'NITK Surathkal',
    year: '3rd Year B.Tech',
    cgpa: 8.7,
    skills: {
      'Python': 78, 'Machine Learning': 62, 'React': 55, 'SQL': 70, 'Node.js': 45,
      'Data Structures': 85, 'System Design': 40, 'Cloud (AWS)': 38, 'Communication': 72, 'Leadership': 60
    },
    completedAssessments: ['Core CS Fundamentals', 'Python & Data Science'],
    appliedJobs: [1, 3, 5],
    projects: [
      { title: 'Smart Campus App', tech: ['React', 'Node.js', 'MongoDB'], verified: true, github: '#' },
      { title: 'Crop Disease Detection', tech: ['Python', 'TensorFlow', 'OpenCV'], verified: true, github: '#' },
      { title: 'Alumni Connect Portal', tech: ['Django', 'PostgreSQL', 'Redis'], verified: false, github: '#' }
    ]
  },
  faculty: {
    name: 'Dr. Priya Nair',
    email: 'priya.nair@nitk.edu.in',
    avatar: 'PN',
    dept: 'Information Technology',
    college: 'NITK Surathkal',
    designation: 'Associate Professor',
    experience: '12 years',
    specialization: ['AI/ML', 'NLP', 'Computer Vision'],
    publications: 28
  },
  industry: {
    name: 'Rahul Mehta',
    email: 'rahul.mehta@techcorp.io',
    avatar: 'RM',
    company: 'TechCorp Solutions',
    role: 'Head of Talent Acquisition',
    postedJobs: [1, 2, 4],
    shortlisted: [3, 7, 12, 18]
  },
  institution: {
    name: 'Prof. Suresh Kumar',
    email: 'placement.nitk@edu.in',
    avatar: 'SK',
    role: 'Training & Placement Officer (TPO)',
    college: 'NITK Surathkal',
    totalStudents: 2480,
    departments: 8
  }
};

export const SKILLS_TAXONOMY = [
  { id: 'python', name: 'Python', category: 'Programming', demand: 94 },
  { id: 'ml', name: 'Machine Learning', category: 'AI/ML', demand: 91 },
  { id: 'react', name: 'React.js', category: 'Frontend', demand: 88 },
  { id: 'nodejs', name: 'Node.js', category: 'Backend', demand: 82 },
  { id: 'sql', name: 'SQL & Databases', category: 'Data', demand: 87 },
  { id: 'aws', name: 'Cloud (AWS/GCP)', category: 'Cloud', demand: 89 },
  { id: 'docker', name: 'Docker & K8s', category: 'DevOps', demand: 78 },
  { id: 'system_design', name: 'System Design', category: 'Architecture', demand: 85 },
  { id: 'dsa', name: 'Data Structures', category: 'CS Fundamentals', demand: 92 },
  { id: 'communication', name: 'Communication', category: 'Soft Skills', demand: 88 },
  { id: 'leadership', name: 'Leadership', category: 'Soft Skills', demand: 75 },
  { id: 'java', name: 'Java', category: 'Programming', demand: 80 },
];

export const JOBS = [
  {
    id: 1,
    company: 'Google', logo: '🔵', color: '#4285f4',
    title: 'Software Engineering Intern',
    type: 'Internship', location: 'Bengaluru', mode: 'Hybrid',
    stipend: '₹80,000/month', duration: '6 months',
    skills: ['Python', 'Data Structures', 'System Design', 'Machine Learning'],
    minCGPA: 8.0, openings: 15,
    description: 'Join Google\'s Core ML team to build next-generation recommendation systems. Work with petabyte-scale data and cutting-edge infrastructure.',
    deadline: '2026-10-15',
    match: 82,
    posted: '2026-09-01',
    category: 'internship',
    applicants: 1240
  },
  {
    id: 2,
    company: 'Microsoft', logo: '🟦', color: '#00a4ef',
    title: 'Full Stack Developer Intern',
    type: 'Internship', location: 'Hyderabad', mode: 'Hybrid',
    stipend: '₹70,000/month', duration: '4 months',
    skills: ['React', 'Node.js', 'SQL', 'Azure'],
    minCGPA: 7.5, openings: 20,
    description: 'Work on Azure DevOps platform features used by millions of developers worldwide. Ship production code from day one.',
    deadline: '2026-10-20',
    match: 74,
    posted: '2026-09-02',
    category: 'internship',
    applicants: 890
  },
  {
    id: 3,
    company: 'Flipkart', logo: '🛍️', color: '#f7931a',
    title: 'Data Science Intern',
    type: 'Internship', location: 'Bengaluru', mode: 'On-site',
    stipend: '₹60,000/month', duration: '3 months',
    skills: ['Python', 'Machine Learning', 'SQL', 'Spark'],
    minCGPA: 7.8, openings: 10,
    description: 'Build demand forecasting models that directly impact supply chain operations for 500M+ SKUs.',
    deadline: '2026-10-10',
    match: 79,
    posted: '2026-09-03',
    category: 'internship',
    applicants: 567
  },
  {
    id: 4,
    company: 'Zomato', logo: '🍴', color: '#e23744',
    title: 'Backend Engineer (SDE-I)',
    type: 'Full-Time', location: 'Gurugram', mode: 'Hybrid',
    stipend: '₹18 LPA', duration: 'Permanent',
    skills: ['Java', 'Microservices', 'Kafka', 'Redis', 'AWS'],
    minCGPA: 7.0, openings: 8,
    description: 'Build and scale backend services serving 80M+ monthly active users. Own critical payment and logistics services.',
    deadline: '2026-10-30',
    match: 61,
    posted: '2026-09-04',
    category: 'fulltime',
    applicants: 2100
  },
  {
    id: 5,
    company: 'Razorpay', logo: '💳', color: '#3395ff',
    title: 'ML Engineer',
    type: 'Full-Time', location: 'Bengaluru', mode: 'Remote',
    stipend: '₹22 LPA', duration: 'Permanent',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Spark'],
    minCGPA: 8.0, openings: 5,
    description: 'Build fraud detection models and risk scoring systems for India\'s fastest-growing fintech platform.',
    deadline: '2026-11-01',
    match: 75,
    posted: '2026-09-05',
    category: 'fulltime',
    applicants: 380
  },
  {
    id: 6,
    company: 'ISRO', logo: '🚀', color: '#ff6b35',
    title: 'Software Research Intern',
    type: 'Research Internship', location: 'Bengaluru', mode: 'On-site',
    stipend: '₹25,000/month', duration: '6 months',
    skills: ['Python', 'Signal Processing', 'C++', 'Embedded Systems'],
    minCGPA: 8.5, openings: 4,
    description: 'Contribute to satellite telemetry processing and real-time ground station software systems.',
    deadline: '2026-09-30',
    match: 55,
    posted: '2026-09-06',
    category: 'research',
    applicants: 210
  }
];

export const FACULTY_PROGRAMS = [
  {
    id: 1, type: 'FDP', icon: '📚',
    title: 'Advanced AI & Deep Learning',
    organizer: 'Google Developer Academy', duration: '5 Days',
    mode: 'Online', date: '2026-10-15',
    seats: 50, registered: 32,
    stipend: '₹5,000',
    skills: ['TensorFlow', 'PyTorch', 'Transformers', 'LLMs'],
    color: '#4285f4',
    description: 'Intensive program on state-of-the-art deep learning architectures including LLMs and multimodal AI systems.',
  },
  {
    id: 2, type: 'Industrial Internship', icon: '🏭',
    title: 'Industry Immersion Program - Manufacturing 4.0',
    organizer: 'Tata Steel', duration: '4 Weeks',
    mode: 'On-site (Jamshedpur)', date: '2026-12-01',
    seats: 20, registered: 8,
    stipend: '₹40,000',
    skills: ['IoT', 'Industrial AI', 'SCADA', 'Data Analytics'],
    color: '#00447c',
    description: 'Hands-on exposure to smart manufacturing processes, IoT sensor integration, and AI-driven quality control systems.',
  },
  {
    id: 3, type: 'FDP', icon: '☁️',
    title: 'Cloud Architecture & DevOps',
    organizer: 'Amazon Web Services', duration: '3 Days',
    mode: 'Hybrid', date: '2026-11-20',
    seats: 80, registered: 67,
    stipend: '₹3,000 + AWS Credits',
    skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD'],
    color: '#ff9900',
    description: 'Learn AWS solutions architecture and production-grade DevOps practices.',
  },
  {
    id: 4, type: 'Consultancy', icon: '🔬',
    title: 'Industry Problem: Smart Grid Optimization',
    organizer: 'NTPC Limited', duration: '3 Months',
    mode: 'Collaborative', date: '2026-10-01',
    seats: 3, registered: 1,
    stipend: '₹1,50,000 (Project)',
    skills: ['Optimization Algorithms', 'MATLAB', 'Power Systems', 'AI'],
    color: '#1a73e8',
    description: 'Develop AI-based optimization algorithm for renewable energy load balancing in smart grid infrastructure.',
  },
  {
    id: 5, type: 'Guest Lecture', icon: '🎤',
    title: 'Future of Generative AI in Enterprise',
    organizer: 'NVIDIA India', duration: '2 Hours',
    mode: 'Virtual', date: '2026-09-25',
    seats: 200, registered: 187,
    stipend: 'Honorarium: ₹10,000',
    skills: ['Generative AI', 'CUDA', 'LLM Deployment'],
    color: '#76b900',
    description: 'Expert session on deploying LLMs in enterprise workflows, RAG architectures, and NVIDIA NIM platform.',
  },
  {
    id: 6, type: 'R&D Project', icon: '🧪',
    title: 'Collaborative Research: NLP for Indian Languages',
    organizer: 'Infosys Labs & IIT Bombay', duration: '1 Year',
    mode: 'Collaborative', date: '2026-10-15',
    seats: 5, registered: 2,
    stipend: '₹3,00,000 (Annual)',
    skills: ['NLP', 'Transformers', 'Python', 'Sanskrit/Tamil NLP'],
    color: '#0d47a1',
    description: 'Research partnership to build multilingual NLP models for 22 scheduled Indian languages.',
  }
];

export const CANDIDATES = [
  {
    id: 1, name: 'Arjun Sharma', college: 'NITK Surathkal', dept: 'CSE', year: '3rd',
    cgpa: 8.7, skills: { 'Python': 78, 'ML': 62, 'React': 55, 'SQL': 70 },
    match: 92, status: 'applied', avatar: 'AS', assessmentScore: 84
  },
  {
    id: 2, name: 'Priya Menon', college: 'IIT Madras', dept: 'CSE', year: '4th',
    cgpa: 9.1, skills: { 'Python': 90, 'ML': 88, 'TensorFlow': 80, 'SQL': 75 },
    match: 96, status: 'shortlisted', avatar: 'PM', assessmentScore: 91
  },
  {
    id: 3, name: 'Rohan Gupta', college: 'VIT Vellore', dept: 'IT', year: '4th',
    cgpa: 8.2, skills: { 'Java': 82, 'Spring Boot': 75, 'AWS': 68, 'SQL': 88 },
    match: 78, status: 'assessment', avatar: 'RG', assessmentScore: 76
  },
  {
    id: 4, name: 'Aisha Khan', college: 'BITS Pilani', dept: 'CS', year: '3rd',
    cgpa: 9.3, skills: { 'React': 88, 'Node.js': 82, 'TypeScript': 75, 'GraphQL': 70 },
    match: 88, status: 'interview', avatar: 'AK', assessmentScore: 88
  },
  {
    id: 5, name: 'Varun Reddy', college: 'NITW', dept: 'ECE', year: '4th',
    cgpa: 7.9, skills: { 'Python': 65, 'DSP': 78, 'C++': 72, 'Embedded': 80 },
    match: 65, status: 'offered', avatar: 'VR', assessmentScore: 72
  },
  {
    id: 6, name: 'Sneha Iyer', college: 'SRM Chennai', dept: 'CSE', year: '3rd',
    cgpa: 8.5, skills: { 'Python': 84, 'ML': 76, 'Flask': 70, 'Docker': 65 },
    match: 85, status: 'applied', avatar: 'SI', assessmentScore: 82
  }
];

export const INSTITUTION_STATS = {
  totalStudents: 2480,
  eligibleStudents: 1890,
  placedStudents: 1245,
  internshipStudents: 876,
  avgPackage: 12.4,
  highestPackage: 48.0,
  companies: 87,
  offersMade: 1580,
  placementRate: 85.2,
  departments: [
    { name: 'CSE', students: 480, placed: 428, avgPkg: 16.2, placementRate: 89.2, color: '#6366f1' },
    { name: 'IT', students: 360, placed: 310, avgPkg: 14.8, placementRate: 86.1, color: '#8b5cf6' },
    { name: 'ECE', students: 420, placed: 340, avgPkg: 11.5, placementRate: 81.0, color: '#06b6d4' },
    { name: 'EEE', students: 280, placed: 210, avgPkg: 9.8, placementRate: 75.0, color: '#f59e0b' },
    { name: 'MECH', students: 360, placed: 240, avgPkg: 8.2, placementRate: 66.7, color: '#f43f5e' },
    { name: 'CIVIL', students: 200, placed: 110, avgPkg: 7.1, placementRate: 55.0, color: '#10b981' },
    { name: 'CHE', students: 180, placed: 107, avgPkg: 9.4, placementRate: 59.4, color: '#ec4899' },
    { name: 'META', students: 200, placed: 100, avgPkg: 8.9, placementRate: 50.0, color: '#f97316' },
  ],
  topRecruiters: [
    { company: 'TCS', offers: 120, avgPkg: 7, logo: '🔷' },
    { company: 'Infosys', offers: 98, avgPkg: 8.5, logo: '🟣' },
    { company: 'Google', offers: 12, avgPkg: 42, logo: '🔵' },
    { company: 'Microsoft', offers: 18, avgPkg: 38, logo: '🟦' },
    { company: 'Amazon', offers: 24, avgPkg: 32, logo: '🟠' },
    { company: 'Wipro', offers: 85, avgPkg: 6.8, logo: '⚫' },
    { company: 'Razorpay', offers: 8, avgPkg: 22, logo: '💳' },
    { company: 'Flipkart', offers: 15, avgPkg: 28, logo: '🛍️' },
  ],
  skillGapData: [
    { skill: 'Cloud (AWS/GCP)', industryDemand: 89, studentAvg: 38, gap: 51 },
    { skill: 'System Design', industryDemand: 85, studentAvg: 40, gap: 45 },
    { skill: 'Docker/Kubernetes', industryDemand: 78, studentAvg: 35, gap: 43 },
    { skill: 'Machine Learning', industryDemand: 91, studentAvg: 55, gap: 36 },
    { skill: 'React.js', industryDemand: 88, studentAvg: 58, gap: 30 },
    { skill: 'Data Structures', industryDemand: 92, studentAvg: 75, gap: 17 },
    { skill: 'Python', industryDemand: 94, studentAvg: 78, gap: 16 },
    { skill: 'SQL', industryDemand: 87, studentAvg: 72, gap: 15 },
  ],
  monthlyPlacements: [
    { month: 'Aug', offers: 45 }, { month: 'Sep', offers: 120 },
    { month: 'Oct', offers: 280 }, { month: 'Nov', offers: 390 },
    { month: 'Dec', offers: 210 }, { month: 'Jan', offers: 145 },
    { month: 'Feb', offers: 85 }, { month: 'Mar', offers: 55 },
  ]
};

export const QUIZ_QUESTIONS = {
  'Core CS': [
    {
      id: 1,
      question: 'What is the time complexity of Quick Sort in the average case?',
      options: ['O(n²)', 'O(n log n)', 'O(log n)', 'O(n)'],
      correct: 1,
      explanation: 'Quick Sort has an average time complexity of O(n log n) due to the recursive partitioning into roughly equal halves on average.'
    },
    {
      id: 2,
      question: 'In a Binary Search Tree (BST), which traversal gives nodes in sorted order?',
      options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
      correct: 2,
      explanation: 'In-order traversal (Left → Root → Right) of a BST always yields elements in sorted (ascending) order.'
    },
    {
      id: 3,
      question: 'Which data structure is used in BFS (Breadth First Search)?',
      options: ['Stack', 'Queue', 'Heap', 'Hash Map'],
      correct: 1,
      explanation: 'BFS uses a Queue (FIFO) to process nodes level by level from the source.'
    },
    {
      id: 4,
      question: 'What is the space complexity of Merge Sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 2,
      explanation: 'Merge Sort requires O(n) auxiliary space for the temporary arrays used during the merge step.'
    },
    {
      id: 5,
      question: 'Which of the following is NOT a property of a process in Operating Systems?',
      options: ['Process ID (PID)', 'Program Counter', 'Stack Pointer', 'Compiler Version'],
      correct: 3,
      explanation: 'Compiler Version is not a runtime property of a process. A process has PID, PC, stack pointer, registers, and memory maps.'
    }
  ],
  'Python & ML': [
    {
      id: 6,
      question: 'What does the "fit" method of a scikit-learn model primarily do?',
      options: ['Predicts labels', 'Transforms data', 'Trains the model on data', 'Evaluates accuracy'],
      correct: 2,
      explanation: 'fit() trains the model by learning parameters from the training data. predict() is used for inference.'
    },
    {
      id: 7,
      question: 'Which activation function is commonly used in the output layer for binary classification?',
      options: ['ReLU', 'Sigmoid', 'Softmax', 'Tanh'],
      correct: 1,
      explanation: 'Sigmoid maps output to [0,1], perfect for binary classification probability. Softmax is for multi-class.'
    },
    {
      id: 8,
      question: 'What is Overfitting in ML?',
      options: [
        'Model performs poorly on training data',
        'Model performs well on training but poorly on unseen data',
        'Model is too simple to capture patterns',
        'Model has too many features'
      ],
      correct: 1,
      explanation: 'Overfitting means the model memorizes training data too well, causing high variance and poor generalization.'
    },
    {
      id: 9,
      question: 'In Python, what is a List Comprehension?',
      options: [
        'A way to create lists using loops and conditions in one line',
        'A method to sort lists',
        'A data type for ordered sets',
        'A numpy function'
      ],
      correct: 0,
      explanation: 'List comprehensions provide a concise way to create lists: [expr for item in iterable if condition]'
    },
    {
      id: 10,
      question: 'Which of these Python libraries is primarily used for data manipulation?',
      options: ['Matplotlib', 'Pandas', 'Scikit-learn', 'Flask'],
      correct: 1,
      explanation: 'Pandas provides DataFrame and Series structures for powerful tabular data manipulation and analysis.'
    }
  ],
  'Web Development': [
    {
      id: 11,
      question: 'What does REST stand for in Web APIs?',
      options: [
        'Remote Execution State Transfer',
        'Representational State Transfer',
        'Resource Endpoint Service Type',
        'Relational Entity State Transformer'
      ],
      correct: 1,
      explanation: 'REST (Representational State Transfer) is an architectural style for distributed hypermedia systems, using HTTP methods.'
    },
    {
      id: 12,
      question: 'In React, what is the purpose of "useEffect" hook?',
      options: [
        'To manage component state',
        'To perform side effects (API calls, DOM mutations, subscriptions)',
        'To create context providers',
        'To memoize computed values'
      ],
      correct: 1,
      explanation: 'useEffect runs after renders to handle side effects like fetching data, setting up subscriptions, or directly updating the DOM.'
    },
    {
      id: 13,
      question: 'Which HTTP status code means "Not Found"?',
      options: ['200', '401', '404', '500'],
      correct: 2,
      explanation: '404 Not Found means the server cannot find the requested resource. 200=OK, 401=Unauthorized, 500=Internal Server Error.'
    },
    {
      id: 14,
      question: 'What is the difference between localStorage and sessionStorage?',
      options: [
        'localStorage is encrypted, sessionStorage is not',
        'localStorage persists after browser close; sessionStorage is cleared on tab close',
        'sessionStorage can hold more data',
        'There is no difference'
      ],
      correct: 1,
      explanation: 'localStorage persists indefinitely until cleared. sessionStorage is cleared when the tab or browser session ends.'
    },
    {
      id: 15,
      question: 'What is CORS in web development?',
      options: [
        'A CSS layout system',
        'A JavaScript runtime error',
        'Cross-Origin Resource Sharing - a browser security mechanism for cross-domain requests',
        'A database query language'
      ],
      correct: 2,
      explanation: 'CORS (Cross-Origin Resource Sharing) is a browser mechanism that controls cross-domain HTTP requests for security.'
    }
  ],
  'Soft Skills & Aptitude': [
    {
      id: 1,
      question: 'A teammate keeps missing deadlines, delaying your group project. What is the best first step?',
      options: ['Report them to the professor immediately', 'Talk to them privately to understand the cause and agree a plan', 'Quietly do their share yourself', 'Raise it angrily in the next group meeting'],
      correct: 1,
      explanation: 'A private, solution-focused conversation resolves most issues and preserves trust; escalate only if that fails.'
    },
    {
      id: 2,
      question: 'You must explain a technical delay to a non-technical manager. Which approach works best?',
      options: ['Share the full error logs', 'Lead with the impact and new timeline, then give a one-line cause', 'Avoid mentioning it until it is fixed', 'Explain every technical detail so they trust you'],
      correct: 1,
      explanation: 'Audience-aware communication leads with what the listener needs: impact, timeline, and what you need from them.'
    },
    {
      id: 3,
      question: 'You are leading a team of four with conflicting ideas for the project design. What should you do?',
      options: ['Pick your own idea to save time', 'Let the loudest member decide', 'Set evaluation criteria together, compare options against them, then decide', 'Combine all ideas into one design'],
      correct: 2,
      explanation: 'Agreeing on criteria first turns opinion clashes into an objective comparison the whole team can accept.'
    },
    {
      id: 4,
      question: 'A train 120 m long passes a pole in 6 seconds. What is its speed?',
      options: ['20 km/h', '60 km/h', '72 km/h', '80 km/h'],
      correct: 2,
      explanation: 'Speed = 120 m / 6 s = 20 m/s = 20 × 18/5 = 72 km/h.'
    },
    {
      id: 5,
      question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
      options: ['40', '42', '44', '36'],
      correct: 1,
      explanation: 'Differences are 4, 6, 8, 10, so the next difference is 12: 30 + 12 = 42 (the series is n × (n+1)).'
    }
  ]
};

// Which skill each question measures, by category and question position.
// Used to turn a quiz result into per-skill evidence on the student's profile.
export const QUIZ_SKILLS = {
  'Core CS': ['Data Structures', 'Data Structures', 'Data Structures', 'Data Structures', 'System Design'],
  'Python & ML': ['Machine Learning', 'Machine Learning', 'Machine Learning', 'Python', 'Data Analysis'],
  'Web Development': ['REST APIs', 'React', 'REST APIs', 'JavaScript', 'REST APIs'],
  'Soft Skills & Aptitude': ['Teamwork', 'Communication', 'Leadership', 'Problem Solving', 'Problem Solving'],
};

export const LEARNING_PATHS = [
  {
    skill: 'Machine Learning', gap: 29, priority: 'critical',
    path: [
      { step: 'Mathematics Refresher', duration: '2 weeks', resource: 'Khan Academy', type: 'free' },
      { step: 'Python for ML (NumPy, Pandas)', duration: '3 weeks', resource: 'Coursera', type: 'free' },
      { step: 'Scikit-learn & Classical ML', duration: '4 weeks', resource: 'Fast.ai', type: 'free' },
      { step: 'Deep Learning with TensorFlow', duration: '6 weeks', resource: 'DeepLearning.AI', type: 'paid' },
      { step: 'Kaggle ML Project', duration: '2 weeks', resource: 'Kaggle', type: 'free' },
    ]
  },
  {
    skill: 'System Design', gap: 45, priority: 'critical',
    path: [
      { step: 'OS & Networking Fundamentals', duration: '2 weeks', resource: 'MIT OCW', type: 'free' },
      { step: 'Database Design & Scaling', duration: '3 weeks', resource: 'Neetcode.io', type: 'free' },
      { step: 'Distributed Systems Concepts', duration: '4 weeks', resource: 'ByteByteGo', type: 'paid' },
      { step: 'Design case studies', duration: '3 weeks', resource: 'GitHub', type: 'free' },
    ]
  },
  {
    skill: 'Cloud (AWS)', gap: 52, priority: 'critical',
    path: [
      { step: 'Cloud Fundamentals', duration: '1 week', resource: 'AWS Free Tier', type: 'free' },
      { step: 'AWS Core Services (EC2, S3, RDS)', duration: '3 weeks', resource: 'AWS Skill Builder', type: 'free' },
      { step: 'AWS Solutions Architecture', duration: '6 weeks', resource: 'Adrian Cantrill', type: 'paid' },
      { step: 'Practice Exams', duration: '2 weeks', resource: 'Tutorials Dojo', type: 'paid' },
    ]
  }
];
