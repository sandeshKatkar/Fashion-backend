import express from 'express'
import { adminLogin, userLogin, userRegister } from '../controllers/user.controller.js';

const userRouter=express.Router();

userRouter.post('/register',userRegister);
userRouter.post('/login',userLogin)
userRouter.post('/admin',adminLogin);

export default userRouter