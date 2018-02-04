import {StrainScraper} from "./StrainScraper";
export interface Collector {
    strainScraper:StrainScraper;

    collect(dumpPath?:string);
    dump(dumpPath?:string);
}