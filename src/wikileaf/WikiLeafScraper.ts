import * as cheerio from 'cheerio';
import {ScrapingNetworkUtils} from "../ScrapingNetworkUtils";
import {StrainScraper} from "../StrainScraper";
export class WikiLeafScraper implements StrainScraper{

    private strainListUrl:string = "https://www.wikileaf.com/strains/";
    private strainUrl:string = "https://www.wikileaf.com/strain/";

    handleStrainList(url:string, html, observer){
        //noinspection TypeScriptValidateTypes
        let loadedHtml = cheerio.load(html);
        console.log("loaded html of url "+url);

        //noinspection TypeScriptValidateTypes
        loadedHtml('.strain-info-name').each((i,element)=> {

            //noinspection TypeScriptValidateTypes
            let data = loadedHtml(element);
            let name = data.text();
            //TODO: get other data
            observer.next(name);
        });
    }

    handleSpecficStrain(url, html, observer, additionalData){
        //noinspection TypeScriptValidateTypes
        if (!html){
            observer.error("Could not load html "+url);
            return;
        }

        //noinspection TypeScriptValidateTypes
        let loadedHtml = cheerio.load(html);
        console.log("loaded html of url "+url);

        // We'll use the unique header class as a starting point.

        //noinspection TypeScriptValidateTypes
        let description = "";
        //noinspection TypeScriptValidateTypes
        loadedHtml('.strain-content').each((i,element)=>{

            //noinspection TypeScriptValidateTypes
            let data = loadedHtml(element);
            let descriptionParagraph = data.text();
            description = description+descriptionParagraph+"\n";

        });
        //noinspection TypeScriptValidateTypes
        let data = loadedHtml('#use_relax');
        let relaxValue = data.attr('value');

        //noinspection TypeScriptValidateTypes
        let data1 = loadedHtml('#use_sleep');
        let sleepValue = data1.attr('value');

        //noinspection TypeScriptValidateTypes
        let data2 = loadedHtml('#use_euphoria');
        let euphoriaValue = data2.attr('value');

        //noinspection TypeScriptValidateTypes
        let data3 = loadedHtml('#use_cott_mouth');
        let cottonValue = data3.attr('value');

        observer.next({
            "name": additionalData.name,
            "effects": {
                "relax":relaxValue,
                "sleep": sleepValue,
                "euphoria": euphoriaValue,
                "cotton-mouth":cottonValue
            },
            "description": description
        });
    }

    scrapeStrainsList(){
        return ScrapingNetworkUtils.request(this.strainListUrl, this.handleStrainList);
    }

    scrapeSpecificStrain(urlStrainName:string){
        let url = this.strainUrl+urlStrainName+"/";
        return ScrapingNetworkUtils.request(url, this.handleSpecficStrain, {name:urlStrainName});

    }
}