import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Post } from 'types/blog.type';
import { useSelector } from 'react-redux';
import { cancelEditingPost, createPost, updatePost } from 'pages/newblog/blog.slice';
import { RootState, useAppDispatch } from 'store';

interface errForm {
  publishDate: string;
}

export default function CreatePost() {
  const initialFormDataRef = useRef<Post>({
    title: '',
    description: '',
    featuredImage: '',
    id: '',
    publishDate: '',
    published: false
  });
  const editingPost = useSelector((state: RootState) => state.blogReducer.editingPost);
  const [formData, setformData] = useState<Post>(initialFormDataRef.current);
  const [errForm, setErrForm] = useState<null | errForm>(null);
  useEffect(() => {
    setformData(editingPost || initialFormDataRef.current);
  }, [editingPost]);
  const dispatch = useAppDispatch();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingPost) {
      dispatch(updatePost(formData))
        .unwrap()
        .then(() => {
          setformData(initialFormDataRef.current);
          if (errForm) {
            setErrForm(null);
          }
        })
        .catch((err) => {
          setErrForm({ ...errForm, publishDate: err.err });
        });
    } else {
      dispatch(createPost(formData))
        .unwrap()
        .then(() => {
          setformData(initialFormDataRef.current);
          if (errForm) {
            setErrForm(null);
          }
        })
        .catch((err) => {
          setErrForm({ ...errForm, publishDate: err.err });
        });
    }
  };
  const hanleCancel = () => {
    dispatch(cancelEditingPost());
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-6'>
        <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Title
        </label>
        <input
          type='text'
          id='title'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Title'
          required
          value={formData.title}
          onChange={(e) => setformData((prev) => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='featuredImage' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Featured Image
        </label>
        <input
          type='text'
          id='featuredImage'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Url image'
          required
          value={formData.featuredImage}
          onChange={(e) => setformData((prev) => ({ ...prev, featuredImage: e.target.value }))}
        />
      </div>
      <div className='mb-6'>
        <div>
          <label htmlFor='description' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'>
            Description
          </label>
          <textarea
            id='description'
            rows={3}
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Your description...'
            required
            value={formData.description}
            onChange={(e) => setformData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
      </div>
      <div className='mb-6'>
        <label
          htmlFor='publishDate'
          className={`mb-2 block text-sm font-medium ${
            errForm?.publishDate ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-gray-300'
          }`}
        >
          Publish Date
        </label>
        <input
          type='date'
          id='publishDate'
          required
          className={`block w-56 rounded-lg border  p-2.5 text-sm focus:outline-none ${
            errForm?.publishDate
              ? 'border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder='Title'
          value={formData.publishDate}
          onChange={(e) => setformData((prev) => ({ ...prev, publishDate: e.target.value }))}
        />
        <p className='font-semibold text-red-600'>{errForm?.publishDate}</p>
      </div>
      <div className='mb-6 flex items-center'>
        <input
          id='publish'
          type='checkbox'
          className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
          checked={formData.published}
          onChange={(e) => setformData((prev) => ({ ...prev, published: e.target.checked }))}
        />
        <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
          Publish
        </label>
      </div>
      <div>
        {!editingPost && (
          <button
            className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
            type='submit'
          >
            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
              Publish Post
            </span>
          </button>
        )}
        {editingPost && (
          <>
            <button
              type='submit'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Update Post
              </span>
            </button>
            <button
              type='reset'
              onClick={hanleCancel}
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Cancel
              </span>
            </button>
          </>
        )}
      </div>
    </form>
  );
}
