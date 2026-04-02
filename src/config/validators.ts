import mongoose from "mongoose";

export class Validators {

    static isValidId(id: string) {
        return mongoose.isValidObjectId(id);
    }

}