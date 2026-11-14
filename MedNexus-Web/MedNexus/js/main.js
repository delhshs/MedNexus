
// ========================================
// MEDNEXUS - DASHBOARD FUNCTIONALITY
// ========================================

// Get saved data from browser storage
function getProjects() {
    return JSON.parse(localStorage.getItem("mednexusProjects")) || [];
}

function getRecords() {
    return JSON.parse(localStorage.getItem("mednexusRecords")) || [];
}

function getActivities() {
    return JSON.parse(localStorage.getItem("mednexusActivities")) || [];
}


// ========================================
// UPDATE DASHBOARD STATISTICS
// ========================================

function updateDashboardStatistics() {
    const projects = getProjects();
    const records = getRecords();

    const ongoing = projects.filter(
        project => project.status === "Ongoing"
    );

    const completed = projects.filter(
        project => project.status === "Completed"
    );

    document.getElementById("totalProjects").textContent =
        projects.length;

    document.getElementById("ongoingProjects").textContent =
        ongoing.length;

    document.getElementById("completedProjects").textContent =
        completed.length;

    document.getElementById("totalRecords").textContent =
        records.length;
}


// ========================================
// DISPLAY RESEARCH PROGRESS
// ========================================

function displayResearchProgress() {
    const projects = getProjects();
    const progressContainer = document.getElementById("progressOverview");

    if (projects.length === 0) {
        progressContainer.innerHTML =
            "<p>No research projects available yet.</p>";
        return;
    }

    progressContainer.innerHTML = projects.map(project => `
        <div class="progress-item">
            <div class="progress-info">
                <span>${project.title}</span>
                <strong>${project.progress}%</strong>
            </div>

            <div class="progress-bar">
                <div class="progress-fill"
                     style="width: ${project.progress}%">
                </div>
            </div>
        </div>
    `).join("");
}


// ========================================
// DISPLAY RECENT ACTIVITIES
// ========================================

function displayRecentActivities() {
    const activities = getActivities();
    const activityContainer = document.getElementById("recentActivities");

    if (activities.length === 0) {
        activityContainer.innerHTML =
            "<p>No recent activities yet.</p>";
        return;
    }

    activityContainer.innerHTML = activities
        .slice(0, 5)
        .map(activity => `
            <div class="activity-item">
                <div class="activity-dot"></div>

                <div>
                    <p>${activity.description}</p>
                    <small>${activity.date}</small>
                </div>
            </div>
        `).join("");
}


// ========================================
// INITIALIZE DASHBOARD
// ========================================

function initializeDashboard() {
    updateDashboardStatistics();
    displayResearchProgress();
    displayRecentActivities();
}

// Run dashboard functions when the page loads
document.addEventListener("DOMContentLoaded", initializeDashboard);
