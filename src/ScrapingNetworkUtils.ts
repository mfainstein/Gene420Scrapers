import * as request from 'request';
import {Observer, Observable} from "rxjs";
import * as Rx from 'rxjs';
export class ScrapingNetworkUtils {

    public static request(url:string, handler:(url:string, html, observer:Observer<any>, data:any)=>any, data?:any):Observable<any>{
        let observable = Rx.Observable.create(observer=> {
            request(url, (error, response, html)=> {
                handler(url, html, observer, data);
            });
        });
        return observable;
    }


}
