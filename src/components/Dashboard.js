import { useState, useEffect, useContext } from 'react';
import { Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UpdatePost from './UpdatePost';
import UserContext from '../UserContext';

export default function AdminDashboard() {

	const { user } = useContext(UserContext);
    const notyf = new Notyf();
    const navigate = useNavigate();
	const [posts, setPosts] = useState([]);
	const [showAddCommentModal, setShowAddCommentModal] = useState(false);
	const [newComment, setNewComment] = useState('');
	const [selectedPostId, setSelectedPostId] = useState(null);

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

	const addComment = () => {
	    if (!newComment.trim()) {
	        notyf.error("Comment cannot be empty");
	        return;
	    }

	    fetch(`https://blogapp-server-zaragoza.onrender.com/posts/addComment/${selectedPostId}`, {
	        method: 'POST',
	        headers: {
	            "Content-Type": "application/json",
	            'Authorization': `Bearer ${localStorage.getItem("token")}`
	        },
	        body: JSON.stringify({
	            comments: [{ comment: newComment }]
	        })
	    })
	        .then(res => res.json())
	        .then(data => {
	            if (data.message === "comment added successfully") {
	                notyf.success("Comment added successfully");
	                setNewComment("");
	                fetchData();
	                setShowAddCommentModal(false);
	            } else {
	                notyf.error(data.error || "Error adding comment");
	            }
	        })
	        .catch(error => {
	            console.error("Error adding comment:", error);
	            notyf.error("Failed to add comment. Please try again later.");
	        });
	};
	const openAddCommentModal = (postId) => {
		setSelectedPostId(postId);
		setShowAddCommentModal(true);
	};

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
					      <thead className="text-center">
					        <tr>
					          <th>Title</th>
					          <th>Content</th>
					          <th>Author</th>
					          <th>Created On</th>
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
										        <td>{post.createdOn}</td>
										        <td>
								                    {Array.isArray(post.comments) && post.comments.length > 0
								                      ? post.comments.map((comment, index) => (
								                          <div key={comment._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								                              <span>{comment.comment}</span> {/* Render comment text */}
								                              {/* Add the delete button for each comment */}
								                              <button 
								                                  className="btn btn-danger btn-sm ms-2 my-1" 
								                                  onClick={() => deleteComment(post._id, comment._id)} // Properly reference comment._id
								                              >
								                                  Remove Comment
								                              </button>
								                          </div>
								                      ))
								                      : "No comments"}
								                </td>
										        <td className="text-center align-middle">
            										<div className="d-flex flex-column align-items-center">
        										        <Button
        										            variant="info"
        										            className="btn-sm mb-1 px-1" // Adjust spacing between buttons
        										            onClick={() => openAddCommentModal(post._id)}
        										        >
        										        	Comment
        										        </Button>
        										        {user.id && typeof post.author === "string" && post.author.includes(`(${user.id})`) ? (
        										            <UpdatePost post={post} fetchData={fetchData} />
        										        ) : null}
        										        <Button
        										            variant="danger"
        										            className="btn-sm my-1" // Adjust spacing between buttons
        										            onClick={() => deletePost(post._id)}
        										        >
        										            Delete
        										        </Button>
        										    </div>
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

			    {/* Add Comment Modal */}
    			<Modal show={showAddCommentModal} onHide={() => setShowAddCommentModal(false)}>
    				<Modal.Header closeButton>
    					<Modal.Title>Add Comment</Modal.Title>
    				</Modal.Header>
    				<Modal.Body>
    					<Form>
    						<Form.Group>
    							<Form.Label>Comment</Form.Label>
    							<Form.Control
    								as="textarea"
    								rows={3}
    								placeholder="Enter your comment"
    								value={newComment}
    								onChange={(e) => setNewComment(e.target.value)}
    							/>
    						</Form.Group>
    					</Form>
    				</Modal.Body>
    				<Modal.Footer>
    					<Button variant="secondary" onClick={() => setShowAddCommentModal(false)}>
    						Close
    					</Button>
    					<Button variant="primary" onClick={addComment}>
    						Add Comment
    					</Button>
    				</Modal.Footer>
    			</Modal>
		    </>
		:
			<Navigate to="/login" />
	)
}