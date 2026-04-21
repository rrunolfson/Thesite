
  # Last Mile Inc.

  Official website for Last Mile Inc.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Production deployment automation

  The nightly integrations sync now verifies whether the live production catalog matches the generated catalog.

  If production is behind, GitHub Actions deploys `dist/` directly to cPanel over SSH.

  Required GitHub Actions secrets:

  - `CPANEL_SSH_PRIVATE_KEY`

  Optional GitHub Actions secrets for non-default cPanel environments:

  - `CPANEL_SSH_HOST` default `lastmileinc.ai`
  - `CPANEL_SSH_USERNAME` default `hh0h355mndjv`
  - `CPANEL_DEPLOY_PATH` default `/home/hh0h355mndjv/public_html/`
  - `CPANEL_SSH_PORT` optional, defaults to `22`
  