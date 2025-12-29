import mongoose, { Document } from 'mongoose';
export interface IBlog extends Document {
    _id: string;
    title: string;
    content: string;
    image: string;
    author: mongoose.Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog, {}, mongoose.DefaultSchemaOptions> & IBlog & Required<{
    _id: string;
}> & {
    __v: number;
}, any, IBlog>;
export default _default;
//# sourceMappingURL=Blog.d.ts.map