import PostItem from '../PostItem';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from 'store';
import { deletePost, fetchPostList, startEditingPost } from 'pages/newblog/blog.slice';
import { Post } from 'types/blog.type';
import { useEffect } from 'react';
import Skeleton from '../skeletons';

function PostList() {
  const initialPostList = useSelector((state: RootState) => state.blogReducer.postList);
  const loading = useSelector((state: RootState) => state.blogReducer.loading);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const res = dispatch(fetchPostList());
    return () => {
      res.abort();
    };
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deletePost(id));
  };
  const handleEditing = (post: Post) => {
    dispatch(startEditingPost(post));
  };
  return (
    <div>
      <div className='bg-white py-6 sm:py-8 lg:py-12'>
        <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
          <div className='mb-10 md:mb-16'>
            <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Được Dev Blog</h2>
            <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
              Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
            </p>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
            {loading && (
              <>
                <Skeleton />
                <Skeleton />
              </>
            )}
            {!loading &&
              initialPostList.map((post) => {
                return <PostItem post={post} key={post.id} handleDelete={handleDelete} handleEditing={handleEditing} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostList;
