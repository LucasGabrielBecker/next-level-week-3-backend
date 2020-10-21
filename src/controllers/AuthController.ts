import {Request, Response} from "express"
import {getRepository, getConnection} from 'typeorm';
import { reduceEachTrailingCommentRange } from "typescript";
import Users from "../models/Users"
import UsersView from "../views/users_view"

import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import * as jwt from "jsonwebtoken";
import config from "../config/config.ts"

interface Data{
    nome:string;
    email:string;
    password:string;
}

interface User{
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
        const userExists = await usersRepository.findOne({email:data.email})
        console.log(userExists)
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
        const user = await usersRepository.findOneOrFail({ where: { email } })

        if(!user){
            return response.status(500).json({succes:false, message:"User not found"})
        }

        await bcryptjs.compare(password, user.password, (err, res:Response, next) =>{
            if (err){
                // handle error
                console.error(err)
                return res.status(500).json({succes:false,message:"An error has ocurred", error: err})
              }
              if (res){
                // Send JWT
                const token = jwt.sign(
                    { userId: user.id, email: user.email },
                    config.jwtSecret,
                    { expiresIn: "1h" }
                  );

                return response.status(200).json({succes:true, message: "You are loged in", token})

              } else {
                // response is OutgoingMessage object that server response http request
                return response.json({success: false, message: 'passwords do not match'});
              }
          });
    },

    async forgot_password(request:Request, response: Response){
        const { email } =request.body;
        
        try {
            const usersRepository = getRepository(Users);
            const user = await usersRepository.findOneOrFail({where:{email}})
            console.log(user)
            if(!user){
                return response.status(400).json({error: 'User not found'})
            }

            const token = crypto.randomBytes(20).toString('hex')
            const now = new Date();
            now.setHours(now.getHours() +1)

            console.log('1')

            await getConnection()
                .createQueryBuilder()
                .update(Users)
                .set({ "passwordResetToken": "Abobora", "passwordResetExpires": now })
                .where(`id=${user.id}`)
                .execute();
                console.log('2')
        } catch (error) {
            console.log(error)
            response.status(400).json({error:'Error on getting user email'})
        }
    }

}