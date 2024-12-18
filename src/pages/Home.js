import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {


    return (
        <Row>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>Welcome To Your Blog App!</h1>
                <Link className="btn btn-primary" to={"/login"}>View Blog Posts!</Link>
            </Col>
        </Row>
    )
}