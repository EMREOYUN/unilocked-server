import mongoose from "mongoose";

export function OID(id:string | number) {
    if (id === undefined) {
        return undefined
    }
    return new mongoose.Types.ObjectId(id)
}