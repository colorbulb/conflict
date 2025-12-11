// Migration script to transfer data from constants.js to Firestore
// Run this once to migrate all data to Firestore
// Usage: Import and call migrateToFirestore() from browser console or a migration page

import {
  saveAllCourses,
  saveAllBlogPosts,
  saveTeam,
  saveTestimonials,
  saveSettings,
  savePageContent,
  saveSocialFeed,
  getCourses,
  getBlogPosts,
  getTeam,
  getTestimonials
} from './db.js';
import {
  INITIAL_COURSES,
  INITIAL_BLOG_POSTS,
  INITIAL_SOCIAL_FEED,
  INITIAL_SETTINGS,
  TEAM,
  TESTIMONIALS,
  INITIAL_PAGE_CONTENT
} from '../constants.js';

export const migrateToFirestore = async () => {
  try {
    console.log('Starting migration to Firestore...');
    
    const migrationData = {
      courses: INITIAL_COURSES,
      blogPosts: INITIAL_BLOG_POSTS,
      team: TEAM,
      testimonials: TESTIMONIALS,
      settings: INITIAL_SETTINGS,
      pageContent: INITIAL_PAGE_CONTENT,
      socialFeed: INITIAL_SOCIAL_FEED
    };

    // Check if data already exists
    const existingCourses = await getCourses();
    
    if (existingCourses.length > 0) {
      console.log('Firestore already has data. Use forceMigrate() to overwrite.');
      return { success: false, message: 'Data already exists in Firestore' };
    }

    // Migrate all data
    await saveAllCourses(migrationData.courses);
    console.log(`✓ Migrated ${migrationData.courses.length} courses`);
    
    await saveAllBlogPosts(migrationData.blogPosts);
    console.log(`✓ Migrated ${migrationData.blogPosts.length} blog posts`);
    
    await saveTeam(migrationData.team);
    console.log(`✓ Migrated ${migrationData.team.length} team members`);
    
    await saveTestimonials(migrationData.testimonials);
    console.log(`✓ Migrated ${migrationData.testimonials.length} testimonials`);
    
    await saveSettings(migrationData.settings);
    console.log('✓ Migrated settings');
    
    await savePageContent(migrationData.pageContent);
    console.log('✓ Migrated page content');
    
    await saveSocialFeed(migrationData.socialFeed);
    console.log(`✓ Migrated ${migrationData.socialFeed.length} social feed items`);

    console.log('✅ Migration completed successfully!');
    return { success: true, message: 'Migration completed successfully' };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { success: false, message: error.message, error };
  }
};

// Force migration (overwrites existing data)
export const forceMigrateToFirestore = async () => {
  try {
    console.log('Starting FORCE migration to Firestore (will overwrite existing data)...');
    
    const migrationData = {
      courses: INITIAL_COURSES,
      blogPosts: INITIAL_BLOG_POSTS,
      team: TEAM,
      testimonials: TESTIMONIALS,
      settings: INITIAL_SETTINGS,
      pageContent: INITIAL_PAGE_CONTENT,
      socialFeed: INITIAL_SOCIAL_FEED
    };

    // Force migrate all data (overwrites existing)
    await saveAllCourses(migrationData.courses);
    console.log(`✓ Migrated ${migrationData.courses.length} courses`);
    
    await saveAllBlogPosts(migrationData.blogPosts);
    console.log(`✓ Migrated ${migrationData.blogPosts.length} blog posts`);
    
    await saveTeam(migrationData.team);
    console.log(`✓ Migrated ${migrationData.team.length} team members`);
    
    await saveTestimonials(migrationData.testimonials);
    console.log(`✓ Migrated ${migrationData.testimonials.length} testimonials`);
    
    await saveSettings(migrationData.settings);
    console.log('✓ Migrated settings');
    
    await savePageContent(migrationData.pageContent);
    console.log('✓ Migrated page content');
    
    await saveSocialFeed(migrationData.socialFeed);
    console.log(`✓ Migrated ${migrationData.socialFeed.length} social feed items`);

    console.log('✅ Force migration completed successfully!');
    return { success: true, message: 'Force migration completed successfully' };
  } catch (error) {
    console.error('❌ Force migration failed:', error);
    return { success: false, message: error.message, error };
  }
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  window.migrateToFirestore = migrateToFirestore;
  window.forceMigrateToFirestore = forceMigrateToFirestore;
}

