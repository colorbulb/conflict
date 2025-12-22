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
  PAGE_CONTENT: 'pageContent',
  LOOKUP_LISTS: 'lookupLists'
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
    // Prepare course data for Firestore: ensure icon is string and ageGroup is array
    const courseData = {
      ...course,
      icon: typeof course.icon === 'string' ? course.icon : 'coding', // Always save as string
      ageGroup: Array.isArray(course.ageGroup) ? course.ageGroup : (course.ageGroup ? [course.ageGroup] : []), // Ensure array
      headerBackgroundImage: course.headerBackgroundImage || null,
      headerBackgroundOpacity: course.headerBackgroundOpacity !== undefined ? course.headerBackgroundOpacity : 0.2
    };
    
    // Remove ReactNode icon if present (can't serialize to Firestore)
    if (typeof courseData.icon !== 'string') {
      courseData.icon = 'coding';
    }
    
    if (course.id) {
      await setDoc(doc(db, getLangCollection(COLLECTIONS.COURSES, lang), course.id), courseData);
      return course.id;
    } else {
      const { id, ...dataToSave } = courseData;
      const docRef = await addDoc(collection(db, getLangCollection(COLLECTIONS.COURSES, lang)), dataToSave);
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

import { Timestamp } from './timestamp.js';
export const saveSubmission = async (submission, lang = 'en') => {
  try {
    const { id, ...submissionData } = submission;
    const docRef = await addDoc(collection(db, getLangCollection(COLLECTIONS.SUBMISSIONS, lang)), {
      ...submissionData,
      timestamp: submission.timestamp && submission.timestamp.toDate ? submission.timestamp : Timestamp.now()
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

// ===== LOOKUP LISTS =====
export const getLookupLists = async (lang = 'en') => {
  try {
    const listsRef = doc(db, getLangCollection(COLLECTIONS.LOOKUP_LISTS, lang), 'main');
    const snapshot = await getDoc(listsRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching lookup lists:', error);
    return null;
  }
};

export const saveLookupLists = async (lists, lang = 'en') => {
  try {
    await setDoc(doc(db, getLangCollection(COLLECTIONS.LOOKUP_LISTS, lang), 'main'), lists);
  } catch (error) {
    console.error('Error saving lookup lists:', error);
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
        if (langData.lookupLists) {
          await saveLookupLists(langData.lookupLists, lang);
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

// ===== CUSTOM PAGES =====
// Unified custom pages (translations in one doc)
export const getCustomPages = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'custom_pages'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching custom pages:', error);
    return [];
  }
};


// Recursively remove undefined values from objects/arrays
function cleanObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject).filter(v => v !== undefined);
  } else if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        result[key] = cleanObject(value);
      }
    }
    return result;
  }
  return obj;
}

export const saveCustomPages = async (pages) => {
  try {
    console.log(`Saving ${pages.length} custom pages (unified translations)`);
    const batch = writeBatch(db);
    // Delete all existing pages in en_pages and zh_pages
    const existingEn = await getDocs(collection(db, 'en_pages'));
    const existingZh = await getDocs(collection(db, 'zh_pages'));
    console.log(`Deleting ${existingEn.docs.length} en_pages and ${existingZh.docs.length} zh_pages`);
    existingEn.docs.forEach(doc => batch.delete(doc.ref));
    existingZh.docs.forEach(doc => batch.delete(doc.ref));
    // Add new pages to both en_pages and zh_pages
    pages.forEach(page => {
      // English
      const enRef = doc(db, 'en_pages', page.id);
      const enData = { ...page.translations.en, id: page.id, slug: page.slug, createdAt: page.createdAt, updatedAt: page.updatedAt };
      batch.set(enRef, cleanObject(enData));
      // Traditional Chinese
      const zhRef = doc(db, 'zh_pages', page.id);
      const zhData = { ...page.translations.zh, id: page.id, slug: page.slug, createdAt: page.createdAt, updatedAt: page.updatedAt };
      batch.set(zhRef, cleanObject(zhData));
    });
    await batch.commit();
    console.log(`Successfully saved ${pages.length} custom pages to en_pages and zh_pages`);
  } catch (error) {
    console.error('Error saving custom pages:', error);
    throw error;
  }
};

// ===== MENU ITEMS =====
export const getMenuItems = async (lang = 'en') => {
  try {
    const snapshot = await getDocs(collection(db, `${lang}_menu`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching menu items (${lang}):`, error);
    return [];
  }
};

export const saveMenuItems = async (items, lang = 'en') => {
  try {
    console.log(`Saving ${items.length} menu items for language: ${lang}`);
    const batch = writeBatch(db);
    // Delete all existing items
    const existing = await getDocs(collection(db, `${lang}_menu`));
    console.log(`Deleting ${existing.docs.length} existing menu items`);
    existing.docs.forEach(doc => batch.delete(doc.ref));
    // Add new items
    items.forEach(item => {
      const ref = doc(db, `${lang}_menu`, item.id);
      batch.set(ref, item);
    });
    await batch.commit();
    console.log(`Successfully saved ${items.length} menu items`);
  } catch (error) {
    console.error(`Error saving menu items (${lang}):`, error);
    throw error;
  }
};

// ===== GET ALL APP DATA =====
export const getAppData = async (lang = 'en') => {
  try {
    const [courses, instructors, blogPosts, themeColors, trialSettings, submissions, pageContent, lookupLists] = await Promise.allSettled([
      getCourses(lang),
      getInstructors(lang),
      getBlogPosts(lang),
      getThemeColors(lang),
      getTrialSettings(lang),
      getSubmissions(lang),
      getPageContent(lang),
      getLookupLists(lang)
    ]);

    // Extract values from Promise.allSettled results, using fallbacks for rejected promises
    const getValue = (result, fallback) => result.status === 'fulfilled' ? result.value : fallback;

    // Get custom pages and menu items
    const [customPagesResult, menuItemsResult] = await Promise.allSettled([
      getCustomPages(lang),
      getMenuItems(lang)
    ]);

    return {
      courses: getValue(courses, []),
      instructors: getValue(instructors, []),
      blogPosts: getValue(blogPosts, []),
      themeColors: getValue(themeColors, {}),
      trialSettings: getValue(trialSettings, {}),
      submissions: getValue(submissions, []),
      pageContent: getValue(pageContent, null),
      lookupLists: getValue(lookupLists, null),
      customPages: getValue(customPagesResult, []),
      menuItems: getValue(menuItemsResult, [])
    };
  } catch (error) {
    console.error('Error fetching app data:', error);
    // Return empty structure instead of throwing, so we don't lose existing data
    return {
      courses: [],
      instructors: [],
      blogPosts: [],
      themeColors: {},
      trialSettings: {},
      submissions: [],
      pageContent: null,
      lookupLists: null
    };
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
