# Ask NDR: the website chatbot

A chat button ("Ask NDR") sits bottom-right on every page. Visitors ask questions and get short answers taken only from the website's own content, with links to the right page. When someone wants space, a call, a job or a partnership, the bot offers a small enquiry form inside the chat; it is delivered exactly like the site's other enquiry forms (it is marked "Website chat").

It costs nothing to run: answers come from Google Gemini's free tier, and Groq's free tier takes over automatically if Gemini is down or has hit its daily limit.

## One-time setup (about 10 minutes)

1. **Get a free Gemini key.** Go to https://aistudio.google.com/apikey, sign in with a Google account, click _Create API key_, copy it. No card needed.
2. **Get a free Groq key** (the backup). Go to https://console.groq.com/keys, sign up, click _Create API Key_, copy it.
3. **Put both keys on the server.** In cPanel → File Manager → `public_html/api/`, edit `config.php` (the file that already holds the contact form settings). Copy the whole `'chat' => [ ... ],` block from `config.example.php` into it, just before the final `];`, and paste the keys:

   ```php
   'chat' => [
       'enabled' => true,
       'gemini_key' => 'paste-the-gemini-key-here',
       'gemini_model' => 'gemini-flash-latest',
       'groq_key' => 'paste-the-groq-key-here',
       'groq_model' => 'llama-3.3-70b-versatile',
       'rate_limit_max' => 30,
       'rate_limit_window' => 600,
       'daily_max' => 1000,
       'max_turns' => 12,
       'max_message_chars' => 1000,
   ],
   ```

   Save. No rebuild is needed; the keys never reach visitors' browsers.

4. Open the live site, click **Ask NDR**, and ask "Where are your warehouses?".

## How it stays accurate

Every build (`npm run build`) writes `api/chat-knowledge.md`: the text of every page plus the full portfolio register (published sites only). The server sends the parts that match each question to the AI, with instructions to answer only from that text and say so when it doesn't know. Edit the website and redeploy, and the bot knows the new content. The knowledge file cannot be downloaded by browsers (`api/.htaccess`).

## Day-to-day

- **Turn it off:** set `'enabled' => false` in `config.php`. The button stays, but it replies that the assistant is offline and points to the Contact page.
- **Abuse limits:** each visitor can send 30 messages per 10 minutes (`rate_limit_max` / `rate_limit_window`), the whole site at most 1,000 per day (`daily_max`), and only the website's own chat panel is accepted (other sites can't borrow your quota).
- **If answers stop:** the free quota may be used up for the day (it resets daily), or a key was revoked. Check the keys in AI Studio / Groq console. If Google renames its models, change `gemini_model` (or `groq_model`) to the current free model name.
- **Privacy note:** on Gemini's free tier Google may use the questions visitors type to improve its products. Enquiry details (name, email, phone) never go to the AI; they go only to your inbox. If that matters later, switching Gemini to a paid key (a few rupees a day at this traffic) removes it, with no code change.

## Local testing

- `npm start` (after `npm run build`) serves the site with a stand-in for the chat server. Without keys it streams a test reply naming the pages it would have used.
- For real answers locally, set `GEMINI_API_KEY` and/or `GROQ_API_KEY` in the environment before `npm start`.
- With `npm run dev`, also run `npm run contact:mock` (serves both the contact and chat stand-ins on port 3200).

## Files

- `src/components/chat/`: the button, the panel and the in-chat enquiry form
- `src/lib/chat.ts`: talks to the server and reads the streamed reply
- `public/api/chat.php`: the server side (on cPanel); `scripts/chat-mock.mjs`: its local stand-in
- `scripts/build-chat-knowledge.mjs`: builds the knowledge file after every build
