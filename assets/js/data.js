/* ===================================
   PORTFOLIO DATA CONFIGURATION
=================================== */

const portfolioData = {
    profile: {
        name: "Ahmad Ali",
        role: "Salesforce Developer",
        titles: [
            "Salesforce Developer",
            "Apex & LWC Specialist",
            "Flow Automation Expert",
            "CRM Solution Architect"
        ],
        email: "ahmadali.salesforce@gmail.com",
        location: "Uttar Pradesh, India",
        openForRoles: true,
        experienceMonths: 6,
        projectsCount: 15,
        trailheadRank: "Double Star Ranger",
        trailheadBadges: 65,
        trailheadPoints: 78500
    },
    socials: {
        linkedin: "https://linkedin.com/in/ahmad-ali-salesforce",
        github: "https://github.com/ahmadali-dev",
        trailhead: "https://trailhead.salesforce.com",
        email: "mailto:ahmadali.salesforce@gmail.com"
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = portfolioData;
}
