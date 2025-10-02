const validateEmailAndRole = (email) => {
  if (!email || typeof email !== "string") return { valid: false, role: null };

  const studentPattern = /^[a-z0-9._%+-]+@student\.uni\.edu\.pk$/i;
  const facultyPattern = /^[a-z0-9._%+-]+@uni\.edu\.pk$/i;
  const adminPattern = /^[a-z0-9._%+-]+@admin\.uni\.edu\.pk$/i;

  if (adminPattern.test(email)) {
    return { valid: true, role: "admin" };
  } else if (studentPattern.test(email)) {
    return { valid: true, role: "student" };
  } else if (facultyPattern.test(email)) {
    return { valid: true, role: "faculty" };
  } else {
    return { valid: false, role: null };
  }
};

export default validateEmailAndRole;
