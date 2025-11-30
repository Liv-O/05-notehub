//import { useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import NoteList from '../NoteList/NoteList';

import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader';
import CustomErrorMessage from '../CustomErrorMessage/CustomErrorMessage';

function App() {
  const [title, setTitle] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setTitle(value);
    setCurrentPage(1);
  }, 1000);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', title, currentPage],
    queryFn: () => fetchNotes(currentPage, title),
    enabled: true,
    placeholderData: keepPreviousData,
  });

  // const mutationPost = useMutation({
  //   mutationFn: async (newNoteInfo: NewNote) => {
  //     return createNote(newNoteInfo);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ['notes'],
  //     });
  //   },
  // });

  // const mutationDelete = useMutation({
  //   mutationFn: async (id: string) => {
  //     return deleteNote(id);
  //   },
  //   onSuccess: () => {
  //     console.log('note deleted');
  //     queryClient.invalidateQueries({
  //       queryKey: ['notes'],
  //     });
  //   },
  // });

  const totalPages = data?.totalPages ?? 0;

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  // const newNoteCreate = (newNoteCreatedInfo: NewNote) => {
  //   return mutationPost.mutate(newNoteCreatedInfo);
  // };

  // const newNoteCreate = mutationPost.mutateAsync;

  // const deleteNoteClick = (id: string) => {
  //   mutationDelete.mutate(id);
  // };

  // const deleteNoteClick = mutationDelete.mutateAsync;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          onSearch={debouncedSearch}
          value={title}
        />
        {totalPages > 1 && (
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
      {/* {mutationPost.isPending && <Loader />}
      {mutationDelete.isPending && <Loader />} */}
      {isError && <CustomErrorMessage />}
      {/* {mutationPost.isError && <Error />}
      {mutationDelete.isError && <Error />} */}
      {isOpenModal && (
        <Modal closeModal={closeModal}>
          <NoteForm closeModal={closeModal} />
        </Modal>
      )}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}

export default App;
