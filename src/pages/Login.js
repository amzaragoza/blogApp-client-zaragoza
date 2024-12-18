import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom'; 
import { Notyf } from 'notyf';
import UserContext from '../UserContext';

export default function Login() {
	const { user, setUser } = useContext(UserContext);
	const notyf = new Notyf();

	const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        e.preventDefault();
		// fetch('http://localhost:4000/users/login',{
		fetch('https://blogapp-server-zaragoza.onrender.com/users/login',{
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				emailOrUsername,
				password
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data.access){
				localStorage.setItem('token', data.access);
				retrieveUserDetails(data.access);
				notyf.success('Successful Login');
			} else if (data.error === "Credentials do not match") {
	            notyf.error(`Incorrect credentials. Try again!`);
			} else if (data.error === "No user found") {
                notyf.error('User does not exist.');
            } else {
            	notyf.error(`An error occurred. Please try again.`);
            }
		})

		setEmailOrUsername('');
		setPassword('');


    }


    const retrieveUserDetails = (token) => {

        // fetch('http://localhost:4000/users/details',{
        fetch('https://blogapp-server-zaragoza.onrender.com/users/details', {
            headers: {
                'Authorization': `Bearer ${ token }`
            }
        })
        .then(res => res.json())
        .then(data => {

            setUser({
              id: data._id,
              isAdmin: data.isAdmin
            });
        })

    };

    // useEffect(() => {
    //     // Validation to enable submit button when all fields are populated and both passwords match
    //     if(emailOrUsername !== '' && password !== ''){
    //         setIsActive(true);
    //     }else{
    //         setIsActive(false);
    //     }
    // }, [emailOrUsername, password]);
    useEffect(() => {
        setIsActive(emailOrUsername !== '' && password !== '');
    }, [emailOrUsername, password]);

    return (
    	(user.id !== null) ?
			<Navigate to="/posts" />
			:
	    	<>
		        <Form onSubmit={(e) => authenticate(e)}>
		        	<h1 className="my-5 text-center">Login</h1>
		            <Form.Group controlId="userEmailOrUsername">
		                <Form.Label>Email or Username: </Form.Label>
		                <Form.Control 
		                    className="mb-2"
		                    type="text"
		                    placeholder="Enter Email or Username"
		                    value={emailOrUsername}
	            			onChange={(e) => setEmailOrUsername(e.target.value)}
		                    required
		                />
		            </Form.Group>

		            <Form.Group controlId="password">
		                <Form.Label>Password: </Form.Label>
		                <Form.Control 
		                    className="mb-2"
		                    type="password" 
		                    placeholder="Enter Password"
		                    value={password}
	            			onChange={(e) => setPassword(e.target.value)}
		                    required
		                />
		            </Form.Group>

		             { isActive ? 
		                <Button variant="primary" type="submit" id="loginBtn" className="mt-2">
		                    Submit
		                </Button>
		                : 
		                <Button variant="danger" type="submit" id="loginBtn" className="mt-2" disabled>
		                    Submit
		                </Button>
		            }
		        </Form>
		        <p className = 'mt-4 text-center'>Don't have an account yet? <a href="/register" className="text-decoration-none">Click here</a> to register.</p>
	    	</>
    )
}