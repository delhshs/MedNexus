
// ========================================
// MEDNEXUS - SAMPLE RESEARCH DATA
// ========================================

// Sample research projects
const sampleProjects = [
    {
        id: 1,
        title: "Knowledge and Awareness of Preventive Healthcare",
        category: "Public Health",
        leader: "Maria Santos",
        status: "Ongoing",
        progress: 65,
        updatedAt: "2026-11-12"
    },
    {
        id: 2,
        title: "Digital Health Records Management",
        category: "Health Informatics",
        leader: "John Reyes",
        status: "Ongoing",
        progress: 40,
        updatedAt: "2026-11-13"
    },
    {
        id: 3,
        title: "Community Nutrition Assessment",
        category: "Nutrition",
        leader: "Angela Cruz",
        status: "Completed",
        progress: 100,
        updatedAt: "2026-11-10"
    },
    {
        id: 4,
        title: "Healthcare Service Accessibility Study",
        category: "Healthcare Services",
        leader: "Mark Garcia",
        status: "Planning",
        progress: 10,
        updatedAt: "2026-11-14"
    }
];

// Sample research records
const sampleRecords = [
    {
        id: 1,
        title: "Preventive Healthcare Research Proposal",
        type: "Proposal",
        author: "Maria Santos",
        dateCreated: "2026-11-10",
        summary: "Initial proposal for a study on preventive healthcare awareness."
    },
    {
        id: 2,
        title: "Digital Health Records Literature Review",
        type: "Manuscript",
        author: "John Reyes",
        dateCreated: "2026-11-11",
        summary: "Review of existing studies about digital health record systems."
    },
    {
        id: 3,
        title: "Community Nutrition Assessment Report",
        type: "Report",
        author: "Angela Cruz",
        dateCreated: "2026-11-12",
        summary: "Summary of findings from a community nutrition assessment."
    }
];

// Sample recent activities
const sampleActivities = [
    {
        id: 1,
        description: "Updated Digital Health Records Management",
        date: "2026-11-13"
    },
    {
        id: 2,
        description: "Completed Community Nutrition Assessment",
        date: "2026-11-12"
    },
    {
        id: 3,
        description: "Added Preventive Healthcare Research Proposal",
        date: "2026-11-10"
    }
];

// Initialize browser storage with sample data
if (localStorage.getItem("mednexusProjects") === null) {
    localStorage.setItem(
        "mednexusProjects",
        JSON.stringify(sampleProjects)
    );
}

if (localStorage.getItem("mednexusRecords") === null) {
    localStorage.setItem(
        "mednexusRecords",
        JSON.stringify(sampleRecords)
    );
}

if (localStorage.getItem("mednexusActivities") === null) {
    localStorage.setItem(
        "mednexusActivities",
        JSON.stringify(sampleActivities)
    );
}
