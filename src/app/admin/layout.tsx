export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root admin layout: intentionally empty so that
  // /admin/login לא נעטף בלייאאוט המוגן.
  // ההגנה על דשבורד / משרות / מועמדויות נעשית
  // בלייאאוט שבתוך (dashboard).
  return children;
}
