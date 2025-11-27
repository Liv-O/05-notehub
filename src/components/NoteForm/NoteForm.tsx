import css from './NoteForm.module.css';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import type { NewNote, Note } from '../../types/note';

interface NoteFormProps {
  closeModal: () => void;
  newNoteCreate: (newNoteInfo: NewNote) => Promise<Note>;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const NoteFormValidation = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must have minimum 3 symbols')
    .max(50, 'Title must have maximum 50 symbols')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content must have maximum 500 symbols'),
  tag: Yup.string()
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Wrong tag name '
    )
    .required('Tag is required'),
});

function NoteForm({ closeModal, newNoteCreate }: NoteFormProps) {
  const handleSubmit = async (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    try {
      await newNoteCreate(values); // чекаємо mutateAsync

      actions.resetForm();
      closeModal();
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteFormValidation}>
      <Form>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage
            name="title"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            as="textarea"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage
            name="content"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field
            id="tag"
            as="select"
            name="tag"
            className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage
            name="tag"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={closeModal}>
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default NoteForm;
