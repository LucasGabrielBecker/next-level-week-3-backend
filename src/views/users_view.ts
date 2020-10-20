import User from "../models/Users"


export default{
    render(users:User){
        return {
            id: users.id ,
            nome: users.nome,
            password: users.password,
            email: users.email,
        };
    },

    renderMany(users: User[]){
        return users.map( user => this.render(user))
    }
    
}
