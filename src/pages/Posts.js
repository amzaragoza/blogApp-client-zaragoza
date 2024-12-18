import { useContext } from 'react';
import PostCard from '../components/PostCard';
import Dashboard from '../components/Dashboard';
import UserContext from '../UserContext';

export default function Posts() {

    const { user } = useContext(UserContext);

    return(
        (user.isAdmin === true)
        ?
            <Dashboard />
        :
            <PostCard />
    )
}