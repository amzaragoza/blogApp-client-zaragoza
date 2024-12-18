import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UpdatePost from './UpdatePost';
import UserContext from '../UserContext';
import { Notyf } from 'notyf';

export default function PostDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const notyf = new Notyf();

    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const [author,setAuthor] = useState("");
    const [comments,setComments] = useState([]);

    useEffect(() => {
        // fetch(`http://localhost:4000/posts/getPost/${id}`)
        fetch(`https://blogapp-server-zaragoza.onrender.com/posts/getPost/${id}`)
        .then(response => response.json())
        .then(data => {
            if(data.error === "Post not found" || data.length === 0) {
                navigate('/posts')
            } else {
                setTitle(data.title);
                setContent(data.content);
                setAuthor(data.author || "");
                setComments(data.comments);
            }
        })
    }, [id, navigate])

    // Refetch data function
    const fetchData = () => {
        // fetch(`http://localhost:4000/posts/getPost/${id}`)
        fetch(`https://blogapp-server-zaragoza.onrender.com/posts/getPost/${id}`)
        .then(response => response.json())
        .then(data => {
            setTitle(data.title);
            setContent(data.content);
            setAuthor(data.author);
            setComments(data.comments);
        });
    };

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
                navigate('/posts');
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
        <Container>
        	<Row className="d-flex justify-content-center mt-5">
        	    <Col className="my-5 text-center">
        	        <Card.Body>
                        <Card.Title className="mb-4">{title}</Card.Title>
                        <Card.Subtitle>Content:</Card.Subtitle>
                        <Card.Text>{content}</Card.Text>
                        <Card.Subtitle>Author:</Card.Subtitle>
                        <Card.Text>{author}</Card.Text>
                        {
                            user.id ? (
                                <>
                                    <Card.Subtitle>Comments:</Card.Subtitle>
                                    {
                                        Array.isArray(comments) && comments.length > 0 ? (
                                            comments.map((comment) => (
                                                <Card.Text key={comment._id}>
                                                    <strong>User:</strong> {comment.userId} <br />
                                                    <strong>Comment:</strong> {comment.comment}
                                                </Card.Text>
                                            ))
                                        ) : (
                                            <Card.Text>No comments available.</Card.Text>
                                        )
                                    }
                                </>
                            )
                            :
                            null
                        }    
                    </Card.Body>
        	    </Col>
        	</Row>
            {user.id && typeof author === "string" && author.includes(`(${user.id})`) ? ( // Compare the logged-in user's ID with the post's author ID
                <div className="text-center my-3">
                    <UpdatePost
                        post={{ _id: id, title, content }}
                        fetchData={fetchData}
                    />
                    <button className="btn btn-danger btn-sm" onClick={() => deletePost(id)}>Delete</button>
                </div>
            ) : null}
        	<div className="text-center">
        		<Link className="btn btn-primary" to={"/posts"}>Explore More Blog Posts</Link>
        	</div>
        </Container>
    )
}