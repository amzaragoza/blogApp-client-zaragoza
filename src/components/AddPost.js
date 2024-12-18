import {useState, useContext} from 'react';
import {Form,Button} from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../UserContext';

export default function AddPost(){
    const notyf = new Notyf();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");

    function createPost(e){

        e.preventDefault();

        let token = localStorage.getItem('token');
        console.log(token);

        fetch('http://localhost:4000/posts/addPost',{

            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({

                title,
                content

            })
        })
        .then(res => res.json())
        .then(data => {

            if (typeof data === undefined) {
                notyf.error("Error: Something Went Wrong.")
            } if (data.message === "Post already exists") {
                notyf.error("Post already exists")
            } else {
                notyf.success("Post Added")
                navigate("/posts");
            }

        })

        setTitle("")
        setContent("")
    }

    return (
        (user.id)
        ?
        <>
            <h1 className="my-5 text-center">Add Post</h1>
            <Form onSubmit={e => createPost(e)}>
                <Form.Group>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Post Title"
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Content:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Post Content"
                        required
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="my-5">Add Post</Button>
                <Button variant="danger" type="button" className="my-5" onClick={() => navigate("/posts")}>Cancel</Button>
            </Form>
        </>
        :
        <Navigate to="/posts" />
    )
}