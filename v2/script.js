const rolesData = [
    { title: "Aircraft / A & P Mechanic", color: "#22d3ee" },
    { title: "Auto Body Technician", color: "#22d3ee" },
    { title: "Automotive Electrical Systems Tech", color: "#22d3ee" },
    { title: "Automotive Glass Installer", color: "#22d3ee" },
    { title: "Automotive Service Tech", color: "#22d3ee" },
    { title: "Avionics Technician", color: "#22d3ee" },
    { title: "Bike Technician", color: "#22d3ee" },
    { title: "Diesel Mechanic", color: "#34d399" },
    { title: "Heavy Equipment Mechanic", color: "#34d399" },
    { title: "Small Engine Mechanic", color: "#34d399" },
    { title: "Tire Changer / Technician", color: "#34d399" },
    { title: "Electronics Repairer", color: "#a78bfa" },
    { title: "Industrial Machinery Mechanic", color: "#a78bfa" },
    { title: "Maintenance Technician", color: "#a78bfa" },
    { title: "HVAC Technician", color: "#34d399" },
    { title: "Wind Turbine Technician", color: "#34d399" },
    { title: "Solar Photovoltaic Installer", color: "#34d399" },
    { title: "Telecommunications Installer", color: "#a78bfa" },
    { title: "Network Technician", color: "#a78bfa" },
    { title: "Computer Support Specialist", color: "#a78bfa" },
    { title: "Medical Equipment Repairer", color: "#fb7185" },
    { title: "Laboratory Technician", color: "#fb7185" },
    { title: "Data Scientist", color: "#a78bfa" },
    { title: "Cybersecurity Analyst", color: "#fb7185" },
    { title: "Systems Architect", color: "#22d3ee" },
    { title: "Software Engineer", color: "#22d3ee" },
    { title: "Cloud Specialist", color: "#34d399" },
    { title: "IT Manager", color: "#fbbf24" },
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
const mainHub = document.getElementById('main-hub');
const hubBackTrigger = document.getElementById('hub-back-trigger');
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

let currentState = 'discovery';
let selectedRole = null;

// ── Starfield Background ──
let stars = [];
function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            a: Math.random(),
            da: (Math.random() - 0.5) * 0.005
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        s.a += s.da;
        if (s.a > 1 || s.a < 0.1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${s.a})`;
        ctx.fill();
    });
    requestAnimationFrame(drawStars);
}

window.addEventListener('resize', initStars);
initStars();
drawStars();

// ── Clustering ──
function createRoleNode(role, index, isSubRole = false) {
    const node = document.createElement('div');
    node.className = 'role-node';

    const goldenAngle = 137.5;
    const angle = (index * goldenAngle + (Math.random() * 8)) * (Math.PI / 180);
    const viewportMin = Math.min(window.innerWidth, window.innerHeight);
    const scaleFactor = viewportMin < 800 ? 0.7 : 1.1;

    const hubAvoid = (isSubRole ? 160 : 200) * scaleFactor;
    const spread = (isSubRole ? 60 : 100) * scaleFactor;
    const radius = hubAvoid + (spread * Math.sqrt(index + 2)) + (index * 6 * scaleFactor);

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    node.style.left = '50%';
    node.style.top = '50%';
    node.style.setProperty('--tx', `${x}px`);
    node.style.setProperty('--ty', `${y}px`);
    node.style.color = role.color;

    node.innerHTML = `
        <div class="role-dot" style="background-color:${role.color};box-shadow:0 0 8px ${role.color}"></div>
        <span class="role-label">${role.title}</span>
    `;

    node.onclick = () => {
        if (currentState === 'discovery') drillDown(role);
        else showPathView(role);
    };

    discoveryScene.appendChild(node);
    setTimeout(() => node.classList.add('visible'), index * 20);
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
    setTimeout(() => {
        hubLabel.textContent = role.title;
        hubLabel.style.color = role.color;
        mainHub.style.borderColor = role.color;
        mainHub.classList.add('drilled');
        hubLabel.style.opacity = '1';
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
    pathHeaderDot.style.backgroundColor = role.color;
    pathHeaderDot.style.boxShadow = `0 0 30px ${role.color}`;

    renderHorizontalTrajectory(role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    discoveryScene.classList.add('hidden');
    setTimeout(() => pathView.classList.add('visible'), 400);
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
        m.style.color = startRole.color;
        m.innerHTML = `<div class="h-dot"></div><div class="h-info"><span class="h-tag">${stages[i]}</span><h3>${title}</h3></div>`;
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
        hubLabel.style.color = "#e2e8f0";
        mainHub.style.borderColor = "rgba(34,211,238,0.2)";
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
