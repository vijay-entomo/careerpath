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
const hubLabel = document.querySelector('.hub-label');
const hubSub = document.querySelector('.hub-sub');
const mainHub = document.getElementById('main-hub');

let currentState = 'discovery';
let selectedRole = null;

function createRoleNode(role, index, isSubRole = false) {
    const node = document.createElement('div');
    node.className = 'role-node';

    const goldenAngle = 137.5;
    const angle = (index * goldenAngle + (Math.random() * 8)) * (Math.PI / 180);
    const viewportMin = Math.min(window.innerWidth, window.innerHeight);
    const scaleFactor = viewportMin < 800 ? 0.65 : 1;

    const hubAvoid = (isSubRole ? 180 : 220) * scaleFactor;
    const spread = (isSubRole ? 65 : 110) * scaleFactor;
    const radius = hubAvoid + (spread * Math.sqrt(index + 2)) + (index * 7 * scaleFactor);

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    node.style.left = '50%';
    node.style.top = '50%';
    node.style.setProperty('--tx', `${x}px`);
    node.style.setProperty('--ty', `${y}px`);
    node.style.color = role.color;

    node.innerHTML = `
        <div class="role-dot" style="background-color:${role.color}"></div>
        <span class="role-label">${role.title}</span>
    `;

    node.onclick = () => {
        if (currentState === 'discovery') drillDown(role);
        else showPathView(role);
    };

    discoveryScene.appendChild(node);
    setTimeout(() => node.classList.add('visible'), index * 25);
}

function drillDown(role) {
    selectedRole = role;
    currentState = 'sub-roles';

    document.querySelectorAll('.role-node').forEach(n => {
        n.style.opacity = '0';
        n.style.transform = `translate(${n.style.getPropertyValue('--tx')}, ${n.style.getPropertyValue('--ty')}) scale(0)`;
        setTimeout(() => n.remove(), 600);
    });

    hubLabel.style.opacity = '0';
    hubSub.style.opacity = '0';
    setTimeout(() => {
        hubLabel.textContent = role.title;
        hubLabel.style.color = role.color;
        hubSub.textContent = 'Click a role for career path';
        hubLabel.style.opacity = '1';
        hubSub.style.opacity = '1';
        mainHub.classList.add('drilled');
        subRolesData.forEach((t, i) => createRoleNode({ title: t, color: role.color }, i, true));
    }, 400);
}

mainHub.onclick = (e) => {
    if (e.target.closest('.hub-back')) { e.stopPropagation(); handleBack(); return; }
    if (currentState === 'sub-roles') showPathView(selectedRole);
};

function showPathView(role) {
    currentState = 'path';
    pathRoleTitle.textContent = role.title;
    pathHeaderDot.style.background = `linear-gradient(135deg, ${role.color}, ${lighten(role.color, 30)})`;
    renderHorizontalTrajectory(role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    discoveryScene.classList.add('hidden');
    setTimeout(() => pathView.classList.add('visible'), 400);
}

function lighten(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
    const b = Math.min(255, (num & 0x0000FF) + percent);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function renderHorizontalTrajectory(startRole) {
    horizontalPath.innerHTML = '';
    const suffixes = ["Adv. Practitioner", "Lead Specialist", "Consultant", "Director", "Principal"];
    const stages = ["Start", "Expert", "Leader", "Advisor", "Head"];
    suffixes.forEach((s, i) => {
        const title = i === 0 ? startRole.title : `${startRole.title.split(' ')[0]} ${s}`;
        const m = document.createElement('div');
        m.className = 'h-milestone';
        m.style.setProperty('--delay', i + 1);
        m.innerHTML = `
            <div class="h-dot" style="background:${startRole.color}; ${i===0 ? 'box-shadow:0 0 20px '+startRole.color : ''}"></div>
            <div class="h-info">
                <span class="h-tag" style="color:${startRole.color};background:${startRole.color}12">${stages[i]}</span>
                <h3>${title}</h3>
            </div>
        `;
        horizontalPath.appendChild(m);
    });
}

function handleBack() {
    if (currentState === 'path') {
        pathView.classList.remove('visible');
        setTimeout(() => { discoveryScene.classList.remove('hidden'); currentState = 'sub-roles'; }, 600);
    } else if (currentState === 'sub-roles') {
        currentState = 'discovery';
        hubLabel.textContent = "Occupation";
        hubLabel.style.color = "#1a1a2e";
        hubSub.textContent = "Select a career to explore";
        mainHub.classList.remove('drilled');
        render();
    }
}

function clearScene() { document.querySelectorAll('.role-node').forEach(n => n.remove()); }
function render() { clearScene(); rolesData.forEach((r, i) => createRoleNode(r, i)); }

// Parallax
let tX = 0, tY = 0, cX = 0, cY = 0;
window.addEventListener('mousemove', (e) => {
    tX = (e.clientX - window.innerWidth / 2) / 50;
    tY = (e.clientY - window.innerHeight / 2) / 50;
});
function animate() {
    cX += (tX - cX) * 0.06;
    cY += (tY - cY) * 0.06;
    if (!discoveryScene.classList.contains('hidden'))
        discoveryScene.style.transform = `translate(${cX}px, ${cY}px)`;
    requestAnimationFrame(animate);
}

backBtn.onclick = handleBack;
document.addEventListener('DOMContentLoaded', () => { render(); animate(); });
