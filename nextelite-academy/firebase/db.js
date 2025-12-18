// Firestore database service functions
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  query,
  orderBy,
  writeBatch
} from "firebase/firestore";
import { db } from "./config.js";

// Collection structure based on AppData from constants.tsx
// Collections are organized by language using suffixes, e.g.:
//   courses_en, courses_zh, blogPosts_en, blogPosts_zh, etc.
const COLLECTIONS = {
  COURSES: 'courses',
  INSTRUCTORS: 'instructors',
  BLOG_POSTS: 'blogPosts',
  THEME_COLORS: 'themeColors',
  TRIAL_SETTINGS: 'trialSettings',
  SUBMISSIONS: 'submissions',
  TRANSLATIONS: 'translations',
  PAGE_CONTENT: 'pageContent'
};

// Helper to get language-specific collection name
// Example: getLangCollection('courses', 'en') => 'courses_en'
const getLangCollection = (collectionName, lang = 'en') => {
  return `${collectionName}_${lang}`;
};

// ===== COURSES =====
export const getCourses = async (lang = 'en') => {
  try {
    const coursesRef = collection(db, getLangCollection(COLLECTIONS.COURSES, lang));
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export const saveCourse = async (course, lang = 'en') => {
  try {
    if (course.id) {
      await setDoc(doc(db, getLangCollection(COLLECTIONS.COURSES, lang), course.id), course);
      return course.id;
    } else {
      const { id, ...courseData } = course;
      const docRef = await addDoc(collection(db, getLangCollection(COLLECTIONS.COURSES, lang)), courseData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId, lang = 'en') => {
  try {
    await deleteDoc(doc(db, getLangCollection(COLLECTIONS.COURSES, lang), courseId));
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const saveAllCourses = async (courses, lang = 'en') => {
  try {
    const batch = writeBatch(db);
    courses.forEach(course => {
      const courseRef = doc(db, getLangCollection(COLLECTIONS.COURSES, lang), course.id);
      batch.set(courseRef, course);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error saving all courses:', error);
    throw error;
  }
};

// ===== INSTRUCTORS =====
export const getInstructors = async (lang = 'en') => {
  try {
    const instructorsRef = collection(db, getLangCollection(COLLECTIONS.INSTRUCTORS, lang));
    const snapshot = await getDocs(instructorsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return [];
  }
};

export const saveInstructor = async (instructor, lang = 'en') => {
  try {
    if (instructor.id) {
      await setDoc(doc(db, getLangCollection(COLLECTIONS.INSTRUCTORS, lang), instructor.id), instructor);
      return instructor.id;
    } else {
      const { id, ...instructorData } = instructor;
      const docRef = await addDoc(collection(db, getLangCollection(COLLECTIONS.INSTRUCTORS, lang)), instructorData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving instructor:', error);
    throw error;
  }
};

export const deleteInstructor = async (instructorId, lang = 'en') => {
  try {
    await deleteDoc(doc(db, getLangCollection(COLLECTIONS.INSTRUCTORS, lang), instructorId));
  } catch (error) {
    console.error('Error deleting instructor:', error);
    throw error;
  }
};

export const saveAllInstructors = async (instructors, lang = 'en') => {
  try {
    const batch = writeBatch(db);
    instructors.forEach(instructor => {
      const instructorRef = doc(db, getLangCollection(COLLECTIONS.INSTRUCTORS, lang), instructor.id);
      batch.set(instructorRef, instructor);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error saving all instructors:', error);
    throw error;
  }
};

// ===== BLOG POSTS =====
export const getBlogPosts = async (lang = 'en') => {
  try {
    const postsRef = collection(db, getLangCollection(COLLECTIONS.BLOG_POSTS, lang));
    const snapshot = await getDocs(postsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const saveBlogPost = async (post, lang = 'en') => {
  try {
    if (post.id) {
      await setDoc(doc(db, getLangCollection(COLLECTIONS.BLOG_POSTS, lang), post.id), post);
      return post.id;
    } else {
      const { id, ...postData } = post;
      const docRef = await addDoc(collection(db, getLangCollection(COLLECTIONS.BLOG_POSTS, lang)), postData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (postId, lang = 'en') => {
  try {
    await deleteDoc(doc(db, getLangCollection(COLLECTIONS.BLOG_POSTS, lang), postId));
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

export const saveAllBlogPosts = async (posts, lang = 'en') => {
  try {
    const batch = writeBatch(db);
    posts.forEach(post => {
      const postRef = doc(db, getLangCollection(COLLECTIONS.BLOG_POSTS, lang), post.id);
      batch.set(postRef, post);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error saving all blog posts:', error);
    throw error;
  }
};

// ===== THEME COLORS =====
export const getThemeColors = async (lang = 'en') => {
  try {
    const themeRef = doc(db, getLangCollection(COLLECTIONS.THEME_COLORS, lang), 'main');
    const snapshot = await getDoc(themeRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching theme colors:', error);
    return null;
  }
};

export const saveThemeColors = async (themeColors, lang = 'en') => {
  try {
    await setDoc(doc(db, getLangCollection(COLLECTIONS.THEME_COLORS, lang), 'main'), themeColors);
  } catch (error) {
    console.error('Error saving theme colors:', error);
    throw error;
  }
};

// ===== TRIAL SETTINGS =====
export const getTrialSettings = async (lang = 'en') => {
  try {
    const settingsRef = doc(db, getLangCollection(COLLECTIONS.TRIAL_SETTINGS, lang), 'main');
    const snapshot = await getDoc(settingsRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching trial settings:', error);
    return null;
  }
};

export const saveTrialSettings = async (settings, lang = 'en') => {
  try {
    await setDoc(doc(db, getLangCollection(COLLECTIONS.TRIAL_SETTINGS, lang), 'main'), settings);
  } catch (error) {
    console.error('Error saving trial settings:', error);
    throw error;
  }
};

// ===== SUBMISSIONS =====
export const getSubmissions = async (lang = 'en') => {
  try {
    const submissionsRef = collection(db, getLangCollection(COLLECTIONS.SUBMISSIONS, lang));
    const snapshot = await getDocs(query(submissionsRef, orderBy('timestamp', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
};

export const saveSubmission = async (submission, lang = 'en') => {
  try {
    const { id, ...submissionData } = submission;
    const docRef = await addDoc(collection(db, getLangCollection(COLLECTIONS.SUBMISSIONS, lang)), {
      ...submissionData,
      timestamp: submission.timestamp || new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving submission:', error);
    throw error;
  }
};

export const deleteSubmission = async (submissionId, lang = 'en') => {
  try {
    await deleteDoc(doc(db, getLangCollection(COLLECTIONS.SUBMISSIONS, lang), submissionId));
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
};

// ===== TRANSLATIONS =====
export const getTranslations = async (lang = 'en') => {
  try {
    const translationsRef = doc(db, getLangCollection(COLLECTIONS.TRANSLATIONS, lang), 'main');
    const snapshot = await getDoc(translationsRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching translations:', error);
    return null;
  }
};

export const saveTranslations = async (translations, lang = 'en') => {
  try {
    await setDoc(doc(db, getLangCollection(COLLECTIONS.TRANSLATIONS, lang), 'main'), translations);
  } catch (error) {
    console.error('Error saving translations:', error);
    throw error;
  }
};

// ===== PAGE CONTENT =====
export const getPageContent = async (lang = 'en') => {
  try {
    const pageContentRef = doc(db, getLangCollection(COLLECTIONS.PAGE_CONTENT, lang), 'main');
    const snapshot = await getDoc(pageContentRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
};

export const savePageContent = async (pageContent, lang = 'en') => {
  try {
    await setDoc(doc(db, getLangCollection(COLLECTIONS.PAGE_CONTENT, lang), 'main'), pageContent);
  } catch (error) {
    console.error('Error saving page content:', error);
    throw error;
  }
};

// ===== INITIALIZE DATA (Import from constants.tsx) =====
export const initializeFirestore = async (initialData) => {
  try {
    // Check if data already exists
    const existingCourses = await getCourses('en');
    if (existingCourses.length > 0) {
      console.log('Firestore already has data, skipping initialization');
      return false;
    }

    // Initialize data for both languages
    for (const lang of ['en', 'zh']) {
      const langData = initialData[lang];
      if (langData) {
        await saveAllCourses(langData.courses || [], lang);
        await saveAllInstructors(langData.instructors || [], lang);
        await saveAllBlogPosts(langData.blogPosts || [], lang);
        await saveThemeColors(langData.themeColors || {}, lang);
        await saveTrialSettings(langData.trialSettings || {}, lang);
        if (langData.pageContent) {
          await savePageContent(langData.pageContent, lang);
        }
      }
    }

    console.log('Firestore initialized with initial data');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};

// ===== GET ALL APP DATA =====
export const getAppData = async (lang = 'en') => {
  try {
    const [courses, instructors, blogPosts, themeColors, trialSettings, submissions, pageContent] = await Promise.all([
      getCourses(lang),
      getInstructors(lang),
      getBlogPosts(lang),
      getThemeColors(lang),
      getTrialSettings(lang),
      getSubmissions(lang),
      getPageContent(lang)
    ]);

    return {
      courses,
      instructors,
      blogPosts,
      themeColors: themeColors || {},
      trialSettings: trialSettings || {},
      submissions,
      pageContent: pageContent || null
    };
  } catch (error) {
    console.error('Error fetching app data:', error);
    throw error;
  }
};

// ===== SAVE ALL APP DATA =====
export const saveAppData = async (appData, lang = 'en') => {
  try {
    await Promise.all([
      saveAllCourses(appData.courses || [], lang),
      saveAllInstructors(appData.instructors || [], lang),
      saveAllBlogPosts(appData.blogPosts || [], lang),
      saveThemeColors(appData.themeColors || {}, lang),
      saveTrialSettings(appData.trialSettings || {}, lang),
      appData.pageContent ? savePageContent(appData.pageContent, lang) : Promise.resolve()
    ]);
  } catch (error) {
    console.error('Error saving app data:', error);
    throw error;
  }
};
