import {StrainScraper} from "../StrainScraper";
import {ScrapingNetworkUtils} from "../ScrapingNetworkUtils";
import * as cheerio from 'cheerio';
import * as phantom from 'phantom';
//noinspection TypeScriptCheckImport
import * as Horseman from 'node-horseman';
export class LeaflyScraper implements StrainScraper{

    private strainListUrl = "https://www.leafly.com/explore/sort-alpha";
    private strainBaseUrl = "https://www.leafly.com/";

    handleStrainList(url, html, observer){
        //noinspection TypeScriptValidateTypes
        let loadedHtml = cheerio.load(html);
        console.log("loaded html of url "+url);


        let strainNames = [];
        //noinspection TypeScriptValidateTypes
        let strainInfoNameClass = loadedHtml('img', '.strain-tile');
        strainInfoNameClass.each((i,element)=> {

            //noinspection TypeScriptValidateTypes
            let data = loadedHtml(element);
            let name = data.attr('alt');
            //TODO: get other data
            //observer.next(name);
            strainNames.push(name);
        });
        observer.next(strainNames);
        observer.complete();
    }

    scrapeStrainsList(){
        let horseman = new Horseman();
        horseman
            .viewport(3200,1800)
            .open(this.strainListUrl)
            .log("opened "+this.strainListUrl)
            .waitForSelector('button.terms-button')
            .screenshot('screenshot-1.png')
            .select('input[id=acceptedTermsOfUse]', true)
            .click('button.terms-button')
            .wait(5000)
            .screenshot('screenshot0.png')
            .click('button.ga_Explore_LoadMore')
            .screenshot('screenshot1.png')
            .count('img.strain-tile')
            .log()
            .wait(25000)
            .count('img.strain-tile')
            .log()
            .screenshot('screenshot2.png')
            .html()
            .then((html)=>{
                console.log(html)
                return horseman.close();
            });
    }

    scrapeSpecificStrain(urlStrainName:string){
        //let url = this.strainUrl+urlStrainName+"/";
        //return ScrapingNetworkUtils.request(url, this.handleSpecficStrain, {name:urlStrainName});

    }
}