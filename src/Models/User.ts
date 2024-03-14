interface User {
    id: number;
    login: string;
    password?: string;
    admin?: boolean;
    verified: boolean;
    suspended: boolean;
}
export default User;