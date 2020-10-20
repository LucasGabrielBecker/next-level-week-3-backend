import {Router} from 'express';
import multer from 'multer';
import OrphanagesController from "./controllers/OrphanagesController";

import uploadConfig from "./config/upload"
import AuthController from './controllers/AuthController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images') ,OrphanagesController.create);

routes.post('/createUser', AuthController.createUser)
routes.get('/users', AuthController.listUsers)

export default routes;
