import { addPost } from 'pages/blog/blog.reducer';
import { createAction, createReducer, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
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

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addNewPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.postList.push(action.payload);
      },
      prepare: (post: Post) => {
        return {
          payload: {
            ...post,
            id: nanoid()
          }
        };
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const postList: Post[] = state.postList;
      let count = 0;
      for (const item of postList) {
        if (item.id === action.payload) {
          postList.splice(count, 1);
          break;
        }
        count++;
      }
    },
    startEditingPost: (state, action: PayloadAction<Post>) => {
      state.editingPost = action.payload || null;
    },
    cancelEditingPost: (state) => {
      state.editingPost = null;
    },
    finishEditingPost: (state, action: PayloadAction<Post>) => {
      state.postList.some((post, i) => {
        if (post.id === action.payload.id) {
          state.postList[i] = action.payload;
          return true;
        } else return false;
      });
      state.editingPost = null;
    }
  }
});

export const { deletePost, startEditingPost, cancelEditingPost, finishEditingPost, addNewPost } = blogSlice.actions;

export default blogSlice.reducer;
