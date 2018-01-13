import * as express from 'express';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as request from 'request';
let app = express();
app.get('/scrape', (req, res)=>{
    let url = 'https://www.wikileaf.com/strains/';
    request(url, (error, response, html)=>{
        if(!error){

            //noinspection TypeScriptValidateTypes
            let loadedHtml = cheerio.load(html);
            console.log("loaded html of url "+url);

            // We'll use the unique header class as a starting point.
            let strainNames = [];

            //noinspection TypeScriptValidateTypes
            loadedHtml('div', '.content-box list-item').each((i,element)=>{

                //noinspection TypeScriptValidateTypes
                let data = loadedHtml(element);
                let name = data.attr('data-st-name');
                //TODO: get other data

                strainNames.push(name);

            });
        }
    });
});

app.listen('8081');
