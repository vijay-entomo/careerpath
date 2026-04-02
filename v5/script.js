const rolesData = [
    { title: "Aircraft / A & P Mechanic", color: "#d4a853" },
    { title: "Auto Body Technician", color: "#d4a853" },
    { title: "Automotive Electrical Systems Tech", color: "#d4a853" },
    { title: "Automotive Glass Installer", color: "#d4a853" },
    { title: "Automotive Service Tech", color: "#d4a853" },
    { title: "Avionics Technician", color: "#d4a853" },
    { title: "Bike Technician", color: "#d4a853" },
    { title: "Diesel Mechanic", color: "#7c9a5e" },
    { title: "Heavy Equipment Mechanic", color: "#7c9a5e" },
    { title: "Small Engine Mechanic", color: "#7c9a5e" },
    { title: "Tire Changer / Technician", color: "#7c9a5e" },
    { title: "Electronics Repairer", color: "#8b7ec8" },
    { title: "Industrial Machinery Mechanic", color: "#8b7ec8" },
    { title: "Maintenance Technician", color: "#8b7ec8" },
    { title: "HVAC Technician", color: "#7c9a5e" },
    { title: "Wind Turbine Technician", color: "#7c9a5e" },
    { title: "Solar Photovoltaic Installer", color: "#7c9a5e" },
    { title: "Telecom Installer", color: "#5b8db8" },
    { title: "Network Technician", color: "#5b8db8" },
    { title: "Computer Support Specialist", color: "#5b8db8" },
    { title: "Medical Equipment Repairer", color: "#c47a7a" },
    { title: "Laboratory Technician", color: "#c47a7a" },
    { title: "Data Scientist", color: "#8b7ec8" },
    { title: "Cybersecurity Analyst", color: "#c47a7a" },
    { title: "Systems Architect", color: "#5b8db8" },
    { title: "Software Engineer", color: "#5b8db8" },
    { title: "Cloud Specialist", color: "#7c9a5e" },
    { title: "IT Manager", color: "#d4a853" },
    { title: "UX Designer", color: "#8b7ec8" },
    { title: "Product Designer", color: "#8b7ec8" },
    { title: "Graphic Artist", color: "#c47a7a" },
    { title: "Content Strategist", color: "#d4a853" },
    { title: "Marketing Analyst", color: "#d4a853" },
    { title: "Sales Engineer", color: "#7c9a5e" },
    { title: "Project Lead", color: "#d4a853" },
    { title: "Supply Chain Manager", color: "#d4a853" },
    { title: "Logistics Specialist", color: "#7c9a5e" },
    { title: "Financial Analyst", color: "#8b7ec8" },
    { title: "Risk Manager", color: "#8b7ec8" },
    { title: "Operations Director", color: "#d4a853" },
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
const hubBackTrigger = document.getElementById('hub-back-trigger');
const rolesList = document.getElementById('roles-list');
const roleCount = document.getElementById('role-count');
const sidebarEyebrow = document.getElementById('sidebar-eyebrow');

let currentState = 'discovery';
let selectedRole = null;

function renderRolesList(roles, isSubRole = false) {
    rolesList.innerHTML = '';
    roleCount.textContent = roles.length;

    roles.forEach((role, i) => {
        const card = document.createElement('div');
        card.className = 'role-card';
        card.innerHTML = `
            <div class="role-card-dot" style="background-color: ${role.color}"></div>
            <span class="role-card-title">${role.title}</span>
            <span class="role-card-arrow">→</span>
        `;

        card.onclick = () => {
            if (currentState === 'discovery') drillDown(role);
            else if (currentState === 'sub-roles') showPathView(role);
        };

        rolesList.appendChild(card);
        setTimeout(() => card.classList.add('visible'), i * 25);
    });
}

function drillDown(role) {
    selectedRole = role;
    currentState = 'sub-roles';

    document.querySelectorAll('.role-card').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.95)';
    });

    setTimeout(() => {
        hubLabel.textContent = role.title;
        hubLabel.style.color = role.color;
        hubSub.textContent = 'Select a specialization to view the career path.';
        sidebarEyebrow.textContent = 'Specializations';
        hubBackTrigger.classList.add('show');

        const subRoles = subRolesData.map(t => ({ title: t, color: role.color }));
        renderRolesList(subRoles, true);
    }, 300);
}

function showPathView(role) {
    currentState = 'path';
    pathRoleTitle.textContent = role.title;
    pathHeaderDot.style.background = `linear-gradient(135deg, ${selectedRole.color}, #d4a853)`;

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
    const stages = ["Entry", "Expert", "Leader", "Advisor", "Head"];
    const descriptions = [
        "Foundational certification and hands-on practical training.",
        "2–4 years experience with advanced specialty credentials.",
        "Team leadership and cross-functional project management.",
        "Strategic advisory, mentoring, and organizational influence.",
        "Executive-level impact and industry thought leadership."
    ];

    titles.forEach((title, i) => {
        const step = document.createElement('div');
        step.className = 'path-step';
        step.style.setProperty('--delay', i + 1);
        step.innerHTML = `
            <div class="step-number-badge">${String(i + 1).padStart(2, '0')}</div>
            <div class="step-content">
                <span class="step-tag" style="color:${selectedRole.color};background:${selectedRole.color}18">${stages[i]}</span>
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
        hubLabel.style.color = "#fafafa";
        hubSub.textContent = "Browse and select from available career tracks to discover your path forward.";
        sidebarEyebrow.textContent = "Explore Roles";
        hubBackTrigger.classList.remove('show');
        renderRolesList(rolesData);
    }
}

hubBackTrigger.onclick = (e) => { e.stopPropagation(); handleBack(); };
backBtn.onclick = handleBack;

document.addEventListener('DOMContentLoaded', () => {
    renderRolesList(rolesData);
});
