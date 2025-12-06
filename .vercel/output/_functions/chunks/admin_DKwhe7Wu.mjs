function checkAdminAuth(cookies) {
  const adminCookie = cookies.get("admin_session");
  return adminCookie?.value === "authenticated";
}
function requireAdmin(cookies) {
  if (!checkAdminAuth(cookies)) {
    throw new Error("Unauthorized");
  }
}

export { checkAdminAuth as c, requireAdmin as r };
