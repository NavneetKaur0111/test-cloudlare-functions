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
      const resp = axios('/api/post/?apiurl=https://redcap.ualberta.ca/api/', data)
        .then(result => {
          setPost(result);
          return resolve(result)
        })
        .catch(error => {
          setError(error);
          return reject(error)
        });

      // const resp = await fetch(`/api/post/?apiurl=https://redcap.ualberta.ca/api/`);
      const postResp = await resp.json();
      setPost(postResp);
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
