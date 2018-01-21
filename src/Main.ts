import {Observable} from "rxjs";
import {WikiLeafScraper} from "./wikileaf/WikiLeafScraper";
import {WikiLeafCollector} from "./wikileaf/WikiLeafCollector";
let wikiLeafCollector = new WikiLeafCollector();
wikiLeafCollector.collect(true);





