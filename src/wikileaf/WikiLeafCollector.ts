import {Observable} from "rxjs";
import {WikiLeafScraper} from "./WikiLeafScraper";
import {Collector} from "../Collector";
import {TextFiles} from "../TextFiles";
export class WikiLeafCollector implements Collector{
    private REQUEST_GAP = 2000; //in miliseconds

    private strainData = {};
    private collectedStrains = {};
    strainScraper;

    constructor(){
        this.strainScraper = new WikiLeafScraper();
    }

    private getNameForUrl(strainName:string){
        return strainName.toLowerCase().replace(" ", "-").replace(" ", "-").replace(".", "");
    }

    collect(dumpPath:string){
        let observable = this.strainScraper.scrapeStrainsList();
        let index = 0;
        observable.subscribe((strainNames)=>{
            for (let strainName of strainNames){
                index++;
                this.collectedStrains[strainName] = false;
                this.collectStrain(strainName, index*this.REQUEST_GAP);
            }
            let dumpTimeEstimation = index*this.REQUEST_GAP+10000;
            this.scheduleDump(dumpTimeEstimation, dumpPath);
        });


    }

    collectStrain(strainName:string, delay:number){
        setTimeout(()=>{
            let nameForUrl =this.getNameForUrl(strainName);
            console.log(nameForUrl);
            let observable:Observable<any> = this.strainScraper.scrapeSpecificStrain(nameForUrl);
            observable.subscribe(
                (data)=>{this.strainData[strainName] = data}, (error)=>console.log(error));
        }, delay)
    }


    scheduleDump(delay:number, dumpPath:string){
        setTimeout(()=>{
            this.dump(dumpPath);
        }, delay)
    }

    dump(dumpPath:string){
        TextFiles.write(dumpPath, this.strainData, true);
    }



}
