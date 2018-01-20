import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as request from 'request';
import * as rx from 'rxjs';
export class WikiLeaf {
    private strainListUrl:string = "https://www.wikileaf.com/strains/";
    private strainUrl:string = "https://www.wikileaf.com/strain/";
    private strainNames:string[] = [];
    private dataByStrain = {};

    scrapeStrainsList(){
        let observable = rx.Observable.create(observer=>{
            request(this.strainListUrl, (error, response, html)=>{
                //noinspection TypeScriptValidateTypes
                let loadedHtml = cheerio.load(html);
                console.log("loaded html of url "+this.strainListUrl);

                // We'll use the unique header class as a starting point.

                //noinspection TypeScriptValidateTypes
                loadedHtml('.strain-info-name').each((i,element)=>{

                    //noinspection TypeScriptValidateTypes
                    let data = loadedHtml(element);
                    let name = data.text();
                    //TODO: get other data
                    this.strainNames.push(name);
                    observer.next(name);
                });

            });
        });
        return observable;

    }

    scrapeSpecificStrain(strainName:string){
        //TODO: combine urls utils
        let promise = new Promise((resolve, reject)=>{
            let url = this.strainUrl+strainName+"/";
            request(url, (error, response, html)=>{
                //noinspection TypeScriptValidateTypes
                if (!html){
                    reject("Could not load html "+url);
                    return;
                }

                let loadedHtml = cheerio.load(html);
                console.log("loaded html of url "+url);

                // We'll use the unique header class as a starting point.

                //noinspection TypeScriptValidateTypes
                let description = "";
                loadedHtml('.strain-content').each((i,element)=>{

                    //noinspection TypeScriptValidateTypes
                    let data = loadedHtml(element);
                    let descriptionParagraph = data.text();
                    description = description+descriptionParagraph+"\n";

                });
                let data = loadedHtml('#use_relax');
                let relaxValue = data.attr('value');

                let data1 = loadedHtml('#use_sleep');
                let sleepValue = data1.attr('value');

                let data2 = loadedHtml('#use_euphoria');
                let euphoriaValue = data2.attr('value');

                let data3 = loadedHtml('#use_cott_mouth');
                let cottonValue = data3.attr('value');
                resolve({
                    "name": strainName,
                    "effects": {
                        "relax":relaxValue,
                        "sleep": sleepValue,
                        "euphoria": euphoriaValue,
                        "cotton-mouth":cottonValue
                    },
                    "description": description
                })
            });

        });
        return promise;
    }
}