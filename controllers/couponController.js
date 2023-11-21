import qr from 'qrcode';
import Coupon from "../models/couponcode.js";
import generateQR from "../utils/generateQr.js";
import AllCouponsCodes from '../utils/constants/OutputCouponCodes.json' assert {type:"json"};
import { exec } from 'child_process';

export const getQR = async (req, res)=>{
    const str = "https://commercetools.github.io/nodejs/cli/discount-code-generator.html";
    const QRCode = await generateQR(str);    
    console.log(QRCode)
    res.send(QRCode);
}

export const getOutputCouponJson = (req, res)=>{
    res.json({AllCouponsCodes})
}

export const generateCoupons = (req, res)=>{
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
}

export const saveCouponsInDB = async (req, res)=>{
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
}

export const allCouponsFromDB = async (req, res)=>{
    try {
        const allCouponsWithQR = await Coupon.find({}); 
        console.log("length::>> ",allCouponsWithQR.length);
        res.status(200).json({count : allCouponsWithQR.length, coupons : allCouponsWithQR});
    } catch (error) {
        res.json({error});
    }
}

export const generateQRFromText =  (req, res) => {

    let data = {
        name:"Employee Name",
        age:27,
        department:"Police",
        id:"aisuoiqu3234738jdhf100223"
    }
     
    // Converting the data into String format
    let stringdata = JSON.stringify(data)
     
    // Print the QR code to terminal
    qr.toString(stringdata,{type:'terminal'},
                        function (err, QRcode) {
     
        if(err) return console.log("error occurred")
     
        // Printing the generated code
        console.log(QRcode)
    })
    const url = req.body.url;

    // If the input is null return "Empty Data" error
    if (url.length === 0) res.send("Empty Data!");
    
    // Let us convert the input stored in the url and return it as a representation of the QR Code image contained in the Data URI(Uniform Resource Identifier)
    // It shall be returned as a png image format
    // In case of an error, it will save the error inside the "err" variable and display it
    
    qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");
      
        console.log("src::>> ",src);
        // Let us return the QR code image as our response and set it to be the source used in the webpage
        res.render("scan", { src });
    });
};

