# Automatic Hostinger deployment

Push to `main` or run the GitHub Actions workflow manually. GitHub installs the locked dependencies and builds the Next.js static export. A restricted SSH key uploads the exact commit to a new release directory. The receiver atomically switches `public_html`, verifies the commit through `/version.json` and checks the homepage using strict TLS against the Hostinger origin. Failed verification restores the previous release.

Server root: `/home/u381549037/domains/yosephfr.com`.
Releases: `app/releases/<commit>/public`.
Initial recovery copy: `state/before-autodeploy-public_html`.
Verified deployment record: `state/last-deploy.json`.

Repository secret: `HOSTINGER_DEPLOY_KEY`. The forced SSH command permits only `deploy <40-character commit>`. No provider API token is used by the workflow.

Keep `.well-known` in the shared state directory. Domain email still receives through iCloud. Contact SMTP changes were explicitly deferred and are not part of this deployment.

After a successful deploy, the workflow compares the previous sitemap with the new one and notifies IndexNow. The key is the public file `public/<key>.txt` (IndexNow keys are public by design). A failed notification does not fail the deploy.
