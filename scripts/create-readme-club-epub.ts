/**
 * Create an EPUB about readme.club project
 * 
 * Run: npm run create-readme-club-epub
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore - JSZip is available via epubjs dependency
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const outputPath = path.join(projectRoot, 'public', 'readme-club.epub');

// EPUB content
const content = {
  title: 'Readme.club - The Xteink Community Hub',
  author: 'Florent Bertiaux (iamkxrz)',
  language: 'en',
  date: new Date().toISOString().split('T')[0],
  chapters: [
    {
      id: 'cover',
      title: 'Welcome to Readme.club',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Welcome to Readme.club</title>
  <style>
    body { font-family: serif; padding: 2em; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    h2 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    ul { margin-left: 1.5em; margin-bottom: 1em; }
    li { margin-bottom: 0.5em; }
    .intro { font-size: 1.2em; font-style: italic; margin-bottom: 2em; }
  </style>
</head>
<body>
  <h1>Readme.club</h1>
  <p class="intro">The Xteink Community Hub</p>
  <p>Welcome to Readme.club, your central resource for everything related to Xteink e-readers. This guide will introduce you to the platform, its features, and how it serves the global Xteink community.</p>
</body>
</html>`
    },
    {
      id: 'what-is',
      title: 'What is Readme.club?',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>What is Readme.club?</title>
  <style>
    body { font-family: serif; padding: 2em; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    h2 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    ul { margin-left: 1.5em; margin-bottom: 1em; }
    li { margin-bottom: 0.5em; }
  </style>
</head>
<body>
  <h1>What is Readme.club?</h1>
  
  <p>Readme.club (also known as the Xteink Community Hub) is an unofficial, community-driven platform created to serve Xteink e-reader users worldwide. Our mission is to centralize and facilitate access to community-contributed resources, language files, documentation, tools, wallpapers, and more.</p>
  
  <p>This platform is completely independent and not affiliated with Xteink or any official Xteink entity. All content is contributed by community members and moderated by volunteers.</p>
  
  <h2>Background</h2>
  
  <p>The project was founded in 2025 by Florent Bertiaux (known as u/iamkxrz on Reddit) to solve the problem of scattered resources. Before Readme.club, finding tools, guides, and community knowledge required searching through hundreds of Reddit posts and various websites.</p>
  
  <p>Readme.club provides a centralized hub where users can:</p>
  <ul>
    <li>Browse curated content from the community</li>
    <li>Submit their own contributions</li>
    <li>Access over 160 community-curated tips and tricks</li>
    <li>Download tools, wallpapers, and resources</li>
    <li>Connect with other Xteink users worldwide</li>
  </ul>
  
  <h2>What Makes Readme.club Unique</h2>
  
  <p>What makes Xteink Community Hub unique is its emphasis on:</p>
  <ul>
    <li><strong>Community safety:</strong> All resources are reviewed and verified</li>
    <li><strong>Transparency:</strong> Prominent disclaimers about unofficial nature</li>
    <li><strong>Comprehensive resources:</strong> Including a global user map showing the worldwide Xteink community distribution across 120+ countries</li>
    <li><strong>Multi-language support:</strong> Available in 5 languages (English, French, Spanish, Russian, Chinese)</li>
  </ul>
</body>
</html>`
    },
    {
      id: 'features',
      title: 'Key Features and Services',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Key Features and Services</title>
  <style>
    body { font-family: serif; padding: 2em; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    h2 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    ul { margin-left: 1.5em; margin-bottom: 1em; }
    li { margin-bottom: 0.5em; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Key Features and Services</h1>
  
  <h2>Resource Browser</h2>
  <p>Browse and download community-contributed language files, plugins, documentation, and tools. The resource browser allows you to:</p>
  <ul>
    <li>Search and filter resources by category</li>
    <li>Star your favorite resources for easy access</li>
    <li>Submit your own resources to help fellow users</li>
    <li>Download tools and utilities created by the community</li>
  </ul>
  
  <h2>Wallpaper Gallery</h2>
  <p>Discover beautiful wallpapers optimized for your Xteink X4 e-reader. The gallery features:</p>
  <ul>
    <li>Community-contributed wallpapers in 3:5 aspect ratio</li>
    <li>Browse by category or explore randomly</li>
    <li>Upload and share your own creations</li>
    <li>Download wallpapers optimized for the X4's 480×800 display</li>
  </ul>
  
  <h2>Font Preview</h2>
  <p>Preview and download custom fonts for your Xteink device:</p>
  <ul>
    <li>Live EPUB preview with different fonts</li>
    <li>Download fonts in both TTF and BIN formats</li>
    <li>Font information including size, line height, and source</li>
    <li>Curated selection of e-ink optimized fonts</li>
  </ul>
  
  <h2>Firmware Information</h2>
  <p>Comprehensive guide to official and community firmware options, including:</p>
  <ul>
    <li>CrossPoint Reader alternative firmware</li>
    <li>Detailed installation instructions</li>
    <li>Comparison tables between firmware options</li>
    <li>Tips and FAQ for firmware management</li>
  </ul>
  
  <h2>Tips & Tricks</h2>
  <p>Access over 160 curated tips from the r/xteinkereader community, organized by category:</p>
  <ul>
    <li>Setup and configuration</li>
    <li>File management</li>
    <li>EPUB optimization</li>
    <li>Reading customization</li>
    <li>Fonts and languages</li>
    <li>Connectivity and file transfer</li>
    <li>Battery life optimization</li>
    <li>Troubleshooting</li>
  </ul>
  
  <h2>Feature Request Board</h2>
  <p>Submit and vote on feature requests to help shape the future of Xteink devices:</p>
  <ul>
    <li>Browse community-requested features</li>
    <li>Vote on your favorite ideas</li>
    <li>Submit your own feature requests</li>
    <li>Track the status of feature requests</li>
  </ul>
  
  <h2>Global User Map</h2>
  <p>Visual representation of Xteink users worldwide, showing:</p>
  <ul>
    <li>Community distribution across 120+ countries</li>
    <li>Connect with users in your region</li>
    <li>Visualize the global reach of our community</li>
  </ul>
  
  <h2>Community Guides</h2>
  <p>Downloadable guides with comprehensive community knowledge:</p>
  <ul>
    <li>Complete Xteink X4 user guide</li>
    <li>EPUB optimization guides</li>
    <li>Font installation instructions</li>
    <li>Firmware update guides</li>
  </ul>
  
  <h2>News & Updates</h2>
  <p>Stay informed with the latest community news:</p>
  <ul>
    <li>Read articles from multiple authors</li>
    <li>Get updates on new features and announcements</li>
    <li>Community digest and summaries</li>
  </ul>
</body>
</html>`
    },
    {
      id: 'guide',
      title: 'Community Guide',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Community Guide</title>
  <style>
    body { font-family: serif; padding: 2em; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    h2 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    ul { margin-left: 1.5em; margin-bottom: 1em; }
    li { margin-bottom: 0.5em; }
  </style>
</head>
<body>
  <h1>Community Guide</h1>
  
  <p>Readme.club hosts a comprehensive community guide for the Xteink X4 e-reader. This guide covers everything from initial setup to advanced customization.</p>
  
  <h2>What's in the Guide</h2>
  
  <p>The community guide includes detailed information on:</p>
  
  <h2>1. Setup and Configuration</h2>
  <ul>
    <li>Where to purchase and getting started</li>
    <li>Unboxing and first steps</li>
    <li>Firmware update (critical first step)</li>
    <li>Initial hardware setup</li>
  </ul>
  
  <h2>2. Device Overview and Hardware</h2>
  <ul>
    <li>Physical dimensions and portability</li>
    <li>Display and screen technology</li>
    <li>Processor, OS, and system architecture</li>
    <li>Connectivity: WiFi and Bluetooth</li>
    <li>Storage: MicroSD card and capacity</li>
    <li>Buttons and physical controls</li>
    <li>Battery and power</li>
  </ul>
  
  <h2>3. File Management and Organization</h2>
  <ul>
    <li>Creating a logical folder structure</li>
    <li>Supported file types and formats</li>
    <li>MicroSD card formatting and optimization</li>
    <li>File organization best practices</li>
    <li>Backup and library management</li>
  </ul>
  
  <h2>4. EPUB Optimization</h2>
  <ul>
    <li>Why EPUB optimization matters</li>
    <li>Calibre: Essential tool</li>
    <li>EPUB optimization tools</li>
    <li>Common optimization steps</li>
    <li>Common issues and solutions</li>
    <li>Batch processing libraries</li>
  </ul>
  
  <h2>5. Reading Experience and Customization</h2>
  <ul>
    <li>Reading menu and features</li>
    <li>Text and display customization</li>
    <li>Lock screen and wallpapers</li>
    <li>Bookmarks and reading history</li>
    <li>Performance and page turning</li>
  </ul>
  
  <h2>6. Fonts and Languages</h2>
  <ul>
    <li>Built-in fonts</li>
    <li>Language support and international use</li>
    <li>Custom fonts: Resources and tools</li>
    <li>Installing custom .bin fonts</li>
    <li>Recommended community fonts</li>
    <li>Switching and managing multiple fonts</li>
  </ul>
  
  <h2>7. Connectivity and File Transfer</h2>
  <ul>
    <li>WiFi modes: Connecting to existing networks</li>
    <li>Hotspot mode: Creating a file transfer network</li>
    <li>File transfer via microSD card</li>
    <li>Bluetooth connectivity</li>
  </ul>
  
  <h2>8. Battery Life and Power Management</h2>
  <ul>
    <li>Battery capacity and real-world performance</li>
    <li>Charging specifications</li>
    <li>Sleep, standby, and power-off modes</li>
    <li>Battery maintenance and longevity</li>
  </ul>
  
  <h2>9. Troubleshooting and Common Issues</h2>
  <ul>
    <li>File recognition and storage issues</li>
    <li>Display and text rendering issues</li>
    <li>Navigation and functionality issues</li>
    <li>System performance issues</li>
  </ul>
  
  <p>For the complete guide, visit <strong>https://readme.club/guide</strong></p>
</body>
</html>`
    },
    {
      id: 'links',
      title: 'Important Links',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Important Links</title>
  <style>
    body { font-family: serif; padding: 2em; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    h2 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    ul { margin-left: 1.5em; margin-bottom: 1em; }
    li { margin-bottom: 0.5em; }
  </style>
</head>
<body>
  <h1>Important Links</h1>
  
  <h2>Readme.club</h2>
  <ul>
    <li><strong>Website:</strong> https://readme.club</li>
    <li><strong>Resources:</strong> https://readme.club/resources</li>
    <li><strong>Wallpapers:</strong> https://readme.club/wallpapers</li>
    <li><strong>Font Preview:</strong> https://readme.club/font-preview</li>
    <li><strong>Firmware:</strong> https://readme.club/firmware</li>
    <li><strong>Tips & Tricks:</strong> https://readme.club/tips</li>
    <li><strong>Community Guide:</strong> https://readme.club/guide</li>
    <li><strong>About:</strong> https://readme.club/about</li>
  </ul>
  
  <h2>Official Xteink Resources</h2>
  <ul>
    <li><strong>Official Website:</strong> https://www.xteink.com/</li>
    <li><strong>Official Support:</strong> support@xteink.com</li>
    <li><strong>Contact Page:</strong> https://www.xteink.com/pages/contact</li>
  </ul>
  
  <h2>Community Resources</h2>
  <ul>
    <li><strong>Reddit Community:</strong> https://www.reddit.com/r/xteinkereader/</li>
    <li><strong>Creator (u/iamkxrz):</strong> https://www.reddit.com/user/iamkxrz/</li>
  </ul>
  
  <h2>Tools and Utilities</h2>
  <ul>
    <li><strong>Web Font Maker:</strong> https://xteink.lakafior.com</li>
    <li><strong>ePaper Font Converter (iOS):</strong> https://apps.apple.com/us/app/dotink/id6754073002</li>
    <li><strong>Image to BMP Converter:</strong> https://aryascripts.github.io/page-apps/bmp-convert/</li>
    <li><strong>Calibre (Ebook Management):</strong> https://calibre-ebook.com/</li>
  </ul>
</body>
</html>`
    },
    {
      id: 'contributing',
      title: 'Contributing to Readme.club',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Contributing to Readme.club</title>
  <style>
    body { font-family: serif; padding: 2em; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    h2 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    ul { margin-left: 1.5em; margin-bottom: 1em; }
    li { margin-bottom: 0.5em; }
  </style>
</head>
<body>
  <h1>Contributing to Readme.club</h1>
  
  <p>The Xteink community welcomes participation! Readme.club is a volunteer-driven project, and contributions from the community are what make it valuable.</p>
  
  <h2>How You Can Contribute</h2>
  
  <h2>Share Your Discoveries</h2>
  <p>Share your discoveries, tips, and solutions on the Reddit community at https://www.reddit.com/r/xteinkereader/. Your experiences help other users and may be included in the community guide.</p>
  
  <h2>Contribute Tools or Scripts</h2>
  <p>Submit your own tools, scripts, or utilities to the community hub. Whether it's an EPUB optimizer, font converter, or any other helpful tool, the community benefits from shared resources.</p>
  
  <h2>Create and Share Custom Fonts</h2>
  <p>If you've created or optimized fonts for e-ink displays, share them with other users. The Font Preview page allows users to discover and download community-contributed fonts.</p>
  
  <h2>Write Guides or Tutorials</h2>
  <p>Create guides or tutorials for specific use cases. Whether it's a detailed setup guide, optimization tips, or troubleshooting walkthroughs, your knowledge helps others.</p>
  
  <h2>Answer Questions</h2>
  <p>Help newcomers in the community by answering questions. The Reddit community is active, and your expertise can make a real difference for new Xteink users.</p>
  
  <h2>Submit Resources</h2>
  <p>Submit resources through the Readme.club website:</p>
  <ul>
    <li>Language files</li>
    <li>Documentation</li>
    <li>Tools and utilities</li>
    <li>Plugins and scripts</li>
  </ul>
  
  <h2>Share Wallpapers</h2>
  <p>Create and share wallpapers optimized for the X4's 480×800 display. The wallpaper gallery is always looking for new contributions.</p>
  
  <h2>Report Issues</h2>
  <p>If you find errors, outdated information, or have suggestions for improvement, share them with the community. Feedback helps keep Readme.club accurate and useful.</p>
  
  <h2>Support the Project</h2>
  <p>Readme.club is maintained entirely by volunteers with no commercial affiliation. Supporting these efforts helps keep resources online and growing. Visit https://readme.club/about#funding to learn how to contribute.</p>
</body>
</html>`
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Disclaimer</title>
  <style>
    body { font-family: serif; padding: 2em; line-height: 1.6; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 1em; margin: 1em 0; }
  </style>
</head>
<body>
  <h1>Disclaimer</h1>
  
  <div class="warning">
    <p><strong>Important:</strong> Readme.club is an unofficial, community-driven platform. This project is not affiliated with, endorsed by, or connected to Xteink or any official Xteink entity.</p>
  </div>
  
  <p>All resources, tools, and content on Readme.club are provided "as-is" without warranties of any kind. Users install modifications and use resources at their own risk.</p>
  
  <p>Content is contributed by community members and moderated by volunteers. While we strive for accuracy, information may become outdated as firmware and features evolve. Always verify time-sensitive information directly with official sources.</p>
  
  <p>For official support, warranty information, and current specifications, always refer to:</p>
  <ul>
    <li>Official website: https://www.xteink.com/</li>
    <li>Official support: support@xteink.com</li>
    <li>Official contact page: https://www.xteink.com/pages/contact</li>
  </ul>
  
  <p>This is a volunteer, non-commercial project. No commercial affiliation with Xteink is implied.</p>
</body>
</html>`
    }
  ]
};

async function createEPUB() {
  console.log('📚 Creating Readme.club EPUB...\n');

  const zip = new JSZip();

  // mimetype (must be first, uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // META-INF/container.xml
  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  zip.file('META-INF/container.xml', containerXml);

  // OEBPS/content.opf
  const manifestItems = content.chapters.map((ch, idx) => 
    `    <item id="${ch.id}" href="${ch.id}.xhtml" media-type="application/xhtml+xml"/>`
  ).join('\n');

  const spineItems = content.chapters.map(ch => 
    `    <itemref idref="${ch.id}"/>`
  ).join('\n');

  const tocItems = content.chapters.map((ch, idx) => 
    `    <navPoint id="navpoint-${idx + 1}" playOrder="${idx + 1}">
      <navLabel><text>${ch.title}</text></navLabel>
      <content src="${ch.id}.xhtml"/>
    </navPoint>`
  ).join('\n');

  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" unique-identifier="book-id" xmlns="http://www.idpf.org/2007/opf">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${content.title}</dc:title>
    <dc:creator>${content.author}</dc:creator>
    <dc:language>${content.language}</dc:language>
    <dc:date>${content.date}</dc:date>
    <dc:identifier id="book-id">readme-club-${content.date}</dc:identifier>
    <meta property="dcterms:modified">${new Date().toISOString()}</meta>
  </metadata>
  <manifest>
${manifestItems}
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
${spineItems}
  </spine>
</package>`;
  zip.file('OEBPS/content.opf', contentOpf);

  // OEBPS/toc.ncx
  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="readme-club-${content.date}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${content.title}</text>
  </docTitle>
  <navMap>
${tocItems}
  </navMap>
</ncx>`;
  zip.file('OEBPS/toc.ncx', tocNcx);

  // OEBPS/*.xhtml (chapters)
  for (const chapter of content.chapters) {
    zip.file(`OEBPS/${chapter.id}.xhtml`, chapter.content);
  }

  // Generate EPUB
  const epubBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    mimeType: 'application/epub+zip'
  });

  await fs.writeFile(outputPath, epubBuffer);
  console.log(`✅ EPUB created: ${outputPath}`);
  console.log(`📄 Size: ${(epubBuffer.length / 1024).toFixed(2)} KB`);
}

createEPUB().catch(console.error);

