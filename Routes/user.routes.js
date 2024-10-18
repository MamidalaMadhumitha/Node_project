import {register,login} from "../Controllers/users.controller";

//created a function to register a new user and Authenticate user and return a JWT token through login router
export function useRoutes(app){
    app.post("/register",register);
    app.post("/login",login);
}