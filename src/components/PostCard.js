import { Row, Col, Card, Button } from 'react-bootstrap';
import { useEffect, useState, useContext } from 'react';
import PostDetails from '../components/PostDetails';
import UserContext from '../UserContext';
import { Link } from 'react-router-dom';

export default function PostCard({post}) {

    const { user } = useContext(UserContext); 
    const [posts, setPosts] = useState([]);

    const fetchData = () => {
        // fetch('http://localhost:4000/posts/getPosts', {
        fetch('https://blogapp-server-zaragoza.onrender.com/posts/getPosts', {
            headers: {
                'Authorization': `Bearer ${ localStorage.getItem('token') }`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.error === "No posts found") {
                setPosts([]);
            } else {
                setPosts(data.posts);
            }
        });
    }

    useEffect(() => {
        fetchData()
    }, [user]);

	return (
        <>
            <h1 className="my-5 text-center">Explore Blog Posts</h1>
            <Row className="d-flex justify-content-center mx-auto my-5">
                {
                    (posts.length > 0)
                    ?
                        posts.map((post) => {
                            return(
                                <Col key={post._id} className="col-4 justify-content-center mt-4">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title className="mb-4 text-center">{post.title}</Card.Title>
                                            <Button as={Link} variant="primary" className="col-12" to={`/posts/getPost/${post._id}`}>Details</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    :
                        <h1 className="text-center">No Movies or TV Shows found &#128542;</h1>
                }
            </Row>
        </>
	)
}