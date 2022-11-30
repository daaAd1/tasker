export function buildListLink(id: string): string {
  if (window && window.location) {
    const origin = window.location.origin;
    return `${origin}/list/${id}`;
  }

  return "/";
}
