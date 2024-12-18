import { useState, useEffect, useContext } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UpdatePost from './UpdatePost';
import UserContext from '../UserContext';

export default function AdminDashboard() {

	const { user } = useContext(UserContext);
    const notyf = new Notyf();
    const navigate = useNavigate();
	const [posts, setPosts] = useState([]);

	const fetchData = () => {
		// fetch('http://localhost:4000/posts/getPosts', {
		fetch('https://blogapp-server-zaragoza.onrender.com/posts/getPosts', {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then(response => response.json())
		.then(data => {
			if(data.error === "No posts found" || data.posts.length === 0) {
				setPosts([]);
			} else {
				setPosts(data.posts);
			}
		});
	};

	useEffect(() => {
		fetchData();
	}, [user])

	function deleteComment(postId, commentId) {
	  	// fetch(`http://localhost:4000/posts/removeComments/${postId}/${commentId}`, {
	  	fetch(`https://blogapp-server-zaragoza.onrender.com/posts/removeComments/${postId}/${commentId}`, {
	    	method: 'DELETE',
	    	headers: {
	      		"Content-Type": "application/json",
	      		'Authorization': `Bearer ${localStorage.getItem("token")}`
	    	}
	  	})
	    .then(res => res.json())
	    .then(data => {
	      	if (data.message === "Comment removed successfully") {
	      		notyf.success("Comment removed successfully");
	      		fetchData(); // Re-fetch posts to update the UI
	      	}else if (data.error === "Post not found") {
	      		notyf.error("Post not found");
	      	}else if (data.error === "You do not have permission to delete this comment") {
	      		notyf.error("You do not have permission to delete this comment");
	      	}else {
	      		notyf.error(data.error || "Error removing comment");
	      	}
	    });
	}

	function deletePost(postId) {

	        // fetch(`http://localhost:4000/posts/deletePost/${postId}`,{
	        fetch(`https://blogapp-server-zaragoza.onrender.com/posts/deletePost/${postId}`,{

	        method: 'DELETE',
	        headers: {
	            "Content-Type": "application/json",
	            'Authorization': `Bearer ${localStorage.getItem("token")}`
	        }
	    })
	    .then(res => res.json())
	    .then(data => {

	        if(data.message === "Post deleted successfully") {
	        	notyf.success("Post deleted successfully");
	        	fetchData();
	        }else if (data.error === "Post not found") {
	        	notyf.error("Post not found");
	      	}else if(data.error === "You do not have permission to delete this post") {
	        	notyf.success("You do not have permission to delete this post");
	        }else{
	        	notyf.error(data.error || "Error deleting post");
	        }
	    })
	}

	return(
		(user.id !== null && user.isAdmin === true)
		?
			<>
				<Row className="my-5 text-center">
					<h1>Admin Dashboard</h1>
					<Col>
						<Button variant="success" className="ms-1" onClick={() => navigate('/addPost')}>Add Post</Button>
					</Col>
				</Row>
				<Row>
					<Col className="col-12">
						<Table striped bordered hover variant="dark">
					      <thead>
					        <tr>
					          <th>Title</th>
					          <th>Content</th>
					          <th>Author</th>
					          <th>Comments</th>
					          <th>Actions</th>
					        </tr>
					      </thead>
					      <tbody>
					      	{
					      		(posts.length > 0)
					      		?
					      			posts.map((post, index) => {
					      				return(
				      						<tr key={post._id || index}>
						      					<td>{post.title}</td>
										        <td>{post.content}</td>
										        <td>{post.author}</td>
										        <td>
								                    {Array.isArray(post.comments) && post.comments.length > 0
								                      ? post.comments.map((comment, index) => (
								                          <div key={comment._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								                              <span>{comment.comment}</span> {/* Render comment text */}
								                              {/* Add the delete button for each comment */}
								                              <button 
								                                  className="btn btn-danger btn-sm ms-2" 
								                                  onClick={() => deleteComment(post._id, comment._id)} // Properly reference comment._id
								                              >
								                                  Remove Comment
								                              </button>
								                          </div>
								                      ))
								                      : "No comments"}
								                </td>
										        <td className="text-center">
            										{/*<button className="btn btn-danger btn-sm" onClick={() => deleteComment(post._id, comment._id)}>Delete</button>*/}
            										{/*<UpdatePost
            										    post={{ _id: id, title, content }}
            										    fetchData={fetchData}
            										/>*/}
										        	{user.id && typeof post.author === "string" && post.author.includes(`(${user.id})`) ? (
	                                                    <UpdatePost post = {post} fetchData = {fetchData}/>
	                                                ) : null}
            										{/*<UpdatePost post = {post} fetchData = {fetchData}/>*/}
            										<button className="btn btn-danger btn-sm" onClick={() => deletePost(post._id)}>Delete</button>
										        </td>
									        </tr>
					      				)
					      			})
					      		:
					      			null
					      	}
					      </tbody>
					    </Table>
				    </Col>
			    </Row>
		    </>
		:
			<Navigate to="/login" />
	)
}