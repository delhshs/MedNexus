
 // ==============================
 // RESEARCH LIBRARY DATA
 // ==============================

const RESOURCE_STORAGE_KEY = "mednexusResources";

const sampleResources = [
    {
        id: 1,
        title: "World Health Organization",
        category: "Useful Website",
        author: "World Health Organization",
        url: "https://www.who.int/",
        description: "Official source of global health information, medical guidelines, and public health research."
    },
    {
        id: 2,
        title: "PubMed",
        category: "Medical Journal",
        author: "U.S. National Library of Medicine",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        description: "A database for searching biomedical literature, medical journals, and life science publications."
    },
    {
        id: 3,
        title: "Google Scholar",
        category: "Research Article",
        author: "Google",
        url: "https://scholar.google.com/",
        description: "A search platform for scholarly literature, academic publications, and research articles."
    },
    {
        id: 4,
        title: "National Institutes of Health",
        category: "Reference Material",
        author: "National Institutes of Health",
        url: "https://www.nih.gov/",
        description: "A research resource providing health information and updates on medical discoveries."
    }
];

// Initialize sample resources only once
if (localStorage.getItem(RESOURCE_STORAGE_KEY) === null) {
    localStorage.setItem(
        RESOURCE_STORAGE_KEY,
        JSON.stringify(sampleResources)
    );
}


// ==============================
// GET AND SAVE RESOURCES
// ==============================

function getResources() {
    return JSON.parse(
        localStorage.getItem(RESOURCE_STORAGE_KEY)
    ) || [];
}

function saveResources(resources) {
    localStorage.setItem(
        RESOURCE_STORAGE_KEY,
        JSON.stringify(resources)
    );
}


// ==============================
// HTML ESCAPING
// ==============================

function escapeLibraryHTML(value) {
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
// URL VALIDATION
// ==============================

function isValidResourceURL(value) {
    try {
        const url = new URL(value);

        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}


// ==============================
// ACTIVITY LOG
// ==============================

function addLibraryActivity(message) {
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
// UPDATE LIBRARY STATISTICS
// ==============================

function updateLibraryStatistics() {
    const resources = getResources();

    document.getElementById("totalResources").textContent =
        resources.length;

    document.getElementById("journalCount").textContent =
        resources.filter(resource =>
            resource.category === "Medical Journal"
        ).length;

    document.getElementById("articleCount").textContent =
        resources.filter(resource =>
            resource.category === "Research Article"
        ).length;

    document.getElementById("websiteCount").textContent =
        resources.filter(resource =>
            resource.category === "Useful Website"
        ).length;
}


// ==============================
// DISPLAY RESOURCE CARDS
// ==============================

function displayResources() {
    const resources = getResources();

    const searchValue = document
        .getElementById("resourceSearch")
        .value.toLowerCase()
        .trim();

    const categoryFilter = document
        .getElementById("resourceCategoryFilter")
        .value;

    const resourceGrid = document.getElementById("resourceGrid");

    const filteredResources = resources.filter(resource => {
        const matchesSearch =
            resource.title.toLowerCase().includes(searchValue) ||
            resource.author.toLowerCase().includes(searchValue) ||
            resource.description.toLowerCase().includes(searchValue);

        const matchesCategory =
            categoryFilter === "All" ||
            resource.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    if (filteredResources.length === 0) {
        resourceGrid.innerHTML = `
            <div class="empty-library">
                <h3>No resources found</h3>
                <p>Try another search or category.</p>
            </div>
        `;
        return;
    }

    resourceGrid.innerHTML = filteredResources.map(resource => `
        <div class="resource-card">

            <span class="resource-category">
                ${escapeLibraryHTML(resource.category)}
            </span>

            <h3>${escapeLibraryHTML(resource.title)}</h3>

            <p class="resource-author">
                ${escapeLibraryHTML(resource.author)}
            </p>

            <p>${escapeLibraryHTML(resource.description)}</p>

            <a
                href="${escapeLibraryHTML(resource.url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="resource-link"
            >
                Visit Resource ↗
            </a>

            <div class="resource-actions">

                <button
                    class="btn-edit"
                    data-action="edit"
                    data-id="${resource.id}"
                >
                    Edit
                </button>

                <button
                    class="btn-delete"
                    data-action="delete"
                    data-id="${resource.id}"
                >
                    Delete
                </button>

            </div>

        </div>
    `).join("");
}


// ==============================
// OPEN AND CLOSE MODAL
// ==============================

function openResourceModal() {
    document.getElementById("resourceForm").reset();

    document.getElementById("resourceId").value = "";

    document.getElementById("resourceModalTitle").textContent =
        "Add New Resource";

    document.getElementById("resourceModal").classList.add("active");
}

function closeResourceModal() {
    document.getElementById("resourceModal").classList.remove("active");
}


// ==============================
// ADD OR UPDATE RESOURCE
// ==============================

function saveResource(event) {
    event.preventDefault();

    const id = document.getElementById("resourceId").value;

    const title = document.getElementById("resourceTitle").value.trim();

    const category = document.getElementById("resourceCategory").value;

    const author = document.getElementById("resourceAuthor").value.trim();

    const url = document.getElementById("resourceUrl").value.trim();

    const description = document
        .getElementById("resourceDescription")
        .value.trim();

    if (!title || !category || !author || !url || !description) {
        alert("Please complete all required fields.");
        return;
    }

    if (!isValidResourceURL(url)) {
        alert("Please enter a valid HTTP or HTTPS resource URL.");
        return;
    }

    let resources = getResources();

    if (id) {
        resources = resources.map(resource => {
            if (Number(resource.id) === Number(id)) {
                return {
                    ...resource,
                    title,
                    category,
                    author,
                    url,
                    description
                };
            }

            return resource;
        });

        addLibraryActivity(`Updated research resource: ${title}`);

    } else {
        const newResource = {
            id: Date.now(),
            title,
            category,
            author,
            url,
            description
        };

        resources.push(newResource);

        addLibraryActivity(`Added research resource: ${title}`);
    }

    saveResources(resources);

    closeResourceModal();

    initializeLibrary();
}


// ==============================
// EDIT RESOURCE
// ==============================

function editResource(id) {
    const resource = getResources().find(
        resource => Number(resource.id) === Number(id)
    );

    if (!resource) return;

    document.getElementById("resourceId").value = resource.id;

    document.getElementById("resourceTitle").value = resource.title;

    document.getElementById("resourceCategory").value = resource.category;

    document.getElementById("resourceAuthor").value = resource.author;

    document.getElementById("resourceUrl").value = resource.url;

    document.getElementById("resourceDescription").value =
        resource.description;

    document.getElementById("resourceModalTitle").textContent =
        "Edit Resource";

    document.getElementById("resourceModal").classList.add("active");
}


// ==============================
// DELETE RESOURCE
// ==============================

function deleteResource(id) {
    const resource = getResources().find(
        resource => Number(resource.id) === Number(id)
    );

    if (!resource) return;

    const confirmation = confirm(
        `Are you sure you want to delete "${resource.title}"?`
    );

    if (!confirmation) return;

    const updatedResources = getResources().filter(
        resource => Number(resource.id) !== Number(id)
    );

    saveResources(updatedResources);

    addLibraryActivity(`Deleted research resource: ${resource.title}`);

    initializeLibrary();
}


// ==============================
// EVENT LISTENERS
// ==============================

document.getElementById("addResourceBtn")
    .addEventListener("click", openResourceModal);

document.getElementById("closeResourceModal")
    .addEventListener("click", closeResourceModal);

document.getElementById("cancelResourceBtn")
    .addEventListener("click", closeResourceModal);

document.getElementById("resourceForm")
    .addEventListener("submit", saveResource);

document.getElementById("resourceSearch")
    .addEventListener("input", displayResources);

document.getElementById("resourceCategoryFilter")
    .addEventListener("change", displayResources);

document.getElementById("resourceGrid")
    .addEventListener("click", function(event) {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === "edit") {
            editResource(id);
        }

        if (action === "delete") {
            deleteResource(id);
        }
    });


// ==============================
// INITIALIZE RESEARCH LIBRARY
// ==============================

function initializeLibrary() {
    updateLibraryStatistics();
    displayResources();
}

initializeLibrary();
