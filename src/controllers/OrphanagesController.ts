import {Request, Response} from "express"
import {getRepository} from 'typeorm';
import Orphanage from "../models/Orphanage"
import orphanageView from "../views/orphanages_view"
import * as Yup from 'yup';
import * as fs from 'fs;
import * as AWS from 'aws-sdk;

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});




export default {
    async index(request:Request, response: Response){
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations : ['images']
        });

        return response.status(200).json(orphanageView.renderMany(orphanages))
    },

    async show(request:Request, response: Response){
        const { id } = request.param;
        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations : ['images']
        });

        return response.status(200).json(orphanageView.render(orphanage))
    },



    async create(request:Request, response: Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = request.body;
    
        const orphanagesRepository = await getRepository(Orphanage);

        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return {path : image.filename}
        })

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images
        };
        
        const params = {
         Bucket: 'images-happy', // pass your bucket name
         Key: 'contacts.csv', // file will be saved as testBucket/contacts.csv
         Body: JSON.stringify(data, null, 2)
         };
        
        images.map(image=>{
            params.key=image.filename
            s3.upload(params, function(s3Err, data){
                if(s3Err) throw s3Err
                console.log(`file: ${image.filename} uploaded succesfully`
            }
        })
         

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours : Yup.string().required(),
            open_on_weekends : Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({path: Yup.string().required()}))
        });

        try {
            
             const errors = await schema.validate(data, {
                abortEarly: false,
            })
    
            const orphanage = orphanagesRepository.create(data);
        
            await orphanagesRepository.save(orphanage);
        
            console.log('created succesfully')
            return response.status(201).json(orphanage)

        } catch (error) {

            return response.status(400).json({message:"Error", errors: error.errors})
        }
    } 
}
