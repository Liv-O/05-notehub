// import type { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  deleteNote: (id: string) => Promise<Note>;
}

function NoteList({ notes, deleteNote }: NoteListProps) {
  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li
          className={css.listItem}
          key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
