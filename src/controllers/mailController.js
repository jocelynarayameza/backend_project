import  { transporter, mailOptionsEthereal,  } from '../services/mailService.js';
import 'dotenv/config'

export const sendMailEthereal = async(req, res)=>{
    try {
        const response = await transporter.sendMail(mailOptionsEthereal);
        res.json(response)
    } catch (error) {
        console.log(error);
    }
};

