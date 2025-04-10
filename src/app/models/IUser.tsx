export default interface IUser {
    id?: number | string;
    username: string;
    email: string;
    password: string;
    role?: "user" | "admin";
}