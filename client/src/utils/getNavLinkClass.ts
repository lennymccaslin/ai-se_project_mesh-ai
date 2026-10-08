export function getNavLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? "auth-tabs__link auth-tabs__link--active"
    : "auth-tabs__link";
}