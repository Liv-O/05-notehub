// import type { deleteNote } from '../../services/noteService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { deleteNote } from '../../services/noteService';
import Loader from '../Loader/Loader';
import CustomErrorMessage from '../CustomErrorMessage/CustomErrorMessage';

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const mutationDelete = useMutation({
    mutationFn: async (id: string) => {
      return deleteNote(id);
    },
    onSuccess: () => {
      console.log('note deleted');
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });
  const handleDelete = async (id: string) => {
    try {
      await mutationDelete.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };
  return (
    <>
      {mutationDelete.isPending && <Loader />}
      {mutationDelete.isError && <CustomErrorMessage />}
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
    </>
  );
}

export default NoteList;
