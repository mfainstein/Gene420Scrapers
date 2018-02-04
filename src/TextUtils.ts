export class TextUtils{

    public static getRegexGroups(text:string, regex:RegExp){
        let matcher;
        let matches = [];
        while ((matcher = regex.exec(text)) !== null) {
            if (matcher.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            matcher.forEach((match, groupIndex) => {
                if (groupIndex>=1){
                    if (matches.indexOf(match)<0){
                        matches.push(match);
                    }
                }

            });
        }
        if (matches.length == 0){
            matches.push("");
        }
        return matches;
    }


}