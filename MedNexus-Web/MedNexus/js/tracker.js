
// ==============================
// PROGRESS TRACKER DATA
// ==============================

const TASK_STORAGE_KEY = "mednexusTasks";

const sampleTasks = [
    {
        id: 1,
        title: "Finalize Research Proposal",
        projectId: 1,
        dueDate: "2026-11-18",
        status: "Completed"
    },
    {
        id: 2,
        title: "Conduct Literature Review",
        projectId: 2,
        dueDate: "2026-11-20",
        status: "Pending"
    },
    {
        id: 3,
        title: "Prepare Data Collection Tools",
        projectId: 1,
        dueDate: "2026-11-25",
        status: "Pending"
    },
    {
        id: 4,
        title: "Submit Final Research Report",
        projectId: 3,
        dueDate: "2026-11-12",
        status: "Completed"
    }
];

// Initialize sample tasks only if no saved tasks exist
if (localStorage.getItem(TASK_STORAGE_KEY) === null) {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(sampleTasks));
}


// ==============================
// GET AND SAVE DATA
// ==============================

function getTasks() {
    return JSON.parse(localStorage.getItem(TASK_STORAGE_KEY)) || [];
}

function saveTasks(tasks) {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}

function getTrackerProjects() {
    return JSON.parse(localStorage.getItem("mednexusProjects")) || [];
}


// ==============================
// ACTIVITY LOG
// ==============================

function addTrackerActivity(message) {
    let activities = JSON.parse(
        localStorage.getItem("mednexusActivities")
    ) || [];

    activities.unshift({
        message: message,
        date: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem(
        "mednexusActivities",
        JSON.stringify(activities.slice(0, 10))
    );
}


// ==============================
// DISPLAY PROJECT PROGRESS
// ==============================

function displayOverallProgress() {
    const projects = getTrackerProjects();
    const container = document.getElementById("overallProgressList");

    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = "<p>No research projects available.</p>";
        return;
    }

    container.innerHTML = projects.map(project => {
        const progress = Math.min(
            100,
            Math.max(0, Number(project.progress) || 0)
        );

        return `
            <div class="overall-progress-item">
                <div class="progress-info">
                    <strong>${escapeTrackerHTML(project.title)}</strong>
                    <span>${progress}%</span>
                </div>

                <div class="progress-track">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }).join("");
}


// ==============================
// DISPLAY TASK STATISTICS
// ==============================

function updateTaskStatistics() {
    const tasks = getTasks();
    const today = new Date().toISOString().split("T")[0];

    const completed = tasks.filter(
        task => task.status === "Completed"
    ).length;

    const pending = tasks.filter(
        task => task.status === "Pending"
    ).length;

    const overdue = tasks.filter(
        task => task.status !== "Completed" && task.dueDate < today
    ).length;

    document.getElementById("totalTasks").textContent = tasks.length;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("overdueTasks").textContent = overdue;
}


// ==============================
// DISPLAY TASK TABLE
// ==============================

function displayTasks() {
    const tasks = getTasks();
    const projects = getTrackerProjects();

    const tableBody = document.getElementById("taskTableBody");
    const filter = document.getElementById("taskStatusFilter").value;

    const today = new Date().toISOString().split("T")[0];

    const filteredTasks = tasks.filter(task => {
        return filter === "All" || task.status === filter;
    });

    if (filteredTasks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5">No tasks found.</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filteredTasks.map(task => {
        const project = projects.find(
            project => Number(project.id) === Number(task.projectId)
        );

        const projectName = project
            ? project.title
            : "Project unavailable";

        const isOverdue =
            task.status !== "Completed" && task.dueDate < today;

        let statusClass = task.status.toLowerCase();

        let statusLabel = task.status;

        if (isOverdue) {
            statusClass = "overdue-status";
            statusLabel = "Overdue";
        }

        return `
            <tr>
                <td>${escapeTrackerHTML(task.title)}</td>
                <td>${escapeTrackerHTML(projectName)}</td>
                <td>${formatTaskDate(task.dueDate)}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${statusLabel}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit"
                            data-action="edit"
                            data-id="${task.id}">
                            Edit
                        </button>

                        <button class="btn-delete"
                            data-action="delete"
                            data-id="${task.id}">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}


// ==============================
// FORMAT AND ESCAPE VALUES
// ==============================

function formatTaskDate(dateString) {
    if (!dateString) return "No date";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function escapeTrackerHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


// ==============================
// PROJECT DROPDOWN
// ==============================

function populateProjectDropdown() {
    const projects = getTrackerProjects();
    const dropdown = document.getElementById("taskProject");

    dropdown.innerHTML = `
        <option value="">Select a research project</option>
    `;

    projects.forEach(project => {
        dropdown.innerHTML += `
            <option value="${project.id}">
                ${escapeTrackerHTML(project.title)}
            </option>
        `;
    });
}


// ==============================
// MODAL FUNCTIONS
// ==============================

function openTaskModal() {
    const projects = getTrackerProjects();

    if (projects.length === 0) {
        alert("Please add a research project first.");
        return;
    }

    document.getElementById("taskForm").reset();
    document.getElementById("taskId").value = "";

    document.getElementById("taskModalTitle").textContent =
        "Add New Task";

    populateProjectDropdown();

    document.getElementById("taskModal").classList.add("active");
}

function closeTaskModal() {
    document.getElementById("taskModal").classList.remove("active");
}


// ==============================
// ADD OR UPDATE TASK
// ==============================

function saveTask(event) {
    event.preventDefault();

    const id = document.getElementById("taskId").value;
    const title = document.getElementById("taskTitle").value.trim();
    const projectId = document.getElementById("taskProject").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const status = document.getElementById("taskStatus").value;

    if (!title || !projectId || !dueDate || !status) {
        alert("Please complete all required fields.");
        return;
    }

    const projects = getTrackerProjects();

    const selectedProject = projects.find(
        project => Number(project.id) === Number(projectId)
    );

    if (!selectedProject) {
        alert("Please select a valid research project.");
        return;
    }

    let tasks = getTasks();

    if (id) {
        tasks = tasks.map(task => {
            if (Number(task.id) === Number(id)) {
                return {
                    ...task,
                    title,
                    projectId: Number(projectId),
                    dueDate,
                    status
                };
            }

            return task;
        });

        addTrackerActivity(`Updated task: ${title}`);
    } else {
        const newTask = {
            id: Date.now(),
            title,
            projectId: Number(projectId),
            dueDate,
            status
        };

        tasks.push(newTask);

        addTrackerActivity(`Added new task: ${title}`);
    }

    saveTasks(tasks);

    closeTaskModal();
    initializeTracker();
}


// ==============================
// EDIT AND DELETE TASKS
// ==============================

function editTask(id) {
    const task = getTasks().find(
        task => Number(task.id) === Number(id)
    );

    if (!task) return;

    populateProjectDropdown();

    document.getElementById("taskId").value = task.id;
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskProject").value = task.projectId;
    document.getElementById("taskDueDate").value = task.dueDate;
    document.getElementById("taskStatus").value = task.status;

    document.getElementById("taskModalTitle").textContent =
        "Edit Task";

    document.getElementById("taskModal").classList.add("active");
}

function deleteTask(id) {
    const task = getTasks().find(
        task => Number(task.id) === Number(id)
    );

    if (!task) return;

    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) {
        return;
    }

    const updatedTasks = getTasks().filter(
        task => Number(task.id) !== Number(id)
    );

    saveTasks(updatedTasks);

    addTrackerActivity(`Deleted task: ${task.title}`);

    initializeTracker();
}


// ==============================
// EVENT LISTENERS
// ==============================

document.getElementById("addTaskBtn").addEventListener("click", openTaskModal);

document.getElementById("closeTaskModal").addEventListener("click", closeTaskModal);

document.getElementById("cancelTaskBtn").addEventListener("click", closeTaskModal);

document.getElementById("taskForm").addEventListener("submit", saveTask);

document.getElementById("taskStatusFilter").addEventListener("change", displayTasks);

document.getElementById("taskTableBody").addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "edit") {
        editTask(id);
    }

    if (action === "delete") {
        deleteTask(id);
    }
});


// ==============================
// INITIALIZE TRACKER
// ==============================

function initializeTracker() {
    displayOverallProgress();
    updateTaskStatistics();
    displayTasks();
}

initializeTracker();
