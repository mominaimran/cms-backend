export const parseEmailInfo = (email) => {
  const [prefix] = email.split("@"); // e.g. "005889bscsf24"

  // Extract parts
  const rollNumber = prefix.substring(0, 6);
  const departmentCode = prefix.substring(6, 10); // e.g. bscs
  const batch = prefix.substring(10, 13); // e.g. f24

  // Department mapping
  const departmentMap = {
    bscs: "Computer Science",
    bsse: "Software Engineering",
    bsee: "Electrical Engineering",
    bsme: "Mechanical Engineering",
    bsba: "Business Administration",
  };

  const department = departmentMap[departmentCode.toLowerCase()] || "Unknown";

  // Batch details
  const batchTerm = batch.charAt(0).toUpperCase() === "F" ? "Fall" : "Spring";
  const batchYear = parseInt("20" + batch.slice(1)); // f24 → 2024

  return { rollNumber, department, batchTerm, batchYear };
};
