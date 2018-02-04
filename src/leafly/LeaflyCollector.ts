import {Observable} from "rxjs";
import {Collector} from "../Collector";
import {TextFiles} from "../TextFiles";
import {LeaflyScraper} from "./LeaflyScraper";
export class LeaflyCollector implements Collector{
    private REQUEST_GAP = 2000; //in miliseconds

    private strainData = {};
    private collectedStrains = {};
    strainScraper;

    constructor(){
        this.strainScraper = new LeaflyScraper();
    }

    collect(dumpPath:string){
        let observable = this.strainScraper.scrapeStrainsList();
        let index = 0;
        /*observable.subscribe((strainNames)=>{
            let a = 1;
        });*/
    }

    dump(dumpPath:string){
        TextFiles.write(dumpPath, this.strainData, true);
    }



}
