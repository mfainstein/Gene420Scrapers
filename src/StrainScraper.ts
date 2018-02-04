export interface StrainScraper {
    scrapeStrainsList(data?);
    scrapeSpecificStrain(urlStrainName:string, additionalData?:any);
}
