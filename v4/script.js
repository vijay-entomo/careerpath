const rolesData = [
    { title: "Aircraft / A & P Mechanic", color: "#f97066" },
    { title: "Auto Body Technician", color: "#f97066" },
    { title: "Automotive Electrical Systems Tech", color: "#f97066" },
    { title: "Automotive Glass Installer", color: "#fb923c" },
    { title: "Automotive Service Tech", color: "#fb923c" },
    { title: "Avionics Technician", color: "#fb923c" },
    { title: "Bike Technician", color: "#f97066" },
    { title: "Diesel Mechanic", color: "#34d399" },
    { title: "Heavy Equipment Mechanic", color: "#34d399" },
    { title: "Small Engine Mechanic", color: "#34d399" },
    { title: "Tire Changer / Technician", color: "#34d399" },
    { title: "Electronics Repairer", color: "#8b5cf6" },
    { title: "Industrial Machinery Mechanic", color: "#8b5cf6" },
    { title: "Maintenance Technician", color: "#8b5cf6" },
    { title: "HVAC Technician", color: "#34d399" },
    { title: "Wind Turbine Technician", color: "#34d399" },
    { title: "Solar Photovoltaic Installer", color: "#34d399" },
    { title: "Telecom Installer", color: "#38bdf8" },
    { title: "Network Technician", color: "#38bdf8" },
    { title: "Computer Support Specialist", color: "#38bdf8" },
    { title: "Medical Equipment Repairer", color: "#e879a4" },
    { title: "Laboratory Technician", color: "#e879a4" },
    { title: "Data Scientist", color: "#8b5cf6" },
    { title: "Cybersecurity Analyst", color: "#f97066" },
    { title: "Systems Architect", color: "#38bdf8" },
    { title: "Software Engineer", color: "#38bdf8" },
    { title: "Cloud Specialist", color: "#34d399" },
    { title: "IT Manager", color: "#fb923c" },
    { title: "UX Designer", color: "#8b5cf6" },
    { title: "Product Designer", color: "#8b5cf6" },
    { title: "Graphic Artist", color: "#e879a4" },
    { title: "Content Strategist", color: "#fb923c" },
    { title: "Marketing Analyst", color: "#fb923c" },
    { title: "Sales Engineer", color: "#34d399" },
    { title: "Project Lead", color: "#f97066" },
    { title: "Supply Chain Manager", color: "#f97066" },
    { title: "Logistics Specialist", color: "#34d399" },
    { title: "Financial Analyst", color: "#8b5cf6" },
    { title: "Risk Manager", color: "#8b5cf6" },
    { title: "Operations Director", color: "#fb923c" },
];

const subRolesData = [
    "Specialized Tech", "Fleet Lead", "System Tech",
    "Safety Inspector", "QA Specialist", "Automation Lead",
    "Supervisor", "Tech Lead", "Process Owner"
];

const discoveryScene = document.getElementById('discovery-scene');
const pathView = document.getElementById('path-view');
const horizontalPath = document.getElementById('horizontal-path');
const pathRoleTitle = document.getElementById('path-role-title');
const pathHeaderDot = document.getElementById('path-header-dot');
const backBtn = document.getElementById('back-btn');
const hubLabel = document.getElementById('hub-label');
const hubSub = document.getElementById('hub-sub');
const mainHub = document.getElementById('main-hub');
const hubBackTrigger = document.getElementById('hub-back-trigger');
const rolesList = document.getElementById('roles-list');

let currentState = 'discovery';
let selectedRole = null;

// ── Render Roles as a Vertical List ──
function renderRolesList(roles, isSubRole = false) {
    rolesList.innerHTML = '';
    roles.forEach((role, i) => {
        const item = document.createElement('div');
        item.className = 'role-item';
        item.innerHTML = `
            <div class="role-item-dot" style="background-color: ${role.color}"></div>
            <span class="role-item-title">${role.title}</span>
            <span class="role-item-arrow">›</span>
        `;

        item.onclick = () => {
            if (currentState === 'discovery') {
                drillDown(role);
            } else if (currentState === 'sub-roles') {
                showPathView(role);
            }
        };

        rolesList.appendChild(item);

        // Staggered entry animation
        setTimeout(() => item.classList.add('visible'), i * 30);
    });
}

function drillDown(role) {
    selectedRole = role;
    currentState = 'sub-roles';

    // Fade out current list items
    document.querySelectorAll('.role-item').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(20px)';
    });

    // Update hub
    setTimeout(() => {
        hubLabel.textContent = role.title;
        hubLabel.style.color = role.color;
        hubSub.textContent = 'Select a specialization for career path';
        mainHub.classList.add('drilled');

        // Render sub-roles
        const subRoles = subRolesData.map(t => ({ title: t, color: role.color }));
        renderRolesList(subRoles, true);
    }, 300);
}

function showPathView(role) {
    currentState = 'path';
    pathRoleTitle.textContent = role.title;
    pathHeaderDot.style.background = `linear-gradient(135deg, ${selectedRole.color}, ${lighten(selectedRole.color, 40)})`;

    renderPathSteps(role);

    discoveryScene.classList.add('hidden');
    setTimeout(() => pathView.classList.add('visible'), 300);
}

function renderPathSteps(role) {
    horizontalPath.innerHTML = '';
    const titles = [
        role.title,
        `${role.title} — Advanced`,
        `${selectedRole.title.split(' ')[0]} Lead Specialist`,
        `${selectedRole.title.split(' ')[0]} Consultant`,
        `${selectedRole.title.split(' ')[0]} Director`
    ];
    const stages = ["Start", "Expert", "Leader", "Advisor", "Head"];
    const descriptions = [
        "Foundational certification and hands-on training.",
        "2–4 years experience, advanced specialty skills.",
        "Team leadership and cross-functional expertise.",
        "Strategic advisory and mentoring capability.",
        "Executive-level impact and industry influence."
    ];

    titles.forEach((title, i) => {
        const step = document.createElement('div');
        step.className = 'path-step';
        step.style.setProperty('--delay', i + 1);
        step.innerHTML = `
            <div class="step-indicator">
                <div class="step-dot" style="${i === 0 ? `border-color:${selectedRole.color};box-shadow:0 0 12px ${selectedRole.color}` : ''}"></div>
                <span class="step-number">${String(i + 1).padStart(2, '0')}</span>
            </div>
            <div class="step-content">
                <span class="step-tag" style="color:${selectedRole.color};background:${selectedRole.color}14">${stages[i]}</span>
                <h3>${title}</h3>
                <p>${descriptions[i]}</p>
            </div>
        `;
        horizontalPath.appendChild(step);
    });
}

function handleBack() {
    if (currentState === 'path') {
        pathView.classList.remove('visible');
        setTimeout(() => {
            discoveryScene.classList.remove('hidden');
            currentState = 'sub-roles';
        }, 400);
    } else if (currentState === 'sub-roles') {
        currentState = 'discovery';
        hubLabel.textContent = "Occupation";
        hubLabel.style.color = "#1a1a2e";
        hubSub.textContent = "Select a role to begin your journey";
        mainHub.classList.remove('drilled');
        renderRolesList(rolesData);
    }
}

function lighten(hex, amt) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amt);
    const g = Math.min(255, ((num >> 8) & 0xFF) + amt);
    const b = Math.min(255, (num & 0xFF) + amt);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// Back triggers
hubBackTrigger.onclick = (e) => { e.stopPropagation(); handleBack(); };
backBtn.onclick = handleBack;

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderRolesList(rolesData);
});
