import {Observable} from "rxjs";
import {WikiLeafScraper} from "./wikileaf/WikiLeafScraper";
import {WikiLeafCollector} from "./wikileaf/WikiLeafCollector";
import {LeaflyCollector} from "./leafly/LeaflyCollector";
import {CanaSosCollector} from "./canna-sos/CanaSosCollector";
let cannaSosCollector = new CanaSosCollector();
//cannaSosCollector.collect("/Users/markfainstein/Gene420/Gene420Scrapers/output/canaSos1.json");
cannaSosCollector.collectStrains(
    "/Users/markfainstein/Gene420/Gene420Scrapers/output/cannaSosList.json",
    "/Users/markfainstein/Gene420/Gene420Scrapers/output/cannaSos.json"
);





