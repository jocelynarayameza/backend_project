import { Router } from 'express';
import {  sendMailEthereal } from '../controllers/mailController.js';

const router = Router();

router.post('/send', sendMailEthereal);
// router.post('/gmail', sendGmail);

export default router;