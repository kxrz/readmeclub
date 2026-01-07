**November 2025 Edition**
## ⚠️ Important Disclaimer
This is an **unofficial, volunteer-compiled user guide** for the Xteink X4 e-reader, assembled in November 2025 from publicly available information, official documentation, and community experiences shared on Reddit. This is a **living document**—information may change as device firmware evolves and new features are released.
**Always verify time-sensitive information directly with:**
- **Official website:** https://www.xteink.com/
- **Official support:** [support@xteink.com](mailto:support@xteink.com)
- **Community:** https://www.reddit.com/r/xteinkereader/
**Warranty, support policies, pricing, and official specifications** are subject to change. This guide is for reference only; always defer to official sources for binding information.
## Why This Guide Exists & How to Use It
This guide was created to help Xteink X4 users (old and new) get the most out of their reading experience. While exploring the community, I noticed that most of the best tips, tricks, and troubleshooting advice were dispersed across hundreds of posts, making it hard for people to find key information quickly. By compiling these insights into one structured resource, the goal is to make setup, customization, and daily use as smooth as possible, and to save you countless hours scrolling or experimenting.
Use each section to get answers for setup, file management, accessories, and advanced tweaks. For even more community resources—custom fonts, batch converters, or user guides—visit the **Xteink Community Hub** at [https://readme.club/.](https://readme.club/.) And if you have questions or want to share your own solutions, join us on [https://www.reddit.com/r/xteinkereader/.](https://www.reddit.com/r/xteinkereader/.)
Thanks for checking out this guide. Hope it makes your Xteink X4 experience enjoyable and hassle-free!
— Florent ([iamkxrz](https://reddit.com/user/iamkxrz) on Reddit)
## TL;DR – 10 Essential Things Before You Begin
- **Purchase ONLY through the official [https://www.xteink.com/](https://www.xteink.com/) website.** Do not purchase from AliExpress or other third-party marketplaces. There is no official Xteink presence on AliExpress; devices purchased there are unsupported and may not be authentic.
- **Update firmware immediately after receiving your device** (Sync → System Update). Regular updates fix bugs, improve performance, and add features. Check [support@xteink.com](mailto:support@xteink.com) or r/xteinkereader for the latest information.
- **The community hub at [https://readme.club/](https://readme.club/) is your reference for tools, resources, and community guides.** This is maintained by volunteers and aggregates user-created resources, custom fonts, batch converters, wallpapers, and more.
- **EPUB files work best with Calibre optimization.** Use the **EPUB Workflow Plugin for Calibre** at /resources to batch-process EPUBs with one click. Check https://www.reddit.com/r/xteinkereader/ for the latest optimization guides.
- **Image and font support are limited.** Images must be ≤1024×1024 pixels and <2 MB. Custom fonts need special .bin format conversion. Use the **Web Font Maker** at https://xteink.lakafior.com to convert TTF fonts to .bin format online, or the **ePaper Font Converter** (iOS app) at [https://apps.apple.com/us/app/dotink/id6754073002.](https://apps.apple.com/us/app/dotink/id6754073002.)
- **File transfer works via WiFi hotspot or microSD card.** The hotspot method is most user-friendly. Always format your microSD to **exFAT** (not FAT32) to avoid file size issues.
- **There is no built-in frontlight.** The device is not readable in complete darkness. Use the official magnetic reading light or any standard book light if you need to read in low light.
- **Battery life is measured in weeks, not days.** E Ink technology is extremely efficient; WiFi and Bluetooth drain the most power. Most users report 2-4 weeks between charges with regular reading.
- **Warranty and support terms must be verified live** on https://www.xteink.com/pages/contact or by emailing [support@xteink.com](mailto:support@xteink.com) at the time you need support. Terms can change and community information is not binding.
- **For questions, problems, or to share discoveries, visit [https://www.reddit.com/r/xteinkereader/](https://www.reddit.com/r/xteinkereader/)** where the community and developers actively participate and answer questions.
## 1. Setup and Configuration
### Where to Purchase and Getting Started
**The only recommended source for purchasing the Xteink X4 is the official website: [https://www.xteink.com/](https://www.xteink.com/)**
This ensures you receive an authentic device with full manufacturer support, warranty coverage, and access to official customer service. Devices purchased from the official site include genuine hardware, pre-loaded firmware, and access to technical support through [support@xteink.com](mailto:support@xteink.com).
**AliExpress and third-party marketplaces are not official sales channels.** There is no official Xteink store on AliExpress or other platforms. Community members strongly advise against purchasing from these sources because:
- No guarantee of authenticity or genuine warranty support
- Unclear device history and firmware version
- Support requests may be redirected or ignored
- Returns and refunds are handled through marketplace policies, not the manufacturer
- Device firmware may be outdated
If you have already purchased from a third-party source, contact [support@xteink.com](mailto:support@xteink.com) to clarify your warranty status.
### Unboxing and First Steps
Upon receiving your Xteink X4 from the official website, you will find:
- The X4 e-reader device itself
- One 32GB microSD card (pre-installed in the device)
- USB-C charging cable and power adapter
- USB-A microSD card reader (for direct file transfer via computer)
- 2 MagSafe ring stickers (for phones without built-in MagSafe)
- 2 quality screen protectors
- Quick Start Guide (in the device's language of origin)
**Verify all items are present and undamaged immediately upon receipt.** Check that the microSD card is properly seated (push gently until it clicks into place) and that the device powers on when the Power button is held for 2-3 seconds.
### Firmware Update – Critical First Step
**The absolute first action after powering on your device should be to update the firmware.** Even if the device shipped with current firmware, checking for updates ensures you have the latest bug fixes, performance improvements, and feature additions. Firmware updates are delivered over-the-air (OTA) and are cumulative.
To update firmware:
- Press the Power button to turn on the device
- Connect to WiFi (Settings → WiFi) or use the built-in hotspot (192.168.3.3, password: 12345678)
- Navigate to Sync → System Update
- The device will check for available updates
- If an update is available, confirm and allow the installation to complete (usually 2-5 minutes)
- The device will restart automatically
**After the firmware update completes**, open any book file, press the OK button to access the menu, select "Index," and choose "Rebuild Index." This reindexing process ensures the device properly catalogs all your files and reading history.
Firmware updates typically arrive regularly with bug fixes and improvements. For the latest information, check https://www.reddit.com/r/xteinkereader/ or contact [support@xteink.com](mailto:support@xteink.com).
### Initial Hardware Setup
The Xteink X4 is exceptionally simple to set up physically. If your phone lacks built-in MagSafe support (phones before iPhone 12), apply the 2 MagSafe ring stickers to your phone or case. The X4 itself has integrated magnets on the back that align with the MagSafe standard, enabling immediate attachment to compatible phones, cases, and accessories.
Apply one or both of the included screen protectors to the front of the X4 if desired. Many users apply one immediately to protect against scratches during initial use, and save the second as a backup.
Charge the device for at least 30 minutes using the included USB-C cable before first use. You'll see a battery indicator on screen while charging. The device is ready to use once the charging graphic indicates a full battery.
## 2. Device Overview and Hardware
### Physical Dimensions and Portability
The Xteink X4 is engineered for extreme portability, making it one of the lightest and most compact dedicated e-readers available. The device weighs just **74 grams**—lighter than a deck of playing cards (94g), significantly lighter than any smartphone (modern phones weigh 150-250g), and only marginally heavier than two AA batteries combined (90g).
The physical dimensions are equally compact: **114mm × 69mm × 5.9mm** (approximately **4.49 × 2.72 × 0.23 inches**). These measurements mean the X4 is smaller than a standard credit card in both length and width, though slightly thicker. This combination of weight and size makes the device genuinely pocket-friendly—it fits comfortably in shirt breast pockets, jeans front pockets, jacket interior pockets, small messenger bags, or even large wallet compartments. Many users report carrying the X4 without noticing it's there.
The compact size enables reading scenarios impossible with larger e-readers: reading while standing on crowded public transit, reading while eating lunch at your desk, tucking it into a lanyard around your neck, or clipping it to a belt or bag strap. For travelers, the X4 replaces dozens of physical books (a typical EPUB is 1-3MB, so you fit 700-1000 books on the included 32GB microSD) while weighing less than a single paperback. Ultralight backpackers, digital nomads, and anyone prioritizing minimalism finds the X4 transformative.
### Display and Screen Technology
The Xteink X4 features a **4.3-inch electronic ink (E Ink) display** with a resolution of **480 × 800 pixels**, delivering **220 pixels per inch (PPI)**. This pixel density is sufficiently high to render text without visible pixelation at normal reading distances, creating sharp, crisp typography comparable to printed books.
The display technology is Electronic Paper (E Ink), which differs fundamentally from LCD and OLED screens used in phones and tablets. E Ink displays only consume power when changing the image (when you turn a page). Maintaining a static display uses essentially zero power—this is why battery life is measured in weeks rather than hours. The technology produces exceptional contrast and readability even in bright sunlight (unlike LCD/OLED which become washed out), while generating zero blue light (no sleep disruption from nighttime reading).
**Screen size implications:** At 4.3 inches, the screen is notably smaller than typical e-readers (most range from 6-8 inches). This results in displaying approximately 5-6 words per line and 13-15 lines of text simultaneously, depending on font size and margin settings. New users often express initial concern about this, but adaptation happens quickly—most users report comfortable reading after just one or two hours, and the forced focus of a smaller screen can actually reduce eye strain and improve concentration compared to larger displays. The frequent page turns create natural reading rhythm and break points.
The display is laminated (minimal air gap between the E Ink panel and protective glass), resulting in excellent contrast and a genuinely paper-like visual experience. The screen is flush with the device body (not recessed), contributing to the sleek aesthetic.
The X4 is available in two color options: **black** and **white**. The colors refer to the device body/bezel, not the screen itself (all E Ink displays appear as black text on white/gray background regardless). Both perform identically; the choice is entirely aesthetic.
### Processor, OS, and System Architecture
The Xteink X4 runs a **custom-designed, lightweight operating system** specifically optimized for reading. It is **not Android**, nor is it based on any other general-purpose mobile OS. This purpose-built approach means the device is exceptionally fast at its intended function (opening books, navigating chapters, rendering text) while maintaining week-long battery life because there's no OS overhead from apps, notifications, background services, or UI animations.
The device uses an **ESP32-based architecture**—a microcontroller platform known for WiFi/Bluetooth capabilities, low power consumption, and sufficient processing power for e-reader tasks.
The custom OS means the X4 is fundamentally focused: there are no distractions, notifications, background apps, or task switching. You turn it on to read; you turn it off when done. This simplicity is a feature, not a limitation—it creates what many users describe as the most distraction-free reading experience available.
### Connectivity: WiFi and Bluetooth
The Xteink X4 includes **WiFi connectivity supporting 802.11n (WiFi 4) on the 2.4 GHz frequency band only**. It does **not support 5 GHz networks** or newer WiFi 6 standards. This is important to know when troubleshooting WiFi issues.
WiFi on the X4 serves purposes including firmware updates and file transfer via hotspot.
The device also includes **Bluetooth support** primarily for connecting **wireless page-turner accessories**—small handheld devices with buttons that allow hands-free page navigation. Bluetooth connections persist between sessions once paired, so devices automatically reconnect when within range.
### Storage: MicroSD Card and Capacity
The Xteink X4 uses a **microSD card for all file storage**. The device comes with a **32GB microSD card pre-installed**, which is sufficient for most readers—capacity depends on file format and size, but typically accommodates **700-1000 ebooks** (average EPUB: 1-3MB; average TXT: smaller; illustrated books can be 10-50MB).
**Critical requirement: always format to exFAT**, not FAT32. This is because:
- FAT32 has a 4GB maximum file size per file, problematic for large TXT or EPUB files
- exFAT supports files of any size, is fully compatible with Windows/Mac/Linux, and maintains Unicode support for international filenames
- The X4 firmware fully supports exFAT with no compatibility issues
The microSD card is inserted into the **microSD slot on the left side of the device** (when holding it normally). Insert gently until you hear a click—this indicates proper seating. To remove, push slightly until you hear another click and the card pops out.
### Buttons and Physical Controls
The Xteink X4 employs an entirely **button-based control interface** with no touchscreen. This design choice has significant implications:
**Front buttons (4 total, arranged in two pairs):**
- **Left pair:** Back button (left side), OK/Confirm button (right side)
- **Right pair:** Up button (upper position), Down button (lower position)
These buttons function differently depending on context. In menus, Up/Down navigate options and OK confirms selections. During reading, Up/Down can turn pages or perform other assigned functions. Back always exits menus and returns to books.
**Side buttons (2 total, on right edge):**
- **Upper button:** Default = Previous Page
- **Lower button:** Default = Next Page
**Additional buttons:**
- **Power button** (top right corner) — short press wakes from sleep, long press powers on/off completely
- **Reset button** (recessed, left side near microSD slot) — used only for force-restart if device becomes unresponsive
The button-only interface takes perhaps 5-15 minutes to adapt to for users coming from touchscreen devices, but becomes intuitive quickly. Advantages include: no accidental touches while reading, more precise navigation control, the ability to read without touching the screen (avoiding fingerprints), functionality even with gloves, and clear tactile feedback.
### Battery and Power
The Xteink X4 houses a **650 mAh battery**. E Ink technology is so efficient that this modest battery delivers exceptional battery life—weeks of use on a single charge under normal reading conditions.
**Real-world battery life reports from the community:**
- **Light readers** (30-60 minutes daily): 4-6 weeks between charges
- **Moderate readers** (1-3 hours daily): 2-3 weeks between charges
- **Heavy readers** (4-5+ hours daily): 1-2 weeks between charges
- **Minimal use:** Users report going a month without charging
**Power consumption factors:**
- **Page turns** consume a small amount of power (the largest discretionary consumer)
- **WiFi connectivity** uses significant power when active; disable when not transferring files
- **Bluetooth** moderate drain when actively connected
- **Processor activity** minimal since there's no background OS activity
- **Display maintenance** nearly zero power—E Ink doesn't drain power maintaining a static image
## 3. Initial Configuration and First Use
### Language and Interface Settings
When you first power on the Xteink X4, you'll be prompted to select your preferred language. The device supports:
- **English**
- **Simplified Chinese (简体中文)**
- **Traditional Chinese (繁體中文)**
- **Japanese (日本語)**
Your language selection applies to the entire interface and persists even after firmware updates.
### WiFi Configuration
The Xteink X4 can operate in two WiFi modes: **connecting to an existing network** or **creating its own hotspot**.
#### **Connecting to Existing WiFi**
Navigate to Settings → WiFi Connection and select your network from the list. If your network doesn't appear, ensure it's broadcasting on the 2.4 GHz frequency band (not 5 GHz only). Use the on-screen keyboard to enter your password:
- OK button: Select letters
- Up/Down buttons: Navigate the character grid
- Back button: Delete/backspace
The device remembers this network for future automatic connections.
#### **Hotspot Mode**
The X4 can create its own WiFi network for file transfer without requiring external WiFi infrastructure. To enable:
- Navigate to Sync → WiFi Hotspot
- The device broadcasts a network named "E-Paper" (or similar)
- Default password: **12345678**
- Connect from any computer or phone to this network, then open a web browser to **192.168.3.3**
The hotspot provides a simple file upload interface accessible through any web browser.
### MicroSD Card and Storage Setup
**Format the microSD card to exFAT before first use** if you plan to upgrade from the included card. To format on Windows:
- Insert the card using a card reader
- Open File Explorer, right-click the drive
- Select "Format"
- Choose "exFAT" from the file system dropdown
- Click "Start"
On Mac, use Disk Utility; on Linux, use GParted or command-line tools. Once formatted, insert the card into the device until it clicks into place.
### Button Customization and Control Settings
Navigate to Settings → Customize Main Button to reassign the four front buttons to different functions. Settings → Swap Side Button reverses the page-turn buttons—useful for left-handed users or if you prefer navigation reversed.
Settings → Hold Power adjusts how long to press Power for on/off (prevents accidental shutdowns if you rest your hand on the device).
### Sleep and Auto-Off Timers
Configure power management through Settings:
- **Sleep Time:** How long without button presses before the screen turns off (recommended: 5-10 minutes)
- **Power-Off Timer:** Complete shutdown time (recommended: 20-30 minutes)
These settings optimize battery life while preventing unnecessary shutdowns during reading pauses.
### Firmware Update and Index Rebuild
After initial setup and any firmware update, navigate to any book file, press OK to open the menu, select "Index," and choose "Rebuild Index." This typically takes 30-60 seconds and should be performed after each major firmware update.
## 4. File Management and Organization
### Creating a Logical Folder Structure
The Xteink X4 scans for compatible files in the root directory of the microSD card and in any subfolders you create. Creating a logical folder structure dramatically improves navigation and experience, especially as your library grows.
**Organization approaches:**
- **By Genre:** Fiction, Non-Fiction, Science Fiction, Mystery, Romance, etc.
- **By Author:** Creates a folder for each author with all their works inside
- **By Status:** To-Read, Currently-Reading, Completed
- **By Language:** English, French, Spanish, etc.
- **Hybrid approach:** Fiction → Science Fiction → Asimov, for example
Files and folders display alphabetically in the Folder menu. Consider prefixing folder names with numbers for custom ordering: 01-To-Read, 02-Currently-Reading, 03-Completed.
### Supported File Types and Formats
**Books:**
- **EPUB** — recommended format, maintains formatting, table of contents, chapter navigation
- **TXT** — supported, plain unformatted text, excellent for simple content
**Images:**
- **JPG** — supported for wallpapers and in-EPUB illustrations
- **BMP** — supported for wallpapers and in-EPUB illustrations
**Fonts:**
- **Custom fonts (.bin)** — proprietary format for custom typography
**Not supported:**
- **PDF** — not natively readable; use Calibre to convert to EPUB first
- **Markdown (.md)** — convert to TXT or EPUB using Calibre or the **Markdown to ePub** converter at /resources
- **Other formats** (MOBI, AZW, DOCX, etc.) — convert using Calibre
### MicroSD Card Formatting and Optimization
Always format microSD cards to **exFAT** using your computer before inserting into the X4. The device works with the included 32GB card but will also accept larger cards (verify with the community on r/xteinkereader for current recommendations).
**File system details:**
- exFAT: No maximum file size per file, supports Unicode filenames, fully compatible with Windows/Mac/Linux
- FAT32: Maximum 4GB per file (problematic for large TXT files)
- **Recommendation:** Always use exFAT for new cards
### File Organization Best Practices
Place book files either in the root directory or in organized subfolders. The device displays up to 100-200 files per folder comfortably; more can cause slight menu lag. For very large libraries:
- Create 10-20 top-level folders
- Distribute books across folders to keep folder sizes manageable
- Use meaningful folder names for quick navigation
### Backup and Library Management
Maintain backup copies of your ebook library on your computer or cloud storage. This protects against:
- MicroSD card failure or corruption
- Accidental file deletion
- Device loss or damage
## 5. EPUB Optimization and File Preparation
### Why EPUB Optimization Matters
EPUBs vary tremendously in quality, formatting, and structure. Some are carefully crafted by professional publishers; others are hastily scanned and OCR'd. Files from different sources may have malformed HTML, inconsistent formatting, broken table of contents, embedded fonts that conflict with the X4's rendering, unused CSS styling that bloats file size, or typographical inconsistencies.
Optimizing EPUBs before transferring them to the X4 prevents most common display and navigation issues.
### Calibre: Essential Tool
**Calibre** is a free, open-source ebook management application available for Windows, Mac, and Linux. Download from https://calibre-ebook.com/
### EPUB Optimization Tools
The community has created several tools to streamline EPUB optimization:
**1. EPUB Workflow Plugin for Calibre** (One-click optimization)
- 🔗 [Resources](/resources)
- **GitHub:** [https://github.com/kxrz/calibre_workflow](https://github.com/kxrz/calibre_workflow)
- **Features:** Batch-processes EPUBs with one click, repairs, optimizes, and cleans ebook files automatically, creates backups, works on all platforms, resizes images
- **Installation:** Download the ZIP file, in Calibre go to Preferences → Plugins → Load plugin from file, select the ZIP, restart Calibre
- **Best for:** Users wanting complete automation in one click
**2. EPUB Batch Workflow (Python Script)** (For advanced users)
- 🔗 [Resources](/resources)
- **GitHub:** [https://github.com/kxrz/calibre_workflow](https://github.com/kxrz/calibre_workflow)
- **Features:** Interactive CLI menu, single file or batch processing, recursive directory scanning, full workflow automation with verbose logging
- **Best for:** Users processing large libraries or nested folder structures
**3. Markdown to ePub Converter** (For converting Markdown files)
- 🔗 [Resources](/resources)
- **GitHub:** [https://github.com/kxrz/md_to_epub](https://github.com/kxrz/md_to_epub)
- **Features:** Converts Markdown files to beautifully formatted ePub books with interactive terminal interface
- **Best for:** Writers and note-takers wanting to convert Markdown documents to readable ebooks
### Common EPUB Optimization Steps
If using Calibre manually, common optimization steps include:
- **Repair HTML** — fixes broken or malformed HTML tags and structural issues
- **Beautify All Files** — reformats internal HTML and CSS for consistency
- **Delete Unused CSS** — removes CSS rules that aren't applied to content, reducing file size
- **Smarten Punctuation** — converts straight quotes to curly quotes and fixes em-dashes
- **Check File** — validates no remaining errors or warnings
### Common Issues and Solutions
**Word spacing problems in English:** Ensure you're running the latest firmware. If you're already on current firmware, try re-optimizing the EPUB and pay special attention to punctuation normalization.
**Books starting at wrong chapter:** Use Calibre to Repair HTML, which usually fixes internal navigation structure.
**Missing or incorrect images:** Images must be ≤1024×1024 pixels and <2 MB. Use Calibre to view and resize images if needed.
**Font-related issues:** The X4 uses its own fonts; embedded fonts in EPUBs can cause conflicts. Use Calibre to strip embedded fonts, allowing the X4's native fonts to render all text.
**Characters appearing as boxes/question marks:** The font is missing glyphs for those characters. Switch to a custom font that includes the necessary character set.
### Batch Processing Libraries
For large existing libraries, process files in batches using Calibre or the community tools:
- Use the **EPUB Workflow Plugin** or **EPUB Batch Workflow** script
- Select all your EPUB files
- Run the automated optimization
- Transfer the optimized batch to the X4
## 6. Reading Experience and Customization
### Reading Menu and Features
Press the OK button while reading to access the reading menu. Available options include:
- **Bluetooth** — connect to page-turner accessories
- **Auto Flip** — automatic page turning at set intervals (0-9 seconds)
- **Chapter Navigation** — jump to previous/current/next chapter or forward up to 100 chapters
- **Progress Bar** — display percentage through the book
- **Go To** — jump directly to any specific page number
- **Night Mode** — switch between light and dark display modes
- **Index Rebuild** — refresh file index
- **Direction** — toggle between portrait and landscape orientation
- **Font** — switch between installed fonts without restarting the book
### Text and Display Customization
The X4 offers limited but functional customization:
**Font size:** Adjust via default menu or switch between fonts with different base sizes.
**Orientation:** Portrait (default) and landscape both supported. The device can also rotate 180° for reading upside-down.
**Dark mode:** Toggle between light background (black text on white) and dark mode (white/light text on black background).
### Lock Screen and Wallpapers
When powered off, the X4 displays a custom image or automatically displays the cover of the last EPUB you read. To set a custom lock screen:
- Navigate to Settings → Power-off Screen → Custom
- Select any JPG or BMP image from your Folder
- Image should be roughly 480×800 pixels
**Community-shared wallpapers:** Visit https://readme.club/ to download pre-made BMP wallpapers, or use the **Image to BMP Converter** at https://aryascripts.github.io/page-apps/bmp-convert/ to convert any image to BMP format for your lock screen.
### Bookmarks and Reading History
The X4 automatically saves your reading position in the **last 20 books you've opened**. Resuming any book in your history returns you to your exact last-read location.
**Custom bookmarks:** The device saves your current position as you read, but custom bookmarks within individual books are not supported in current firmware. This is a frequently requested feature.
### Performance and Page Turning
The X4 handles large books (1000+ pages) without performance degradation. Page turns remain instantaneous whether reading a 200-page novella or a 1000-page epic fantasy novel. The indexing system is well-optimized.
## 7. Fonts and Languages
### Built-in Fonts
The Xteink X4 ships with **two default fonts** pre-installed and optimized for E Ink display:
- A serif font (similar to Times New Roman)
- A sans-serif font (similar to Arial)
Both fonts are available in multiple sizes and include complete glyphs for English, Simplified Chinese, Traditional Chinese, and Japanese.
### Language Support and International Use
The Xteink X4 officially supports **four interface and reading languages**:
- English
- Simplified Chinese (简体中文)
- Traditional Chinese (繁體中文)
- Japanese (日本語)**
Community members have successfully tested various other languages with the default font. For languages requiring specialized character sets (Arabic, Hebrew, Thai, Korean, Devanagari, etc.), you need to convert a TTF (TrueType Font) file containing all necessary glyphs to the X4's .bin format.
### Custom Fonts: Resources and Tools
The community has created several tools to generate custom .bin fonts:
**1. Web Font Maker** (Browser-based, recommended for beginners)
- **URL:** https://xteink.lakafior.com
- **Features:** Web-based, no installation needed, live preview, font gallery to browse and download pre-made fonts
- **Process:**
- Open https://xteink.lakafior.com
- Upload your TTF or OTF font file
- Adjust font settings (size, spacing, weight, optical alignment)
- Preview in real-time
- Generate .bin file or upload to gallery for others
- **Best for:** Users wanting easy, visual control over font settings
**2. ePaper Font Converter** (iOS app)
- **URL:** https://apps.apple.com/us/app/dotink/id6754073002
- **Features:** Convert fonts directly on iPhone/iPad, preview rendering simulating e-ink display, customize character spacing, line height, size, weight
- **Supports:** XTEINK X4, MoFei 3.7, WuDaDa-XiaoMo
- **Best for:** iPhone/iPad users wanting all-in-one font conversion on their phone
**3. Analysis of XT4 Firmware - Font System Documentation** (For advanced users)
- 🔗 [Resources](/resources)
- **Content:** Deep technical documentation of font system, extraction techniques, and experimental approaches
- **Best for:** Developers interested in understanding font architecture
### Installing Custom .bin Fonts
**How to install pre-made .bin fonts:**
- Download the .bin file from the community hub or tools above
- Place it in the root directory of your microSD card or in a dedicated "Fonts" folder
- Navigate to Folder on the device and find the font file
- Long-press on the font filename to see options:
- **Preview** — see how the font looks
- **Set as reading font** — make it the default for new books
- **Restore default** — revert to built-in fonts
- **Delete** — remove from device
### Recommended Community Fonts
The hub features pre-converted fonts including:
- **Literata** (multiple sizes) — elegant serif font for classic reading
- **ABeeZee** — supports English, Spanish, Portuguese, Italian, Dutch, Swedish, Danish, Finnish, Norwegian, Icelandic, German
- **Azeret** — monospaced condensed font
- Various others shared by the community
### Switching and Managing Multiple Fonts
You can install multiple fonts on your X4. While reading, press OK → Font to instantly switch between any installed font without restarting the book.
## 8. Connectivity and File Transfer
### WiFi Modes: Connecting to Existing Networks
The X4 can connect to standard WiFi networks (2.4 GHz only) for firmware updates and potentially future features.
**To connect to WiFi:**
- Navigate to Settings → WiFi Connection
- Select your network from the list (must be 2.4 GHz)
- Use the on-screen keyboard to enter password
- Confirm and wait for connection
**Troubleshooting WiFi:**
- Network not appearing? Ensure it broadcasts on 2.4 GHz, not 5 GHz only
- Won't connect? Verify password is correct, move closer to router, restart both router and X4
- Update download stuck? Switch to a different network or use hotspot mode instead
### Hotspot Mode: Creating a File Transfer Network
The X4 can create its own WiFi hotspot for file transfer without requiring external WiFi infrastructure.
**To enable hotspot:**
- Navigate to Sync → WiFi Hotspot
- Device broadcasts network "E-Paper" (or similar)
- Default password: **12345678**
**To transfer files via hotspot:**
- On your computer or phone, connect to the "E-Paper" WiFi network
- Open a web browser and navigate to **192.168.3.3**
- A file upload interface appears
- Select files from your computer and upload directly to X4's microSD
- Files appear in your Folder menu
### File Transfer via MicroSD Card
The traditional file transfer method using the included USB-A microSD card reader:
**Method:**
- Power off the X4
- Remove the microSD card
- Insert the microSD into the USB-A reader
- Connect reader to your computer's USB port
- Drag and drop files into folders on the card
- Eject the drive safely
- Insert card back into X4 until it clicks
- Power on; device automatically scans for new files
This method is reliable, fast, and works offline.
### Bluetooth Connectivity
Bluetooth on the X4 is primarily used for connecting **wireless page-turner accessories**—small handheld devices with buttons allowing hands-free page navigation.
**To connect Bluetooth:**
- Press OK while reading to open menu
- Select "Bluetooth"
- Choose "Scan for new devices"
- Pair your page-turner when it appears
- Once paired, devices auto-reconnect when powered on and in range
## 9. Battery Life and Power Management
### Battery Capacity and Real-World Performance
The Xteink X4 houses a **650 mAh lithium-ion battery**. E Ink technology's extreme efficiency results in exceptional battery life. The battery only drains when actively using power (page turns, WiFi, Bluetooth); displaying static text uses virtually zero power.
### Charging Specifications
Charge the X4 using **any standard USB-C cable and adapter**:
- Compatible with any USB charger (phone chargers, power banks, computer USB ports)
- Supports standard USB power delivery protocols
- Automatically regulates charging speed
**Charging times:**
- 0-100% with standard 5V/1A adapter: approximately 2-3 hours
### Sleep, Standby, and Power-Off Modes
The X4 offers three power states, each with different power consumption:
**Sleep Mode (Screen Off):**
- Activated after configurable inactivity time
- Screen turns off; device remains responsive
- Power consumption: minimal
- Reading position: fully preserved
- Reactivate: any button press wakes device
**Standby/Complete Power-Off:**
- Initiated by holding Power button for configured duration
- Device shuts down completely
- Power consumption: battery maintains charge for weeks/months
- Lock screen displays: the cover of your last-read book (or custom wallpaper)
- Reading progress: fully preserved
**Settings for optimal power management:**
- Sleep Time: 5-10 minutes
- Power-Off Timer: 20-30 minutes
### Battery Maintenance and Longevity
**Normal use:** Simply charge when convenient; the device's low power consumption means charging is infrequent.
**Battery lifespan degradation:** Expect capacity loss over time. Most users find the device's battery acceptable for 2-3 years of regular use.
**If battery capacity degrades significantly** (from 2-3 weeks to several days with same usage):
- Ensure you're running latest firmware
- Check WiFi/Bluetooth not constantly enabled
- Verify no unusual power draw
- If problems persist, contact [support@xteink.com](mailto:support@xteink.com) about battery service or replacement
**Extend battery between charges:**
- Disable WiFi when not transferring files
- Disable Bluetooth if not using page-turners
- These measures can extend battery life by 30-50%
## 10. Accessories and Attachments
### Official Xteink Accessories
Xteink offers three officially-designed accessories specifically optimized for the X4:
**Magnetic Case:**
- Attaches magnetically to the X4's back (no adhesive; perfectly removable)
- Integrated stand for hands-free reading at desks or tables
- Comprehensive protection from drops, scratches, and impacts
- Doesn't interfere with MagSafe functionality
**Magnetic Reading Light:**
- Magnetic attachment to device (no adhesive; fully removable)
- Continuous brightness adjustment (no discrete steps; smooth dimming)
- Dual color temperature: warm white and cool white switchable
- Flexible positioning
- USB-rechargeable battery
**MagSafe Ring Stickers (2 included):**
- Adhesive stickers adding MagSafe magnets to phones/cases
- Allow attachment of X4 to phones without built-in MagSafe
All accessories are available directly from https://www.xteink.com/
### MagSafe and Magnetic Attachment
The X4 has integrated magnets on its back, enabling attachment to any MagSafe-compatible device, surface, or accessory.
**Compatible devices:**
- iPhone 12 and newer (built-in MagSafe magnets)
- Any phone or case with attached MagSafe ring sticker
**Magnetic attachment strength:**
- Strong enough for normal handling, walking, casual movement
- Weak enough that the lightweight X4 detaches rather than pulling down heavy phones (safety feature)
- Detaching and re-attaching won't damage X4 or phone
**Use cases enabled by MagSafe:**
- Attach X4 to back of phone for reading while browsing on front
- Use iPhone's kickstand to prop both phone and X4 together
- Attach to phone held in front-facing car mount for passenger reading
- Quick switching between phone tasks and reading
**Note on magnetic field:** The magnetic field does not interfere with WiFi, Bluetooth, microSD, or any device functions.
## 11. Buttons, Controls, and Navigation
### Button Layout and Primary Functions
The Xteink X4 employs seven physical buttons for all navigation and control:
**Front Panel (4 buttons):**
- **Top-Left: Back Button** — exits menus, returns to books
- **Top-Right: OK/Confirm Button** — selects menu options, opens menus
- **Bottom-Left: Up Button** — navigates up in menus
- **Bottom-Right: Down Button** — navigates down in menus
**Right Side (2 buttons):**
- **Upper Button (Default: Previous Page)** — turn pages backward
- **Lower Button (Default: Next Page)** — turn pages forward
**Additional Buttons:**
- **Power Button** — short press: sleep/wake; long press: power on/off
- **Reset Button** (recessed, left side) — emergency force-restart if device unresponsive
### Context-Sensitive Button Functions
Button functions change based on context:
**While Reading:**
- Up/Down buttons (or side buttons): turn pages
- OK button: open reading menu
- Back button: return to book list
- Power button: enter sleep mode (short press) or power off (long press)
**In Menus:**
- Up/Down buttons: navigate options
- OK button: select/confirm option
- Back button: exit menu, return to previous screen
### Button Customization via Settings
Navigate to **Settings → Customize Main Button** to reassign the four front buttons. **Settings → Swap Side Button** reverses the page-turn button meanings—useful for left-handed users.
### Advanced Button Techniques
**Bookmarking:** While reading, press and hold the OK button. A brief flash animation appears confirming a bookmark was added.
**Quick Menu Exit:** Press and hold Back button to rapidly exit nested menus and return directly to reading.
**Soft Reset:** Press the reset button once, then immediately press and hold Power button. Device restarts.
### Adaptability and Learning Curve
The button-only interface takes approximately 5-15 minutes to adapt to if you're coming from touchscreen devices. Most users report quick muscle-memory development and preference for buttons after adaptation.
## 12. Troubleshooting and Common Issues
### File Recognition and Storage Issues
**MicroSD card not recognized:**
- Ensure card is inserted fully and clicks into place
- Remove and reinsert
- Try card in computer to verify it's not defective
- Format card to exFAT using computer; reinsert in X4
- Try a different brand card
**Specific files don't appear:**
- Ensure files are in a folder the device scans (root directory or subfolders)
- Check file extensions are supported (.epub, .txt, .jpg, .bmp)
- If file was recently transferred, rebuild index
**File appears but won't open:**
- EPUB: Optimize with Calibre or use the EPUB Workflow Plugin
- TXT: If in non-UTF-8 encoding, try converting to UTF-8
- Check file isn't zero bytes (empty)
### Display and Text Rendering Issues
**Characters display as boxes/question marks:**
- Current font is missing glyphs for those characters
- Switch to a different font
- Check the community hub for fonts supporting your language
**Word spacing issues or text alignment problems:**
- Ensure firmware is latest version (newer versions improve English hyphenation)
- Update firmware if necessary
- Re-optimize EPUB with Calibre workflow
**Images in EPUB don't display:**
- Verify images are JPG or BMP format
- Check image dimensions (≤1024×1024 px) and size (<2 MB)
- Update to latest firmware for improved image support
- Re-optimize EPUB and re-transfer to device
### Navigation and Functionality Issues
**Specific EPUB won't open or shows errors:**
- Convert EPUB to TXT using Calibre (strips formatting but preserves text)
- Or re-optimize EPUB with Calibre workflow and re-transfer
- Or delete file and re-download from source
**EPUB starts at wrong chapter:**
- Use Calibre → Repair HTML to fix internal structure
**Chapter navigation doesn't work:**
- Book may lack proper table of contents
- Use Calibre to repair and rebuild internal structure
### System Performance Issues
**Device freezes or becomes unresponsive:**
- First attempt: soft reset (press reset button, then hold Power to restart)
- This resolves ~90% of freeze issues
- If still frozen, let battery drain completely, then charge and restart
**Menu navigation is slow or laggy:**
- Disable WiFi and Bluetooth
- Reduce number of files in current folder
- Rebuild index
- Update firmware
## 13. Performance Optimization
### EPUB File Optimization
Before transferring books to your X4, use the community tools:
- **EPUB Workflow Plugin for Calibre:** /resources
- **EPUB Batch Workflow Script:** /resources
### Library Organization and File Structure
**Optimal file structure:**
- Root directory with 10-20 top-level folders
- Each folder contains 100-200 books maximum
- Meaningful folder names for quick navigation
**Performance benefits:**
- Folder menu displays faster with fewer items
- Navigation is more intuitive
### Firmware Maintenance
- **Update regularly** — firmware updates include performance optimizations
- **Rebuild index after updates** — ensures proper catalog refresh
- **Check community** — r/xteinkereader discusses performance improvements in each update
## 14. Advanced Features
### Custom Lock Screen Wallpapers
Customize your X4's lock screen:
**Process:**
- Prepare a JPG or BMP image (~480×800 pixels for best fit)
- Use **Image to BMP Converter** at https://aryascripts.github.io/page-apps/bmp-convert/ if needed
- Transfer image to device via hotspot or microSD
- Navigate to Settings → Power-off Screen → Custom
- Select your image from Folder
- Power off device
**Community wallpapers:** Download pre-made BMP wallpapers from /resources or browse the hub for other screensaver options.
### Button Remapping
Beyond the basic Customize Main Button feature, you can create custom button configurations through settings.
### WiFi Hotspot Advanced Usage
Beyond basic file transfer, the hotspot can be used for:
- Shared reading (transfer books to friend's X4)
- Batch library transfers (upload multiple files simultaneously)
## 15. Supported Content Formats
### Primary Formats
**EPUB (Electronic Publication):**
- Standard for ebooks; most compatible format for X4
- Supports formatting, table of contents, chapter navigation
- Can include embedded images
- Best results after Calibre optimization
**TXT (Plain Text):**
- Simple unformatted text; fully supported
- Excellent for straightforward content
- UTF-8 and GBK encoding supported
- No table of contents or chapter navigation
### Image Formats
**JPG and BMP:**
- Can be displayed as lock screen wallpapers
- Can be embedded within EPUB files
- Supported specs: ≤1024×1024 pixels, <2 MB, 3:5 aspect ratio preferred
### Font Formats
**Custom .bin Fonts:**
- Proprietary format for custom typography
- Converted from TTF using community tools
### Unsupported Formats
**PDF:**
- **NOT natively supported**
- **Solution:** Convert to EPUB using Calibre first
**Markdown (.md):**
- **NOT natively supported**
- **Solution:** Use the **Markdown to ePub** converter at /resources
**Other Formats (MOBI, AZW, DOCX, etc.):**
- Not natively supported
- Use Calibre to convert to EPUB or TXT
## 16. FAQ and Community Answers
### Frequently Asked Questions
**Q: Can I read in complete darkness?**
A: No. E Ink requires ambient light to display. Use a book light for dark environments.
**Q: How does battery life compare to phones?**
A: E Ink is radically more efficient than LCD/OLED. X4 lasts 2-4 weeks; phones typically last a day.
**Q: Can I read PDFs?**
A: Not directly, but Calibre can convert PDFs to EPUB, which then works on X4.
**Q: How do I transfer files?**
A: Two methods: (1) WiFi hotspot or (2) MicroSD card reader. Hotspot is most user-friendly.
**Q: Can I use page-turners?**
A: Yes. Bluetooth page-turners using standard keyboard protocols work.
**Q: Is there a warranty?**
A: Yes, but verify current terms directly at https://www.xteink.com/pages/contact or contact [support@xteink.com](mailto:support@xteink.com). Terms may change.
**Q: Where do I get books?**
A: Project Gutenberg (free classics), library lending (Libby/OverDrive), and DRM-free indie stores (Smashwords, Draft2Digital).
### Where to Find Additional Help
**Official Resources:**
- Website: https://www.xteink.com/
- Contact: [support@xteink.com](mailto:support@xteink.com)
- Support pages: https://www.xteink.com/pages/contact
**Community Resources:**
- Reddit: https://www.reddit.com/r/xteinkereader/ — active community with developer participation
- Community Hub: https://readme.club/ — fonts, guides, tools, resources
## 17. Contributing and Resources
### About This Guide
This guide is a **collaborative, volunteer-driven project** compiled from official documentation, real-world user experiences, and community wisdom. It represents a snapshot of information as of **November 2025**. Firmware updates, new features, and community discoveries continue to evolve.
### Supporting the Community
The community hub and guides like this one are maintained entirely by volunteers with no commercial affiliation. Supporting these efforts helps keep resources online and growing.
### Getting Involved
The Xteink community welcomes participation:
- **Share your discoveries** on https://www.reddit.com/r/xteinkereader/
- **Contribute tools or scripts** to the community hub
- **Create and share custom fonts** with other users
- **Write guides or tutorials** for specific use cases
- **Answer questions** in the community to help newcomers
## 18. Complete Sources and Credits
### Official Sources
- **Official Website:** https://www.xteink.com/
- **Official Support Email:** [support@xteink.com](mailto:support@xteink.com)
- **Contact Page:** https://www.xteink.com/pages/contact
- **Shipping Policy:** https://www.xteink.com/pages/shipping-policy
- **Exchange & Return:** https://www.xteink.com/pages/exchange-return
- **Official PDF User Manual:** https://cdn.shopify.com/s/files/1/0759/9344/8689/files/X4_User_Manual_ENG.pdf
### Community Resources
- **Primary Community:** https://www.reddit.com/r/xteinkereader/
- **Community Hub:** https://readme.club/
- **Calibre (Ebook Management):** https://calibre-ebook.com/
### Community Tools and Resources (from CSV)
**File Optimization:**
- EPUB Workflow Plugin for Calibre: /resources
- EPUB Batch Workflow (Python): /resources
- Markdown to ePub Converter: /resources
**Font Tools:**
- Web Font Maker: https://xteink.lakafior.com
- ePaper Font Converter (iOS): https://apps.apple.com/us/app/dotink/id6754073002
**Other Utilities:**
- Image to BMP Converter: https://aryascripts.github.io/page-apps/bmp-convert/
- Community Wallpapers: /resources
**Documentation:**
- Firmware Update Guide: https://github.com/Joseph-Cannaday/xteink_x4-english
- Font System Deep Dive: /resources
- Firmware Extraction Guide: /resources
### Document Information
- **Guide Title:** Xteink X4 Complete Community Guide
- **Edition:** November 2025
- **Status:** Unofficial, volunteer-compiled
- **Last Updated:** November 17, 2025
- **Disclaimer:** Always verify official information at https://www.xteink.com/ for time-sensitive details
## Closing Words
The Xteink X4 represents a specific vision of e-reading: minimal, portable, focused, and accessible. This guide aims to serve as a comprehensive reference for every aspect of ownership—from initial setup to advanced customization.
The device's greatest strengths (extreme portability, distraction-free reading, affordable pricing, exceptional battery life) make it exceptional for specific use cases, even as its limitations (no frontlight, small screen, limited format support) prevent it from being a universal solution.
The active development from Xteink (regular firmware updates), engaged community (sharing resources, troubleshooting, collaborating), and growing ecosystem suggest the X4 is not just a product but the beginning of a meaningful community.
For questions, updates, contributions, or to simply share your X4 experience, visit:
- https://www.reddit.com/r/xteinkereader/ — Reddit community
- https://readme.club/ — Community hub
**Happy reading!**
*This guide was compiled from official Xteink documentation, the official PDF user manual, community discussions from r/xteinkereader, and real-world user experiences. Information is current as of November 17, 2025. Firmware and features continue to evolve—always verify official information at [https://www.xteink.com/](https://www.xteink.com/) for the latest specifications and support.*
*This is a volunteer, non-commercial project. No commercial affiliation with Xteink is implied.*