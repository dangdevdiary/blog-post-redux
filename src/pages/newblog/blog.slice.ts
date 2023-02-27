import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from 'types/blog.type';
import http from 'utils/http';
interface BlogState {
  postList: Post[];
  editingPost: Post | null;
  loading: boolean;
  currentRequestId: string | undefined;
}
const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: ''
};

export const fetchPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
  const response = await http.get<Post[]>('/posts', {
    signal: thunkAPI.signal
  });
  return response.data;
});
export const createPost = createAsyncThunk('blog/createPost', async (body: Omit<Post, 'id'>, thunkAPI) => {
  const response = await http.post<Post>('/posts', body, {
    signal: thunkAPI.signal
  });
  return response.data;
});
export const updatePost = createAsyncThunk('blog/updatePost', async (body: Post, thunkAPI) => {
  const response = await http.patch<Post>(`/posts/${body.id}`, body, {
    signal: thunkAPI.signal
  });
  return response.data;
});
export const deletePost = createAsyncThunk('blog/deletePost', async (id: string, thunkAPI) => {
  const response = await http.delete<String>(`/posts/${id}`, {
    signal: thunkAPI.signal
  });
  return response.data;
});

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startEditingPost: (state, action: PayloadAction<Post>) => {
      state.editingPost = action.payload || null;
    },
    cancelEditingPost: (state) => {
      state.editingPost = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.postList.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.find((post, i) => {
          if (post.id === action.payload.id) {
            state.postList[i] = action.payload;
            return true;
          } else return false;
        });
        state.editingPost = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postList: Post[] = state.postList;
        let count = 0;
        for (const item of postList) {
          if (item.id === action.meta.arg) {
            postList.splice(count, 1);
            break;
          }
          count++;
        }
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (action.meta.requestId === state.currentRequestId) state.loading = false;
          state.currentRequestId = undefined;
        }
      );
  }
});

export const { startEditingPost, cancelEditingPost } = blogSlice.actions;

export default blogSlice.reducer;
