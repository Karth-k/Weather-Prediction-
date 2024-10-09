const express=require('express')
const app=express();
const dotenv=require("dotenv");
const moment=require('moment');
const axios=require('axios')
dotenv.config();
app.set('view engine','ejs');


app.use(express.static(__dirname+"public"));//the static files are in the root folder "public"
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.render('index',{weather:null,error:null});//by default the weather is null
})

app.post('/', (req, res) => {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.API_KEY}`;//the api calls the weather object for the input city

  axios
    .get(url)
    .then(response => {
      const weather = response.data;

      if (weather.main === undefined) {
        res.render('index', { weather: null, error: "Error in getting weather" });
      } else {
        console.log(weather)
        //we can return the entire weather object as a whole and extract the required values from it instrad of individual attributes
        //but as we have to convert the temperature and date, I'm taking each property as separate entities, feel free to change it 
        const shahar=city.toUpperCase();
        const temp = convert(weather.main.temp);
        const date = din() ;
        const time = timeNow();
        const pressure = weather.main.pressure;
        const humidity = weather.main.humidity;
        const wind = weather.wind.speed;
        const icons = weather.weather[0].icon;
        res.render('index', { weather: { temp, date, time, pressure, humidity, wind,icons,shahar }, error: null });
      }
    })
    .catch(error => {
      console.error(error);
      res.render('index', { weather: null, error: "Error in getting weather" });
    });
});


function convert(f){
    const ftemp=f;
    const ctemp=Math.round((ftemp-32)*5/9);
    const message=ctemp+'\xB0C';
    return message;

}

function din(){
    var date = moment();

var currentDate = date.format('D/MM/YYYY');
return currentDate;
}

function timeNow() {
    var value = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',seconds:'2-digit'});
    return value;
  }

app.listen(process.env.PORT,()=>{
    console.log(`App is running on ${process.env.PORT}`)
})