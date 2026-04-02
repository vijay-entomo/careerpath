const rolesData = [
    { title: "Aircraft / A & P Mechanic", color: "#14b8a6" },
    { title: "Auto Body Technician", color: "#14b8a6" },
    { title: "Automotive Electrical Systems Technician", color: "#14b8a6" },
    { title: "Automotive Glass Installer", color: "#14b8a6" },
    { title: "Automotive Service Technician / Mechanic", color: "#14b8a6" },
    { title: "Avionics Technician", color: "#14b8a6" },
    { title: "Bike Technician", color: "#14b8a6" },
    { title: "Diesel Mechanic", color: "#14b8a6" },
    { title: "Heavy Equipment Mechanic", color: "#14b8a6" },
    { title: "Small Engine Mechanic", color: "#14b8a6" },
    { title: "Tire Changer / Technician", color: "#14b8a6" },
    { title: "Electronics Repairer", color: "#3b82f6" },
    { title: "Industrial Machinery Mechanic", color: "#3b82f6" },
    { title: "Maintenance Technician", color: "#3b82f6" },
    { title: "HVAC Technician", color: "#10b981" },
    { title: "Wind Turbine Technician", color: "#10b981" },
    { title: "Solar Photovoltaic Installer", color: "#10b981" },
    { title: "Telecommunications Installer", color: "#8b5cf6" },
    { title: "Network Technician", color: "#8b5cf6" },
    { title: "Computer Support Specialist", color: "#8b5cf6" },
    { title: "Medical Equipment Repairer", color: "#f43f5e" },
    { title: "Laboratory Technician", color: "#f43f5e" },
    { title: "Data Scientist", color: "#8b5cf6" },
    { title: "Cybersecurity Analyst", color: "#f43f5e" },
    { title: "Systems Architect", color: "#3b82f6" },
    { title: "Software Engineer", color: "#3b82f6" },
    { title: "Cloud Specialist", color: "#10b981" },
    { title: "IT Manager", color: "#14b8a6" },
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

let currentState = 'discovery';
let selectedRole = null;

function createRoleNode(role, index, isSubRole = false) {
    const node = document.createElement('div');
    node.className = 'role-node';
    
    // Distribute roles radially
    const goldenAngle = 137.5; 
    const angle = (index * goldenAngle + (Math.random() * 8)) * (Math.PI / 180);
    
    const viewportMin = Math.min(window.innerWidth, window.innerHeight);
    const scaleFactor = viewportMin < 800 ? 0.7 : 1.1; 
    
    const hubAvoidanceRadius = (isSubRole ? 160 : 200) * scaleFactor;
    const spreadFactor = (isSubRole ? 60 : 100) * scaleFactor; 
    const radius = hubAvoidanceRadius + (spreadFactor * Math.sqrt(index + 2)) + (index * 6 * scaleFactor);
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    node.style.left = '50%';
    node.style.top = '50%';
    node.style.setProperty('--tx', `${x}px`);
    node.style.setProperty('--ty', `${y}px`);
    node.style.color = role.color;

    node.innerHTML = `
        <div class="role-dot" style="background-color: ${role.color};"></div>
        <span class="role-label">${role.title}</span>
    `;

    node.onclick = () => {
        if (currentState === 'discovery') {
            drillDown(role);
        } else {
            showPathView(role);
        }
    };

    discoveryScene.appendChild(node);

    setTimeout(() => {
        node.classList.add('visible');
    }, index * 20);
}

function drillDown(role) {
    selectedRole = role;
    currentState = 'sub-roles';
    
    // Clear clusters
    const nodes = document.querySelectorAll('.role-node');
    nodes.forEach(n => {
        n.style.opacity = '0';
        n.style.transform = `translate(${n.style.getPropertyValue('--tx')}, ${n.style.getPropertyValue('--ty')}) scale(0)`;
        setTimeout(() => n.remove(), 600);
    });

    // Animate Hub transition
    hubLabel.style.opacity = '0';
    setTimeout(() => {
        hubLabel.textContent = role.title;
        hubLabel.style.color = role.color;
        mainHub.style.borderColor = role.color;
        mainHub.classList.add('drilled'); // Reveal back button icon
        hubLabel.style.opacity = '1';
        
        generateSubRoles(role);
    }, 400);
}

// Hub Central Click Logic
mainHub.onclick = (e) => {
    // If user clicked the back icon directly, stop propagation and return to discovery
    if (e.target.closest('.hub-back')) {
        e.stopPropagation();
        handleBack();
        return;
    }
    
    // If drilled down, clicking anywhere else in the hub shows the path
    if (currentState === 'sub-roles') {
        showPathView(selectedRole);
    }
};

function generateSubRoles(parentRole) {
    subRolesData.forEach((title, i) => {
        createRoleNode({ title, color: parentRole.color }, i, true);
    });
}

function showPathView(role) {
    currentState = 'path';
    pathRoleTitle.textContent = role.title;
    pathHeaderDot.style.backgroundColor = role.color;
    pathHeaderDot.style.boxShadow = `0 0 30px ${role.color}`;

    renderHorizontalTrajectory(role);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    discoveryScene.classList.add('hidden');
    
    setTimeout(() => {
        pathView.classList.add('visible');
    }, 400);
}

function renderHorizontalTrajectory(startRole) {
    horizontalPath.innerHTML = '';
    
    const progressionSuffixes = ["Adv. Practitioner", "Lead Specialist", "Consultant", "Director", "Principal"];
    const stages = ["Start", "Expert", "Leader", "Advisor", "Head"];

    progressionSuffixes.forEach((suffix, i) => {
        const title = i === 0 ? startRole.title : `${startRole.title.split(' ')[0]} ${suffix}`;
        const milestone = document.createElement('div');
        milestone.className = 'h-milestone';
        milestone.style.setProperty('--delay', i + 1);
        milestone.style.color = startRole.color;

        milestone.innerHTML = `
            <div class="h-dot"></div>
            <div class="h-info">
                <span class="h-tag">${stages[i]}</span>
                <h3>${title}</h3>
            </div>
        `;
        horizontalPath.appendChild(milestone);
    });
}

function handleBack() {
    if (currentState === 'path') {
        pathView.classList.remove('visible');
        setTimeout(() => {
            discoveryScene.classList.remove('hidden');
            currentState = 'sub-roles';
        }, 600);
    } else if (currentState === 'sub-roles') {
        currentState = 'discovery';
        hubLabel.textContent = "Occupation";
        hubLabel.style.color = "#334155";
        mainHub.style.borderColor = "white";
        mainHub.classList.remove('drilled'); // Hide back button icon
        render();
    }
}

function clearScene() {
    const nodes = document.querySelectorAll('.role-node');
    nodes.forEach(n => n.remove());
}

function render() {
    clearScene();
    rolesData.forEach((role, i) => createRoleNode(role, i));
}

// Parallax
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - window.innerWidth / 2) / 40;
    targetY = (e.clientY - window.innerHeight / 2) / 40;
});

function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    
    if (!discoveryScene.classList.contains('hidden')) {
        discoveryScene.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
    
    const dotGrid = document.querySelector('.dot-grid');
    if(dotGrid) {
        dotGrid.style.transform = `translate(${-currentX * 0.5}px, ${-currentY * 0.5}px)`;
    }
    
    requestAnimationFrame(animate);
}

backBtn.onclick = handleBack;
document.addEventListener('DOMContentLoaded', () => {
    render();
    animate(); 
});
