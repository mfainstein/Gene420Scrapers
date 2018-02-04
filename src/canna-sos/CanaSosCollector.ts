import {Observable} from "rxjs";
import {Collector} from "../Collector";
import {TextFiles} from "../TextFiles";
import {CanaSosScraper} from "./CanaSosScraper";
//noinspection TypeScriptCheckImport
import * as Nightmare from 'nightmare';
export class CanaSosCollector implements Collector{
    private REQUEST_GAP = 5000; //in miliseconds

    public pagesPerStrainType = {
        "kosher": 1,
        "indica": 24,
        "hybrid": 65,
        "sativa": 16

    };

    private strainData = {};
    private collectedStrains = {};
    strainScraper;
    private mainUrl = "https://cannasos.com/strains/$TYPE$";

    private strainMap = {
        "hybrid": [],
        "kosher": [],
        "sativa": [],
        "indica": []
    };

    private strains = [];

    constructor(){
        this.strainScraper = new CanaSosScraper();
    }

    private getNameForUrl(strainName:string){
        return strainName.toLowerCase().replace(" ", "-").replace(" ", "-").replace(".", "");
    }

    getStrainListUrl(mainUrl, strainType, page){
        if (page>1){
            return mainUrl.replace("$TYPE$", strainType)+"?page="+page;
        }
        else {
            return mainUrl.replace("$TYPE$", strainType);
        }

    }

    collectSpecificStarin(url, strainName, strainType){
        console.log("scraping "+strainName+" "+strainType);
        return new Promise(resolve=>{
            let nightmare = new Nightmare({show:false});
            nightmare
                .viewport(1900,700)
                .goto(url)
                .evaluate(()=>{
                    let html = document.querySelector('body').innerHTML;
                    return html;
                })
                .end()
                .then((html)=>{
                    let strain = CanaSosScraper.extractSpeficicStrain(html, strainType, strainName);
                    resolve(strain);
                })
        });
    }

    collectStrainList(mainUrl, strainType, page): Promise<any>{
        return new Promise(resolve=>{
            let url = this.getStrainListUrl(mainUrl, strainType, page);
            let nightmare = new Nightmare({show:false});
            nightmare
                .viewport(1900,700)
                .goto(url)
                .evaluate(()=>{
                    console.log("here");
                    let html = document.querySelector('body').innerHTML;
                    return html;
                })
                .end()
                .then((html)=>{
                    CanaSosScraper.extractStrainList(html, strainType, page, this.strainMap);
                    resolve(true);
                })
        });

    }

    async collect(dumpPath:string){
        for (let strainType in this.pagesPerStrainType){
            let pages = this.pagesPerStrainType[strainType];
            for (let i=0; i<pages; i++){
                console.log("collecting "+strainType+" "+i);
                await this.collectStrainList(this.mainUrl, strainType, i);
                console.log("collected "+strainType+" "+i);
            }
        }
        this.dump(dumpPath);
    }

    async collectStrains(path:string, dumpPath:string){
        let cannaSos = TextFiles.readJson(path);
        for (let strainType in cannaSos){
            for (let page of cannaSos[strainType]){
                for (let strainName of page["strainNames"]){
                    let url = this.mainUrl.replace("$TYPE$", strainType)+"/"+strainName;
                    let strain = await this.collectSpecificStarin(url, strainName, strainType);
                    this.strains.push(strain);
                }
            }

        }
        this.dump(dumpPath);
    }

    dump(dumpPath:string){
        TextFiles.write(dumpPath, this.strainMap, true);
    }



}
