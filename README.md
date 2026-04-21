
  # Last Mile Inc.

  Official website for Last Mile Inc.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Production deployment automation

  The nightly integrations sync now verifies whether the live production catalog matches the generated catalog.

  If production is behind, GitHub Actions deploys `dist/` directly to cPanel over explicit FTPS.

  Required GitHub Actions secrets:

  - `CPANEL_FTP`

  Optional GitHub Actions secrets for non-default cPanel environments:

  - `CPANEL_FTP_HOST` default `lastmileinc.ai`
  - `CPANEL_FTP_USERNAME` default `rodney@lastmileinc.ai`
  - `CPANEL_DEPLOY_PATH` default `.` when the FTP account is already rooted at `public_html`
  - `CPANEL_FTP_PORT` optional, defaults to `21`
  