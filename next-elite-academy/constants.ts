import { Course, TeamMember, Testimonial, BlogPost } from './types';

export const COURSES: Course[] = [
  {
    id: 'logic-101',
    title: 'Foundations of Logic',
    category: 'Logic',
    shortDescription: 'Master the art of reasoning and critical thinking.',
    fullDescription: 'This course introduces students to formal and informal logic. We cover fallacies, syllogisms, and how to construct sound arguments. Essential for any student wanting to improve their analytical skills.',
    instructor: 'Dr. Sarah Bennett',
    duration: '10 Weeks',
    level: 'Middle School',
    image: 'https://picsum.photos/800/600?random=1',
    syllabus: ['Introduction to Arguments', 'Identifying Fallacies', 'Deductive vs Inductive Reasoning', 'Symbolic Logic Basics', 'Applied Critical Thinking'],
    preview: {
      type: 'quiz',
      title: 'Test Your Logical Intuition',
      description: 'Take this quick 3-question quiz to see if you can spot the logical fallacies in these common arguments.',
      quizData: [
        {
          question: '"If it rains, the ground is wet. The ground is wet, therefore it rained." What type of fallacy is this?',
          options: ['Ad Hominem', 'Affirming the Consequent', 'Straw Man', 'No Fallacy'],
          correctAnswer: 1
        },
        {
          question: 'Which of the following is an example of an Ad Hominem attack?',
          options: ['"You are wrong because your logic is flawed."', '"You are wrong because you are smelly."', '"You are wrong because the data says otherwise."', '"You are wrong because of gravity."'],
          correctAnswer: 1
        },
        {
          question: 'In a valid deductive argument, if the premises are true, the conclusion must be...',
          options: ['Probably true', 'False', 'True', 'Unknown'],
          correctAnswer: 2
        }
      ]
    }
  },
  {
    id: 'debate-adv',
    title: 'Competitive Debate',
    category: 'Debate',
    shortDescription: 'Build confidence and public speaking skills through structured debate.',
    fullDescription: 'Our Competitive Debate program prepares high school students for tournaments. We focus on Policy, Lincoln-Douglas, and Public Forum formats. Students learn research, speechwriting, and rebuttal techniques.',
    instructor: 'Mark Davidson',
    duration: '12 Weeks',
    level: 'High School',
    image: 'https://picsum.photos/800/600?random=2',
    syllabus: ['Public Speaking Fundamentals', 'Research Methods', 'Constructing Case Files', 'Cross-Examination Skills', 'Tournament Strategies'],
    preview: {
      type: 'video',
      title: 'Watch a Championship Round',
      description: 'Observe our students in action during the 2023 Regional Finals. Notice the structure of the rebuttal.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder
    }
  },
  {
    id: 'english-lit',
    title: 'Advanced English & Comp',
    category: 'English',
    shortDescription: 'Elevate your writing and reading comprehension.',
    fullDescription: 'A comprehensive course designed to improve essay writing, literary analysis, and vocabulary. Perfect for preparing for college admissions and standardized tests.',
    instructor: 'Emily Thorne',
    duration: 'Semester',
    level: 'High School',
    image: 'https://picsum.photos/800/600?random=3',
    syllabus: ['Essay Structure Mastery', 'Literary Analysis', 'Advanced Grammar & Style', 'Creative Writing Workshop', 'Standardized Test Prep'],
    preview: {
      type: 'document',
      title: 'Sample Lesson Plan: The Great Gatsby',
      description: 'Download a sample lesson plan and worksheet used in our 4th week of class focusing on symbolism.',
      documentUrl: '#'
    }
  },
  {
    id: 'ai-intro',
    title: 'Intro to AI & Python',
    category: 'AI',
    shortDescription: 'Understand the future with hands-on coding and AI concepts.',
    fullDescription: 'Demystify Artificial Intelligence. Students will learn the basics of Python programming and explore how machine learning models work. We discuss ethics, neural networks, and build simple bots.',
    instructor: 'James Chen',
    duration: '8 Weeks',
    level: 'All Levels',
    image: 'https://picsum.photos/800/600?random=4',
    syllabus: ['Python Basics', 'Data Structures', 'What is Machine Learning?', 'Ethics in AI', 'Building a Chatbot'],
    preview: {
      type: 'quiz',
      title: 'AI Concepts Check',
      description: 'Do you know the difference between Narrow AI and General AI? Test your knowledge.',
      quizData: [
        {
          question: 'What language is primarily used for AI development?',
          options: ['HTML', 'Python', 'CSS', 'SQL'],
          correctAnswer: 1
        },
        {
          question: 'What is a Neural Network modeled after?',
          options: ['The Human Brain', 'A Spider Web', 'Computer Chips', 'Road Maps'],
          correctAnswer: 0
        }
      ]
    }
  },
];

export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Alan Grant',
    role: 'Head of Academics',
    bio: 'Former university professor with 20 years of experience in curriculum development.',
    image: 'https://picsum.photos/300/300?random=10'
  },
  {
    id: '2',
    name: 'Sarah Connor',
    role: 'Lead AI Instructor',
    bio: 'Software engineer turned educator, passionate about teaching the next gen of coders.',
    image: 'https://picsum.photos/300/300?random=11'
  },
  {
    id: '3',
    name: 'Logain Ablar',
    role: 'Debate Coach',
    bio: 'National debate champion helping students find their voice.',
    image: 'https://picsum.photos/300/300?random=12'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Michael B.',
    role: 'High School Student',
    quote: 'The Logic course completely changed how I approach my other subjects. I feel much more confident in my arguments now.'
  },
  {
    id: '2',
    name: 'Linda K.',
    role: 'Parent',
    quote: 'Nexus Academy has been wonderful for my daughter. Her English grades improved significantly after just one term.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Why Logic Should Be Taught in Middle School',
    excerpt: 'Critical thinking is not innate; it is a learned skill. Discover why starting early gives students a massive advantage.',
    content: `
      <p class="mb-4">In an age of information overload, the ability to discern truth from falsehood is more critical than ever. Yet, formal logic—the very framework of valid reasoning—is rarely taught in schools before the university level.</p>
      <p class="mb-4">At Nexus Academy, we believe middle school is the perfect time to introduce these concepts. Students at this age are beginning to question authority and the world around them. Giving them the tools to structure these questions constructively builds confidence and intellectual independence.</p>
      <h3 class="text-xl font-bold mb-2">The Benefits of Early Logic Education</h3>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li><strong>Improved Math Skills:</strong> Logic is the foundation of mathematical proof.</li>
        <li><strong>Better Writing:</strong> Structured thinking leads to structured essays.</li>
        <li><strong>Conflict Resolution:</strong> Understanding fallacies helps de-escalate emotional arguments.</li>
      </ul>
      <p>By integrating logic into our core curriculum, we aren't just teaching students what to think, but how to think.</p>
    `,
    author: 'Dr. Alan Grant',
    date: 'October 15, 2023',
    image: 'https://picsum.photos/800/400?random=50',
    category: 'Education'
  },
  {
    id: '2',
    title: 'The Future of AI in the Classroom',
    excerpt: 'AI is not here to replace teachers, but to augment them. How we are using tools like ChatGPT to enhance learning.',
    content: `
      <p class="mb-4">Artificial Intelligence is transforming every industry, and education is no exception. While some schools are banning AI tools, we are embracing them as essential instruments for the future.</p>
      <p class="mb-4">Our approach is "AI Literacy." We teach students not just how to use prompts, but how the underlying models work, their limitations, and the ethical considerations of using them.</p>
      <h3 class="text-xl font-bold mb-2">Practical Applications</h3>
      <p class="mb-4">In our coding classes, AI acts as a pair programmer, helping students debug code in real-time. In English, we use it to generate counter-arguments for debate practice, allowing students to sharpen their rebuttal skills against a tireless opponent.</p>
      <p>The future belongs to those who can collaborate with machines, not those who compete against them.</p>
    `,
    author: 'Sarah Connor',
    date: 'November 2, 2023',
    image: 'https://picsum.photos/800/400?random=51',
    category: 'Technology'
  },
  {
    id: '3',
    title: 'Top 5 Public Speaking Tips for Introverts',
    excerpt: 'Debate isn\'t just for the loud. Learn how quiet confidence can often be the most persuasive tool in the room.',
    content: `
      <p class="mb-4">Public speaking is often cited as a top fear, especially for introverted students. However, introverts often make the best debaters because they are naturally inclined to listen and analyze before they speak.</p>
      <p class="mb-4">Here are our top tips for introverted speakers:</p>
      <ol class="list-decimal pl-5 mb-4 space-y-2">
        <li><strong>Preparation is Key:</strong> Anxiety often comes from the unknown. Knowing your material inside out reduces fear.</li>
        <li><strong>Focus on the Message:</strong> Shift your attention from "how do I look?" to "what value am I giving the audience?"</li>
        <li><strong>Use Silence:</strong> A well-placed pause is more powerful than a shout.</li>
        <li><strong>Practice in Low-Stakes Environments:</strong> Start with small groups before moving to the stage.</li>
        <li><strong>Be Yourself:</strong> Authenticity resonates more than forced enthusiasm.</li>
      </ol>
    `,
    author: 'Logain Ablar',
    date: 'November 20, 2023',
    image: 'https://picsum.photos/800/400?random=52',
    category: 'Tips & Tricks'
  }
];