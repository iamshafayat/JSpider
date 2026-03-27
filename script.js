const scanBtn = document.getElementById("scanBtn");
const urlInput = document.getElementById("urlInput");
const results = document.getElementById("results");
const status = document.getElementById("status");
const exportActions = document.getElementById("actions");
const exportTxt = document.getElementById("exportTxt");
const exportJson = document.getElementById("exportJson");

const allResults = [];
const scannedJs = new Set(); // avoid duplicate scans across sources
console.log("%c🕷️ JSpider V2.0 Initialized", "color: #0dcaf0; font-weight: bold; font-size: 1.2rem;");

const sensitivePaths = [
  // 🌐 Standard .well-known files
  '/.well-known/security.txt',
  '/.well-known/assetlinks.json',
  '/.well-known/apple-app-site-association',
  '/.well-known/openid-configuration',
  '/.well-known/oauth-authorization-server',
  '/.well-known/jwks.json',
  '/.well-known/jwks',
  '/.well-known/change-password',
  '/.well-known/dnt-policy.txt',
  '/.well-known/privacy-policy.txt',
  '/.well-known/terms-of-service.txt',
  '/.well-known/gpc.json',
  '/.well-known/webfinger',
  '/.well-known/ai-plugin.json',
  '/.well-known/csaf/provider-metadata.json',
  '/.well-known/nodeinfo',
  '/.well-known/trust.txt',
  '/.well-known/recovery',
  '/.well-known/host-meta',
  '/.well-known/apple-developer-merchantid-domain-association',
  '/.well-known/microsoft-identity-association.json',
  '/.well-known/pay',
  '/.well-known/acme-challenge',
  '/.well-known/smart-app-banner',
  '/.well-known/matrix/client',
  '/.well-known/matrix/server',
  '/.well-known/did.json',
  '/.well-known/stellar.toml',
  '/.well-known/mta-sts.txt',
  '/.well-known/bugbounty',
  '/.well-known/humans.txt',

  // 🧭 Common metadata & index files
  '/robots.txt',
  '/humans.txt',
  '/sitemap.xml',
  '/sitemap_index.xml',
  '/manifest.json',
  '/ads.txt',
  '/app-ads.txt',
  '/crossdomain.xml',
  '/security.txt',
  '/server-status',
  '/server-info',
  '/status',
  '/health',
  '/healthcheck',
  '/ping',
  '/ready',
  '/live',

  // 🗂️ Version Control & Source Code
  '/.git',
  '/.git/config',
  '/.git/HEAD',
  '/.git/index',
  '/.git/logs/HEAD',
  '/.gitignore',
  '/.gitconfig',
  '/.gitmodules',
  '/.git-credentials',
  '/.svn/entries',
  '/.svn/wc.db',
  '/.hg/requires',
  '/.bzr/branch/branch.conf',
  '/CVS/Root',
  '/CVS/Entries',

  // 💾 Backups & Database Files
  '/backup.sql',
  '/backup.sql.gz',
  '/backup.zip',
  '/backup.tar.gz',
  '/backup.7z',
  '/backup.bak',
  '/backup.old',
  '/backup.rar',
  '/db.sql',
  '/db.sql.gz',
  '/dump.sql',
  '/database.sql',
  '/db_backup.sql',
  '/mysql.sql',
  '/mysqldump.sql',
  '/site.sql',
  '/data.sql',
  '/1.sql',
  '/1.sql.gz',
  '/2.sql',
  '/latest.sql',
  '/dbdump.sql',
  '/sqldump.sql',
  '/export.sql',
  '/backup-db.sql',
  '/database_backup.sql',
  '/www.sql',
  '/backup/',
  '/backups/',
  '/.backup',
  '/old/',
  '/old.zip',
  '/temp/',
  '/tmp/',
  '/site.zip',
  '/site.tar',
  '/site.tar.gz',
  '/www.zip',
  '/www.tar.gz',
  '/public.zip',
  '/public.tar.gz',
  '/public_html.zip',
  '/web.zip',
  '/web.tar.gz',
  '/website.zip',
  '/httpdocs.zip',
  '/html.zip',

  // 🔑 Configuration & Environment Files
  '/.env',
  '/.env.local',
  '/.env.production',
  '/.env.production.local',
  '/.env.dev',
  '/.env.development',
  '/.env.development.local',
  '/.env.staging',
  '/.env.backup',
  '/.env.old',
  '/.env.save',
  '/.env.example',
  '/.env.php',
  '/env',
  '/env.sample',
  '/example.env',
  '/config',
  '/config.json',
  '/config.php',
  '/config.yml',
  '/config.yaml',
  '/config.inc.php',
  '/config.inc',
  '/config.php.bak',
  '/configuration.php',
  '/configuration.php-dist',
  '/settings.php',
  '/settings.json',
  '/settings.py',
  '/local_settings.py',
  '/app/config/parameters.yml',
  '/application/config/database.php',
  '/api/config',
  '/web.config',
  '/Web.config',
  '/wp-config.php',
  '/wp-config.php.bak',
  '/wp-config.old',
  '/db.php',
  '/database.php',
  '/database.yml',
  '/appsettings.json',
  '/appsettings.production.json',
  '/appsettings.Development.json',
  '/secrets.yml',
  '/credentials.json',
  '/config/database.yml',
  '/config/secrets.yml',
  '/config/master.key',
  '/config/credentials.yml.enc',
  '/php.ini',
  '/.user.ini',
  '/php-fpm.conf',

  // 🚨 CRITICAL - API Keys & Secrets
  '/sftp-config.json',
  '/ftpsync.settings',
  '/.ftpconfig',
  '/deployment-config.json',
  '/.vscode/sftp.json',
  '/privatekey.pem',
  '/server.key',
  '/server.crt',
  '/cert.pem',
  '/key.pem',
  '/ssl/private.key',
  '/.pgpass',
  '/.netrc',
  '/token.txt',
  '/access_token',
  '/api_key.txt',
  '/api-keys.txt',
  '/auth.json',
  '/oauth.json',
  '/client_secret.json',
  '/firebase-adminsdk.json',
  '/.google_authenticator',
  '/2fa-recovery-codes.txt',
  '/backup-codes.txt',
  '/proftpdpasswd',
  '/.my.cnf',
  '/mysql_history',
  '/.psql_history',

  // 🔐 Cloud Provider Credentials
  '/.aws/credentials',
  '/.aws/config',
  '/credentials',
  '/service-account-key.json',
  '/.azure/credentials',
  '/.azure-credentials',
  '/.config/gcloud/credentials.db',
  '/gcp-key.json',
  '/firebase-config.json',
  '/.s3cfg',
  '/.rclone.conf',
  '/rclone.conf',
  '/.boto',
  '/s3.yml',
  '/.kube/config',
  '/kubeconfig',
  '/.docker/config.json',
  '/aws.json',
  '/google-services.json',
  '/GoogleService-Info.plist',

  // 🐳 Docker & Container Files
  '/Dockerfile',
  '/docker-compose.yml',
  '/docker-compose.yaml',
  '/.dockerignore',
  '/.docker/',
  '/docker-compose.override.yml',
  '/docker-compose.prod.yml',

  // 📦 Package Manager Files
  '/package.json',
  '/package-lock.json',
  '/yarn.lock',
  '/composer.json',
  '/composer.lock',
  '/Gemfile',
  '/Gemfile.lock',
  '/Pipfile',
  '/Pipfile.lock',
  '/requirements.txt',
  '/pom.xml',
  '/build.gradle',
  '/go.mod',
  '/go.sum',
  '/.npmrc',
  '/.yarnrc',
  '/pnpm-lock.yaml',

  // 📝 Log Files
  '/error_log',
  '/error.log',
  '/errors.log',
  '/access.log',
  '/access_log',
  '/debug.log',
  '/production.log',
  '/app.log',
  '/application.log',
  '/server.log',
  '/npm-debug.log',
  '/yarn-error.log',
  '/php_errors.log',
  '/laravel.log',
  '/storage/logs/laravel.log',
  '/storage/logs/',
  '/log/development.log',
  '/log/production.log',
  '/logs/error.log',
  '/var/log/',

  // 🔧 Server & Application Info
  '/phpinfo.php',
  '/info.php',
  '/test.php',
  '/php.php',
  '/version',
  '/version.txt',
  '/version.json',
  '/VERSION',
  '/CHANGELOG.md',
  '/CHANGELOG.txt',
  '/api/version',
  '/api/info',
  '/api/v1/info',
  '/api/swagger.json',
  '/api/swagger.yaml',
  '/api/swagger',
  '/api/docs',
  '/api.json',
  '/api.yaml',
  '/api/openapi.json',
  '/api-docs',
  '/swagger.json',
  '/swagger.yaml',
  '/swagger-ui.html',
  '/v2/api-docs',
  '/openapi.json',
  '/openapi.yaml',
  '/redoc',
  '/docs.json',
  '/schema.json',
  '/wsdl',
  '/wadl',

  // 🎯 GraphQL Endpoints
  '/graphql',
  '/graphiql',
  '/playground',
  '/api/graphql',
  '/__graphql',
  '/graphql/console',
  '/v1/graphql',
  '/graphql/v1',
  '/query',
  '/graphql?query={__schema{types{name}}}',

  // 🛡️ Admin & Control Panels
  '/admin',
  '/admin/',
  '/admin/login',
  '/administrator',
  '/admin.php',
  '/admin/index.php',
  '/admin/config.php',
  '/wp-admin/',
  '/phpmyadmin/',
  '/phpmyadmin/index.php',
  '/pma/',
  '/mysql/',
  '/dbadmin/',
  '/adminer.php',
  '/adminer/',
  '/cpanel',
  '/cPanel',
  '/plesk',
  '/webadmin',
  '/controlpanel',
  '/management',
  '/manage',
  '/console',
  '/dashboard',
  '/portal',

  // 📊 Monitoring & Metrics
  '/metrics',
  '/actuator',
  '/actuator/health',
  '/actuator/env',
  '/actuator/metrics',
  '/actuator/mappings',
  '/actuator/configprops',
  '/actuator/dump',
  '/actuator/heapdump',
  '/actuator/trace',
  '/actuator/logfile',
  '/jolokia',
  '/hawtio',
  '/prometheus',
  '/debug/pprof',
  '/debug/vars',
  '/_stats',
  '/_status',
  '/_health',

  // 🗄️ Directory Listings & Indexes
  '/uploads/',
  '/images/',
  '/files/',
  '/download/',
  '/downloads/',
  '/media/',
  '/assets/',
  '/static/',
  '/public/',
  '/storage/',
  '/data/',
  '/documents/',
  '/attachments/',

  // 🧪 Test & Development Files
  '/test',
  '/test.php',
  '/test.html',
  '/testing',
  '/dev',
  '/development',
  '/debug',
  '/demo',
  '/example',
  '/examples',
  '/sample',
  '/samples',
  '/temp.php',
  '/tmp.php',
  '/1.php',
  '/shell.php',
  '/upload.php',

  // 📄 Documentation & README
  '/readme.md',
  '/README.md',
  '/README.txt',
  '/README',
  '/license',
  '/LICENSE',
  '/LICENSE.txt',
  '/INSTALL.txt',
  '/INSTALL.md',
  '/CONTRIBUTING.md',
  '/docs/',
  '/documentation/',
  '/help/',

  // 🌍 CMS Specific (WordPress, Joomla, Drupal)
  '/wp-config.php',
  '/wp-content/debug.log',
  '/wp-json/wp/v2/users',
  '/wp-includes/',
  '/xmlrpc.php',
  '/wp-login.php',
  '/license.txt',
  '/readme.html',
  '/configuration.php',
  '/administrator/manifests/files/joomla.xml',
  '/user/login',
  '/install.php',
  '/install/',
  '/setup/',
  '/sites/default/settings.php',
  '/app/etc/local.xml',
  '/app/etc/env.php',
  '/.maintenance',

  // 🔍 Miscellaneous Sensitive Files
  '/favicon.ico',
  '/.htaccess',
  '/.htpasswd',
  '/Thumbs.db',
  '/.bashrc',
  '/.bash_history',
  '/.bash_profile',
  '/.ssh/id_rsa',
  '/.ssh/id_dsa',
  '/.ssh/id_ecdsa',
  '/.ssh/id_ed25519',
  '/.ssh/known_hosts',
  '/.ssh/authorized_keys',
  '/id_rsa',
  '/id_rsa.pub',
  '/id_dsa',
  '/privatekey',
  '/mykey.pem',
  '/prod.key',
  '/production.key',
  '/staging.key',
  '/.DS_Store',
  '/.idea/',
  '/.vscode/',
  '/nbproject/',
  '/.project',
  '/.classpath',
  '/.settings/',

  // 🔓 Common Vulnerable Endpoints
  '/cgi-bin/',
  '/index.php.bak',
  '/.listing',
  '/.perf',
  '/core',
  '/.core',
  '/WEB-INF/web.xml',
  '/META-INF/MANIFEST.MF',

  // 🏗️ CI/CD & Infrastructure as Code
  '/.travis.yml',
  '/.gitlab-ci.yml',
  '/gitlab-ci.yml',
  '/.circleci/config.yml',
  '/Jenkinsfile',
  '/.drone.yml',
  '/.github/workflows/',
  '/azure-pipelines.yml',
  '/bitbucket-pipelines.yml',
  '/cloudbuild.yaml',
  '/buildspec.yml',
  '/wercker.yml',
  '/appveyor.yml',
  '/codefresh.yml',
  '/terraform.tfstate',
  '/terraform.tfstate.backup',
  '/terraform.tfvars',
  '/.terraform/',
  '/ansible.cfg',
  '/inventory.ini',
  '/hosts.yml',
  '/playbook.yml',
  '/Vagrantfile',
  '/ansible/hosts',
  '/pulumi.yaml',
  '/cloudformation.json',
  '/cloudformation.yaml',

  // 🎫 Authentication & Session
  '/api/auth/config',
  '/oauth/token',
  '/token',
  '/oauth2/token',
  '/login.json',
  '/jwks',
  '/auth/jwks',
  '/auth/realms/master/.well-known/openid-configuration',
  '/session.txt',
  '/sess_*',
  '/redis.conf',
  '/memcached.conf',
  '/.redis',

  // 🔍 Source Maps (leak source code)
  '/main.js.map',
  '/app.js.map',
  '/bundle.js.map',
  '/vendor.js.map',
  '/index.js.map',
  '/app.css.map',

  // 📱 Mobile & App Configs
  '/app.json',
  '/eas.json',
  '/config.codekit',
  '/sftp.json',

  // 🔧 Framework Specific
  '/bootstrap.php',
  '/autoload.php',
  '/vendor/autoload.php',
  '/application.properties',
  '/application.yml',

  // 💀 Shell & Backdoors (common names)
  '/c99.php',
  '/r57.php',
  '/webshell.php',
  '/backdoor.php',
  '/cmd.php',
  '/uploader.php',
  '/up.php',
  '/ajax.php',

  // 🔐 SAML & SSO
  '/saml/metadata',
  '/simplesaml/',
  '/sso/metadata',
  '/FederationMetadata/2007-06/FederationMetadata.xml',

  // 📧 Email & SMTP
  '/email.txt',
  '/smtp.txt',
  '/mail.php',
  '/sendmail.php',
  '/mailer.php',
  '/mailconfig.json',

  // 📊 Analytics & Tracking
  '/analytics.js',
  '/_tracking',
  '/tracking.js',
  '/pixel',

  // 🔎 Information Disclosure (.NET, Symfony, Laravel)
  '/elmah.axd',
  '/trace.axd',
  '/glimpse.axd',
  '/_profiler',
  '/_profiler/phpinfo',
  '/telescope',
  '/horizon/dashboard',
  '/__webpack_hmr',

  // 🌐 CDN & Asset Configs
  '/cdn.yml',
  '/cdn.json',
  '/s3_website.yml',

  // 🎯 API Discovery
  '/api/health',
  '/api/debug',
  '/api/settings',
  '/api/users',
  '/api/v1/users',
  '/api/admin',
  '/rest/api/2/serverInfo',
  '/api/now/table/sys_user',

  // 🛡️ Bug Bounty & Security
  '/bugbounty',
  '/security',
  '/responsible-disclosure',
  '/hall-of-fame',
];

const normalizeUrl = (url) => {
  try {
    const u = new URL(url);
    // Preserving trailing slashes for directory fidelity
    return u.origin + u.pathname + u.search;
  } catch { return url; }
};

// Helper to ensure base URL is treated as a directory for relative path resolution
const directoryfyUrl = (url) => {
  if (url.endsWith('/')) return url;
  try {
    const urlObj = new URL(url);
    const lastPart = urlObj.pathname.split('/').pop() || "";
    // If the last part has no extension, treat it as a directory
    if (!lastPart.includes('.')) {
      return url + '/';
    }
  } catch { }
  return url;
};

const proxyUrl = (url) => `https://aged-unit-e2e8.iamshafayat.workers.dev/?url=${encodeURIComponent(url)}`;

const endpointRegex = new RegExp(
  `(?:"|')((?:[a-zA-Z]{1,10}:\\/\\/|\\/\\/)[^"']*?|(?:\\/|\\.\\/|\\.\\.\\/)[^"'\\s<>]+|[a-zA-Z0-9_\\-/]+\\.[a-z]{1,5}(?:\\?[^"'\\s]*)?)(?:"|')`,
  "g"
);

// Advanced Secret Detection Patterns
const secretPatterns = {
  "AWS Key": /AKIA[0-9A-Z]{16}/g,
  "Google API": /AIza[0-9A-Za-z\-_]{35}/g,
  "Stripe Live": /sk_live_[0-9a-zA-Z]{24,}/g,
  "GitHub PAT": /ghp_[0-9a-zA-Z]{36}/g,
  "Slack Token": /xox[baprs]-[0-9a-zA-Z\-]{10,48}/g,
  "JWT": /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+/g,
  "Private Key": /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g,
  "MongoDB": /mongodb(?:\+srv)?:\/\/[^\s"\'<>]+/g,
  "PostgreSQL": /postgres(?:ql)?:\/\/[^\s"\'<>]+/g,
  "Algolia Admin API Key": /algolia.{0,32}([a-z0-9]{32})\b/gi,
  "Algolia Application ID": /algolia.{0,16}([A-Z0-9]{10})\b/gi,
  "Cloudflare API Token": /cloudflare.{0,32}(?:secret|private|access|key|token).{0,32}([a-z0-9_-]{38,42})\b/gi,
  "Cloudflare Service Key": /(?:cloudflare|x-auth-user-service-key).{0,64}(v1\.0-[a-z0-9._-]{160,})\b/gi,
  "MySQL URI with Credentials": /mysql:\/\/[a-z0-9._%+\-]+:[^\s:@]+@(?:\[[0-9a-f:.]+\]|[a-z0-9.-]+)(?::\d{2,5})?(?:\/[^\s"\'?:]+)?(?:\?[^\s"\']*)?/g,
  "Segment Public API Token": /\bsgp_[A-Z0-9_-]{60,70}\b/g,
  "Segment API Key": /(?:segment|sgmt).{0,16}(?:secret|private|access|key|token).{0,16}([A-Z0-9_-]{40,50}\.[A-Z0-9_-]{40,50})/gi,
  "Facebook App ID": /(?:facebook|fb).{0,8}(?:app|application).{0,16}(\d{15})\b/gi,
  "Facebook Secret Key": /(?:facebook|fb).{0,32}(?:api|app|application|client|consumer|secret|key).{0,32}([a-z0-9]{32})\b/gi,
  "Facebook Access Token": /EAACEdEose0cBA[A-Z0-9]{20,}\b/g,
  "Google OAuth2 Access Token": /\bya29\.[a-z0-9_-]{30,}\b/g,
  "Slack Webhook": /https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[A-Za-z0-9]+/g,
  "Discord Webhook": /https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+/g
};

// Fast-Path Check: Only run detailed regexes if one of these keywords is present
const secretTrigger = /AKIA|AIza|sk_live|ghp_|xox[baprs]|eyJ|-----BEGIN|mongodb|postgres|postgresql|algolia|cloudflare|mysql|sgp_|segment|sgmt|facebook|fb|ya29|hooks\.slack\.com|discord\.com\/api\/webhooks/i;

const blockedSecretKeywords = [
  "defaultNumberingSystem", "defaultOutputCalendar", "twoDigitCutoffYear",
  "module.exports", "prototype", "constructor", "__proto__",
  "invalidExplanation", "DATE_MED", "TIME_WITH", "DATETIME_", "TIME_24"
];

// BLOCK garbage resource extensions
const excludedExtensions = [
  ".woff", ".woff2", ".ttf", ".otf", ".eot", ".sfnt",
  ".png", ".jpg", ".jpeg", ".svg", ".gif", ".ico", ".webp", ".bmp", ".apng", ".tif", ".tiff",
  ".css", ".less", ".sass",
  ".map",
  ".mp4", ".m4v", ".webm", ".mp3", ".wav", ".ogg", ".flac",
  ".xls", ".xlsx", ".csv", ".rtf",
  ".apk", ".ipa", ".dmg", ".bin", ".jar", ".class",
  ".swf", ".log", ".tmp", ".old", ".drag", ".brush", ".zoom", ".time", ".name", ".width", ".calcs"
];

// BLOCK garbage/tracker domains
const externalDomainsToIgnore = [
  "facebook.com", "instagram.com", "twitter.com", "tiktok.com", "linkedin.com",
  "youtube.com", "vimeo.com", "pinterest.com", "cdn.jsdelivr.net", "cdnjs.cloudflare.com",
  "unpkg.com", "bootstrapcdn.com", "maxcdn.bootstrapcdn.com",
  "fonts.googleapis.com", "fonts.gstatic.com",
  "gstatic.com", "google.com", "googleapis.com",
  "googletagmanager.com", "googlesyndication.com", "google-analytics.com", "gtag/js",
  "doubleclick.net", "cookielaw.org", "cdn.adobedtm.com", "scene7.com", "w3.org",
  "akamaihd.net", "brightcove.net", "vidyard.com", "wistia.com",
  "newrelic.com", "datadoghq.com", "cloudflareinsights.com",
  "optimizely.com", "hotjar.com", "segment.com", "intercom.io",
  "salesforce.com", "liveperson.net", "zendesk.com", "helix-rum-js",
  "sentry.io", "mixpanel.com", "disqus.com", "addthis.com", "sharethis.com", "criteo.com",
  "tracking.", "pixel.", "collect.", "recaptcha.net", "lazcdn.com", "alicdn.com"
];

// BLOCK garbage prefixes like markup://, js://, aura://
const disallowedPrefixes = [
  "js://", "markup://", "aura://", "java://", "css://",
  "object://", "text://", "xml://", "apex://", "apexclass://",
  "resource://", "data://", "mailto:", "tel:", "blob:", "file://",
  "intent://", "chrome-extension://", "about:", "chrome://"
];

const stopScanBtn = document.getElementById("stopScanBtn");

// Global State
const state = {
  scanned: 0,
  endpoints: new Set(),
  secrets: new Set(),
  files: new Set(),
  parameters: new Set(),
  allData: [], // { source, type, value, line }
  scannedUrls: new Set(),
  probedDomains: new Set(),
  isScanning: false,
  isCrawlerStopped: false
};

const updateStats = () => {
  document.getElementById("stat-scanned").innerText = state.scanned;
  document.getElementById("stat-endpoints").innerText = state.endpoints.size;
  document.getElementById("stat-secrets").innerText = state.secrets.size;
  document.getElementById("stat-files").innerText = state.files.size;
  document.getElementById("stat-parameters").innerText = state.parameters.size;
};

const addResult = (source, type, value, line = 0) => {
  // Deduplicate same value at same line in same source ONLY if type is also the same
  if (state.allData.some(d => d.source === source && d.value === value && d.line === line && d.type === type)) return;

  state.allData.push({ source, type, value, line });
  if (type === "endpoint") state.endpoints.add(value);
  if (type === "secret") state.secrets.add(value);
  if (type === "file") state.files.add(value);
  if (type === "parameter") state.parameters.add(value);
  updateStats();
};

const setProgress = (percent) => {
  const p = Math.round(percent);
  document.getElementById("progress-bar").style.width = `${p}%`;
  const textEl = document.getElementById("progress-percent");
  if (textEl) textEl.innerText = `${p}%`;
};

const startScan = async (maxDepth) => {
  let siteUrl = urlInput.value.trim();
  if (!siteUrl) return alert("Enter a valid URL");
  if (!/^https?:\/\//i.test(siteUrl)) siteUrl = "https://" + siteUrl;
  siteUrl = normalizeUrl(siteUrl);

  state.scanned = 0;
  state.endpoints.clear();
  state.secrets.clear();
  state.files.clear();
  state.parameters.clear();
  state.allData = [];
  state.scannedUrls.clear();
  scannedJs.clear(); // Reset JS scan cache
  updateStats();

  results.innerHTML = "";
  scanBtn.style.display = "none";
  document.getElementById("fullScanBtn").style.display = "none";
  stopScanBtn.style.display = "inline-block";
  stopScanBtn.disabled = false;
  state.isCrawlerStopped = false;

  document.getElementById("progress-container").style.display = "block";
  document.getElementById("filter-section").style.display = "none";
  exportActions.style.display = "none";
  status.innerText = maxDepth === 0 ? "Scanning single page..." : "Starting full recursive scan...";
  setProgress(5);

  try {
    await recursiveScan(siteUrl, maxDepth);
    if (!state.isCrawlerStopped) {
      status.innerText = "Scan complete!";
    } else {
      status.innerText = "Scan stopped manually.";
    }
    setProgress(100);
    document.getElementById("filter-section").style.display = "block";
    exportActions.style.display = "flex";
    renderResults();
  } catch (e) {
    console.error(e);
    if (!state.isCrawlerStopped) {
      status.innerText = "Scan failed. Check console.";
    }
  }
  scanBtn.style.display = "inline-block";
  scanBtn.disabled = false;
  document.getElementById("fullScanBtn").style.display = "inline-block";
  document.getElementById("fullScanBtn").disabled = false;
  stopScanBtn.style.display = "none";
};

stopScanBtn.addEventListener("click", () => {
  state.isCrawlerStopped = true;
  stopScanBtn.disabled = true;
  status.innerText = "Stopping scan... Finishing current requests.";
});

scanBtn.addEventListener("click", () => startScan(0));
document.getElementById("fullScanBtn").addEventListener("click", () => startScan(1));

async function recursiveScan(url, maxDepth, currentDepth = 0, targetHost = null) {
  if (state.isCrawlerStopped) return;
  const normUrl = normalizeUrl(url);
  try {
    const currentUrlObj = new URL(normUrl);
    if (!targetHost) targetHost = currentUrlObj.hostname;

    if (currentUrlObj.hostname !== targetHost && !currentUrlObj.hostname.endsWith("." + targetHost)) {
      return;
    }

    if (currentDepth > maxDepth || state.scannedUrls.has(normUrl)) return;
    state.scannedUrls.add(normUrl);
    state.scanned++;
    updateStats();

    status.innerText = `Scanning: ${normUrl}`;
    setProgress(Math.min(95, (state.scanned / 15) * 100));

    const res = await fetch(proxyUrl(normUrl));
    if (!res.ok) return;
    const content = await res.text();

    // Extract data with line numbers
    const foundEndpoints = extractEndpointsWithLines(content);
    const foundSecrets = extractSecretsWithLines(content);
    const foundFiles = extractFilesWithLines(content);

    foundEndpoints.forEach(e => {
      addResult(normUrl, "endpoint", e.value, e.line);
      // Sync - if endpoint looks like a file, add it to files tab too
      if (isInterestingFile(e.value)) {
        addResult(normUrl, "file", e.value, e.line);
      }
      // Parameter Discovery (Full endpoint with query)
      if (e.value.includes("?")) {
        addResult(normUrl, "parameter", e.value, e.line);
      }
    });

    foundSecrets.forEach(s => addResult(normUrl, "secret", s.value, s.line));

    foundFiles.forEach(f => {
      addResult(normUrl, "file", f.value, f.line);
    });

    // Discover more links/scripts
    const links = extractInternalLinks(content, normUrl);
    const scripts = extractScriptUrls(content, normUrl);

    for (const script of scripts) {
      if (state.isCrawlerStopped) break;
      await recursiveScan(script, maxDepth, currentDepth, targetHost);
    }

    if (currentDepth < maxDepth) {
      for (const link of links) {
        if (state.isCrawlerStopped) break;
        await recursiveScan(link, maxDepth, currentDepth + 1, targetHost);
      }
    }
  } catch (e) {
    console.warn(`Failed to scan ${normUrl}:`, e);
  }
}

// Optimized Line Counter - O(n) scan instead of O(n) string duplication
function getLineNumber(content, index) {
  let line = 1;
  let pos = 0;
  while ((pos = content.indexOf("\n", pos)) !== -1 && pos < index) {
    line++;
    pos++;
  }
  return line;
}

function extractEndpointsWithLines(content) {
  const matches = [...content.matchAll(endpointRegex)];
  return matches.map(m => ({
    value: m[1],
    line: getLineNumber(content, m.index)
  })).filter(e => {
    // Filter out Webhooks from standard endpoints so they show as Secrets (Warning color)
    if (e.value.includes("hooks.slack.com") || e.value.includes("discord.com/api/webhooks")) return false;
    return filterUrl(e.value);
  });
}

function extractSecretsWithLines(content) {
  // Fast-Path: If nothing looks like a secret, skip 20+ regex scans
  if (!secretTrigger.test(content)) return [];

  const found = [];
  for (const [name, regex] of Object.entries(secretPatterns)) {
    const matches = [...content.matchAll(regex)];
    matches.forEach(m => {
      // Prefer capture group if present (m[1]), otherwise use whole match (m[0])
      let val = (m[1] || m[0]).trim();

      // Anti-URL & False Positive Filter
      // skip long paths unless it's a URI
      if (val.includes("/") && val.split("/").length > 3 && !val.includes("://")) return;
      if (blockedSecretKeywords.some(bk => val.includes(bk))) return;
      if (val.length < 8 || val.length > 500) return;

      found.push({
        value: `${name}: ${val}`,
        line: getLineNumber(content, m.index)
      });
    });
  }
  return found;
}

function extractFilesWithLines(content) {
  // Path-Fidelity File Detection - Updated to prioritize absolute URLs and avoid internal protocol truncation
  const fileRegex = /((?:https?:\/\/|(?<=["']))[^"'\s<>]*\.(?:json|xml|config|env|yaml|yml|sql|db|bak|zip|tar|gz|7z|pdf|doc|docx|js|html|php|asp|aspx|jsp|txt)(?:\?[^"'\s]*)?)(?:["'\s]|$)/gi;
  const matches = [...content.matchAll(fileRegex)];

  return matches.map(m => ({
    value: m[1],
    line: getLineNumber(content, m.index)
  })).filter(f => {
    if (!f.value || f.value.startsWith(".")) return false;
    // Length check to avoid massive false positives
    if (f.value.length < 4 || f.value.length > 250) return false;
    return true;
  });
}

function extractInternalLinks(html, baseUrl) {
  const directoryBase = directoryfyUrl(baseUrl);
  const currentUrlObj = new URL(directoryBase);
  const targetHost = currentUrlObj.hostname.replace(/^www\./, ""); // Base domain comparison

  const re = /href=["']([^"']+)["']/gi;
  const links = [];
  let match;
  while ((match = re.exec(html)) !== null) {
    try {
      const url = new URL(match[1], directoryBase);
      const linkHost = url.hostname.replace(/^www\./, "");

      // Flexible Domain Matching (Allow subdomains and www)
      if ((linkHost === targetHost || url.hostname.endsWith("." + targetHost)) &&
        !url.pathname.endsWith(".js") && !url.pathname.endsWith(".css")) {
        links.push(normalizeUrl(url.href.split("#")[0]));
      }
    } catch { }
  }
  return [...new Set(links)];
}

function extractScriptUrls(html, baseUrl) {
  const directoryBase = directoryfyUrl(baseUrl);
  const currentUrlObj = new URL(directoryBase);
  const targetHost = currentUrlObj.hostname.replace(/^www\./, "");

  const re = /<script[^>]+src=["']([^"']+)["']/gi;
  const scripts = [];
  let match;
  while ((match = re.exec(html)) !== null) {
    try {
      const url = new URL(match[1], directoryBase);
      const scriptHost = url.hostname.replace(/^www\./, "");

      // Flexible Domain Matching for Scripts
      if (scriptHost === targetHost || url.hostname.endsWith("." + targetHost) || !url.hostname) {
        scripts.push(normalizeUrl(url.href));
      }
    } catch { }
  }
  return [...new Set(scripts)];
}

// Navigation & Tool Switching
const navCrawler = document.getElementById("navCrawler");
const navProber = document.getElementById("navProber");
const crawlerSection = document.getElementById("crawler-section");
const proberSection = document.getElementById("prober-section");

navCrawler.onclick = () => {
  navCrawler.classList.add("active");
  navProber.classList.remove("active");
  crawlerSection.style.display = "block";
  proberSection.style.display = "none";
};

navProber.onclick = () => {
  navProber.classList.add("active");
  navCrawler.classList.remove("active");
  proberSection.style.display = "block";
  crawlerSection.style.display = "none";
};

// v2.0: Probing & Parameter Discovery Logic
const probeBtn = document.getElementById("probeBtn");
const stopProbeBtn = document.getElementById("stopProbeBtn");
const proberResults = document.getElementById("prober-results");
const proberUrlInput = document.getElementById("proberUrlInput");
const proberProgressBar = document.getElementById("prober-progress-bar");
const proberProgressContainer = document.getElementById("prober-progress-container");
const proberStatus = document.getElementById("prober-status");

// Prober Stats Elements
const proberStat200 = document.getElementById("prober-stat-200");
const proberStat403 = document.getElementById("prober-stat-403");
const proberStat404 = document.getElementById("prober-stat-404");
const proberFilterSection = document.getElementById("prober-filter-section");

// v2.0 Length Filters
const proberLengthFilters = document.getElementById("prober-length-filters");
const proberIncludeLength = document.getElementById("proberIncludeLength");
const proberExcludeLength = document.getElementById("proberExcludeLength");

let proberData = []; // v2.0: Store results for filtering
let activeProberFilter = "all";
let isProberStopped = false;

probeBtn.onclick = async () => {
  let url = proberUrlInput.value.trim();
  if (!url) return alert("Enter a URL to probe");
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  try {
    // v2.0 Fix: Strip trailing slash from origin to prevent // in paths
    const origin = new URL(url).origin.replace(/\/+$/, "");
    proberResults.innerHTML = "";
    proberResults.style.display = "block";
    proberProgressContainer.style.display = "block";
    proberFilterSection.style.display = "flex"; // v2.0: Enable live filtering during scan
    proberLengthFilters.style.display = "flex"; // Show length filters
    proberProgressBar.style.width = "0%";
    const probPercentEl = document.getElementById("prober-progress-percent");
    if (probPercentEl) probPercentEl.innerText = "0%";

    // Reset Stats & Data
    proberData = [];
    let stats = { 200: 0, 403: 0, 404: 0 };
    proberStat200.innerText = "0";
    proberStat403.innerText = "0";
    proberStat404.innerText = "0";

    probeBtn.style.display = "none";
    stopProbeBtn.style.display = "inline-block";
    stopProbeBtn.disabled = false;
    isProberStopped = false;

    let completed = 0;
    const total = sensitivePaths.length;

    for (const path of sensitivePaths) {
      if (isProberStopped) {
        proberStatus.innerText = `Probing stopped manually.`;
        break;
      }
      completed++;
      const percent = Math.round((completed / total) * 100);
      proberProgressBar.style.width = percent + "%";
      const probPercentEl = document.getElementById("prober-progress-percent");
      if (probPercentEl) probPercentEl.innerText = percent + "%";
      proberStatus.innerText = `Probing: ${path} (${completed}/${total})`;

      // Ensure path starts with / but origin doesn't end with it
      const cleanPath = path.startsWith("/") ? path : "/" + path;
      const fullUrl = origin + cleanPath;
      const proxyUrlWithTarget = `https://aged-unit-e2e8.iamshafayat.workers.dev/?url=${encodeURIComponent(fullUrl)}`;

      try {
        const res = await fetch(proxyUrlWithTarget, { method: 'GET' });
        const status = res.status;
        const text = await res.text();
        const length = text.length;

        // Update stats
        if (status === 200) stats[200]++;
        else if (status === 403 || status === 401) stats[403]++;
        else stats[404]++; // 404 and others

        proberStat200.innerText = stats[200];
        proberStat403.innerText = stats[403];
        proberStat404.innerText = stats[404];

        const resultItem = { path, status, fullUrl, length };
        proberData.push(resultItem);

        // Live update UI if it matches current filter
        if (doesItemMatchFilters(resultItem)) {
          renderProberLine(path, status, fullUrl, length);
        }
      } catch (e) {
        stats[404]++;
        proberStat404.innerText = stats[404];
        const resultItem = { path, status: "ERROR", fullUrl, length: 0 };
        proberData.push(resultItem);

        if (doesItemMatchFilters(resultItem)) {
          renderProberLine(path, "ERROR", fullUrl, 0);
        }
      }
    }
    if (!isProberStopped) {
      proberStatus.innerText = `Probing complete! ${total} paths checked.`;
    }
    proberFilterSection.style.display = "flex";
  } catch (e) {
    alert("Invalid URL");
  } finally {
    probeBtn.style.display = "inline-block";
    stopProbeBtn.style.display = "none";
  }
};

stopProbeBtn.onclick = () => {
  isProberStopped = true;
  stopProbeBtn.disabled = true;
  proberStatus.innerText = "Stopping prober... Finishing current request.";
};

const filterProberResults = (filter) => {
  if (filter) activeProberFilter = filter;
  proberResults.innerHTML = "";

  proberData.forEach(item => {
    if (doesItemMatchFilters(item)) {
      renderProberLine(item.path, item.status, item.fullUrl, item.length);
    }
  });

  // Update button active state
  document.querySelectorAll("[data-prober-filter]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-prober-filter") === activeProberFilter);
  });
};

function doesItemMatchFilters(item) {
  // 1. Check Status Filter
  const statusNum = parseInt(item.status);
  let statusMatch = false;

  if (activeProberFilter === "all") statusMatch = true;
  else if (activeProberFilter === "200" && statusNum === 200) statusMatch = true;
  else if (activeProberFilter === "403" && (statusNum === 403 || statusNum === 401)) statusMatch = true;
  else if (activeProberFilter === "404" && (statusNum === 404 || item.status === "ERROR")) statusMatch = true;

  if (!statusMatch) return false;

  // 2. Check Length Filters (Include / Exclude)
  const incStrings = proberIncludeLength.value.split(',').map(s => s.trim()).filter(s => s !== "");
  const excStrings = proberExcludeLength.value.split(',').map(s => s.trim()).filter(s => s !== "");

  const itemLenStr = String(item.length);

  // If include list has items, item.length MUST be in the list
  if (incStrings.length > 0 && !incStrings.includes(itemLenStr)) {
    return false;
  }

  // If exclude list has items, item.length MUST NOT be in the list
  if (excStrings.length > 0 && excStrings.includes(itemLenStr)) {
    return false;
  }

  return true;
}

// Bind live length filtering
proberIncludeLength.addEventListener('input', () => filterProberResults());
proberExcludeLength.addEventListener('input', () => filterProberResults());

// Prober Filter Click Event
document.querySelectorAll("#prober-filter-section .tab-btn").forEach(btn => {
  btn.onclick = () => filterProberResults(btn.getAttribute("data-prober-filter"));
});

function renderProberLine(path, status, fullUrl, length) {
  const line = document.createElement("div");
  line.className = "prober-line";

  let statusClass = "status-error"; // Default Red
  if (status === 200) statusClass = "status-200"; // Green
  else if (status === 403) statusClass = "status-403"; // Orange
  else if (status === 401) statusClass = "status-401"; // Dark Orange
  else if (status === 404) statusClass = "status-404"; // Red (Specified)

  const lengthDisplay = length !== undefined ? `<span class="prober-length" style="color:var(--text-dim); font-size:0.85em; font-family: monospace;">[${length}]</span>` : '';

  let openBtnHtml = "";
  if (status === 200) {
    openBtnHtml = `<a href="${fullUrl}" target="_blank" class="prober-open-btn-200" style="margin-left: 0;">OPEN🔗</a>`;
  } else if (status === 403 || status === 401) {
    openBtnHtml = `<a href="${fullUrl}" target="_blank" class="prober-open-btn-403" style="margin-left: 0;">OPEN🔗</a>`;
  }

  line.innerHTML = `
    <span class="prober-path" style="flex: 1; word-break: break-all; padding-right: 15px;">${path}</span>
    <div style="display: flex; align-items: center; justify-content: flex-end; flex-shrink: 0;">
      <span class="prober-status ${statusClass}" style="width: 50px; text-align: center;">${status}</span>
      <div style="width: 75px; text-align: center; margin-left: 5px;">${openBtnHtml}</div>
      <div style="width: 75px; text-align: right; margin-left: 5px;">${lengthDisplay}</div>
    </div>
  `;

  // Remove loading text if first result
  if (proberResults.querySelector(".status")) proberResults.innerHTML = "";
  proberResults.appendChild(line);
}

// Comprehensive helper to identify files (aligned with regex)
function isInterestingFile(url) {
  if (!url) return false;
  const cleaned = url.split("?")[0].toLowerCase();
  const interestingExtensions = [
    ".json", ".xml", ".config", ".env", ".yaml", ".yml", ".sql", ".db", ".bak",
    ".zip", ".tar", ".gz", ".7z", ".pdf", ".doc", ".docx", ".js", ".html",
    ".php", ".asp", ".aspx", ".jsp", ".txt"
  ];
  return interestingExtensions.some(ext => cleaned.endsWith(ext));
}

function filterUrl(url) {
  const lowered = (url || "").toLowerCase();
  return (
    lowered &&
    !excludedExtensions.some(ext => lowered.endsWith(ext)) &&
    !externalDomainsToIgnore.some(domain => lowered.includes(domain)) &&
    !disallowedPrefixes.some(prefix => lowered.startsWith(prefix)) &&
    !lowered.includes("base64") &&
    lowered.length < 300
  );
}

function renderResults(filter = "", category = "all") {
  results.innerHTML = "";
  const grouped = {};

  state.allData.forEach(item => {
    if (category !== "all" && item.type !== category.slice(0, -1)) return;
    if (filter && !item.value.toLowerCase().includes(filter.toLowerCase())) return;

    if (!grouped[item.source]) grouped[item.source] = [];
    grouped[item.source].push(item);
  });

  const sourceEntries = Object.entries(grouped);
  if (sourceEntries.length === 0) {
    results.innerHTML = "<div class='status'>No results found matching your criteria.</div>";
    return;
  }

  for (const [source, items] of sourceEntries) {
    const card = document.createElement("div");
    card.className = "card";
    const title = document.createElement("h3");
    title.innerText = source;
    card.appendChild(title);

    const list = document.createElement("ol");
    items.forEach(item => {
      const li = document.createElement("li");

      const lineSpan = document.createElement("span");
      lineSpan.className = "line-number";
      lineSpan.innerText = `[L${item.line}]`;

      const span = document.createElement("span");
      span.className = `endpoint-text ${item.type === 'secret' ? 'secret-item' : ''}`;
      span.innerText = item.value;

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.innerHTML = "📋";
      copyBtn.onclick = () => copyToClipboard(item.value, copyBtn);

      li.appendChild(lineSpan);
      li.appendChild(span);
      li.appendChild(copyBtn);
      list.appendChild(li);
    });
    card.appendChild(list);
    results.appendChild(card);
  }
}

async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    btn.classList.add("copied");
    btn.innerText = "✅";
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerText = "📋";
    }, 2000);
  } catch { }
}

// Tabs & Filter Logic (Crawler Section)
document.querySelectorAll("#crawler-section .tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelector("#crawler-section .tab-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderResults(document.getElementById("filterInput").value, btn.dataset.tab);
  };
});

document.getElementById("filterInput").oninput = (e) => {
  const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
  renderResults(e.target.value, activeTab);
};

// Advanced Exports
const exportCsv = document.getElementById("exportCsv");
const exportMd = document.getElementById("exportMd");

exportCsv.onclick = () => {
  const csv = "Source,Line,Type,Value\n" + state.allData.map(d => `"${d.source}",${d.line},"${d.type}","${d.value.replace(/"/g, '""')}"`).join("\n");
  downloadFile("jjs-results.csv", csv, "text/csv");
};

exportMd.onclick = () => {
  let md = "# JSpider Scan Results\n\n";
  md += `**Total Endpoints:** ${state.endpoints.size}\n`;
  md += `**Total Secrets:** ${state.secrets.size}\n\n`;

  const grouped = {};
  state.allData.forEach(d => {
    if (!grouped[d.source]) grouped[d.source] = [];
    grouped[d.source].push(d);
  });

  for (const [src, items] of Object.entries(grouped)) {
    md += `### ${src}\n`;
    items.forEach(it => md += `- [L${it.line}] [${it.type}] ${it.value}\n`);
    md += "\n";
  }
  downloadFile("jjs-report.md", md, "text/markdown");
};

exportTxt.onclick = () => {
  const content = state.allData.map(d => `[L${d.line}] [${d.type}] ${d.value} (Source: ${d.source})`).join("\n");
  downloadFile("jjs-endpoints.txt", content, "text/plain");
};

exportJson.onclick = () => {
  const json = JSON.stringify(state.allData, null, 2);
  downloadFile("jjs-results.json", json, "application/json");
};

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }, 0);
}
