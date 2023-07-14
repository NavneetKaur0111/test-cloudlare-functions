import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Post = () => {
  const [post, setPost] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      const resp = await fetch(`/api/post`);
      const postResp = await resp.json();
      setPost(postResp);
    };

    getPost();
  }, [id]);

  if (!Object.keys(post).length) return <div>Test</div>;

  return (
    <div>
      <h1>{post}</h1>
      <p>
        <em>Published {new Date(post.published_at).toLocaleString()}</em>
      </p>
      <p>
        <Link to="/">Go back</Link>
      </p>
    </div>
  );
};

export default Post;
