import {Typegoose, prop, arrayProp} from "typegoose"

class Orphanage extends Typegoose{
    @prop({required:true})
    name!:string;
    
    @prop({required:true})
    latitude!: number;

    @prop({required:true})
    longitude!: number;
    
    @prop({required:true})
    about!: string;

    @prop({required:true})
    instructions!: string;

    @prop({required:true})
    opening_hours:! string;


    @prop({required:true})
    open_on_weekends!: string;

    @arrayProp({required:true, items:String})
    imagesPath!:string;
    
    
}

const Orphanages = new Orphanage().getModelForClass(Orphanage);

export default Orphanages;