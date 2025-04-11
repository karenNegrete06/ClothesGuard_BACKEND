import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  user_id: {
    unique: true,
    required: true,
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    state: String,
    municipality: String,
  },
  profileImage: {
    type: String, 
    default: '',   
  },
}, {
  versionKey: false,
  timestamps: true,
});


export default model('User', userSchema);


