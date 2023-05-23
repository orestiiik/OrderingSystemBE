export interface User {
    id: string;
    data: UserData
}

export interface UserWithToken {
    user: User,
    token: string
}

export interface UserData {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    roles: string[]
}

export interface UserDataWidthId {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    roles: string[]
}