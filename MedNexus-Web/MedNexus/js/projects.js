
// ========================================
// MEDNEXUS - RESEARCH PROJECT MANAGEMENT
// ========================================

// Get HTML elements
const projectTableBody = document.getElementById("projectTableBody");
const projectModal = document.getElementById("projectModal");
const projectForm = document.getElementById("projectForm");

const addProjectBtn = document.getElementById("addProjectBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");

const projectSearch = document.getElementById("projectSearch");
const statusFilter = document.getElementById("statusFilter");


// ========================================
// GET PROJECT DATA
// ========================================

function getProjectData() {
    return JSON.parse(localStorage.getItem("mednexusProjects")) || [];
}


// ========================================
// SAVE PROJECT DATA
// ========================================

function saveProjectData(projects) {
    localStorage.setItem("mednexusProjects", JSON.stringify(projects));
}


// ========================================
// DISPLAY PROJECTS
// ========================================

function displayProjects() {
    const projects = getProjectData();

    const searchValue = projectSearch.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    const filteredProjects = projects.filter(project => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchValue) ||
            project.leader.toLowerCase().includes(searchValue) ||
            project.category.toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === "All" ||
            project.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredProjects.length === 0) {
        projectTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No research projects found.
                </td>
            </tr>
        `;
        return;
    }

    projectTableBody.innerHTML = filteredProjects.map(project => `
        <tr>
            <td class="project-title-cell">
                <strong>${escapeHTML(project.title)}</strong>
            </td>

            <td>${escapeHTML(project.category)}</td>

            <td>${escapeHTML(project.leader)}</td>

            <td>
                <span class="status-badge ${project.status.toLowerCase()}">
                    ${escapeHTML(project.status)}
                </span>
            </td>

            <td>
                <div class="table-progress">
                    <div class="table-progress-bar">
                        <div style="width: ${project.progress}%"></div>
                    </div>
                    <small>${project.progress}%</small>
                </div>
            </td>

            <td>
                <div class="table-actions">
                    <button class="edit-btn" data-action="edit" data-id="${project.id}">
                        Edit
                    </button>

                    <button class="delete-btn" data-action="delete" data-id="${project.id}">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}


// ========================================
// PREVENT HTML INJECTION IN TEXT
// ========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// ========================================
// OPEN ADD PROJECT MODAL
// ========================================

function openAddModal() {
    projectForm.reset();

    document.getElementById("projectId").value = "";
    document.getElementById("modalTitle").textContent = "Add New Project";
    document.getElementById("projectProgress").value = 0;

    projectModal.classList.add("show");
}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {
    projectModal.classList.remove("show");
}


// ========================================
// SAVE NEW OR EDITED PROJECT
// ========================================

projectForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const projects = getProjectData();

    const id = document.getElementById("projectId").value;

    const title = document.getElementById("projectTitle").value.trim();
    const category = document.getElementById("projectCategory").value;
    const leader = document.getElementById("projectLeader").value.trim();
    const status = document.getElementById("projectStatus").value;
    const progress = Number(document.getElementById("projectProgress").value);

    if (!title || !category || !leader || !status) {
        alert("Please complete all required fields.");
        return;
    }

    if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
        alert("Progress must be a whole number between 0 and 100.");
        return;
    }

    if (status === "Completed" && progress !== 100) {
        alert("A completed project must have 100% progress.");
        return;
    }

    if (status !== "Completed" && progress === 100) {
        alert("Please select Completed when progress reaches 100%.");
        return;
    }

    const projectData = {
        id: id ? Number(id) : Date.now(),
        title,
        category,
        leader,
        status,
        progress,
        updatedAt: new Date().toISOString().slice(0, 10)
    };

    if (id) {
        const index = projects.findIndex(
            project => project.id === Number(id)
        );

        if (index !== -1) {
            projects[index] = projectData;
        }
    } else {
        projects.unshift(projectData);
    }

    saveProjectData(projects);

    addActivity(
        id
            ? `Updated research project: ${title}`
            : `Added new research project: ${title}`
    );

    displayProjects();
    closeModal();
});


// ========================================
// EDIT OR DELETE PROJECT
// ========================================

projectTableBody.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const projects = getProjectData();

    const project = projects.find(item => item.id === id);

    if (!project) return;

    if (action === "edit") {
        document.getElementById("projectId").value = project.id;
        document.getElementById("projectTitle").value = project.title;
        document.getElementById("projectCategory").value = project.category;
        document.getElementById("projectLeader").value = project.leader;
        document.getElementById("projectStatus").value = project.status;
        document.getElementById("projectProgress").value = project.progress;

        document.getElementById("modalTitle").textContent = "Edit Research Project";

        projectModal.classList.add("show");
    }

    if (action === "delete") {
        const confirmed = confirm(
            `Are you sure you want to delete "${project.title}"?`
        );

        if (!confirmed) return;

        const updatedProjects = projects.filter(
            item => item.id !== id
        );

        saveProjectData(updatedProjects);

        addActivity(`Deleted research project: ${project.title}`);

        displayProjects();
    }
});


// ========================================
// ADD ACTIVITY TO DASHBOARD DATA
// ========================================

function addActivity(description) {
    const activities = JSON.parse(
        localStorage.getItem("mednexusActivities")
    ) || [];

    activities.unshift({
        id: Date.now(),
        description,
        date: new Date().toISOString().slice(0, 10)
    });

    localStorage.setItem(
        "mednexusActivities",
        JSON.stringify(activities.slice(0, 20))
    );
}


// ========================================
// SEARCH AND FILTER EVENTS
// ========================================

projectSearch.addEventListener("input", displayProjects);
statusFilter.addEventListener("change", displayProjects);


// ========================================
// MODAL EVENTS
// ========================================

addProjectBtn.addEventListener("click", openAddModal);
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

projectModal.addEventListener("click", function(event) {
    if (event.target === projectModal) {
        closeModal();
    }
});


// ========================================
// INITIALIZE PROJECT PAGE
// ========================================

displayProjects();
