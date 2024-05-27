import { Routes, Route } from 'react-router-dom';
import { UserContext } from "../Context/UserContext";
import { useContext } from 'react';

import Alert from 'react-bootstrap/Alert';

const PrivateRoute = (props) => {

    const { user } = useContext(UserContext)

    if(user && !user.auth) {
        return <>
            <Alert variant="danger" dismissible className='mt-3'>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                    You don't have permission  to access this routes
                </p>
            </Alert>
        </>
    }
    return (
        <>
           {props.children}
        </>
    )
}

export default PrivateRoute