//import { useState } from 'react';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import css from './App.module.css';
import { createNote, deleteNote, fetchNotes } from '../../services/noteService';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import NoteList from '../NoteList/NoteList';

import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import type { NewNote } from '../../types/note';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';

function App() {
  const [title, setTitle] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [debouncedSearch] = useDebounce(title, 1000);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearch, currentPage],
    queryFn: () => fetchNotes(currentPage, debouncedSearch),
    enabled: true,
    placeholderData: keepPreviousData,
  });

  const mutationPost = useMutation({
    mutationFn: async (newNoteInfo: NewNote) => {
      return createNote(newNoteInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });

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

  const totalPages = data?.totalPages ?? 0;

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const newNoteCreate = (newNoteCreatedInfo: NewNote) => {
    mutationPost.mutate(newNoteCreatedInfo);
  };

  const deleteNoteClick = (id: string) => {
    mutationDelete.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          onSearch={setTitle}
          value={title}
        />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        <button
          className={css.button}
          onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {mutationPost.isPending && <Loader />}
      {mutationDelete.isPending && <Loader />}
      {isError && <Error />}
      {mutationPost.isError && <Error />}
      {mutationDelete.isError && <Error />}
      {isOpenModal && (
        <Modal closeModal={closeModal}>
          <NoteForm
            closeModal={closeModal}
            newNoteCreate={newNoteCreate}
          />
        </Modal>
      )}
      {data && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          deleteNote={deleteNoteClick}
        />
      )}
    </div>
  );
}

export default App;
