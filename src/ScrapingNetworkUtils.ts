import * as request from 'request';
import {Observer, Observable} from "rxjs";
import * as Rx from 'rxjs';
//noinspection TypeScriptCheckImport
import * as Horseman from 'node-horseman';
export class ScrapingNetworkUtils {

    public static request(url:string, handler:(url:string, html, observer:Observer<any>, data:any)=>any, data?:any):Observable<any>{
        let observable = Rx.Observable.create(observer=> {
            request(url, (error, response, html)=> {
                handler(url, html, observer, data);
            });
        });
        return observable;
    }

    public static horsemanRequest(url:string, handler:(url:string, html, observer:Observer<any>, data:any)=>any, data?:any):Observable<any>{
        let observable = Rx.Observable.create(observer=> {
            let horseman = new Horseman();
            horseman
                .viewport(3200,1800)
                .open(url)
                .log("opened "+url)
                .wait(25000)
                .screenshot("screenshot1.png")
                .html()
                .then((html)=>{
                    handler(url, html, observer, data);
                });
        });
        return observable;
    }

    public static click(el){
        var ev = document.createEvent('MouseEvent');
        ev.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        el.dispatchEvent(ev);
    }


}
