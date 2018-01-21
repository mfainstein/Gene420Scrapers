import {Observable} from "rxjs";
import {WikiLeafScraper} from "./WikiLeafScraper";
import {Collector} from "../Collector";
import {TextFiles} from "../TextFiles";
export class WikiLeafCollector implements Collector{
    private GAP = 2000;

    private strainData = {};

    private getNameForUrl(strainName:string){
        return name.toLowerCase().replace(" ", "-").replace(" ", "-").replace(".", "");
    }

    collect(shouldDump:boolean){
        let wikiLeafScraper = new WikiLeafScraper();
        let observable = wikiLeafScraper.scrapeStrainsList();
        let index = 1;
        observable.subscribe((name)=>{
            index++;
            setTimeout(()=>{
                let nameForUrl =this.getNameForUrl(name);
                console.log(nameForUrl);
                let observable:Observable<any> = wikiLeafScraper.scrapeSpecificStrain(nameForUrl);
                observable.subscribe(
                    (data)=>{this.strainData[name] = data}, (error)=>console.log(error), ()=>{if (shouldDump){this.dump()}});
            }, this.GAP*index)
        });
    }

    dump(){
       TextFiles.write(__dirname+"output/wikileaf.js", this.strainData, true);
    }



}
