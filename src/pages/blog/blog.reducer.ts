import { createReducer } from '@reduxjs/toolkit';
import { initialPostList } from 'constant/blog.constant';
import { Post } from 'types/blog.type';
interface BlogState {
  postList: Post[];
}
const initialState: BlogState = {
  postList: initialPostList
};
const blogReducer = createReducer(initialState, (build) => {});
export default blogReducer;
