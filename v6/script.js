const rolesData = [
    { title: "Aircraft / A & P Mechanic", color: "#d9f99d" },
    { title: "Auto Body Technician", color: "#d9f99d" },
    { title: "Automotive Electrical Systems Tech", color: "#d9f99d" },
    { title: "Automotive Glass Installer", color: "#d9f99d" },
    { title: "Automotive Service Tech", color: "#d9f99d" },
    { title: "Avionics Technician", color: "#d9f99d" },
    { title: "Bike Technician", color: "#d9f99d" },
    { title: "Diesel Mechanic", color: "#bef142" },
    { title: "Heavy Equipment Mechanic", color: "#bef142" },
    { title: "Small Engine Mechanic", color: "#bef142" },
    { title: "Tire Changer / Technician", color: "#bef142" },
    { title: "Electronics Repairer", color: "#8b5cf6" },
    { title: "Industrial Machinery Mechanic", color: "#8b5cf6" },
    { title: "Maintenance Technician", color: "#8b5cf6" },
    { title: "HVAC Technician", color: "#06b6d4" },
    { title: "Wind Turbine Technician", color: "#06b6d4" },
    { title: "Solar Photovoltaic Installer", color: "#06b6d4" },
    { title: "Telecom Installer", color: "#06b6d4" },
    { title: "Network Technician", color: "#06b6d4" },
    { title: "Computer Support Specialist", color: "#06b6d4" },
    { title: "Medical Equipment Repairer", color: "#ef4444" },
    { title: "Laboratory Technician", color: "#ef4444" },
    { title: "Data Scientist", color: "#8b5cf6" },
    { title: "Cybersecurity Analyst", color: "#ef4444" },
    { title: "Systems Architect", color: "#06b6d4" },
    { title: "Software Engineer", color: "#06b6d4" },
    { title: "Cloud Specialist", color: "#bef142" },
    { title: "IT Manager", color: "#d9f99d" },
    { title: "UX Designer", color: "#8b5cf6" },
    { title: "Product Designer", color: "#8b5cf6" },
    { title: "Graphic Artist", color: "#ef4444" },
    { title: "Content Strategist", color: "#d9f99d" },
    { title: "Marketing Analyst", color: "#d9f99d" },
    { title: "Sales Engineer", color: "#bef142" },
    { title: "Project Lead", color: "#d9f99d" },
    { title: "Supply Chain Manager", color: "#d9f99d" },
    { title: "Logistics Specialist", color: "#bef142" },
    { title: "Financial Analyst", color: "#8b5cf6" },
    { title: "Risk Manager", color: "#8b5cf6" },
    { title: "Operations Director", color: "#d9f99d" },
];

const subRolesData = [
    "Specialized Tech", "Fleet Lead", "System Tech",
    "Safety Inspector", "QA Specialist", "Automation Lead",
    "Supervisor", "Tech Lead", "Process Owner"
];

const discoveryScene = document.getElementById('discovery-scene');
const pathView = document.getElementById('path-view');
const bentoGrid = document.getElementById('bento-grid');
const horizontalPath = document.getElementById('horizontal-path');
const pathRoleTitle = document.getElementById('path-role-title');
const pathHeaderId = document.getElementById('path-header-id');
const backBtn = document.getElementById('back-btn');
const hubBackPill = document.getElementById('hub-back-trigger');
const roleCount = document.getElementById('role-count');

let currentState = 'discovery';
let selectedRole = null;

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const cyberLabel = document.getElementById('cyber-label');

function initTheme() {
    const savedTheme = localStorage.getItem('v6-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeUI(true);
    }
}

function updateThemeUI(isLight) {
    if (isLight) {
        cyberLabel.textContent = 'USER_CONTEXT: PRISTINE';
    } else {
        cyberLabel.textContent = 'SYS_STATUS: ACTIVE';
    }
}

themeToggle.onclick = () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('v6-theme', isLight ? 'light' : 'dark');
    updateThemeUI(isLight);
};

function renderBentoGrid(roles, isSubRole = false) {
    bentoGrid.innerHTML = '';
    roleCount.textContent = roles.length;

    const sizes = ['tile-large', 'tile-wide', 'tile-tall', 'tile-small'];

    roles.forEach((role, i) => {
        const tile = document.createElement('div');
        // Random aesthetic sizing for bento look
        const sizeClass = isSubRole ? sizes[i % 2] : sizes[i % 4]; 
        tile.className = `bento-tile ${sizeClass}`;
        
        // Cyclic Job Level logic (L1 -> L4)
        const level = `L${(i % 4) + 1}`;
        const levelText = level === 'L1' ? 'Entry' : level === 'L2' ? 'Mid' : level === 'L3' ? 'Senior' : 'Lead';
        const jobLabel = `${level} ${levelText}`;
        
        tile.innerHTML = `
            <div class="tile-arrow">↗</div>
            <div class="tile-id">${jobLabel}</div>
            <div class="tile-title">${role.title}</div>
            <div class="tile-glow" style="background: radial-gradient(circle at center, ${role.color}20, transparent)"></div>
        `;

        tile.onclick = () => {
            if (currentState === 'discovery') drillDown(role, jobLabel);
            else if (currentState === 'sub-roles') showPathView(role, jobLabel);
        };

        bentoGrid.appendChild(tile);
        setTimeout(() => tile.classList.add('visible'), i * 20);
    });
}

function drillDown(role, jobLabel) {
    selectedRole = role;
    currentState = 'sub-roles';

    // Morph transition: Fade out current grid
    document.querySelectorAll('.bento-tile').forEach((el, idx) => {
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'scale(0.9) translateY(20px)';
        }, idx * 10);
    });

    setTimeout(() => {
        const subRoles = subRolesData.map(t => ({ title: t, color: role.color }));
        renderBentoGrid(subRoles, true);
        hubBackPill.classList.add('show');
        
        // Update Header to show context
        const glitchHeader = document.getElementById('glitch-header');
        glitchHeader.textContent = role.title.toUpperCase();
        glitchHeader.setAttribute('data-text', role.title.toUpperCase());
        document.querySelector('.cyber-label').textContent = `SYS_CONTEXT: SPECIALIZE_`;
    }, 400);
}

function showPathView(role, levelLabel) {
    currentState = 'path';
    pathRoleTitle.textContent = role.title;
    pathHeaderId.textContent = `LEVEL: ${levelLabel}`;

    renderPathSteps(role);
    discoveryScene.classList.add('hidden');
    hubBackPill.classList.remove('show');
    
    setTimeout(() => pathView.classList.add('visible'), 300);
}

function renderPathSteps(role) {
    horizontalPath.innerHTML = '';
    const titles = [
        role.title,
        `${role.title} II`,
        `Lead ${selectedRole.title.split(' ')[0]}`,
        `Sr. Consultant`,
        `Domain Principal`
    ];
    const descriptions = [
        "Core competency acquisition and situational awareness.",
        "Operational excellence and multi-vector troubleshooting.",
        "Strategic team orchestration and resource management.",
        "Architecture-level influence and systemic optimization.",
        "Global vision and industry-wide standard definition."
    ];

    titles.forEach((title, i) => {
        const step = document.createElement('div');
        step.className = 'path-step';
        step.style.setProperty('--delay', i + 1);
        step.innerHTML = `
            <div class="step-num">${String(i + 1).padStart(2, '0')}</div>
            <div class="step-main">
                <h3>${title}</h3>
                <p>${descriptions[i]}</p>
            </div>
            <div class="step-status">STAGE_${i + 1}_COMPLETED</div>
        `;
        horizontalPath.appendChild(step);
    });
}

function handleBack() {
    if (currentState === 'path') {
        pathView.classList.remove('visible');
        setTimeout(() => {
            discoveryScene.classList.remove('hidden');
            hubBackPill.classList.add('show');
            currentState = 'sub-roles';
        }, 500);
    } else if (currentState === 'sub-roles') {
        currentState = 'discovery';
        hubBackPill.classList.remove('show');
        
        const glitchHeader = document.getElementById('glitch-header');
        glitchHeader.textContent = 'OCCUPATION';
        glitchHeader.setAttribute('data-text', 'OCCUPATION');
        document.querySelector('.cyber-label').textContent = 'SYS_STATUS: ACTIVE';
        
        renderBentoGrid(rolesData);
    }
}

hubBackPill.onclick = handleBack;
backBtn.onclick = handleBack;

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderBentoGrid(rolesData);
});
