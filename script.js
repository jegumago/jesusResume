// ==========================================
// NEON PARTICLE SYSTEM & EFFECTS
// ==========================================
const sceneCanvas = document.getElementById('scene');
if (sceneCanvas) {
    const ctx = sceneCanvas.getContext('2d');
    let W, H;

    function resizeCanvas() {
        W = sceneCanvas.width = window.innerWidth;
        H = sceneCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.hue = Math.random() > 0.5 ? 180 : 300;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > W) this.speedX *= -1;
            if (this.y < 0 || this.y > H) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    const particles = [];
    for (let i = 0; i < 70; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = dx * dx + dy * dy;
                if (dist < 16900) {
                    const a = 0.12 * (1 - Math.sqrt(dist) / 130);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = particles[i].hue === 180 ? `rgba(0, 255, 255, ${a})` : `rgba(255, 0, 255, ${a})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    let mouseX = W / 2, mouseY = H / 2;
    let rafId;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateParticles() {
        ctx.fillStyle = 'rgba(5, 5, 8, 0.1)';
        ctx.fillRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 35, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        rafId = requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ==========================================
// MOUSE TRAIL
// ==========================================
const trail = document.getElementById('trail');
if (trail) {
    document.addEventListener('mousemove', (e) => {
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('.btn-gate, .btn-control, .btn-skip, .btn-decrypt, .inv-slot, a').forEach(el => {
        el.addEventListener('mouseenter', () => trail.classList.add('hovering'));
        el.addEventListener('mouseleave', () => trail.classList.remove('hovering'));
    });
}

// ==========================================
// LIVE CLOCK
// ==========================================
function updateClock() {
    const timeEl = document.getElementById('time');
    if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.toTimeString().split(' ')[0];
    }
}
updateClock();
setInterval(updateClock, 1000);

// ==========================================
// MATRIX RAIN EFFECT (DIGITAL RAIN)
// ==========================================
class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.drops = [];
        this.isRunning = false;
        this.animId = null;
        this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const cols = Math.floor(this.canvas.width / 20);
        this.drops = [];
        for (let i = 0; i < cols; i++) {
            this.drops[i] = Math.floor(Math.random() * -100);
        }
    }

    start() {
        if (this.isRunning) return;
        this.canvas.classList.remove('hidden');
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animId) cancelAnimationFrame(this.animId);
        if (this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.classList.add('hidden');
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.drops.length; i++) {
            const x = i * 20 + 10;
            const y = this.drops[i] * 20;
            if (y < 0) continue;

            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '18px monospace';
            this.ctx.fillText(char, x, y);

            // Trail
            for (let j = 1; j < 6; j++) {
                const ty = y - j * 20;
                if (ty < 0) break;
                const alpha = Math.max(0, 0.6 - j * 0.1);
                this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
                this.ctx.fillText(this.chars[Math.floor(Math.random() * this.chars.length)], x, ty);
            }

            if (y > this.canvas.height + 20 && Math.random() > 0.975) {
                this.drops[i] = 0;
            } else {
                this.drops[i]++;
            }
        }

        this.animId = requestAnimationFrame(() => this.animate());
    }
}

const matrixRain = new MatrixRain('matrix-rain');

// ==========================================
// ORIGINAL DOMContentLoaded CODE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 0. GATEKEEPER MODE SELECTION MATRIX
    // ==========================================
    const gatekeeperScreen = document.getElementById('gatekeeper-screen');
    const gateHrBtn = document.getElementById('gate-hr-btn');
    const gateTechBtn = document.getElementById('gate-tech-btn');
    const bootScreen = document.getElementById('boot-screen');
    const mainUi = document.getElementById('main-ui');

    function fadeReplace(hideEl, showEl, onDone) {
        if (!hideEl || !showEl) { if (onDone) onDone(); return; }
        const dur = 280;
        hideEl.style.transition = `opacity ${dur}ms ease, transform ${dur}ms ease`;
        hideEl.style.opacity = '0';
        hideEl.style.transform = 'scale(0.97)';
        setTimeout(() => {
            hideEl.classList.add('hidden');
            hideEl.style.opacity = '';
            hideEl.style.transform = '';
            hideEl.style.transition = '';
            showEl.classList.remove('hidden');
            showEl.style.transition = `opacity ${dur}ms ease, transform ${dur}ms ease`;
            showEl.style.opacity = '0';
            showEl.style.transform = 'scale(0.97)';
            showEl.getBoundingClientRect();
            showEl.style.opacity = '1';
            showEl.style.transform = 'scale(1)';
            setTimeout(() => {
                showEl.style.opacity = '';
                showEl.style.transform = '';
                showEl.style.transition = '';
                if (onDone) onDone();
            }, dur + 50);
        }, dur);
    }

    if (gateHrBtn && gatekeeperScreen) {
        gateHrBtn.addEventListener('click', () => {
            fadeReplace(gatekeeperScreen, mainUi, () => {
                revealSectionsSequentially();
                const hrToggleBtn = document.getElementById('hr-mode-btn');
                if (hrToggleBtn && !isHrMode) {
                    hrToggleBtn.click();
                }
            });
        });
    }

    if (gateTechBtn && gatekeeperScreen) {
        gateTechBtn.addEventListener('click', () => {
            matrixRain.start();
            fadeReplace(gatekeeperScreen, bootScreen, () => {
                printBootLine();
            });
        });
    }

    // RESET ENVIRONMENT CONTROL
    const resetPageBtn = document.getElementById('reset-page-btn');
    if (resetPageBtn) {
        resetPageBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // ==========================================
    // 1. TERMINAL BOOT SEQUENCE ENGINE WITH BYPASS
    // ==========================================
    const bootLines = [
        "Initializing MARTÍNEZ_CORE security handshake...",
        "Loading access control matrices... DONE",
        "Target profile located: JESÚS MARTÍNEZ // DEVOPS_SPEC",
        "Syncing metrics and portfolio asset cells...",
        "Bypassing enterprise network firewalls... SUCCESS",
        "Loading historical logs... DATA RETRIEVED (LOCKED)",
        "Handshake complete. Terminal connection stable."
    ];

    const bootLog = document.getElementById('boot-log');
    const skipBootBtn = document.getElementById('skip-boot-btn');
    let lineIndex = 0;
    let bootComplete = false;
    let bootTimeout;

    function printBootLine() {
        if (lineIndex < bootLines.length) {
            const p = document.createElement('p');
            p.textContent = `> ${bootLines[lineIndex]}`;
            if (bootLog) bootLog.appendChild(p);
            if (bootScreen) bootScreen.scrollTop = bootScreen.scrollHeight;
            lineIndex++;
            bootTimeout = setTimeout(printBootLine, 200);
        } else {
            const prompt = document.createElement('p');
            prompt.className = "blink-prompt";
            prompt.textContent = ">>> PRESS [ENTER] TO ACCESS USER_DECK_";
            if (bootLog) bootLog.appendChild(prompt);
            if (bootScreen) bootScreen.scrollTop = bootScreen.scrollHeight;
            bootComplete = true;
        }
    }

    if (skipBootBtn) {
        skipBootBtn.addEventListener('click', () => {
            clearTimeout(bootTimeout);
            bootComplete = false;
            matrixRain.stop();
            fadeReplace(bootScreen, mainUi, () => {
                const sections = document.querySelectorAll('.staggered-reveal');
                sections.forEach(s => s.classList.add('visible'));
            });
        });
    }

    window.addEventListener('keydown', function handleInitialEnter(e) {
        if (bootComplete && e.key === 'Enter') {
            window.removeEventListener('keydown', handleInitialEnter);
            bootComplete = false; 
            
            const blinker = document.querySelector('.blink-prompt');
            if (blinker) blinker.remove();

            const loginContainer = document.getElementById('login-prompt');
            if (!loginContainer) return;

            loginContainer.innerHTML = `
                <p>> ATTENTION: UNKNOWN NODE DETECTED ON NET_GRID.</p>
                <div class="terminal-input-line">
                    <span>ENTER USER_AGENT IDENTIFICATION:</span>
                    <input type="text" id="agent-input" class="terminal-input" autocomplete="off" autofocus>
                </div>
            `;

            const agentInput = document.getElementById('agent-input');
            if (agentInput) agentInput.focus();

            agentInput.addEventListener('keydown', (inputEvent) => {
                if (inputEvent.key === 'Enter' && agentInput.value.trim() !== "") {
                    const agentName = agentInput.value.trim().toUpperCase();
                    agentInput.disabled = true;
                    
                    const funnyUsernames = [
                        "NoobMaster69", "SanchosPanza_OS", "CtrlAltDefeat", 
                        "RootbeerAccess", "SalsaCore_v4", "CyberTaco_95", 
                        "WubbaLubbaDubDub", "Pickle_Rick_Root", "Lord_Vader_Admin", 
                        "MartyMcFly_85", "Jon_Snow_Cone", "Kernel_Panic_At_The_Disco"
                    ];
                    
                    const randomTargetId = funnyUsernames[Math.floor(Math.random() * funnyUsernames.length)];
                    
                    const sequenceDiv = document.createElement('div');
                    sequenceDiv.style.marginTop = "15px";
                    sequenceDiv.innerHTML = `
                        <p>> GREETINGS, AGENT // <span style="color:#fff;">${agentName}</span></p>
                        <p>TARGET_ID RECOVERY: <span style="color:#00ff99;">${randomTargetId}</span></p>
                        <p>ACCESS_KEY: <span id="pass-matrix" style="color:var(--accent-critical);">[ ACCESS_DENIED ]</span></p>
                    `;
                    loginContainer.appendChild(sequenceDiv);

                    const passMatrix = document.getElementById('pass-matrix');
                    let crackAttempts = 0;
                    const matrixChars = "0123456789ABCDEF!@#$";
                    
                    const crackInterval = setInterval(() => {
                        if (crackAttempts < 10) {
                            let randomHash = "";
                            for(let i=0; i<8; i++) {
                                randomHash += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                            }
                            passMatrix.textContent = `[ BYPASS_TRY: ${randomHash} ]`;
                            crackAttempts++;
                        } else {
                            clearInterval(crackInterval);
                            passMatrix.textContent = "[ ACCESS_GRANTED // TOKENS_VALIDATED ]";
                            passMatrix.style.color = "var(--accent-neon)";
                            initializeLoadingBar(loginContainer);
                        }
                    }, 90);
                }
            });
        }
    });

    function initializeLoadingBar(container) {
        const loadWrapper = document.createElement('div');
        loadWrapper.className = "loading-bar-container";
        loadWrapper.innerHTML = `<p>> INITIALIZING DECK ENVIRONMENT DECRYPTION...</p><p id="progress-text">[░░░░░░░░░░░░░░░░░░░░] 0%</p>`;
        container.appendChild(loadWrapper);

        const progressText = document.getElementById('progress-text');
        let currentProgress = 0;
        const totalBars = 20;

        const loadInterval = setInterval(() => {
            if (currentProgress <= 100) {
                const filledCount = Math.round((currentProgress / 100) * totalBars);
                const emptyCount = totalBars - filledCount;
                const barString = "█".repeat(filledCount) + "░".repeat(emptyCount);
                progressText.textContent = `[${barString}] ${currentProgress}%`;
                currentProgress += 5;
            } else {
                clearInterval(loadInterval);
                progressText.style.color = "var(--accent-neon)";
                
                const secureLaunch = document.createElement('p');
                secureLaunch.style.color = "var(--accent-neon)";
                secureLaunch.textContent = ">>> ENVIRONMENT RENDER SUCCESSFUL. BREAKING SHIELD.";
                container.appendChild(secureLaunch);

                setTimeout(() => {
                    matrixRain.stop();
                    fadeReplace(bootScreen, mainUi, () => {
                        revealSectionsSequentially();
                    });
                }, 800);
            }
        }, 60);
    }

    function revealSectionsSequentially() {
        const sections = document.querySelectorAll('.staggered-reveal');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('visible');
            }, index * 200);
        });
    }

    // OVERCLOCK MATRIX TOGGLE
    const overclockBtn = document.getElementById('overclock-btn');
    if (overclockBtn) {
        overclockBtn.addEventListener('click', () => {
            document.body.classList.toggle('overclocked');
            overclockBtn.textContent = document.body.classList.contains('overclocked') ? "RESTORE_DEFAULT" : "CORE_OVERCLOCK";
        });
    }

    // ACCESSIBILITY SWITCHES
    const toggleFontBtn = document.getElementById('toggle-font-btn');

    if (toggleFontBtn) {
        toggleFontBtn.addEventListener('click', () => {
            document.body.classList.toggle('readable-font');
            toggleFontBtn.textContent = document.body.classList.contains('readable-font') ? "[ TT_TERMINAL_FONT ]" : "[ AA_READABLE_FONT ]";
        });
    }

    // ==========================================
    // 2. HR TRANSLATION LEXICON
    // ==========================================
    const hrModeBtn = document.getElementById('hr-mode-btn');
    let isHrMode = false;

    const corporateTranslation = {
        cyber: {
            hrBtn: "[ SWITCH TO STANDARD CV ]",
            subtitle: "> Application Specialist // Tech Deck // DevOps & Admin",
            contact: 'LOC: CDMX // LANG: EN_ADV, ES_NAT // NET_LINK: <a href="https://www.linkedin.com/in/jesusmartinezg95/" target="_blank">linkedin.com/in/jesusmartinezg95/</a>',
            sec0Title: "[00] SYSTEM_METRICS",
            lblExp: "EXP_LEVEL", lblZone: "ZONE_DB", lblTv: "TICKET_VELOCITY", lblOs: "PRIMARY_OS", lblTool: "ADMIN_TOOL", lblLv: "LEARNING_VECTOR", lblDs: "DOCUMENTATION_SCORE", lblUt: "UPTIME", lblCc: "COFFEE_CONSUMPTION",
            sec1Title: "[01] HARDWARE_INVENTORY (SKILLS)",
            sec1Desc: "Select an item slot to extract technical metadata and sub-tools.",
            lblRarity: "RARITY: ", lblLevel: "SKILL_LEVEL: ",
            sec2Title: "[02] CONTRACT_LOG (EXPERIENCE_HISTORY)"
        },
        corporate: {
            hrBtn: "[ SWITCH TO HACKER MODE ]",
            subtitle: "Application Specialist & System Administrator (DevOps / Infrastructure Operations)",
            contact: 'Location: Mexico City | Languages: Fluent English, Native Spanish | LinkedIn: <a href="https://www.linkedin.com/in/jesusmartinezg95/" target="_blank">linkedin.com/in/jesusmartinezg95/</a>',
            sec0Title: "PROFESSIONAL SUMMARY & OPERATIONAL METRICS",
            lblExp: "TOTAL EXPERIENCE", lblZone: "LOCATION", lblTv: "TICKET MANAGEMENT", lblOs: "OPERATING SYSTEM BASE", lblTool: "PRIMARY PLATFORM", lblLv: "GROWTH PROFILE", lblDs: "DOCUMENTATION ABILITY", lblUt: "ATTENDANCE RELIABILITY", lblCc: "ENGAGEMENT PROFILE",
            sec1Title: "CORE TECHNICAL COMPETENCIES (SKILLS Inventory)",
            sec1Desc: "Click on any technical profile slot to evaluate practical administrative metrics and tool usage descriptions.",
            lblRarity: "METRIC CLASS: ", lblLevel: "PROFICIENCY ENGINE: ",
            sec2Title: "PROFESSIONAL WORK HISTORY"
        }
    };

    const enhancedItemData = {
        jira: {
            cyberTitle: "Jira_Cloud.cfg", corporateTitle: "Atlassian Jira Administration",
            cyberRarity: "SPEC", corporateRarity: "Platform Management Focus",
            cyberLevel: "PLATFORM_ADMIN", corporateLevel: "Functional Administrator",
            cyberDesc: "Coordinates platform configuration and user management within Atlassian Jira Cloud. Configures custom workflows, issue fields, security schemes, and Agile project boards to keep engineering squads completely aligned.",
            corporateDesc: "Coordinates system layout and permission control structures within corporate Atlassian Jira environments. Builds custom issue screens, automated workflow transition filters, and team metrics dashboards to stabilize delivery pipelines."
        },
        linux: {
            cyberTitle: "Linux_Core.bin", corporateTitle: "Linux Infrastructure Support",
            cyberRarity: "CORE", corporateRarity: "Systems Infrastructure Foundational",
            cyberLevel: "INFRA_FOUNDATION", corporateLevel: "Operating Systems Practitioner",
            cyberDesc: "Provides foundational operating system support using Red Hat Enterprise Linux (RHEL) and Ubuntu Server environments. Manages system access permissions, basic shell utilities, and monitors core services to ensure operational stability.",
            corporateDesc: "Maintains high-availability server performance across Red Hat Enterprise Linux (RHEL) and Ubuntu server distributions. Confirms secure directory layouts, user profile permissions, standard process operations, and background log file maintenance."
        },
        automation: {
            cyberTitle: "Automation.sh", corporateTitle: "Infrastructure Automation Scripting",
            cyberRarity: "UTILITY", corporateRarity: "Task Optimization Framework",
            cyberLevel: "SCRIPT_PRACTITIONER", corporateLevel: "Task Automation Intermediate",
            cyberDesc: "Develops custom Bash shell scripts and implements modular Ansible playbooks to remove manual drift, configure remote servers consistently, and optimize infrastructure tasks.",
            corporateDesc: "Mitigates operational errors by creating structured command scripts (Bash) and deploying reusable configuration routines (Ansible playbooks) to accurately set up remote workstation groups."
        },
        identity: {
            cyberTitle: "IAM_Access.key", corporateTitle: "Identity & Access Management (IAM)",
            cyberRarity: "SECURE", corporateRarity: "User Lifecycle Governance",
            cyberLevel: "ACCESS_GOVERNANCE", corporateLevel: "Access Provisioning Specialist",
            cyberDesc: "Non-expert practitioner handling enterprise user lifecycles. Manages secure onboarding, offboarding, and group mapping permissions across identity providers like Active Directory, Okta, PingID, and RSA tokens.",
            corporateDesc: "Safely runs standard end-user access workflows throughout employee lifecycles. Handles account onboarding, department shifting, and account closure protocols across Active Directory network groups, Okta layers, and multi-factor authentication tools like PingID and RSA."
        },
        cloud: {
            cyberTitle: "Cloud_Dev.env", corporateTitle: "Cloud Services Infrastructure (AWS)",
            cyberRarity: "VECTOR", corporateRarity: "Active Upskilling Vector",
            cyberLevel: "ACTIVE_LEARNING (40% & Loading)", corporateLevel: "Technical Advancement Path",
            cyberDesc: "Currently expanding capabilities into modern cloud architectures. Hands-on learning path focused on building Amazon Web Services (AWS) components like EC2 instances, S3 storage buckets, and basic Terraform infrastructure-as-code deployment scripts.",
            corporateDesc: "Actively training and extending domain expertise into modern cloud platforms. Exercises hands-on configurations with Amazon Web Services (AWS) infrastructure blocks, including EC2 instances, S3 file trees, security rules, and initial code blueprints via Terraform."
        },
        endpoint: {
            cyberTitle: "Endpoint_Mgmt.sys", corporateTitle: "Enterprise Endpoint Infrastructure",
            cyberRarity: "COMMON", corporateRarity: "System Architecture Delivery",
            cyberLevel: "75% COMPLIANT", corporateLevel: "Systems Management Experienced",
            cyberDesc: "Foundational systems experience deploying application packages and managing remote enterprise workstations. Works with Microsoft SCCM, Citrix virtualization infrastructure, and Microsoft Intune configuration profiles.",
            corporateDesc: "Maintains operational consistency across remote distributed computers and employee workstations. Dispatches structured application software setups and upgrades via Microsoft SCCM platforms, Citrix host environments, and Microsoft Intune deployment configuration policies."
        },
        agile: {
            cyberTitle: "Agile_Sprint.log", corporateTitle: "Agile Coordination & Support",
            cyberRarity: "PROCESS", corporateRarity: "Operational Lifecycle Track",
            cyberLevel: "PROGRESS: OPTIMIZED", corporateLevel: "Project Structure Coordinator",
            cyberDesc: "Handles day-to-day agile administrative tasks. Manages sprint board organization, board filters, and documentation spaces inside Confluence to ensure transparent tracking for cross-functional engineering teams.",
            corporateDesc: "Facilitates scrum methodology organization. Runs administrative data cleanup on delivery boards, audits filter queries, and sets up documentation wikis within Confluence to maintain team record alignment."
        },
        service: {
            cyberTitle: "Service_SLA.cfg", corporateTitle: "ITIL Service Delivery Monitoring",
            cyberRarity: "SERVICE", corporateRarity: "Enterprise Service Desk",
            cyberLevel: "PROGRESS: DISCIPLINED", corporateLevel: "Incident & SLA Tracking Specialist",
            cyberDesc: "Monitors multi-architecture enterprise ticket queues. Efficiently tracks incident response SLAs, provides technical resolution steps, and handles infrastructure escalations within ServiceNow tracking grids.",
            corporateDesc: "Monitors massive corporate IT ticket inflows to protect operational commitments. Diagnoses technical client bugs, registers response milestones, and routes network bottlenecks correctly inside ServiceNow tracking modules."
        },
        excel: {
            cyberTitle: "Data_Report.xlsx", corporateTitle: "Data Analysis & Excel Reporting",
            cyberRarity: "ANALYTIC", corporateRarity: "Performance Data Audit",
            cyberLevel: "PROGRESS: 85% SYNC", corporateLevel: "Advanced Spreadsheet Operations",
            cyberDesc: "Constructs clean data monitoring structures. Leverages advanced formulas, lookup trees, logic parameters, and formatted spreadsheet grids to track team velocity and isolate infrastructure blockers.",
            corporateDesc: "Handles corporate performance auditing datasets. Builds formulas, data matrices, and structured charts inside Microsoft Excel to summarize business ticket trends and help managers isolate workflow layout bottlenecks."
        },
        webdev: {
            cyberTitle: "Web_Dev.src", corporateTitle: "Frontend Web Development Foundations",
            cyberRarity: "INTERFACE", corporateRarity: "Web Application Core Structures",
            cyberLevel: "PROGRESS: 80% LOADED", corporateLevel: "Frontend UI Competent",
            cyberDesc: "Writes clean semantic HTML layouts, structural responsive CSS files, and baseline Javascript automation logic to construct fast, scannable browser tools and application frontends.",
            corporateDesc: "Capable of designing layout code bases using HTML, responsive layout style systems (CSS), and interactive user interface logic (JavaScript) to build clean dashboards and web interfaces."
        },
        ai: {
            cyberTitle: "AI_Leverage.run", corporateTitle: "AI Workflow Optimization & Adaptability",
            cyberRarity: "ADAPTIVE", corporateRarity: "Proactive Workflow Innovation",
            cyberLevel: "INTEGRATION_PATH // ACTIVE", corporateLevel: "Continuous Adaptation & Learning",
            cyberDesc: "Leverages modern generative models to write code faster, audit technical documentation, and accelerate research loops without creating system code dependencies. Strong natural capacity to adapt and adopt modern productivity suites.",
            corporateDesc: "Actively researches and integrates Artificial Intelligence models directly inside everyday working loops to optimize administrative speed, write scripts faster, and review technical data logs. Focuses on leveraging AI safely to maximize individual throughput without building tool dependencies."
        }
    };

    if (hrModeBtn) {
        hrModeBtn.addEventListener('click', () => {
            isHrMode = !isHrMode;
            const mode = isHrMode ? 'corporate' : 'cyber';

            if (isHrMode) {
                document.body.classList.add('readable-font', 'high-contrast-mode');
                if (toggleFontBtn) toggleFontBtn.textContent = "[ TT_TERMINAL_FONT ]";
                
                const decryptAllBtn = document.getElementById('decrypt-all-btn');
                if (decryptAllBtn) decryptAllBtn.click();
            } else {
                document.body.classList.remove('readable-font', 'high-contrast-mode');
                if (toggleFontBtn) toggleFontBtn.textContent = "[ AA_READABLE_FONT ]";
            }

            hrModeBtn.textContent = corporateTranslation[mode].hrBtn;
            document.getElementById('cv-subtitle').textContent = corporateTranslation[mode].subtitle;
            const metaEl = document.querySelector('.contact-meta');
            if (metaEl) metaEl.textContent = isHrMode ? 'Location: Mexico City | Languages: Fluent English, Native Spanish' : 'LOC: CDMX // LANG: EN_ADV, ES_NAT';
            
            document.getElementById('sec0-title').textContent = corporateTranslation[mode].sec0Title;
            document.getElementById('lbl-exp').textContent = corporateTranslation[mode].lblExp;
            document.getElementById('lbl-zone').textContent = corporateTranslation[mode].lblZone;
            document.getElementById('lbl-tv').textContent = corporateTranslation[mode].lblTv;
            document.getElementById('lbl-os').textContent = corporateTranslation[mode].lblOs;
            document.getElementById('lbl-tool').textContent = corporateTranslation[mode].lblTool;
            document.getElementById('lbl-lv').textContent = corporateTranslation[mode].lblLv;
            document.getElementById('lbl-ds').textContent = corporateTranslation[mode].lblDs;
            document.getElementById('lbl-ut').textContent = corporateTranslation[mode].lblUt;
            document.getElementById('lbl-cc').textContent = corporateTranslation[mode].lblCc;
            
            document.getElementById('sec1-title').textContent = corporateTranslation[mode].sec1Title;
            document.getElementById('sec1-desc').textContent = corporateTranslation[mode].sec1Desc;
            document.getElementById('sec2-title').textContent = corporateTranslation[mode].sec2Title;

            const slots = document.querySelectorAll('.inv-slot');
            slots.forEach(slot => {
                const itemKey = slot.getAttribute('data-item');
                if (enhancedItemData[itemKey]) {
                    slot.textContent = isHrMode ? enhancedItemData[itemKey].corporateTitle : enhancedItemData[itemKey].cyberTitle;
                }
            });

            const activeSlot = document.querySelector('.inv-slot.active');
            if (activeSlot) {
                const itemKey = activeSlot.getAttribute('data-item');
                refreshDisplayBlock(itemKey, mode);
            }
        });
    }

    function refreshDisplayBlock(itemKey, mode) {
        const data = enhancedItemData[itemKey];
        if (!data) return;
        
        document.getElementById('item-title').textContent = isHrMode ? data.corporateTitle : data.cyberTitle;
        document.getElementById('lbl-rarity').innerHTML = corporateTranslation[mode].lblRarity + `<span class="text-accent" id="item-rarity">${isHrMode ? data.corporateRarity : data.cyberRarity}</span>`;
        document.getElementById('lbl-level').innerHTML = corporateTranslation[mode].lblLevel + `<span id="item-level">${isHrMode ? data.corporateLevel : data.cyberLevel}</span>`;
        
        const descEl = document.getElementById('item-desc');
        const finalText = isHrMode ? data.corporateDesc : data.cyberDesc;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:<>?";
        let scrambleCount = 0;
        
        function runScramble() {
            if (scrambleCount < 5) {
                let temp = "";
                const len = Math.min(35, finalText.length);
                for (let i = 0; i < len; i++) {
                    temp += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                descEl.textContent = temp;
                scrambleCount++;
                setTimeout(runScramble, 35);
            } else {
                descEl.textContent = finalText;
            }
        }
        runScramble();
    }

    const inventorySlots = document.querySelectorAll('.inv-slot');
    inventorySlots.forEach(slot => {
        slot.addEventListener('click', (e) => {
            inventorySlots.forEach(s => s.classList.remove('active'));
            e.target.classList.add('active');
            const itemKey = e.target.getAttribute('data-item');
            const mode = isHrMode ? 'corporate' : 'cyber';
            refreshDisplayBlock(itemKey, mode);
        });
    });

    // ==========================================
    // 3. TRANSACTION LOG DECRYPTION ENGINE
    // ==========================================
    const experienceDatabase = {
        "role-tideworks": `
            <div class="terminal-experience-box">
                <div class="experience-header">
                    <span class="role-title">Application Specialist // Tideworks</span>
                    <span class="role-date">2022 - PRESENT</span>
                </div>
                <div class="experience-metadata">
                    <span class="tag-accent">CORE_DECK</span>
                    <span class="tag-divider">//</span>
                    <span class="tag-secondary">REMOTE</span>
                </div>
                <hr class="box-divider">
                <div class="experience-content">
                    <div class="decryption-status-line">
                        <span class="status-indicator-dot"></span>
                        <span class="status-text">[ ACCESS GRANTED ]</span>
                    </div>
                    <div class="company-log-block">
                        <span class="company-name">Company: TIDEWORKS //</span>
                        <ul class="clean-log-bullets">
                            <li>Leads enterprise Jira Cloud administration blueprints across global engineering segments.</li>
                            <li>Preserves complete user lifecycle security maps across Active Directory nodes and integrated developer tool licenses.</li>
                            <li>Manages automated sprint lifecycle schedules, backlog filters, and deploys SSH logic to decrease manual infrastructure routines.</li>
                        </ul>
                    </div>
                </div>
            </div>`,
        
        "role-tcs": `
            <div class="terminal-experience-box">
                <div class="experience-header">
                    <span class="role-title">Assistant Systems Engineer L1.5 // TCS</span>
                    <span class="role-date">2020 - 2022</span>
                </div>
                <div class="experience-metadata">
                    <span class="tag-accent">INFRA_DECK</span>
                    <span class="tag-divider">//</span>
                    <span class="tag-secondary">GLOBAL_ENTERPRISE</span>
                </div>
                <hr class="box-divider">
                <div class="experience-content">
                    <div class="decryption-status-line">
                        <span class="status-indicator-dot"></span>
                        <span class="status-text">[ ACCESS GRANTED ]</span>
                    </div>
                    <div class="company-log-block">
                        <span class="company-name">Company: TATA CONSULTANCY SERVICES //</span>
                        <ul class="clean-log-bullets">
                            <li>Dispatched Tier 2 infrastructure core engineering across wide industrial enterprise networks.</li>
                            <li>Controlled secure authentication keys via Active Directory, RSA tokens, PingID, and secure VPN portals.</li>
                            <li>Deployed application layers over corporate pools via SCCM arrays, virtualized Citrix platforms, and InTune profiles.</li>
                        </ul>
                    </div>
                </div>
            </div>`,
        
        "role-mahindra": `
            <div class="terminal-experience-box">
                <div class="experience-header">
                    <span class="role-title">Tech Support Level I // Tech Mahindra</span>
                    <span class="role-date">2019 - 2020</span>
                </div>
                <div class="experience-metadata">
                    <span class="tag-accent">VM_DECK</span>
                    <span class="tag-divider">//</span>
                    <span class="tag-secondary">TELEPHONY_MONITOR</span>
                </div>
                <hr class="box-divider">
                <div class="experience-content">
                    <div class="decryption-status-line">
                        <span class="status-indicator-dot"></span>
                        <span class="status-text">[ ACCESS GRANTED ]</span>
                    </div>
                    <div class="company-log-block">
                        <span class="company-name">Company: TECH MAHINDRA //</span>
                        <ul class="clean-log-bullets">
                            <li>Governed ongoing stability matrix across isolated Windows architectures, Citrix sandbox clusters, core Mainframe access links, and Cisco routing networks.</li>
                            <li>Identified critical platform blockages and escalated infrastructure incidents inside ServiceNow grids while producing compliance metrics logs.</li>
                        </ul>
                    </div>
                </div>
            </div>`,
        
        "role-compucom": `
            <div class="terminal-experience-box">
                <div class="experience-header">
                    <span class="role-title">Service Experience // Compucom</span>
                    <span class="role-date">2019 - 2019</span>
                </div>
                <div class="experience-metadata">
                    <span class="tag-accent">ENDPOINT_DECK</span>
                    <span class="tag-divider">//</span>
                    <span class="tag-secondary">TRAINING_NODES</span>
                </div>
                <hr class="box-divider">
                <div class="experience-content">
                    <div class="decryption-status-line">
                        <span class="status-indicator-dot"></span>
                        <span class="status-text">[ ACCESS GRANTED ]</span>
                    </div>
                    <div class="company-log-block">
                        <span class="company-name">Company: COMPUCOM //</span>
                        <ul class="clean-log-bullets">
                            <li>Administered unified hardware support layers across multi-architecture nodes including Windows, iOS, and Android endpoints.</li>
                            <li>Generated internal knowledge assets and conducted interactive team training blueprints regarding Active Directory operations, Citrix frameworks, OKTA mapping, and SCCM usage.</li>
                        </ul>
                    </div>
                </div>
            </div>`
    };

    const decryptButtons = document.querySelectorAll('.action-decrypt');
    const decryptAllBtn = document.getElementById('decrypt-all-btn');

    function decryptLog(btn, targetId, instant = false) {
        const logContainer = document.getElementById(targetId);
        const fullText = experienceDatabase[targetId];
        if (!logContainer || !fullText) return;

        if (btn) {
            btn.textContent = "[ ACCESS GRANTED ]";
            btn.classList.add('decrypted');
        }
        logContainer.classList.remove('encrypted');

        if (instant) {
            logContainer.innerHTML = fullText;
        } else {
            logContainer.innerHTML = "";
            let scrambleCount = 0;
            const totalScrambles = 14;
            const chars = "XX//$$##@@0110_?!<>[]{}|;:ABCDEF01";
            
            function runScramble() {
                if (scrambleCount < totalScrambles) {
                    const len = scrambleCount < 4 ? 8 : (scrambleCount < 9 ? 16 : 28);
                    let tmp = "";
                    for (let i = 0; i < len; i++) {
                        tmp += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    logContainer.textContent = tmp;
                    
                    // Glitch flash on container border
                    if (scrambleCount % 2 === 0) {
                        logContainer.style.borderColor = 'var(--accent-critical)';
                        logContainer.style.borderLeftColor = 'var(--accent-critical)';
                        setTimeout(() => {
                            logContainer.style.borderColor = '';
                            logContainer.style.borderLeftColor = '';
                        }, 60);
                    }
                    
                    scrambleCount++;
                    const delay = scrambleCount < 5 ? 45 : (scrambleCount < 10 ? 55 : 70);
                    setTimeout(runScramble, delay);
                } else {
                    logContainer.style.borderColor = '';
                    logContainer.style.borderLeftColor = '';
                    logContainer.innerHTML = fullText;
                }
            }
            runScramble();
        }
    }

    decryptButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            decryptLog(e.target, targetId, false);
        });
    });

    if (decryptAllBtn) {
        decryptAllBtn.addEventListener('click', () => {
            decryptButtons.forEach(button => {
                const targetId = button.getAttribute('data-target');
                decryptLog(null, targetId, true);
            });
            decryptAllBtn.textContent = "[ ALL_LOGS_DECRYPTED ]";
            decryptAllBtn.style.borderColor = "var(--accent-neon)";
            decryptAllBtn.style.color = "var(--accent-neon)";
        });
    }
});