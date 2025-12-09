import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

// Create Supabase admin client directly
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createLaunchArticle() {

  // Generate slug with today's date
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateSuffix = `-${year}${month}${day}`;
  
  const title = "Welcome to Readme.club - The New Community Hub";
  const slug = `welcome-to-readme-club-the-new-community-hub${dateSuffix}`;

  const article = {
    title: title,
    slug: slug,
    excerpt: "We're excited to announce the launch of our new community platform, rebranded as Readme.club. Discover resources, wallpapers, feature requests, and more for Xteink users worldwide.",
    content: `# Welcome to Readme.club - The New Community Hub

We're thrilled to announce the launch of our completely redesigned community platform! After months of development, we're proud to introduce **Readme.club** - your new home for everything Xteink.

## What's New?

### Complete Rebranding
We've rebranded from the previous platform to **Readme.club**, reflecting our mission to be the central hub for the Xteink community. The new name represents our commitment to being the "read me" guide for all Xteink users.

### Enhanced Features

**Resource Sharing**
- Browse and download tools, utilities, and resources created by the community
- Submit your own resources to help fellow users
- Star your favorite resources for easy access

**Wallpaper Gallery**
- Discover beautiful wallpapers optimized for your Xteink device
- Upload and share your own creations
- Browse by category or explore randomly

**Feature Requests**
- Vote on community-requested features
- Submit your ideas for improving the Xteink ecosystem
- Track the status of feature requests

**News & Updates**
- Stay informed with the latest community news
- Read articles from multiple authors
- Get updates on new features and announcements

**Tips & Tricks**
- Comprehensive guides for getting the most out of your device
- Tips organized by category for easy navigation
- Community-contributed knowledge

**Global Community Map**
- See where Xteink users are located worldwide
- Connect with users in your region
- Visualize the global reach of our community

## Multi-Language Support

Readme.club is now available in **5 languages**:
- English
- Français (French)
- Español (Spanish)
- Русский (Russian)
- 中文 (Chinese)

All interface elements are translated, making the platform accessible to users worldwide. Resource descriptions remain in their original submission language to preserve authenticity.

## What's Next?

This is just the beginning! We have exciting plans for the future:

- More community features
- Enhanced search capabilities
- Better organization and categorization
- Regular community events and challenges

## Join Us!

We invite you to explore the new platform, share your resources, and become an active member of the Readme.club community. Together, we're building the best resource hub for Xteink users.

Thank you for being part of this journey!

---

*The Readme.club Team*`,
    author_name: "Readme.club Team",
    author_email: "team@readme.club",
    status: "draft",
    featured: false,
    published_at: null,
    hidden: false,
    views_count: 0,
  };

  const { data, error } = await supabaseAdmin
    .from('news')
    .insert(article)
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    process.exit(1);
  }

  console.log('✅ Article created successfully!');
  console.log(`Title: ${data.title}`);
  console.log(`Slug: ${data.slug}`);
  console.log(`Status: ${data.status}`);
  console.log(`ID: ${data.id}`);
  console.log(`\nYou can edit it at: /admin/news/${data.id}`);
}

createLaunchArticle().catch(console.error);

