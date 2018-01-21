declare var require:any;
export class TextFiles{

    private static stringifyIfNeeded(content:any){
        let stringContent:string;
        if (typeof content == "string")
        {
            stringContent = content;
        }
        else {
            stringContent = JSON.stringify(content, null, 4);
        }


        return stringContent;
    }

    private static writeFileContent(path, content:string){
        let fs:any = require('fs');
        let mkdirp:any = require('mkdirp');
        //TODO: better with fs
        mkdirp.sync(path);
        fs.writeFileSync(path, content);
    }

    public static write(path, content:any, overwrite = true):boolean{
        let fs:any = require('fs');
        if (fs.existsSync(path)){
            if (!overwrite){
                return false;
            }
        }
        let stringContent:string = this.stringifyIfNeeded(content);
        this.writeFileContent(path, stringContent);
        return true;

    }

    public static read(path):string{
        let fs:any = require('fs');
        let text:string = fs.readFileSync(path, 'utf8');
        return text;
    }
}