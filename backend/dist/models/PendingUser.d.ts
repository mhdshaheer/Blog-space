import mongoose, { Document } from 'mongoose';
export interface IPendingUser extends Document {
    username: string;
    email: string;
    password: string;
    otp: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IPendingUser, {}, {}, {}, mongoose.Document<unknown, {}, IPendingUser, {}, mongoose.DefaultSchemaOptions> & IPendingUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IPendingUser>;
export default _default;
//# sourceMappingURL=PendingUser.d.ts.map