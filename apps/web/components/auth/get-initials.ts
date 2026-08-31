
export function getInitials(name?: string | null, email?: string | null): string {
    if (name) {
      const parts = name.trim().split(/\s+/).filter(Boolean);
      const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
      const initials = letters.join("");
      if (initials) return initials;
    }
    if (email) return email[0]?.toUpperCase() ?? "?";
    return "?";
  }