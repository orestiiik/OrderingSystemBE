import jwt from 'jsonwebtoken';
import {User} from "./schema/types/users";

const JWT_SECRET = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJBZG1pbiIsIlVzZXJuYW1lIjoib3JkZXJ3aXNlIiwiaWF0IjoxNjgxOTQxOTc1fQ.zxLehdVdS4Gw_-GuGysmvbP3UK6zJmox1h16I3-Llks';

export const verifyToken = (token: string): boolean => {
    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch (err) {
        return false;
    }
}
export const requireAuthenticatedUser = (user: User, pass: Function) => {
    if (!user) {
        return {
            redirect: {
                permanent: false,
                destination: '/',
            },
        }
    } else {
        const res = pass()

        return {
            ...res,
            props: {
                ...res.props,
                user,
            },
        }
    }
}
