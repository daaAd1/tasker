import toast from "react-hot-toast";

export function buildListLink(id: string): string {
  if (typeof window !== "undefined" && window && window.location) {
    const origin = window.location.origin;
    return `${origin}/list/${id}`;
  }

  return `list/${id}`;
}

export async function toastWrapper(funcToCall: any) {
  try {
    await funcToCall();
    toast.success("Synced!", {
      id: "success",
      duration: 2000,
    });
  } catch (e) {
    toast.error("Error syncing. Please try again.", {
      id: "error-syncing",
      duration: 3000,
    });
  }
}
