const express = require("express")
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require('dotenv').config();

const app = express()

app.use(morgan('dev'));

app.use(helmet())

app.use(cors({origin:process.env.CLIENT_URL}));

app.use(express.json())

app.use(express.urlencoded({extended: true}));

const itemRoutes = require('./routes/itemRoutes');

app.use('/api/items', itemRoutes);

app.get('/',(req,res)=>{
    res.status(200).json({message:'Api is running !!'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT ,()=>{
    console.log(`Server runnin in ${process.env.NODE_ENV} mode on port ${PORT}`)
})