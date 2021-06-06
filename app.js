const express=require('express');
const bodyparser=require('body-parser');
const https=require('https');
const { response } = require('express');
const { isFunction } = require('util');
require('dotenv').config();

const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set("view engine",'ejs')

let day=new Date();
let object={
    weekday: 'long',
    day: "numeric",
    month: "long"
}
var today=day.toLocaleDateString("en-US",object);
app.get("/",function(request,response)
{
    response.render('index',{city: null,
        temp: null,
        min:null,
        max:null,
        desc:null,
        iconUrl:null,
        error:null,
        count:-1,
        today
    });
})

app.post("/",function(req,res)
{
    var city=req.body.city;
    const url="https:api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+process.env.API_KEY+"&units=metric#";

    https.get(url,function(response)
    {
        var statusCode= response.statusCode;
        if(statusCode!=200){
            res.render('index',{city: null,
                temp: null,
                min:null,
                max:null,
                desc:null,
                iconUrl:null,
                error:"Sorry we couldn't find the weather of city you are looking for.",
                today,
                count:0
            });
        }
        else{
            response.on("data",function(data)
            {
                const weatherData=JSON.parse(data);
                const icon= weatherData.weather[0].icon;
                res.render('index',{city: weatherData.name,
                    temp:weatherData.main.temp,
                    min:weatherData.main.temp_min,
                    max:weatherData.main.temp_max,
                    desc:weatherData.weather[0].description,
                    iconUrl:"http://openweathermap.org/img/wn/"+icon+"@4x.png",
                    error:null,
                    today,
                    count:1
                });
            })   
        }
    })

})

app.listen(3000,function()
{
    console.log("server is running on port 3000");
})