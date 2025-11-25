import axios from 'axios';

import type { Note, NewNote } from '../types/note';

interface HTTPGetResponse {
  notes: Note[];
  totalPages: number;
}

interface HTTPPostDeleteResponse {
  note: Note;
}

export const fetchNotes = async (
  currentPage: number,
  title: string
): Promise<HTTPGetResponse> => {
  const getParams = {
    params: {
      search: title,
      page: currentPage,
      perPage: 12,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  };

  const data = await axios.get<HTTPGetResponse>(
    'https://notehub-public.goit.study/api/notes',
    getParams
  );
  console.log(data);

  return data.data;
};

export const createNote = async (
  note: NewNote
): Promise<HTTPPostDeleteResponse> => {
  const postParams = {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  };

  const newNote = await axios.post<HTTPPostDeleteResponse>(
    'https://notehub-public.goit.study/api/notes',
    note,
    postParams
  );

  return newNote.data;
};

export const deleteNote = async (
  id: string
): Promise<HTTPPostDeleteResponse> => {
  const deleteParams = {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  };

  const newNote = await axios.delete<HTTPPostDeleteResponse>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    deleteParams
  );

  return newNote.data;
};
