import {Request, Response} from "express"
import {getRepository} from 'typeorm';
import Orphanages from "../models/Orphanage"
import orphanageView from "../views/orphanages_view"
import * as Yup from 'yup';
import * as fs from 'fs';
import * as AWS from 'aws-sdk';


const BUCKET_NAME = 'images-happy';
const IAM_USER_KEY = 'AKIAIVP3XOA7ZIJOVSNA';
const IAM_USER_SECRET = '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';


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
        
        console.log(images)
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
        
            let s3bucket = new AWS.S3({
              accessKeyId: IAM_USER_KEY,
              secretAccessKey: IAM_USER_SECRET,
              Bucket: BUCKET_NAME,
            });

            images.map(image=>{
                s3bucket.createBucket(function () {
                    var params = {
                      Bucket: BUCKET_NAME,
                      Key: image.name,
                      Body: image
                    };
                    s3bucket.upload(params, function (err, data) {
                      if (err) {
                        console.log('error in callback');
                        console.log(err);
                      }
                      console.log('success');
                      console.log(data);
                    });
                });
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
        
            return response.status(201).json(orphanage)

        } catch (error) {

            return response.status(400).json({message:"Error", errors: error.errors})
        }
    },

    async testCreate(request:Request, response:Response){
        const data = request.body;
        console.log(data)
        try {
            const createdOrphanage = await Orphanages.create({data})
            return response.json(data)
            
        } catch (error) {
            //console.error(error)
            return response.json({message: "you messed it up"})
        }
    }
}
