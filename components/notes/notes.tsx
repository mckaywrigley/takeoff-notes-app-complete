"use client";

import { createNoteAction, deleteNoteAction, updateNoteAction } from "@/actions/notes-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { InsertNote, SelectNote } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NotesProps {
  notes: SelectNote[];
  userId: string;
}

export default function Notes({ notes: initialNotes, userId }: NotesProps) {
  const [notes, setNotes] = useState<SelectNote[]>(initialNotes);
  const [selectedNote, setSelectedNote] = useState<SelectNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const addNewNote = async () => {
    const newNote: InsertNote = {
      title: "New Note",
      content: "",
      userId
    };
    const result = await createNoteAction(newNote);
    if (result.isSuccess && result.data) {
      setNotes([...notes, result.data]);
      setSelectedNote(result.data);
      router.refresh();
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    const result = await updateNoteAction(id, { title, content });
    if (result.isSuccess && result.data) {
      const updatedNotes = notes.map((note) => (note.id === id ? result.data! : note));
      setNotes(updatedNotes);
      setSelectedNote(result.data);
      setIsEditing(false);
      router.refresh();
    }
  };

  const handleNoteChange = (field: "title" | "content", value: string) => {
    if (selectedNote) {
      setSelectedNote({ ...selectedNote, [field]: value });
      setIsEditing(true);
    }
  };

  const deleteNote = async (id: string) => {
    const result = await deleteNoteAction(id);
    if (result.isSuccess) {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      setSelectedNote(null);
      router.refresh();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-foreground">My Notes</h2>
            <Button
              onClick={addNewNote}
              className="w-full mb-4"
            >
              Add New Note
            </Button>
            <div className="space-y-2">
              {notes
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((note) => (
                  <div
                    key={note.id}
                    className={`p-2 rounded cursor-pointer ${selectedNote?.id === note.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"}`}
                    onClick={() => setSelectedNote(note)}
                  >
                    {note.title}
                  </div>
                ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8 bg-background">
        {selectedNote ? (
          <div className="space-y-4">
            <Input
              value={selectedNote.title}
              onChange={(e) => handleNoteChange("title", e.target.value)}
              placeholder="Note title"
              className="text-2xl font-bold bg-background text-foreground"
            />
            <Textarea
              value={selectedNote.content}
              onChange={(e) => handleNoteChange("content", e.target.value)}
              placeholder="Write your note here..."
              className="min-h-[300px] bg-background text-foreground"
            />
            <div className="flex justify-between">
              <Button
                onClick={() => updateNote(selectedNote.id, selectedNote.title, selectedNote.content)}
                disabled={!isEditing}
              >
                Save Changes
              </Button>
              <Button
                onClick={() => deleteNote(selectedNote.id)}
                variant="destructive"
              >
                Delete Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-20">Select a note or create a new one to get started.</div>
        )}
      </div>
    </div>
  );
}
