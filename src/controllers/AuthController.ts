import {Request, Response} from "express"
import {getRepository} from 'typeorm';
import { reduceEachTrailingCommentRange } from "typescript";
import Users from "../models/Users"
import UsersView from "../views/users_view"
import * as bcryptjs from 'bcryptjs';

interface Data{
    nome:string;
    email:string;
    password:string;
}

export default{
    async createUser(request:Request, response: Response){
        const usersRepository = getRepository(Users);
        const data:Data = request.body;
        const newPassword = await bcryptjs.hash(data.password,10)
        data.password = newPassword;
        
        //check for duplicates users
        const userExists = await usersRepository.find({email:data.email})
        if(userExists){
            console.log('User email already exists')
            return response.status(500).json({message: `We already have ${data.email} on our system, users email must be unique`})
        }
        



        const user = usersRepository.create(data)
        try {
            await usersRepository.save(user);
            console.log(user)
            return response.status(201).json({message: 'User created Succesfully', data})
        } catch (error) {
            return response.status(500).json({message: "Internal server error", error})
        }

    },

    async listUsers(request:Request, response: Response){
        const usersRepository = getRepository(Users);
        const users = await usersRepository.find({})
        return response.status(201).json(UsersView.renderMany(users))
    },

    async login(request:Request, response: Response){
        const usersRepository = getRepository(Users);
        const {email, password} = request.body;
        const user = await usersRepository.find({email})

        bcrypt.compare(password, user.password, function(err, res) {
            if(password != user.password){
              res.json({success: false, message: 'passwords do not match'});
            } else {
              // Send JWT
              
            }
          });
        
        return response.status(201).json(UsersView.renderMany(users))
    }

}