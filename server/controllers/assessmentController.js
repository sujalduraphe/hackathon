import { supabaseAdmin } from '../config/supabase.js';

// Static quiz bank (mirrors frontend store.js)
const QUIZ_QUESTIONS = {
  'Core CS': [
    { id: 1, question: 'What is the time complexity of Quick Sort in the average case?', options: ['O(n²)', 'O(n log n)', 'O(log n)', 'O(n)'], correct: 1, explanation: 'Quick Sort has O(n log n) average-case complexity due to recursive partitioning into roughly equal halves.' },
    { id: 2, question: 'In a Binary Search Tree (BST), which traversal gives nodes in sorted order?', options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'], correct: 2, explanation: 'In-order traversal (Left → Root → Right) of a BST yields elements in ascending sorted order.' },
    { id: 3, question: 'Which data structure is used in BFS (Breadth First Search)?', options: ['Stack', 'Queue', 'Heap', 'Hash Map'], correct: 1, explanation: 'BFS uses a Queue (FIFO) to process nodes level by level from the source.' },
    { id: 4, question: 'What is the space complexity of Merge Sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct: 2, explanation: 'Merge Sort requires O(n) auxiliary space for temporary arrays used in the merge step.' },
    { id: 5, question: 'Which of the following is NOT a property of a process in OS?', options: ['Process ID (PID)', 'Program Counter', 'Stack Pointer', 'Compiler Version'], correct: 3, explanation: 'Compiler Version is not a runtime property. A process has PID, PC, stack pointer, registers, and memory maps.' },
  ],
  'Python & ML': [
    { id: 6, question: 'What does the "fit" method of a scikit-learn model primarily do?', options: ['Predicts labels', 'Transforms data', 'Trains the model on data', 'Evaluates accuracy'], correct: 2, explanation: 'fit() trains the model by learning parameters from training data. predict() is used for inference.' },
    { id: 7, question: 'Which activation function is commonly used in the output layer for binary classification?', options: ['ReLU', 'Sigmoid', 'Softmax', 'Tanh'], correct: 1, explanation: 'Sigmoid maps output to [0,1], perfect for binary classification probability. Softmax is for multi-class.' },
    { id: 8, question: 'What is Overfitting in ML?', options: ['Model performs poorly on training data', 'Model performs well on training but poorly on unseen data', 'Model is too simple to capture patterns', 'Model has too many features'], correct: 1, explanation: 'Overfitting means the model memorizes training data, causing high variance and poor generalization.' },
    { id: 9, question: 'In Python, what is a List Comprehension?', options: ['A way to create lists using loops and conditions in one line', 'A method to sort lists', 'A data type for ordered sets', 'A numpy function'], correct: 0, explanation: 'List comprehensions provide a concise way to create lists: [expr for item in iterable if condition]' },
    { id: 10, question: 'Which Python library is primarily used for data manipulation?', options: ['Matplotlib', 'Pandas', 'Scikit-learn', 'Flask'], correct: 1, explanation: 'Pandas provides DataFrame and Series structures for powerful tabular data manipulation.' },
  ],
  'Web Development': [
    { id: 11, question: 'What does REST stand for in Web APIs?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Resource Endpoint Service Type', 'Relational Entity State Transformer'], correct: 1, explanation: 'REST (Representational State Transfer) is an architectural style for distributed systems using HTTP.' },
    { id: 12, question: 'In React, what is the purpose of "useEffect" hook?', options: ['To manage component state', 'To perform side effects (API calls, DOM mutations)', 'To create context providers', 'To memoize computed values'], correct: 1, explanation: 'useEffect runs after renders to handle side effects like fetching data and subscriptions.' },
    { id: 13, question: 'Which HTTP status code means "Not Found"?', options: ['200', '401', '404', '500'], correct: 2, explanation: '404 Not Found means the server cannot find the requested resource.' },
    { id: 14, question: 'What is the difference between localStorage and sessionStorage?', options: ['localStorage is encrypted', 'localStorage persists after browser close; sessionStorage clears on tab close', 'sessionStorage can hold more data', 'There is no difference'], correct: 1, explanation: 'localStorage persists until cleared. sessionStorage clears when the tab or browser session ends.' },
    { id: 15, question: 'What is CORS in web development?', options: ['A CSS layout system', 'A JavaScript runtime error', 'Cross-Origin Resource Sharing - a browser security mechanism', 'A database query language'], correct: 2, explanation: 'CORS controls cross-domain HTTP requests for security in browsers.' },
  ],
  'System Design': [
    { id: 16, question: 'What is the CAP theorem?', options: ['Consistency, Availability, Partition Tolerance - pick any 2', 'Cache, API, Protocol', 'Clustering, Automation, Persistence', 'Code, Architecture, Performance'], correct: 0, explanation: 'CAP theorem states a distributed system can only guarantee 2 of: Consistency, Availability, Partition Tolerance.' },
    { id: 17, question: 'What is the primary purpose of a Load Balancer?', options: ['Database optimization', 'Distributing network traffic across multiple servers', 'Caching static content', 'SSL termination only'], correct: 1, explanation: 'Load balancers distribute incoming traffic across multiple servers to ensure reliability and performance.' },
    { id: 18, question: 'Which database type is better suited for hierarchical data?', options: ['Relational (SQL)', 'Document (MongoDB)', 'Graph (Neo4j)', 'Time-series'], correct: 2, explanation: 'Graph databases like Neo4j are optimized for hierarchical and relationship-heavy data structures.' },
    { id: 19, question: 'What is a CDN (Content Delivery Network)?', options: ['A type of database', 'Geographically distributed servers to deliver content faster', 'A programming paradigm', 'A message queue system'], correct: 1, explanation: 'CDNs cache content on servers worldwide to reduce latency by serving from the nearest location.' },
    { id: 20, question: 'What is eventual consistency in distributed systems?', options: ['Data is always consistent across all nodes', 'All nodes agree on the same value at the same time', 'Given enough time, all replicas will converge to the same value', 'Data consistency is never guaranteed'], correct: 2, explanation: 'Eventual consistency guarantees that, absent new updates, all replicas will eventually converge to the same value.' },
  ],
  'Data Science': [
    { id: 21, question: 'What does SQL JOIN do?', options: ['Creates a new table', 'Combines rows from two or more tables', 'Deletes duplicate rows', 'Sorts a table'], correct: 1, explanation: 'JOIN combines rows from multiple tables based on related columns.' },
    { id: 22, question: 'What is Feature Engineering?', options: ['Building software features', 'Creating/transforming variables to improve ML model performance', 'Writing code for data pipelines', 'A deep learning technique'], correct: 1, explanation: 'Feature engineering transforms raw data into features that better represent patterns for ML algorithms.' },
    { id: 23, question: 'Which metric is most appropriate for imbalanced classification problems?', options: ['Accuracy', 'F1 Score', 'Mean Squared Error', 'R-squared'], correct: 1, explanation: 'F1 Score (harmonic mean of precision and recall) is more appropriate than accuracy for imbalanced datasets.' },
    { id: 24, question: 'What is a p-value in hypothesis testing?', options: ['The mean of your sample', 'Probability of observing results at least as extreme as observed, assuming null hypothesis is true', 'The standard deviation', 'The sample size'], correct: 1, explanation: 'p-value measures the probability of the observed data (or more extreme) given the null hypothesis is true.' },
    { id: 25, question: 'What is dimensionality reduction?', options: ['Removing rows from a dataset', 'Reducing number of features while preserving information', 'Scaling features to the same range', 'Filling missing values'], correct: 1, explanation: 'Dimensionality reduction reduces the number of features while preserving important information (e.g., PCA).' },
  ],
};

/**
 * GET /api/assessments/questions
 * Query: ?category=Core CS
 */
export async function getQuestions(req, res) {
  try {
    const { category } = req.query;

    if (category) {
      const questions = QUIZ_QUESTIONS[category];
      if (!questions) {
        return res.status(404).json({ error: `Category "${category}" not found` });
      }
      // Don't send correct answers to client
      return res.json({
        category,
        questions: questions.map(({ correct, explanation, ...q }) => q),
        total: questions.length,
      });
    }

    // Return all categories (without answers)
    const categories = Object.entries(QUIZ_QUESTIONS).map(([cat, qs]) => ({
      category: cat,
      total: qs.length,
      description: getCategoryDescription(cat),
      icon: getCategoryIcon(cat),
    }));

    return res.json({ categories });
  } catch (err) {
    console.error('[getQuestions]', err);
    return res.status(500).json({ error: 'Failed to fetch questions' });
  }
}

/**
 * POST /api/assessments/submit
 * Body: { category, answers: { 0: 1, 1: 2, ... } }
 * Access: student
 */
export async function submitAssessment(req, res) {
  try {
    const { category, answers } = req.body;
    const userId = req.user.id;

    const questions = QUIZ_QUESTIONS[category];
    if (!questions) {
      return res.status(400).json({ error: `Unknown assessment category: ${category}` });
    }

    // Get student record
    const { data: student } = await supabaseAdmin
      .from('students').select('id, skills').eq('user_id', userId).single();

    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    // Score the assessment
    let correct = 0;
    const gradedAnswers = questions.map((q, i) => {
      const studentAnswer = answers[i];
      const isCorrect = studentAnswer === q.correct;
      if (isCorrect) correct++;
      return {
        questionId: q.id,
        question: q.question,
        studentAnswer,
        correctAnswer: q.correct,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correct / questions.length) * 100);

    // Save assessment result
    const { data: assessment, error } = await supabaseAdmin
      .from('assessments')
      .insert({
        student_id: student.id,
        category,
        score,
        correct_count: correct,
        total_questions: questions.length,
        answers: gradedAnswers,
        taken_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Update skill proficiency based on score (for relevant category)
    const skillUpdates = getSkillUpdatesFromScore(category, score, student.skills || {});
    if (Object.keys(skillUpdates).length > 0) {
      await supabaseAdmin.from('students')
        .update({ skills: { ...student.skills, ...skillUpdates } })
        .eq('id', student.id);
    }

    return res.status(201).json({
      assessment,
      score,
      correct,
      total: questions.length,
      passed: score >= 60,
      grade: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement',
      gradedAnswers,
      skillUpdates,
    });
  } catch (err) {
    console.error('[submitAssessment]', err);
    return res.status(500).json({ error: 'Failed to submit assessment' });
  }
}

/**
 * GET /api/assessments/my
 * Logged-in student's assessment history.
 */
export async function getMyAssessments(req, res) {
  try {
    const userId = req.user.id;

    const { data: student } = await supabaseAdmin
      .from('students').select('id').eq('user_id', userId).single();

    if (!student) return res.json({ assessments: [] });

    const { data: assessments, error } = await supabaseAdmin
      .from('assessments')
      .select('id, category, score, correct_count, total_questions, taken_at')
      .eq('student_id', student.id)
      .order('taken_at', { ascending: false });

    if (error) throw error;

    return res.json({ assessments: assessments || [] });
  } catch (err) {
    console.error('[getMyAssessments]', err);
    return res.status(500).json({ error: 'Failed to fetch assessments' });
  }
}

/**
 * GET /api/assessments/:id
 * Full assessment result with graded answers.
 */
export async function getAssessmentResult(req, res) {
  try {
    const { id } = req.params;

    const { data: assessment, error } = await supabaseAdmin
      .from('assessments').select('*').eq('id', id).single();

    if (error || !assessment) return res.status(404).json({ error: 'Assessment not found' });

    // Verify ownership
    const { data: student } = await supabaseAdmin
      .from('students').select('user_id').eq('id', assessment.student_id).single();

    if (student?.user_id !== req.user.id && req.user.role !== 'institution') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    return res.json({ assessment });
  } catch (err) {
    console.error('[getAssessmentResult]', err);
    return res.status(500).json({ error: 'Failed to fetch assessment' });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryDescription(cat) {
  const descs = {
    'Core CS': 'Data Structures, Algorithms, OS, DBMS fundamentals',
    'Python & ML': 'Python programming, NumPy, Pandas, Machine Learning',
    'Web Development': 'React, REST APIs, HTTP, JavaScript, CSS',
    'System Design': 'Architecture, Scalability, Distributed Systems',
    'Data Science': 'Statistics, Feature Engineering, SQL, Analytics',
  };
  return descs[cat] || cat;
}

function getCategoryIcon(cat) {
  const icons = {
    'Core CS': '⚙️', 'Python & ML': '🐍', 'Web Development': '🌐',
    'System Design': '🏗️', 'Data Science': '📊',
  };
  return icons[cat] || '📚';
}

function getSkillUpdatesFromScore(category, score, existingSkills) {
  const categorySkillMap = {
    'Core CS': ['Data Structures', 'Problem Solving'],
    'Python & ML': ['Python', 'Machine Learning'],
    'Web Development': ['React.js', 'Node.js'],
    'System Design': ['System Design'],
    'Data Science': ['SQL', 'Data Analysis'],
  };

  const skills = categorySkillMap[category] || [];
  const updates = {};

  for (const skill of skills) {
    const current = existingSkills[skill] || 0;
    // Weighted average: 70% current + 30% new score
    const updated = Math.round(current * 0.7 + score * 0.3);
    if (updated !== current) updates[skill] = updated;
  }

  return updates;
}
