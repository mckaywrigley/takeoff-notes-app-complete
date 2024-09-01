import { getNotesByUserIdAction } from "@/actions/notes-actions";
import { default as Notes } from "@/components/notes/notes";
import { getProfileByUserId } from "@/db/queries/profiles-queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/login");
  }

  const profile = await getProfileByUserId(userId);

  if (!profile) {
    return redirect("/signup");
  }

  if (profile.membership === "free") {
    return redirect("/pricing");
  }

  const notesRes = await getNotesByUserIdAction(userId);

  return (
    <Notes
      notes={notesRes.data ?? []}
      userId={userId}
    />
  );
}
