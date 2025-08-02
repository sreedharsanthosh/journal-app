📝 Cozy Journal App
A minimal, privacy-focused journal app built with SvelteKit, Supabase, and TailwindCSS.
Designed to feel cozy and clean — with mood tagging, smooth UI, and no distractions.

🚀 Features
✍️ Create, edit, and view journal entries

😊 Mood selection (happy, sad, angry, etc.)

🌙 Dark mode friendly

🔒 Supabase Auth (user login)

☁️ Hosted on Supabase (DB + Auth + Storage)

🔍 Animated transitions, cozy vibe

🧱 Built With
SvelteKit

Supabase

TailwindCSS

📦 Setup
Clone the repo:

bash
Copy
Edit
git clone https://github.com/yourusername/journal-app.git
cd journal-app
Install dependencies:

bash
Copy
Edit
npm install
Add your Supabase credentials to .env:

ini
Copy
Edit
PUBLIC_SUPABASE_URL=your-url
PUBLIC_SUPABASE_ANON_KEY=your-key
Run the app:

bash
Copy
Edit
npm run dev
📁 Folder Structure
/routes – App pages (journal list, create page, etc.)

/lib – Supabase client & utility logic

/components – Reusable components (Modal, MoodSelector, etc.)

/assets – Images, textures, etc.

✅ To-Do (Optional)
Add AI-powered tags (future)

Add journaling streak system

Export/backup to markdown or PDF
