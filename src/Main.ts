import {WikiLeaf} from "./WikiLeaf";
let wikiLeafScraper = new WikiLeaf();
let observable = wikiLeafScraper.scrapeStrainsList();
let index = 1;
observable.subscribe((name)=>{
    index++;
    setTimeout(()=>{

        let nameForUrl = name.toLowerCase().replace(" ", "-").replace(" ", "-").replace(".", "");
        console.log(nameForUrl);
        let promise:Promise<any> = wikiLeafScraper.scrapeSpecificStrain(nameForUrl);
        promise.then((data)=>{
            console.log("SLEEP "+data.effects.sleep);
        });
        promise.catch((error)=>{
            console.log(error);
        })

    }, 2000*index)


});




