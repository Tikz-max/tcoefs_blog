// Migration Utility: Transfer articles from blogPosts.js to Supabase
// Run this once to migrate existing articles to the database

import { supabase } from "../lib/supabase";
import { blogPosts } from "../data/blogPosts";

/**
 * Migrate all articles from blogPosts.js to Supabase
 * This function should be run ONCE from the browser console or a temporary admin page
 */
export const migrateArticlesToDatabase = async () => {
  console.log("Starting migration...");
  console.log(`Found ${blogPosts.length} articles to migrate`);

  const results = {
    success: [],
    failed: [],
  };

  for (const post of blogPosts) {
    try {
      console.log(`Migrating article ${post.id}: ${post.title}`);

      // Prepare article data
      const articleData = {
        id: post.id.toString(), // Convert to string for database
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        card_image_url: post.image, // Changed from post.cardImage to post.image
        date: post.date,
        read_time: post.readTime,
        featured: post.featured || false,
        slug: post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      };

      // Insert into Supabase
      const { error } = await supabase
        .from("articles")
        .insert(articleData)
        .select()
        .single();

      if (error) {
        console.error(`Failed to migrate article ${post.id}:`, error);
        results.failed.push({ id: post.id, error: error.message });
      } else {
        console.log(`✓ Successfully migrated article ${post.id}`);
        results.success.push(post.id);
      }
    } catch (err) {
      console.error(`Exception migrating article ${post.id}:`, err);
      results.failed.push({ id: post.id, error: err.message });
    }
  }

  console.log("\n=== Migration Complete ===");
  console.log(`✓ Successfully migrated: ${results.success.length} articles`);
  console.log(`✗ Failed: ${results.failed.length} articles`);

  if (results.failed.length > 0) {
    console.log("\nFailed articles:");
    results.failed.forEach((fail) => {
      console.log(`  - Article ${fail.id}: ${fail.error}`);
    });
  }

  return results;
};

/**
 * Check if articles have already been migrated
 */
export const checkMigrationStatus = async () => {
  try {
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error checking migration status:", error);
      return { migrated: false, count: 0, error };
    }

    console.log(`Found ${count} articles in database`);
    return { migrated: count > 0, count, error: null };
  } catch (err) {
    console.error("Exception checking migration status:", err);
    return { migrated: false, count: 0, error: err };
  }
};

/**
 * Clear all articles from database (use with caution!)
 */
export const clearAllArticles = async () => {
  const confirmation = window.confirm(
    "⚠️ WARNING: This will delete ALL articles from the database. Are you sure?",
  );

  if (!confirmation) {
    console.log("Operation cancelled");
    return { success: false, message: "Cancelled by user" };
  }

  try {
    const { error } = await supabase.from("articles").delete().neq("id", "");

    if (error) {
      console.error("Error clearing articles:", error);
      return { success: false, error };
    }

    console.log("✓ All articles cleared from database");
    return { success: true };
  } catch (err) {
    console.error("Exception clearing articles:", err);
    return { success: false, error: err };
  }
};

/**
 * HOW TO USE THIS MIGRATION SCRIPT:
 *
 * 1. Open your browser console (F12)
 * 2. Import the migration function:
 *    import { migrateArticlesToDatabase, checkMigrationStatus } from './utils/migrateArticles';
 *
 * 3. Check if articles are already migrated:
 *    await checkMigrationStatus();
 *
 * 4. Run the migration:
 *    await migrateArticlesToDatabase();
 *
 * 5. Verify the migration was successful by checking your Supabase dashboard
 *
 * ALTERNATIVE: Create a temporary admin page at /admin/migrate that runs this function
 */

// Export a function to add to admin panel temporarily
export const MigrationButton = () => {
  const handleMigrate = async () => {
    const status = await checkMigrationStatus();

    if (status.count > 0) {
      const confirm = window.confirm(
        `Database already contains ${status.count} articles. Do you want to migrate anyway? This may create duplicates.`,
      );
      if (!confirm) return;
    }

    const results = await migrateArticlesToDatabase();

    if (results.success.length > 0) {
      alert(`✓ Successfully migrated ${results.success.length} articles!`);
    }

    if (results.failed.length > 0) {
      alert(
        `⚠️ ${results.failed.length} articles failed to migrate. Check console for details.`,
      );
    }
  };

  return (
    <button
      onClick={handleMigrate}
      className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark"
    >
      Migrate Articles to Database
    </button>
  );
};
