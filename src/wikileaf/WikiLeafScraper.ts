import * as cheerio from 'cheerio';
import {ScrapingNetworkUtils} from "../ScrapingNetworkUtils";
import {StrainScraper} from "../StrainScraper";
import {TextUtils} from "../TextUtils";
export class WikiLeafScraper implements StrainScraper{

    private strainListUrl:string = "https://www.wikileaf.com/strains/";
    private strainUrl:string = "https://www.wikileaf.com/strain/";

    handleStrainList(url:string, html, observer){
        //noinspection TypeScriptValidateTypes
        let loadedHtml = cheerio.load(html);
        console.log("loaded html of url "+url);


        let strainNames = [];
        //noinspection TypeScriptValidateTypes
        let strainInfoNameClass = loadedHtml('.strain-info-name');
        let listSize = strainInfoNameClass.length;
        strainInfoNameClass.each((i,element)=> {

            //noinspection TypeScriptValidateTypes
            let data = loadedHtml(element);
            let name = data.text();
            //TODO: get other data
            //observer.next(name);
            strainNames.push(name);
        });
        observer.next(strainNames);

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
        let thcRegex = /THC Content\s+-\s+(.+)\s+Highest Test/g;
        let thcContent = TextUtils.getRegexGroups(html, thcRegex)[0];

        let typeRegex = /<a href=\"https:\/\/www.wikileaf.com\/strains\/(\w+)\/\">(\w+)<\/a>/g;
        let strainType = TextUtils.getRegexGroups(html, typeRegex)[0];

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
        let relax = loadedHtml('#use_relax');
        let relaxValue = relax.attr('value');

        //noinspection TypeScriptValidateTypes
        let sleep = loadedHtml('#use_sleep');
        let sleepValue = sleep.attr('value');

        //noinspection TypeScriptValidateTypes
        let euphoria = loadedHtml('#use_euphoria');
        let euphoriaValue = euphoria.attr('value');

        //noinspection TypeScriptValidateTypes
        let cottonMouth = loadedHtml('#use_cott_mouth');
        let cottonValue = cottonMouth.attr('value');

        //noinspection TypeScriptValidateTypes
        let paranoia = loadedHtml('#use_paranoia');
        let paranoiaValue = paranoia.attr('value');

        //noinspection TypeScriptValidateTypes
        let creativity = loadedHtml('#use_creativity');
        let creativityValue = creativity.attr('value');

        //noinspection TypeScriptValidateTypes
        let energy = loadedHtml('#use_energy');
        let energyValue = energy.attr('value');

        //noinspection TypeScriptValidateTypes
        let focus = loadedHtml('#use_focus');
        let focusValue = focus.attr('value');

        observer.next({
            "name": additionalData.name,
            "type": strainType,
            "thc": thcContent,
            "effects": {
                "relax":relaxValue,
                "sleep": sleepValue,
                "euphoria": euphoriaValue,
                "cotton-mouth":cottonValue,
                "paranoia": paranoiaValue,
                "creativity": creativityValue,
                "energy": energyValue,
                "focus": focusValue
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