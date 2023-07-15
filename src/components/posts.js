import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";

const Post = () => {
  const [post, setPost] = useState({});
  const [error, setError] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      const data = new FormData();
      data.append('token', process.env.REACT_APP_REDCAP_TOKEN);
      data.append('format', 'json');
      data.append('content', 'record');
      data.append('type', 'flat');
      data.append('data', JSON.stringify([{record_id: 'testinggggg'}]));

      axios.post('/api/redcap/corsproxy', data)
        .then(result => {
          console.log(result);
          setPost(result);
        })
        .catch(error => {
          console.log(error);
          setError(error);
        });
    };

    getPost();
  }, [id]);

  if (!Object.keys(post).length) return <div>Test</div>;

  return (
    <div>
      <h1>{post}</h1>
      <h2>{error}</h2>
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
