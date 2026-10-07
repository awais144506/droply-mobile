// Helper to display "Today" or a formatted date (e.g., "Oct 07")
export const getScheduledText = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const today = new Date();
    
    const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    if (isToday) return "Today";

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // Output: "Oct 7"
};
