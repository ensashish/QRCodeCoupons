import express from 'express';
import generateQR from '../utils/generateQr.js';
import AllCouponsCodes from '../path-to-write-data/output.json' assert { type: "json" };
import Coupon from '../models/couponcode.js';
import { exec } from 'child_process';

const router = express.Router();

router.get('/getqr', async (req, res)=>{
    const str = "https://commercetools.github.io/nodejs/cli/discount-code-generator.html";
    const QRCode = await generateQR(str);    
    console.log(QRCode)
    res.send(QRCode);
});

router.get('/getCouponCodes', (req, res)=>{
    res.json({AllCouponsCodes})
});

router.get('/generate-codes', (req, res)=>{
    const command = 'npm run generate-codes';
    exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`Output: ${stdout}`);
      });

      res.status(200).json({coupons : AllCouponsCodes})
});

router.get('/save', async (req, res)=>{
    try {
        const codes = AllCouponsCodes.map( async(coupon, index)=>{
             console.log(index," ::>> ", coupon);
            const newCoupon = await Coupon.create(coupon);
            const QRCode = await generateQR(newCoupon.code);
            newCoupon.qrcode = QRCode;
            const savedCoupon = await newCoupon.save();
            return savedCoupon;
        });
        const allCodes = await Promise.all(codes);
    
        res.status(200).json({message:"Saved",
                    data : allCodes});
    } catch (error) {
        res.json({error});
    }
});

export default router;
// discount-code-gen -i /path-to-code-data/input.json -o /path-to-write-data/output.json -q 3 -l 9 -p FOO