const functions = require('firebase-functions');
const express = require('express');
const requestPromise = require('request-promise-native');
const cors = require('cors');
const jschardet = require('jschardet');
const Iconv = require('iconv').Iconv;

// http://localhost:5000/react-firebase-83057/us-central1/helloWorld
// https://us-central1-react-firebase-83057.cloudfunctions.net/helloWorld

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const app = express();

// 全てのエンドポイントに対してCORSを許可するにはこれを有効にする
app.use(cors());

const getWeatherFromApi = async (lat,lon) =>{
  const requestUrl = `https://map.yahooapis.jp/weather/V1/place?coordinates=${lat},${lon}&output=json&appid=${functions.config().yahooservice.key}`;
  const result = await requestPromise(`${requestUrl}`);
  return result;
};



const getLocalInfoApi = async (keyword) => {

  const requestUrl = `https://map.yahooapis.jp/search/local/V1/localSearch?appid=${functions.config().yahooservice.key}&ac=40133&output=json&query=${encodeURIComponent(keyword)}&results=50$detail=full`;
  const result = await requestPromise(`${requestUrl}`);
  return result;
};

const getLocalInfoApiGeo = async (keyword,lat,lon,dist) => {

  const requestUrl = `https://map.yahooapis.jp/search/local/V1/localSearch?appid=${functions.config().yahooservice.key}&ac=40133&output=json&query=${encodeURIComponent(keyword)}&results=50$detail=full&lat=${lat}&lon=${lon}&dist=${dist}$sort=geo`;
  const result = await requestPromise(`${requestUrl}`);
  return result;
};

const getDataFromApi = async keyword =>{
  const requestUrl = 'https://www.googleapis.com/books/v1/volumes?country=JP&q=intitle';
  const result = await requestPromise(`${requestUrl}${keyword}`);
  return result;
};

app.get('/getlocalinfogeo/keyword/:keyword/lat/:lat/lon/:lon/dist/:dist',async (req,res) =>{
  const response = await getLocalInfoApiGeo(
    req.params.keyword,
    req.params.lat,
    req.params.lon,
    req.params.dist);
  //const response = await getLocalInfoApi();
  res.send(response);
});

app.get('/getweather/lat/:lat/lon/:lon',async (req,res) =>{
  const response = await getWeatherFromApi(req.params.lat,req.params.lon);
  res.send(response);
});

app.get('/hello',(req,res) =>{
  res.send('Hello Express!');
});

app.get('/user/:userId',(req,res) => {
  const users = [
    {id:1,name:'のび太'},
    {id:2,name:'スネ夫'},
    {id:3,name:'ジャイアン'},
    {id:4,name:'しずかちゃん'},
    {id:5,name:'ドラえもん'}
  ];
  //requestは文字列でくるので、型を合わせる必要がある
  const targetUser = users.find(user=>user.id === Number(req.params.userId));
  res.send(targetUser);
});

// このエンドポイントだけ許可する場合は、の関数の第２引数を設定する。
app.get('/gbook/:keyword',async(req,res)=> {
  const response = await getDataFromApi(req.params.keyword);
  res.send(response);
});

const api = functions.https.onRequest(app);
module.exports = {api};

