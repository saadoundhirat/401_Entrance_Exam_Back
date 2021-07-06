const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const axios = require('axios')
const mongoose = require('mongoose')

// use dependencies
const app = express();
dotenv.config();
const PORT= process.env.PORT || 4000;


// middlewares
app.use(cors());
app.use(express.json());

//🐾🐾🐾 Database
const drinkSchema = new mongoose.Schema({
    strDrink: String,
    strDrinkThumb: String,
    idDrink: String,
  });
  const drinksModel = mongoose.model('drink', drinkSchema);
//🐾🐾🐾 APPLICATION ROUTERS 

app.get('/getAllDrinks' , (req, res) => {
    let Url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic'
    axios.get(Url)
    .then(result =>{
        // console.log(result.data.drinks)
        res.status(200).send(result.data.drinks)
    }).catch(err =>{
        console.log("bad response" , err)
    })
})

app.post('/addToFav' , (req ,res)=>{
    let {idDrink ,strDrinkThumb ,strDrink }=req.body;
    const newObj= new drinksModel({
        strDrink: strDrink,
        strDrinkThumb: strDrinkThumb,
        idDrink: idDrink,
    })
    newObj.save();
    res.status(200).send("item add to db")
})


app.get('/getAllFavDrinks' , (req, res) => {
    
    drinksModel.find({} ,(err ,favData)=>{
        if(err){
            console.log("cant get items" ,err)
        }else{
            res.status(200).send(favData)
        }
    })
})


app.delete('/DeleteFromDB/:id' , (req, res) => {
    const {id}=req.params;
    drinksModel.findOneAndDelete({_id:id} ,(err ,favData)=>{
        if(err){
            console.log("cant get items" ,err)
        }else{
            drinksModel.find({} ,(err ,favData)=>{
                    res.status(200).send(favData)
            })
        }
    })
})


app.put('/updateDrink' , (req, res) => {
    const {id ,strDrink,strDrinkThumb}=req.body
    drinksModel.findOne({_id:id} ,(err ,favData)=>{
        if(err){
            console.log("cant get items" ,err)
        }else{
            favData.strDrink=strDrink;
            favData.strDrinkThumb=strDrinkThumb;

            favData.save()
            .then(()=>{
                drinksModel.find({} ,(err ,favData)=>{
                    res.status(200).send(favData)
                })
            })
        }
    })
})


//🐾🐾🐾 ROUTERS
app.get('/' , (req ,res) => {
    res.status(200).send('WELCOME TO THE HOME ROUTER')
})
app.all('*' , (req ,res) => {
    res.status(200).send('THIS ROUTER NOT HANDELD YET TRY ANOTHER')
})



//🐾🐾🐾 connictions
mongoose.connect('mongodb://localhost:27017/drink', {useNewUrlParser: true, useUnifiedTopology: true});

// mongoose.connect(`${process.env.MONGODB}`, {useNewUrlParser: true, useUnifiedTopology: true});


app.listen(PORT , ()=>{
    console.log(`server up and run on post: http://localhost:8000`)
})