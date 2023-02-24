import { createAction, createReducer } from '@reduxjs/toolkit';
import { initialPostList } from 'constant/blog.constant';
import { Post } from 'types/blog.type';
interface BlogState {
  postList: Post[];
}
const initialState: BlogState = {
  postList: initialPostList
};
export const addPost = createAction<Post>('blogReducer/addPost');
export const deletePost = createAction<string>('blogReducer/deletePost');
const blogReducer = createReducer(initialState, (builder) => {
  builder.addCase(addPost, (state, action) => {
    state.postList.push(action.payload);
  });
  builder.addCase(deletePost, (state, action) => {
    const postList: Post[] = state.postList;
    let count = 0;
    for (const item of postList) {
      if (item.id === action.payload) {
        postList.splice(count, 1);
        break;
      }
      count++;
    }
  });
});
export default blogReducer;
