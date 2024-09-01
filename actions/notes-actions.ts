"use server";

import { createNote, deleteNote, getNote, getNotes, updateNote } from "@/db/queries/notes-queries";
import { InsertNote, SelectNote } from "@/db/schema/notes-schema";
import { ActionResult } from "@/types/actions/actions-types";
import { revalidatePath } from "next/cache";

export async function createNoteAction(note: InsertNote): Promise<ActionResult<SelectNote>> {
  try {
    const newNote = await createNote(note);
    revalidatePath("/");
    return { isSuccess: true, message: "Note created successfully", data: newNote };
  } catch (error) {
    return { isSuccess: false, message: "Failed to create note" };
  }
}

export async function getNotesByUserIdAction(userId: string): Promise<ActionResult<SelectNote[]>> {
  try {
    const notes = await getNotes(userId);
    return { isSuccess: true, message: "Notes retrieved successfully", data: notes };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get notes" };
  }
}

export async function getNoteAction(id: string): Promise<ActionResult<SelectNote | null>> {
  try {
    const note = await getNote(id);
    return { isSuccess: true, message: "Note retrieved successfully", data: note };
  } catch (error) {
    return { isSuccess: false, message: "Failed to get note" };
  }
}

export async function updateNoteAction(id: string, data: Partial<InsertNote>): Promise<ActionResult<SelectNote>> {
  try {
    const updatedNote = await updateNote(id, data);
    revalidatePath("/");
    return { isSuccess: true, message: "Note updated successfully", data: updatedNote };
  } catch (error) {
    return { isSuccess: false, message: "Failed to update note" };
  }
}

export async function deleteNoteAction(id: string): Promise<ActionResult<void>> {
  try {
    await deleteNote(id);
    revalidatePath("/");
    return { isSuccess: true, message: "Note deleted successfully" };
  } catch (error) {
    return { isSuccess: false, message: "Failed to delete note" };
  }
}
