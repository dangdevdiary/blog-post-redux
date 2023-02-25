import { createAction, createReducer, nanoid } from '@reduxjs/toolkit';
import { initialPostList } from 'constant/blog.constant';
import { Post } from 'types/blog.type';
interface BlogState {
  postList: Post[];
  editingPost: Post | null;
}
const initialState: BlogState = {
  postList: initialPostList,
  editingPost: null
};

export const addPost = createAction('blogReducer/addPost', (post: Post) => {
  return {
    payload: {
      ...post,
      id: nanoid()
    }
  };
});
export const deletePost = createAction<string>('blogReducer/deletePost');
export const startEditingPost = createAction<Post>('blogReducer/startEditingPost');
export const cancelEditingPost = createAction('blogReducer/cancelEditingPost');
export const finishEditingPost = createAction<Post>('blogReducer/finishEditingPost');

const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      state.postList.push(action.payload);
    })
    .addCase(deletePost, (state, action) => {
      const postList: Post[] = state.postList;
      let count = 0;
      for (const item of postList) {
        if (item.id === action.payload) {
          postList.splice(count, 1);
          break;
        }
        count++;
      }
    })
    .addCase(startEditingPost, (state, action) => {
      state.editingPost = action.payload || null;
    })
    .addCase(cancelEditingPost, (state, action) => {
      state.editingPost = null;
    })
    .addCase(finishEditingPost, (state, action) => {
      state.postList.some((post, i) => {
        if (post.id === action.payload.id) {
          state.postList[i] = action.payload;
          return true;
        } else return false;
      });
      state.editingPost = null;
    });
});
export default blogReducer;
