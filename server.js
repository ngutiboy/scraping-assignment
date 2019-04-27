const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const port = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapedData", { useNewUrlParser: true });

app.get("/scrape", (req, res) => {
   axios.get("https://www.nationwideliquor.com/").then( (response) => {
       let $ = cheerio.load(response.data);
       $(".storylink").each( (i, element) => {
           let results = {};
           results.title = $(element).text();
           results.link = $(element).attr("href");

           db.Article.create(results)
           .then( (dbArticle) =>{
               console.log(dbArticle);
           })
           .catch( (err) => {
               console.log(err);
           });
       });
       res.json({
           status: "scrape complete"
       });
   });
});

app.get("/articles", (req, res) => {
       db.Article.find({})
   .then ( (dbArticle) => {
       res.json(dbArticle);
   })
   .catch( (err) => {
       res.json(err);
   });
});

app.get("/clearall", (req, res) => {
   db.Article.remove({}, (err, response) => {
       if (err) {
           res.json(err);
       }
       else {
           res.send(response);
       }
   });
});

app.listen(port, () => {
   console.log(`listening on port: ${port}`);
})