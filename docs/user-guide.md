📦 Manual Installation

Clone Repository

bashgit clone https://github.com/FeanorJD/wotanzeroday-gungnir.git
cd wotanzeroday-gungnir

Install Dependencies

bashnpm install

Start Development Server

bashnpm start

Access Gungnir

Open browser: http://localhost:3000
Default credentials: No authentication required for demo



🐳 Docker Installation
Using Docker Compose (Recommended)
bashgit clone https://github.com/FeanorJD/wotanzeroday-gungnir.git
cd wotanzeroday-gungnir
docker-compose up -d
Using Docker
bashdocker build -t gungnir .
docker run -p 3000:80 gungnir
🚀 Production Deployment
Build for Production
bashnpm run build
Deploy with nginx
bash# Install serve globally
npm install -g serve

# Deploy
npm run deploy
Environment Variables
Create .env file:
REACT_APP_API_URL=https://your-api-endpoint.com
REACT_APP_THREAT_INTEL_KEY=your-key-here
REACT_APP_ENVIRONMENT=production
🔧 Configuration
Scanner Configuration
Edit src/config/scanner.js:
javascriptexport const scannerConfig = {
  maxConcurrentScans: 10,
  defaultTimeout: 30000,
  retryAttempts: 3,
  threatIntelFeeds: [
    'misp',
    'opencti',
    'custom'
  ]
};
🧪 Verification
Run the test suite:
bashnpm test
Check system health:
bashnpm run health-check
🚨 Troubleshooting
Common Issues
Port 3000 already in use:
bash# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
Permission denied on scripts:
bashchmod +x scripts/*.sh
Node.js version issues:
bash# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install latest Node.js
nvm install node
nvm use node
📱 Browser Compatibility
BrowserVersionStatusChrome90+✅ Fully SupportedFirefox88+✅ Fully SupportedSafari14+✅ Fully SupportedEdge90+✅ Fully Supported
🔐 Security Notes

Change default configurations in production
Use HTTPS in production environments
Regularly update dependencies
Monitor for security advisories

📞 Support

Issues: GitHub Issues
Documentation: Wiki
Email: pablo.bobadilla@cybersec.ar


The spear that never misses its target 🎯

### **docs/user-guide.md**
```markdown
# User Guide - Wotanzeroday Gungnir

## 🏹 Welcome to Gungnir

Gungnir is your advanced SOC platform designed for precision threat hunting and zero-day vulnerability discovery. This guide will help you master the spear that never misses.

## 🎯 Interface Overview

### Main Dashboard
- **Tactical Overview**: Real-time threat landscape
- **Neural Scanner**: Advanced vulnerability assessment
- **Threat Correlation**: Multi-stage attack detection
- **Hunt Platform**: Custom threat hunting queries
- **Intel Feed**: Live threat intelligence
- **Ops Journal**: Operational activity log

## 🔍 Neural Scanner

### Quick Scan
1. Navigate to "Neural Scanner" tab
2. Enter target (IP, domain, or range)
3. Select scan profile:
   - **Stealth Reconnaissance**: Minimal footprint
   - **Aggressive Enumeration**: Comprehensive discovery
   - **Vulnerability Assessment**: CVE correlation
   - **Red Team Simulation**: Full attack chain
   - **Compliance Validation**: Regulatory alignment
4. Click "Execute Advanced Scan"

### Interpreting Results
- **Risk Score**: 0-10 scale (10 = critical)
- **Exploitability**: Ease of exploitation
- **Business Impact**: Potential damage assessment
- **Recommendations**: Actionable remediation steps

## 🧠 Threat Correlation Engine

### Understanding Alerts
- **Critical**: Immediate action required
- **High**: Investigate within 1 hour
- **Medium**: Review within 4 hours
- **Low**: Monitor and document

### Attack Timeline
The correlation engine reconstructs multi-stage attacks:
1. Initial reconnaissance
2. Lateral movement attempts
3. Privilege escalation
4. Data exfiltration

## 🎯 Threat Hunting Platform

### Query Templates
Use pre-built hunting queries:
- PowerShell execution analysis
- Lateral movement detection
- Suspicious DNS queries

### Custom Queries
Write KQL/Splunk compatible queries:
```kql
// Example: Hunt for suspicious processes
ProcessEvents
| where ProcessName contains "powershell"
| where CommandLine contains "EncodedCommand"
| summarize count() by Computer
Best Practices

Start with broad queries, narrow down
Use time windows for focused hunting
Correlate across multiple data sources
Document findings in Ops Journal

📊 Tactical Intelligence Feed
IOC Management

Confidence Levels: 0-100% reliability
MITRE ATT&CK: Technique mapping
Source Attribution: Intel feed origin
Analyst Notes: Contextual information

Acting on Intelligence

Investigate: Deep dive into indicators
Resolve: Mark as handled
Escalate: Pass to incident response team

📝 Operations Journal
Activity Logging
All operations are automatically logged:

Scan executions
Hunt query results
Threat investigations
System events

Log Types

INFO: General operations
RUNNING: Active processes
COMPLETED: Finished tasks
ERROR: System errors
HUNTING: Query results

🚀 Advanced Features
Export Capabilities
Generate comprehensive reports:

JSON format for API integration
Include findings and recommendations
Compliance-ready documentation

Performance Optimization

Monitor system health metrics
Optimize scan parameters
Balance thoroughness vs speed

🔧 Customization
Scan Profiles
Create custom scanning profiles:
javascript{
  name: "Custom Profile",
  intensity: "medium",
  techniques: ["port-scan", "service-enum"],
  timeout: 30000
}
Alert Thresholds
Adjust sensitivity levels:

ML detection confidence
Anomaly scoring
Correlation windows

📈 SOC Workflows
Level 1 Analyst Tasks

Monitor tactical overview
Triage incoming alerts
Execute predefined scans
Document initial findings

Level 2 Analyst Tasks

Investigate complex threats
Create custom hunt queries
Correlate multi-source events
Escalate critical findings

Level 3 Analyst Tasks

Design new detection rules
Tune correlation engines
Mentor junior analysts
Strategic threat assessment

🛡️ Security Best Practices
Operational Security

Rotate scanning targets
Vary scan timing patterns
Use distributed scanning
Monitor for counter-surveillance

Data Handling

Classify threat intelligence
Secure export procedures
Maintain audit trails
Follow retention policies

🚨 Incident Response Integration
Alert Escalation

Validate threat indicators
Assess business impact
Coordinate response team
Document lessons learned

Playbook Integration

Automated response workflows
Standardized procedures
Metrics collection
Post-incident review

📞 Getting Help
Documentation Resources
Installation Guide: /docs/installation.md
Troubleshooting: GitHub Issues

Community Support

GitHub Discussions
SOC Analyst Forums
Security Conferences

Professional Support

Email: pablo.bobadilla@cybersec.ar
Enterprise consulting available

🎯 Pro Tips
Efficient Scanning

Use network ranges for bulk scans
Schedule scans during low-traffic periods
Combine multiple scan types for comprehensive coverage
Monitor target infrastructure changes

Threat Hunting Excellence

Develop hypothesis-driven hunts
Use threat intelligence to guide searches
Create repeatable hunt procedures
Share findings with security community

Operational Excellence

Maintain detailed documentation
Regular tool updates and maintenance
Continuous skill development
Cross-train team members


Master the spear - never miss your target 🏹
Developed by Pablo Bobadilla - SOC L3 Analyst

### **CONTRIBUTING.md**
```markdown
# Contributing to Wotanzeroday - Gungnir

First off, thanks for taking the time to contribute! 🏹

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find that you don't need to create one. When you create a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what behavior you expected**
* **Include screenshots if applicable**
* **Include your environment details** (OS, Node.js version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:
* `good-first-issue` - issues which should only require a few lines of code
* `help-wanted` - issues which are a bit more involved

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the JavaScript/React style guides
* Include thoughtfully-worded, well-structured tests
* Document new code based on the Documentation Styleguide
* End all files with a newline

## Development Process

### Setup Development Environment

```bash
git clone https://github.com/FeanorJD/wotanzeroday-gungnir.git
cd wotanzeroday-gungnir
npm install
npm start
Branch Naming Convention

feature/description - for new features
bugfix/description - for bug fixes
hotfix/description - for critical fixes
docs/description - for documentation updates

Commit Messages
Follow the conventional commits specification:
type(scope): short description

Longer description if needed

- Bullet points for details
- Reference issues with #123
Types:

feat - new feature
fix - bug fix
docs - documentation changes
style - formatting changes
refactor - code restructuring
test - adding tests
chore - maintenance tasks

Testing
bash# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test
npm test -- --testNamePattern="Scanner"
Code Style
We use ESLint and Prettier for code formatting:
bash# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code with Prettier
npm run format
Security Vulnerabilities
If you discover a security vulnerability, please send an email to pablo.bobadilla@cybersec.ar instead of creating a public issue.
Recognition
Contributors will be recognized in:

README.md contributors section
Release notes for significant contributions
Annual contributor acknowledgments

Questions?
Feel free to reach out:

GitHub Discussions
Email: pablo.bobadilla@cybersec.ar
Twitter: @pbobadilla_sec

License
By contributing, you agree that your contributions will be licensed under the MIT License.

Together we forge the perfect spear 🛠️⚡

### **SECURITY.md**
```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.3.x   | :white_check_mark: |
| 2.2.x   | :white_check_mark: |
| 2.1.x   | :x:                |
| < 2.1   | :x:                |

## Reporting a Vulnerability

### Security Contact

For security issues, please email: **pablo.bobadilla@cybersec.ar**

**DO NOT** create public GitHub issues for security vulnerabilities.

### Response Timeline

* **Initial Response**: Within 24 hours
* **Assessment**: Within 72 hours  
* **Fix Timeline**: Critical issues within 7 days, others within 30 days
* **Public Disclosure**: After fix is deployed and users have time to update

### What to Include

Please include:
* Description of the vulnerability
* Steps to reproduce
* Potential impact
* Any proof-of-concept code (if applicable)
* Your contact information

### Security Measures

Gungnir implements several security measures:

* **Input Validation**: All user inputs are validated and sanitized
* **HTTPS Only**: Enforced in production environments
* **CSP Headers**: Content Security Policy implemented
* **Dependency Scanning**: Regular security audits of dependencies
* **Secure Defaults**: Security-first configuration

### Known Security Considerations

* This tool is designed for authorized security testing only
* Ensure proper authorization before scanning any systems
* Use in compliance with local and international laws
* Implement proper access controls in production deployments

### Bug Bounty

Currently, we don't offer a formal bug bounty program, but we do recognize security researchers:

* Hall of Fame recognition
* Acknowledgment in release notes
* Direct communication with development team

### Security Updates

Security updates are released as patch versions and include:
* Clear description of the issue (after disclosure period)
* Impact assessment
* Mitigation steps
* Upgrade instructions

---

**Security is everyone's responsibility** 🛡️
tailwind.config.js
javascript/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'Consolas']
      },
      colors: {
        gungnir: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        },
        norse: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      backdropBlur: {
        'xs': '2px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
Scripts de instalación automática
package-lock.json - Este se genera automáticamente cuando ejecutas npm install
Instrucciones finales de setup:
bash# 1. Crear el repositorio
mkdir wotanzeroday-gungnir
cd wotanzeroday-gungnir

# 2. Inicializar Git
git init
git branch -m main

# 3. Copiar todos los archivos (según la estructura mostrada)

# 4. Instalar dependencias
npm install
npm install --save-dev @tailwindcss/forms @tailwindcss/typography

# 5. Hacer el primer commit
git add .
git commit -m "Initial commit: Wotanzeroday Gungnir platform

🏹 The Spear of Zero-Day Detection

- Advanced SOC platform for enterprise security
- Neural scanning engine with ML correlation
- Real-time threat intelligence integration  
- Norse mythology themed UI/UX
- Built for SOC L1/L2/L3 analysts

Features:
✅ Zero-day behavioral analysis
✅ Multi-stage attack correlation
✅ Advanced threat hunting platform
✅ Tactical intelligence feed
✅ Compliance reporting modules

Author: Pablo Bobadilla - SOC L3 Analyst"

# 6. Crear el repositorio en GitHub y conectar
git remote add origin https://github.com/FeanorJD/wotanzeroday-gungnir.git
git push -u origin main

# 7. Crear tags y branches (usar los comandos del mensaje anterior)
🎯 Comandos para el usuario final:
Una vez publicado, cualquier persona puede usar:
bash# Instalación rápida
git clone https://github.com/FeanorJD/wotanzeroday-gungnir.git
cd wotanzeroday-gungnir
chmod +x scripts/install.sh && ./scripts/install.sh
npm start

# O con Docker
git clone https://github.com/FeanorJD/wotanzeroday-gungnir.git
cd wotanzeroday-gungnir  
docker-compose up -d
