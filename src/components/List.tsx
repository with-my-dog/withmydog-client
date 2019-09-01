import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createUserAction, RootState,
} from '../internal';

export const List: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(createUserAction({
            email: 'pyeong.oh5@gmail.com',
            password: '1234',
            name: 'pyeong.oh5',
        }));
    }, []);

    const { fetchingCount } = useSelector((state: RootState) => state.userReducer );
    console.log('fetchingCount', fetchingCount);

    // dispatch({
    //     type: 'CREATE_USER/TRIGGER',
    //     payload: {
    //         email: 'pyeong.oh5@gmail.com',
    //         password: '1234',
    //         name: 'pyeong.oh5',
    //     }
    // });
    return (
        <div>List!!!</div>
    );
};