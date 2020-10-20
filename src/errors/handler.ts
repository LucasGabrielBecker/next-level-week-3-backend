import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';

interface ValidationErrors{
    [hey:string]: string[];
}


const errorHandler: ErrorRequestHandler = async (error, request, response, next) =>{
    if (error instanceof ValidationError){
        let errors:ValidationErrors = {};
        error.inner.forEach(err => {
            errors[err.path] = err.errors;
        })

        return response.status(400).json({message: 'Validation fails', errors})
    }else{

        console.error(error);
    
        return response.status(500).json({message : ' Internal server error'})
    }
}


export default errorHandler;