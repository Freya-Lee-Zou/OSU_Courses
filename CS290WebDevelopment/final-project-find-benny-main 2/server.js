var path = require('path')
var express = require('express');
var exphbs = require('express-handlebars')
var fs = require('fs')

var app = express();
var port = process.env.PORT || 3000;

function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }   
}

var scoreData = require('./scoreData.json')
scoreData.sort(sortByProperty('score'));
console.log(scoreData)
app.engine('handlebars', exphbs.engine({
    defaultLayout: "main"
}))

app.set('view engine', 'handlebars')


app.use(express.static('public'));

function callback()
{
    console.log("callback")
}
app.get('/', function(req, res, next) {
    if(req.query.name && req.query.s)
    {
        minutes = req.query.m
        seconds = req.query.s
        nickname = req.query.name
        if (minutes < 10) {
            minutes = "0" + minutes
        }
    
        if (seconds < 10) {
            seconds = "0" + seconds
        }
    
        scoreData.push({
            name: nickname,
            score: minutes + ":" + seconds
        })
    
        fs.readFile('scoreData.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            json = JSON.stringify(scoreData); //convert it back to json
            fs.writeFile('scoreData.json', json, 'utf8', callback); // write it back 
        }});
        res.redirect('/')
    }
    else
    {
        scoreData.sort(sortByProperty('score'));
        res.status(200).render('index', {
            scores: scoreData,
        })
    }   
})

app.get('/end', function(req, res) {
    res.status(200).render('end', {
        minutes: req.query.m,
        seconds: req.query.s
    })
})


app.get('*', function(req, res){
    res.status(404).render('404')
});

app.listen(port, function () {
	console.log("== Server is listening on port", port);
});
