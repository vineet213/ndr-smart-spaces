# One-click deploy to cPanel

Every push to `main` builds the site and uploads it to the server. You can also run it by hand:
GitHub -> **Actions** -> **Deploy to cPanel** -> **Run workflow**.

It uploads over FTP with TLS. Nothing is deleted on the server, so `api/config.php` (which only exists there) is never touched.

## One-time setup

### 1. Create a deploy-only FTP account (cPanel)
1. cPanel -> **FTP Accounts** -> **Add FTP Account**.
2. Log in: `deploy` (the domain is added for you, e.g. `deploy@ndrsmartspaces.com`).
3. Set a strong password and keep it for step 2.
4. **Directory:** `public_html`. This limits the account to the website folder.
5. Quota: Unlimited. Click **Create FTP Account**.

### 2. Add the secrets (GitHub)
Repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**. Add three:

| Name | Value |
|---|---|
| `FTP_HOST` | `ndrsmartspaces.com` |
| `FTP_USER` | `deploy@ndrsmartspaces.com` |
| `FTP_PASSWORD` | the password from step 1 |

Leave `FTP_DIR` alone (default `/`) because the account is already limited to `public_html`.

### 3. Run it once
**Actions** -> **Deploy to cPanel** -> **Run workflow**. A green tick means the site was uploaded. After that, every push deploys.

## Notes
- **Certificate:** the server's FTP certificate is self-signed and expired (Dec 2024), so strict checking is off by default; the connection is still encrypted. Once the server owner renews it (WHM -> Manage Service SSL Certificates), set a repository **variable** `FTP_VERIFY_CERT` to `yes`.
- **A failed upload leaves the old site working.** Files are replaced one by one, so a failure mid-way can leave a mix of old and new for a moment; re-run the workflow.
- **Builds without secrets** still pass, with a warning that nothing was uploaded.
- `npm run package` still makes the zip for manual upload if you ever need it.
