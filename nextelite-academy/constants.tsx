import React from 'react';
import { BookOpen, Brain, Cpu, GraduationCap, Code2, Users, Target, Lightbulb, Calculator, Globe, Music, Paintbrush, Gamepad2, FlaskConical, BookMarked, Languages, Sparkles, Rocket, Award, TrendingUp } from 'lucide-react';
import { Course, Instructor, AppData, BlogPost, PageContent } from './types';

// Icons need to be recreated in App logic or passed, but keeping them here for static ref is okay 
// provided we map them correctly. 
// Since we are mocking a CMS, we will use a helper to attach icons to the raw data.

export const ICONS = {
  debate: <BookOpen className="w-8 h-8 text-white" />,
  logic: <Brain className="w-8 h-8 text-white" />,
  coding: <Cpu className="w-8 h-8 text-white" />,
  graduation: <GraduationCap className="w-8 h-8 text-white" />,
  code: <Code2 className="w-8 h-8 text-white" />,
  users: <Users className="w-8 h-8 text-white" />,
  target: <Target className="w-8 h-8 text-white" />,
  lightbulb: <Lightbulb className="w-8 h-8 text-white" />,
  calculator: <Calculator className="w-8 h-8 text-white" />,
  globe: <Globe className="w-8 h-8 text-white" />,
  music: <Music className="w-8 h-8 text-white" />,
  paintbrush: <Paintbrush className="w-8 h-8 text-white" />,
  gamepad: <Gamepad2 className="w-8 h-8 text-white" />,
  flask: <FlaskConical className="w-8 h-8 text-white" />,
  bookmarked: <BookMarked className="w-8 h-8 text-white" />,
  languages: <Languages className="w-8 h-8 text-white" />,
  sparkles: <Sparkles className="w-8 h-8 text-white" />,
  rocket: <Rocket className="w-8 h-8 text-white" />,
  award: <Award className="w-8 h-8 text-white" />,
  trending: <TrendingUp className="w-8 h-8 text-white" />,
};

// Lookup lists for course management
export const AGE_GROUPS = [
  'Pre-K (Ages 3-5)',
  'Kindergarten (Ages 5-6)',
  'Primary 1-2 (Ages 6-8)',
  'Primary 3-4 (Ages 8-10)',
  'Primary 5-6 (Ages 10-12)',
  'Primary 3 - Secondary 2',
  'Secondary 1-2 (Ages 12-14)',
  'Secondary 3-4 (Ages 14-16)',
  'Secondary 5-6 (Ages 16-18)',
  'All Ages',
];

export const COURSE_CATEGORIES = [
  'Academic',
  'Language & Communication',
  'STEM',
  'Arts & Creativity',
  'Sports & Physical',
  'Life Skills',
  'Test Preparation',
  'Competition Training',
  'Other',
];

export const BLOG_CATEGORIES = [
  'News',
  'Achievements',
  'Education',
  'Tips & Advice',
  'Events',
  'Announcements',
  'Other'
];

const DEFAULT_THEME = {
  yellow: '#BDD5EA', // Columbia Blue
  orange: '#FE5F55', // Bittersweet
  blue: '#577399',   // Glaucous
  green: '#495867',  // Payne's Gray
  purple: '#3E3A39', // Binrouji Black
};

export const DEFAULT_TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const DEFAULT_TRIAL_SETTINGS = {
  enabled: true,
  slotsAvailable: 5,
  message: 'Limited slots available for this weekend!',
  blockedDates: [], // Strings 'YYYY-MM-DD'
  customAvailability: {}
};

const DEFAULT_PAGE_CONTENT_EN: PageContent = {
  hero: {
    titleLine1: 'Shape the Mind,',
    titleLine2: 'Lead the Future',
    subtitle: 'Join NextElite Academy for premier English Debate, Logical Thinking, and AI Coding. We build confidence, critical thinking, and future-ready skills.',
    exploreButton: 'Explore Courses',
    trialButton: 'Book a Free Trial',
  },
  sections: {
    programs: {
      heading: 'Our Programs',
      subheading: 'Designed for Primary and Secondary students to excel beyond the classroom.',
    },
    mentors: {
      heading: 'Meet Our Mentors',
      subheading: 'Expert guidance from passionate educators.',
    },
    gallery: {
      heading: 'Moments of Joy',
    },
    contact: {
      heading: 'Get In Touch',
      subheading: 'Ready to start the journey? Fill out the form or visit us at our campus!',
      address: '123 Education Rd, Innovation District',
      email: 'hello@nextelite.edu',
    },
  },
  about: {
    heading: 'About NextElite Academy',
    subheading: 'Empowering the next generation of leaders and thinkers',
    content: '<p>NextElite Academy is dedicated to nurturing young minds through innovative educational programs that combine critical thinking, communication skills, and technological literacy.</p><p>Our mission is to prepare students for a rapidly evolving world by developing their analytical abilities, creative problem-solving skills, and confidence to express their ideas effectively.</p>',
    imageUrl: '',
  },
  galleryImages: [
    'https://picsum.photos/id/20/800/600',
    'https://picsum.photos/id/119/800/600',
    'https://picsum.photos/id/180/800/600',
    'https://picsum.photos/id/201/800/600',
    'https://picsum.photos/id/250/800/600',
    'https://picsum.photos/id/366/800/600',
  ],
  backgrounds: {
    hero: '',
    programs: '',
    mentors: '',
    gallery: '',
    contact: '',
  },
  logo: '',
};

const DEFAULT_PAGE_CONTENT_ZH: PageContent = {
  hero: {
    titleLine1: '啟發思維，',
    titleLine2: '引領未來',
    subtitle: '加入 NextElite Academy，體驗頂尖的英語辯論、邏輯思維及 AI 編程課程。我們致力於建立自信、批判性思考及未來技能。',
    exploreButton: '瀏覽課程',
    trialButton: '預約試堂',
  },
  sections: {
    programs: {
      heading: '課程介紹',
      subheading: '專為中小學生設計，讓學習超越課室。',
    },
    mentors: {
      heading: '專業導師',
      subheading: '充滿熱誠的教育專家，引領學生成長。',
    },
    gallery: {
      heading: '精彩時刻',
    },
    contact: {
      heading: '聯絡我們',
      subheading: '準備好開始了嗎？填寫表格或親臨我們的校舍！',
      address: '123 Education Rd, Innovation District',
      email: 'hello@nextelite.edu',
    },
  },
  about: {
    heading: '關於 NextElite Academy',
    subheading: '培養下一代領袖和思想家',
    content: '<p>NextElite Academy 致力於通過創新的教育計劃培養年輕人的思維，結合批判性思考、溝通技巧和科技素養。</p><p>我們的使命是通過培養學生的分析能力、創造性解決問題的能力以及有效表達想法的信心，為快速發展的世界做好準備。</p>',
    imageUrl: '',
  },
  galleryImages: [
    'https://picsum.photos/id/20/800/600',
    'https://picsum.photos/id/119/800/600',
    'https://picsum.photos/id/180/800/600',
    'https://picsum.photos/id/201/800/600',
    'https://picsum.photos/id/250/800/600',
    'https://picsum.photos/id/366/800/600',
  ],
  backgrounds: {
    hero: '',
    programs: '',
    mentors: '',
    gallery: '',
    contact: '',
  },
  logo: '',
};

// Placeholder PDF URL for demo purposes
const DEMO_PDF_URL = "https://pdfobject.com/pdf/sample.pdf";

const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'NextElite Students Win Regional Debate Championship',
    excerpt: 'Our senior debate team took home the gold at the Inter-School Cup this weekend.',
    content: `<p>We are incredibly proud to announce that the NextElite Senior Debate Team has won the <strong>2024 Regional Inter-School Debate Cup</strong>!</p>
    <p>After three grueling rounds of preliminaries, our students faced off against the defending champions in the finals. The motion was <em>"This House Believes that AI will do more harm than good to the education sector."</em></p>
    <h3>Key Highlights</h3>
    <ul>
      <li><strong>Best Speaker:</strong> Jason Lee (Secondary 2)</li>
      <li><strong>Best Rebuttal:</strong> Sarah Wong (Primary 6)</li>
    </ul>
    <p>The judges praised our team for their structured arguments and calm demeanor under pressure. A huge thank you to Coach Sarah Jenkins for her tireless dedication.</p>`,
    date: '2024-10-15',
    coverImage: 'https://picsum.photos/id/20/800/600',
    tags: ['Achievements', 'Debate']
  },
  {
    id: 'b2',
    title: 'Why Logic Puzzles are Crucial for Early Development',
    excerpt: 'Explore how simple puzzles can build the foundation for complex mathematical understanding.',
    content: `<p>Many parents ask us: <em>"Why do you spend time on Sudoku and riddles?"</em></p>
    <p>The answer lies in <strong>neuroplasticity</strong>. When children engage in logic puzzles, they aren't just solving a game; they are training their brains to recognize patterns, deduce outcomes, and think algorithmically.</p>
    <blockquote>"Logic is the anatomy of thought." - John Locke</blockquote>
    <p>Our Primary 1-3 curriculum integrates these puzzles to prepare students for the abstract concepts they will encounter in higher mathematics and coding.</p>`,
    date: '2024-09-28',
    coverImage: 'https://picsum.photos/id/227/800/600',
    tags: ['Education', 'Logic']
  }
];

export const INITIAL_DATA: { en: AppData; zh: AppData } = {
  en: {
    themeColors: DEFAULT_THEME,
    trialSettings: DEFAULT_TRIAL_SETTINGS,
    submissions: [],
    blogPosts: INITIAL_BLOG_POSTS,
    pageContent: DEFAULT_PAGE_CONTENT_EN,
    lookupLists: {
      ageGroups: AGE_GROUPS,
      courseCategories: COURSE_CATEGORIES,
      blogCategories: BLOG_CATEGORIES
    },
    courses: [
      {
        id: 'c1',
        title: 'English Debate & Public Speaking',
        ageGroup: ['Primary 3 - Secondary 2'],
        category: 'Language & Communication',
        description: 'Empower your child to speak with confidence. We focus on argumentative structure, rebuttal techniques, and voice projection.',
        fullDescription: 'Our English Debate program is designed to transform shy students into confident speakers and articulate thinkers. Through a rigorous curriculum of parliamentary debate formats, impromptu speaking drills, and current affairs analysis, students learn to construct logical arguments, identify fallacies, and present with poise.',
        color: 'bg-brand-orange',
        icon: 'debate',
        outline: [
          'Week 1: Introduction to Arguments (ARE Structure)',
          'Week 2: The Art of Rebuttal',
          'Week 3: Voice and Body Language',
          'Week 4: Mock Debate: "Homework should be banned"',
          'Week 5-8: Advanced Rhetoric & Tournaments'
        ],
        attachments: [
          { name: 'Debate_Syllabus_2024.pdf', size: '2.4 MB', url: DEMO_PDF_URL },
          { name: 'Reading_List.pdf', size: '1.1 MB', url: DEMO_PDF_URL }
        ],
        galleryImages: [
          'https://picsum.photos/id/106/800/600',
          'https://picsum.photos/id/129/800/600',
          'https://picsum.photos/id/180/800/600'
        ]
      },
      {
        id: 'c2',
        title: 'Logical Thinking & Math Olympiad',
        ageGroup: 'Primary 1 - Primary 6',
        category: 'STEM',
        description: 'Boost cognitive skills through puzzles, pattern recognition, and advanced arithmetic. Perfect for Math Olympiad preparation.',
        fullDescription: 'Logic is the foundation of all STEM fields. In this course, we move beyond rote memorization to explore the "why" and "how" of mathematics. Students engage in spatial reasoning games, number theory puzzles, and competitive math drills tailored for Olympiad success.',
        color: 'bg-brand-green',
        icon: 'logic',
        outline: [
          'Module 1: Patterns and Sequences',
          'Module 2: Logic Puzzles and Sudoku',
          'Module 3: Geometry & Spatial Awareness',
          'Module 4: Word Problems Deconstructed',
          'Module 5: Competition Drills'
        ],
        attachments: [
          { name: 'Logic_Workbook_Sample.pdf', size: '5.0 MB', url: DEMO_PDF_URL }
        ],
        galleryImages: [
          'https://picsum.photos/id/227/800/600',
          'https://picsum.photos/id/250/800/600',
          'https://picsum.photos/id/352/800/600'
        ],
        quiz: {
          title: 'Logic Challenge',
          questions: [
            {
              question: 'What comes next in the sequence: 2, 4, 8, 16, ...?',
              options: ['24', '32', '18', '20'],
              correctIndex: 1
            },
            {
              question: 'If some Smurfs are blue, and all blue things are small, does it mean some Smurfs are small?',
              options: ['Yes', 'No', 'Impossible to tell'],
              correctIndex: 0
            },
            {
              question: 'Which shape has 6 sides?',
              options: ['Pentagon', 'Heptagon', 'Hexagon', 'Octagon'],
              correctIndex: 2
            }
          ]
        }
      },
      {
        id: 'c3',
        title: 'AI Coding & Robotics',
        ageGroup: ['Primary 4 - Secondary 4'],
        category: 'STEM',
        description: 'From Scratch to Python, and into the world of Machine Learning. Students build real apps and train their own AI models.',
        fullDescription: 'Prepare for the future with our comprehensive AI Coding curriculum. We start with visual block coding to grasp algorithmic thinking, then graduate to Python—the language of AI. Students will train simple machine learning models to recognize images and text.',
        color: 'bg-brand-blue',
        icon: 'coding',
        outline: [
          'Level 1: Block-based Coding (Scratch)',
          'Level 2: Introduction to Python Syntax',
          'Level 3: Building a Chatbot',
          'Level 4: Computer Vision Basics',
          'Level 5: Capstone Project'
        ],
        attachments: [
          { name: 'Course_Requirements.pdf', size: '0.5 MB', url: DEMO_PDF_URL },
          { name: 'Python_Setup_Guide.pdf', size: '1.2 MB', url: DEMO_PDF_URL }
        ],
        galleryImages: [
          'https://picsum.photos/id/0/800/600',
          'https://picsum.photos/id/60/800/600',
          'https://picsum.photos/id/119/800/600'
        ],
        quiz: {
          title: 'Coding Basics Quiz',
          questions: [
            {
              question: 'Which symbol is used for comments in Python?',
              options: ['//', '#', '/* */', '--'],
              correctIndex: 1
            },
            {
              question: 'What is a "loop" used for in coding?',
              options: ['Drawing circles', 'Repeating code', 'Stopping the program', 'Connecting to Wi-Fi'],
              correctIndex: 1
            },
            {
              question: 'Which of these is a variable?',
              options: ['score = 10', 'print("Hello")', 'if x > 5:', 'import math'],
              correctIndex: 0
            }
          ]
        }
      }
    ],
    instructors: [
      {
        id: 'i1',
        name: 'Sarah Jenkins',
        role: 'Head of Debate',
        bio: 'Former National Debate Champion with 10 years of coaching experience. Passionate about helping introverts find their voice.',
        imageUrl: 'https://picsum.photos/id/64/400/400'
      },
      {
        id: 'i2',
        name: 'Dr. Alan Grant',
        role: 'Logic & Math Lead',
        bio: 'PhD in Mathematics. Believes that math is not just about numbers, but about seeing the world clearly.',
        imageUrl: 'https://picsum.photos/id/91/400/400'
      },
      {
        id: 'i3',
        name: 'Kenji Sato',
        role: 'AI & Tech Director',
        bio: 'Software Engineer turned educator. Loves making complex tech concepts simple and fun for kids.',
        imageUrl: 'https://picsum.photos/id/177/400/400'
      }
    ]
  },
  zh: {
    themeColors: DEFAULT_THEME,
    trialSettings: DEFAULT_TRIAL_SETTINGS,
    submissions: [],
    pageContent: DEFAULT_PAGE_CONTENT_ZH,
    lookupLists: {
      ageGroups: AGE_GROUPS,
      courseCategories: COURSE_CATEGORIES,
      blogCategories: BLOG_CATEGORIES
    },
    blogPosts: [
       {
        id: 'b1',
        title: 'NextElite 學生勇奪地區辯論冠軍',
        excerpt: '我們的高級辯論隊在本週末的校際盃中奪得金牌。',
        content: `<p>我們非常自豪地宣布，NextElite 高級辯論隊贏得了 <strong>2024 地區校際辯論盃</strong>！</p>
        <p>經過三輪激烈的初賽，我們的學生在決賽中面對衛冕冠軍。辯題是 <em>"本院認為人工智能對教育界的弊大於利。"</em></p>
        <h3>亮點</h3>
        <ul>
          <li><strong>最佳辯手：</strong> Jason Lee (中二)</li>
          <li><strong>最佳反駁：</strong> Sarah Wong (小六)</li>
        </ul>
        <p>評判稱讚我們的團隊在壓力下論點結構嚴謹，表現冷靜。非常感謝 Sarah Jenkins 教練的不懈努力。</p>`,
        date: '2024-10-15',
        coverImage: 'https://picsum.photos/id/20/800/600',
        tags: ['成就', '辯論']
      },
      {
        id: 'b2',
        title: '為什麼邏輯謎題對早期發展至關重要',
        excerpt: '探索簡單的謎題如何為複雜的數學理解建立基礎。',
        content: `<p>許多家長問我們：<em>"為什麼你們要花時間玩數獨和謎語？"</em></p>
        <p>答案在於 <strong>神經可塑性</strong>。當孩子們參與邏輯謎題時，他們不僅僅是在解決一個遊戲；他們正在訓練大腦識別模式，推斷結果，並進行算法思考。</p>
        <blockquote>"邏輯是思想的解剖學。" - John Locke</blockquote>
        <p>我們的小一至小三課程整合了這些謎題，讓學生為將來的高等數學和編程中的抽象概念做好準備。</p>`,
        date: '2024-09-28',
        coverImage: 'https://picsum.photos/id/227/800/600',
        tags: ['教育', '邏輯']
      }
    ],
    courses: [
      {
        id: 'c1',
        title: '英語辯論與演講',
        ageGroup: ['小三 至 中二'],
        category: 'Language & Communication',
        description: '讓孩子自信演講。我們專注於論點結構、反駁技巧和聲音投射。',
        fullDescription: '我們的英語辯論課程旨在將害羞的學生轉變為自信的演講者和思維清晰的思想家。通過嚴格的議會辯論形式課程、即興演講訓練和時事分析，學生學習構建邏輯論點，識別謬誤，並從容地展示自己。',
        color: 'bg-brand-orange',
        icon: 'debate',
        outline: [
          '第一週：論點介紹 (ARE 結構)',
          '第二週：反駁的藝術',
          '第三週：聲音與肢體語言',
          '第四週：模擬辯論："應該禁止家庭作業"',
          '第五至八週：高級修辭與比賽'
        ],
        attachments: [
          { name: '辯論課程大綱_2024.pdf', size: '2.4 MB', url: DEMO_PDF_URL },
          { name: '閱讀清單.pdf', size: '1.1 MB', url: DEMO_PDF_URL }
        ],
        galleryImages: [
          'https://picsum.photos/id/106/800/600',
          'https://picsum.photos/id/129/800/600',
          'https://picsum.photos/id/180/800/600'
        ]
      },
      {
        id: 'c2',
        title: '邏輯思維與奧數',
        ageGroup: ['小一 至 小六'],
        category: 'STEM',
        description: '通過謎題、模式識別和高級算術提升認知能力。非常適合奧數準備。',
        fullDescription: '邏輯是所有 STEM 領域的基礎。在本課程中，我們超越死記硬背，探索數學的"為什麼"和"如何"。學生參與空間推理遊戲、數論謎題和為奧數成功量身定制的競爭性數學訓練。',
        color: 'bg-brand-green',
        icon: 'logic',
        outline: [
          '單元一：模式與序列',
          '單元二：邏輯謎題與數獨',
          '單元三：幾何與空間感',
          '單元四：應用題拆解',
          '單元五：競賽訓練'
        ],
        attachments: [
          { name: '邏輯練習本樣本.pdf', size: '5.0 MB', url: DEMO_PDF_URL }
        ],
        galleryImages: [
          'https://picsum.photos/id/227/800/600',
          'https://picsum.photos/id/250/800/600',
          'https://picsum.photos/id/352/800/600'
        ],
        quiz: {
          title: '邏輯挑戰',
          questions: [
            {
              question: '序列 2, 4, 8, 16, ... 的下一個數字是什麼？',
              options: ['24', '32', '18', '20'],
              correctIndex: 1
            },
            {
              question: '如果有些藍精靈是藍色的，而所有藍色的東西都是小的，這是否意味著有些藍精靈是小的？',
              options: ['是', '否', '無法判斷'],
              correctIndex: 0
            },
            {
              question: '哪個形狀有 6 條邊？',
              options: ['五邊形', '七邊形', '六邊形', '八邊形'],
              correctIndex: 2
            }
          ]
        }
      },
      {
        id: 'c3',
        title: 'AI 編程與機械人',
        ageGroup: ['小四 至 中四'],
        category: 'STEM',
        description: '從 Scratch 到 Python，進入機器學習的世界。學生建立真實的應用程序並訓練他們自己的 AI 模型。',
        fullDescription: '通過我們全面的 AI 編程課程為未來做好準備。我們從視覺積木編程開始，掌握算法思維，然後升級到 Python——AI 的語言。學生將訓練簡單的機器學習模型來識別圖像和文本。',
        color: 'bg-brand-blue',
        icon: 'coding',
        outline: [
          '第一級：積木編程 (Scratch)',
          '第二級：Python 語法入門',
          '第三級：建立聊天機械人',
          '第四級：電腦視覺基礎',
          '第五級：畢業專案'
        ],
        attachments: [
          { name: '課程要求.pdf', size: '0.5 MB', url: DEMO_PDF_URL },
          { name: 'Python_安裝指南.pdf', size: '1.2 MB', url: DEMO_PDF_URL }
        ],
        galleryImages: [
          'https://picsum.photos/id/0/800/600',
          'https://picsum.photos/id/60/800/600',
          'https://picsum.photos/id/119/800/600'
        ],
        quiz: {
          title: '編程基礎測驗',
          questions: [
            {
              question: 'Python 中使用哪個符號進行註釋？',
              options: ['//', '#', '/* */', '--'],
              correctIndex: 1
            },
            {
              question: '編程中的 "Loop" 有什麼用？',
              options: ['畫圓圈', '重複代碼', '停止程序', '連接 Wi-Fi'],
              correctIndex: 1
            },
            {
              question: '以下哪個是變量？',
              options: ['score = 10', 'print("Hello")', 'if x > 5:', 'import math'],
              correctIndex: 0
            }
          ]
        }
      }
    ],
    instructors: [
      {
        id: 'i1',
        name: 'Sarah Jenkins',
        role: '辯論部主管',
        bio: '前國家辯論冠軍，擁有 10 年教練經驗。熱衷於幫助內向者找到自己的聲音。',
        imageUrl: 'https://picsum.photos/id/64/400/400'
      },
      {
        id: 'i2',
        name: 'Dr. Alan Grant',
        role: '邏輯與數學主管',
        bio: '數學博士。相信數學不僅僅是數字，而是關於清晰地看世界。',
        imageUrl: 'https://picsum.photos/id/91/400/400'
      },
      {
        id: 'i3',
        name: 'Kenji Sato',
        role: 'AI 與科技總監',
        bio: '軟件工程師轉型教育家。喜歡把複雜的科技概念變得簡單有趣。',
        imageUrl: 'https://picsum.photos/id/177/400/400'
      }
    ]
  }
};