
// ========================================
// MEDNEXUS - RESEARCH RECORDS MANAGEMENT
// ========================================

const recordTableBody = document.getElementById("recordTableBody");
const recordModal = document.getElementById("recordModal");
const recordForm = document.getElementById("recordForm");

const addRecordBtn = document.getElementById("addRecordBtn");
const closeRecordModal = document.getElementById("closeRecordModal");
const cancelRecordModal = document.getElementById("cancelRecordModal");

const recordSearch = document.getElementById("recordSearch");
const recordTypeFilter = document.getElementById("recordTypeFilter");


// ========================================
// GET AND SAVE RECORDS
// ========================================

function getRecordsData() {
    return JSON.parse(localStorage.getItem("mednexusRecords")) || [];
}

function saveRecordsData(records) {
    localStorage.setItem("mednexusRecords", JSON.stringify(records));
}


// ========================================
// PREVENT HTML INJECTION
// ========================================

function escapeRecordHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// ========================================
// DISPLAY RESEARCH RECORDS
// ========================================

function displayRecords() {
    const records = getRecordsData();

    const searchValue = recordSearch.value.toLowerCase();
    const selectedType = recordTypeFilter.value;

    const filteredRecords = records.filter(record => {
        const matchesSearch =
            record.title.toLowerCase().includes(searchValue) ||
            record.author.toLowerCase().includes(searchValue) ||
            record.summary.toLowerCase().includes(searchValue);

        const matchesType =
            selectedType === "All" ||
            record.type === selectedType;

        return matchesSearch && matchesType;
    });

    if (filteredRecords.length === 0) {
        recordTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No research records found.
                </td>
            </tr>
        `;
        return;
    }

    recordTableBody.innerHTML = filteredRecords.map(record => `
        <tr>
            <td class="project-title-cell">
                <strong>${escapeRecordHTML(record.title)}</strong>
            </td>

            <td>${escapeRecordHTML(record.type)}</td>

            <td>${escapeRecordHTML(record.author)}</td>

            <td>${escapeRecordHTML(record.dateCreated)}</td>

            <td class="record-summary">
                ${escapeRecordHTML(record.summary)}
            </td>

            <td>
                <div class="table-actions">
                    <button class="edit-btn"
                        data-action="edit"
                        data-id="${record.id}">
                        Edit
                    </button>

                    <button class="delete-btn"
                        data-action="delete"
                        data-id="${record.id}">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}


// ========================================
// OPEN ADD RECORD MODAL
// ========================================

function openRecordModal() {
    recordForm.reset();

    document.getElementById("recordId").value = "";
    document.getElementById("recordModalTitle").textContent =
        "Add New Record";

    recordModal.classList.add("show");
}


// ========================================
// CLOSE RECORD MODAL
// ========================================

function closeRecordModalWindow() {
    recordModal.classList.remove("show");
}


// ========================================
// ADD OR EDIT RECORD
// ========================================

recordForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const records = getRecordsData();

    const id = document.getElementById("recordId").value;

    const title = document.getElementById("recordTitle").value.trim();
    const type = document.getElementById("recordType").value;
    const author = document.getElementById("recordAuthor").value.trim();
    const dateCreated = document.getElementById("recordDate").value;
    const summary = document.getElementById("recordSummary").value.trim();

    if (!title || !type || !author || !dateCreated || !summary) {
        alert("Please complete all required fields.");
        return;
    }

    const recordData = {
        id: id ? Number(id) : Date.now(),
        title,
        type,
        author,
        dateCreated,
        summary
    };

    if (id) {
        const index = records.findIndex(
            record => record.id === Number(id)
        );

        if (index !== -1) {
            records[index] = recordData;
        }
    } else {
        records.unshift(recordData);
    }

    saveRecordsData(records);

    addRecordActivity(
        id
            ? `Updated research record: ${title}`
            : `Added research record: ${title}`
    );

    displayRecords();
    closeRecordModalWindow();
});


// ========================================
// EDIT OR DELETE RECORD
// ========================================

recordTableBody.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const records = getRecordsData();

    const record = records.find(item => item.id === id);

    if (!record) return;

    if (action === "edit") {
        document.getElementById("recordId").value = record.id;
        document.getElementById("recordTitle").value = record.title;
        document.getElementById("recordType").value = record.type;
        document.getElementById("recordAuthor").value = record.author;
        document.getElementById("recordDate").value = record.dateCreated;
        document.getElementById("recordSummary").value = record.summary;

        document.getElementById("recordModalTitle").textContent =
            "Edit Research Record";

        recordModal.classList.add("show");
    }

    if (action === "delete") {
        const confirmed = confirm(
            `Are you sure you want to delete "${record.title}"?`
        );

        if (!confirmed) return;

        const updatedRecords = records.filter(
            item => item.id !== id
        );

        saveRecordsData(updatedRecords);

        addRecordActivity(`Deleted research record: ${record.title}`);

        displayRecords();
    }
});


// ========================================
// RECORD ACTIVITY
// ========================================

function addRecordActivity(description) {
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
// SEARCH AND FILTER
// ========================================

recordSearch.addEventListener("input", displayRecords);
recordTypeFilter.addEventListener("change", displayRecords);


// ========================================
// MODAL EVENTS
// ========================================

addRecordBtn.addEventListener("click", openRecordModal);

closeRecordModal.addEventListener("click", closeRecordModalWindow);

cancelRecordModal.addEventListener("click", closeRecordModalWindow);

recordModal.addEventListener("click", function(event) {
    if (event.target === recordModal) {
        closeRecordModalWindow();
    }
});


// ========================================
// INITIALIZE RECORDS PAGE
// ========================================

displayRecords();
