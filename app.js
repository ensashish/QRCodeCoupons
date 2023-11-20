import express from 'express';
import qr from 'qrcode';
import bp from 'body-parser';
import homeRouter from './routes/home.js';
import dotenv from 'dotenv';
import dbConnection from './utils/dbConnect.js';

const app = express();
dotenv.config();
dbConnection();
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/scan", (req, res) => {

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
});

app.use('/home', homeRouter);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running at PORT : ${PORT}`)
});