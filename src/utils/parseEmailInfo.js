export const parseEmailInfo = (email) => {
  const [prefix] = email.split("@"); // e.g. "005889bscsf24"

  const rollNumber = prefix.substring(0, 6);
  const departmentCode = prefix.substring(6, 10);
  const batch = prefix.substring(10, 13);

  const departmentMap = {
    bscs: "Computer Science",
    bsse: "Software Engineering",
    bsit: "Information Technology",
  };
  const department = departmentMap[departmentCode.toLowerCase()] || "Unknown";

  const batchTerm = batch.charAt(0).toUpperCase() === "F" ? "Fall" : "Spring";
  const batchYear = parseInt("20" + batch.slice(1));

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentTerm = now.getMonth() <= 5 ? "Spring" : "Fall";

  // 🧮 Fix semester logic
  let semesterNumber =
    (currentYear - batchYear) * 2 +
    (batchTerm === currentTerm ? 1 : currentTerm === "Spring" ? 2 : 0);

  if (semesterNumber < 1) semesterNumber = 1;
  if (semesterNumber > 8) semesterNumber = 8;

  return { rollNumber, department, batchTerm, batchYear, semesterNumber };
};
