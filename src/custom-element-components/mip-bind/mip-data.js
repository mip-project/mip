
import BaseElement from '../base-element';
import Bind from './bind';

let uid = 0;

class MipData extends BaseElement {

    createdCallback() {
        this.uid = uid++;
        this.bind = new Bind(this.uid);

        let src = this.element.getAttribute('src');
        let ele = this.element.querySelector('script[type="application/json"]');

        if (src) {
            this.getData(src);
        }
        else if (ele) {
            let data = ele.textContent.toString();
            let result;
            try {
                result = JSON.parse(data);
            }
            catch (e) {}
            if (result) {
                window.m = window.m ? window.m : {};
                MIP.$set(result, 0);
                // this.postMessage(result);
            }
        }
    }

    getData(url) {
        if (!url) {
            return;
        }

        fetch(url, {
            credentials: 'include'
        }).then(res => {
            if (res.ok) {
                res.json().then(data => this.postMessage(data));
            }
            else {
                console.error('Fetch request failed!');
            }
        }).catch(console.error);
    }

    postMessage(data) {
        window.m = window.m ? window.m : {};
        let loc = window.location;
        let domain = loc.protocol + '//' + loc.host;
        window.postMessage({
            type: 'bind' + this.uid,
            m: data
        }, domain);
    }
}

export default MipData;
