import {Button, Form, Modal} from 'react-bootstrap';
import { useState } from 'react';
import {Notyf} from 'notyf';

export default function UpdatePost({post, fetchData}){
    const notyf = new Notyf();

    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddModalClose = () => setShowAddModal(false);
    const handleAddModalShow = () => setShowAddModal(true);

    const [postId, setPostId] = useState(post._id);

    const [title,setTitle] = useState(post.title);
	const [content,setContent] = useState(post.content);

    const updatePost = (event, postId) => {

        event.preventDefault();
        // fetch(`http://localhost:4000/posts/updatePost/${postId}`,{
        fetch(`https://blogapp-server-zaragoza.onrender.com/posts/updatePost/${postId}`,{
	        method: 'PATCH',
	        headers: {
	            "Content-Type": "application/json",
	            'Authorization': `Bearer ${localStorage.getItem("token")}`
        	},
			body: JSON.stringify({
				title,
				content
			})
        })
        .then(res => res.json())
        .then(data => {

            console.log(data)

            if (data.error === "Post not found") {
                notyf.error(`${data.title} does not exist`);
                fetchData();
                handleAddModalClose();
            } else if (data.error === "You do not have permission to update this post") {
                notyf.error("You do not have permission to update this post");
                fetchData();
                handleAddModalClose();
            } else {
                notyf.success(`Post updated successfully`);
                fetchData();
                handleAddModalClose();
            }
        })
    }


    
    return (
        <>
            <Button variant = "primary" className="me-1" size = "sm" onClick={handleAddModalShow}>Update</Button>

            {/*Update Modal*/}

            <Modal show={showAddModal} onHide={handleAddModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                       	<Form.Group className="mb-3" controlId="postTitle">
                        	<Form.Label>Post Title</Form.Label>
                        	<Form.Control
	                        	type="text"
	                        	value = {title}
	                        	onChange = {event => setTitle(event.target.value)}
	                        	required/>
                       	</Form.Group>

                       	<Form.Group className="mb-3" controlId="postContent">
                        	<Form.Label>Post Content</Form.Label>
                        	<Form.Control  
	                            type = "text"
	                            value = {content}
	                            onChange = {event => setContent(event.target.value)} 
	                            required/>
                       	</Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddModalClose}>Close</Button>
                    <Button variant="success" onClick= {event => updatePost(event, postId)}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}