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
routes.post('/login', AuthController.login)
routes.get('/users', AuthController.listUsers)

routes.post('/forgot_password', AuthController.forgot_password)
routes.post('/teste', upload.array('images') , AuthController.testingRoute)
routes.post('/testModel', OrphanagesController.testCreate)

export default routes;
