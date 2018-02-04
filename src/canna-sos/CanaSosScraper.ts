import * as cheerio from 'cheerio';
import {ScrapingNetworkUtils} from "../ScrapingNetworkUtils";
import {StrainScraper} from "../StrainScraper";
import {TextUtils} from "../TextUtils";
export class CanaSosScraper implements StrainScraper {

    private  strainListUrl: string = "https://cannasos.com/strains/";
    private strainUrl: string = "https://cannasos.com/strains/$TYPE$/";

    public pagesPerStrainType = {
        "kosher": 1,
        "indica": 24,
        "hybrid": 65,
        "sativa": 16

    };

    public static extractStrainList(html:string, strainType:string, page:string, strainMap:any){
        let nameRegex = /href="\/strains\/\w+\/(\w+)">/g;

        let strainNames = TextUtils.getRegexGroups(html, nameRegex);
        console.log("extracted type "+strainType+" page "+page+" strains:"+strainNames.length);
        strainMap[strainType].push({page: page, strainNames: strainNames});
    }


    handleStrainList(url: string, html, observer, data) {
        let strainType = data["strainType"];
        let pages = data["pages"][strainType];
        let page = data["page"];

        //noinspection TypeScriptValidateTypes

        let nameRegex = /href="\/strains\/\w+\/(\w+)">/g;

        let strainNames = TextUtils.getRegexGroups(html, nameRegex);
        console.log("strain list: "+strainNames.length);
        observer.next(strainNames);

    }

    getStrainListUrl(strainType: string, page: number) {
        if (page>1){
            return this.strainListUrl + strainType + "?page="+page;
        }
        else {
            return this.strainListUrl + strainType;
        }

    }

    public static extractSpeficicStrain(html, strainType, strainName){
        console.log("scraping specific strain "+strainName+" of type "+strainType);
        let thcRegex = /<span ng-bind="THC.min |\| '—'">(\d+.\d+)<\/span>\//g;
        let cbdRegex = /<span ng-bind="CBD.min |\| '—'">(\d+.\d+)<\/span>\//g;
        let cbnRegex = /<span ng-bind="CBN.min |\| '—'">(\d+.\d+)<\/span>\//g;
        let thcContent = TextUtils.getRegexGroups(html, thcRegex)[0];
        let cbdContent = TextUtils.getRegexGroups(html, cbdRegex)[0];
        let cbnContent = TextUtils.getRegexGroups(html, cbnRegex)[0];

        let descriptionRegex = /ng-bind-html="model.htmlDescription">(.+?)<\/div>/g
        let strainDescription = TextUtils.getRegexGroups(html, descriptionRegex)[0];

        let typeOfHighRegex = /ng-bind-html="model.htmlTypeOfHigh">(.+?)<\/div>/g
        let typeOfHighDescription = TextUtils.getRegexGroups(html, typeOfHighRegex)[0];

        let originRegex = /ng-bind-html="model.htmlOrigin">(.+?)<\/div>/g
        let originDescription = TextUtils.getRegexGroups(html, originRegex)[0];

        let description = strainDescription +" \n" + typeOfHighDescription +" \n" + originDescription;

        let effectsRegex = /\/strains\/effects\/.+?">(.+?)<\/a>/g
        let effects = TextUtils.getRegexGroups(html, effectsRegex);

        let effectStrengthRegex = /style="right:\s+(\w+)%;"><\/div>/g
        let effectsStrength = TextUtils.getRegexGroups(html, effectStrengthRegex);

        let effectsData = {};


        for (let i=0; i<effects.length; i++){
            let effectName = effects[i];
            let effectStrength = 0;
            if (effectsStrength[2*i+1]){
                effectStrength = effectsStrength[2*i+1]; //take male only (2*i+1) should be female
            }
            effectsData[effectName] = effectStrength;

        }
        console.log("thc: "+thcContent+" description: "+description+" effects: "+JSON.stringify(effectsData));
        return {
            "name": strainName,
            "type": strainType,
            "thc": thcContent,
            "cbd": cbdContent,
            "cbn": cbnContent,
            "effects": effectsData,
            "description": description
        }
    }

    scrapeStrainsList(data) {
        let strainType = data.strainType;
        let page = data.page;

        return ScrapingNetworkUtils.horsemanRequest(
            this.getStrainListUrl(strainType, page),
            this.handleStrainList,
            {pages: this.pagesPerStrainType, strainType: strainType, page: page});
    }

    scrapeSpecificStrain(urlStrainName: string, strainType:string) {



    }
}