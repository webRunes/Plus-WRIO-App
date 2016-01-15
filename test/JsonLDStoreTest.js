import assert from 'assert';
import should from 'should';
import {setMock} from '../js/stores/CrossStorageFactory.js'
import JsonLDStore from '../js/stores/jsonld.js'

var mockval = {
    "plus":{
        "webrunes.com": {
            "name": "webRunes",
            "url": "webrunes.com",
            "order": 0
        },
        "wrioos.com": {
            "name": "WRIO OS",
            "url": "wrioos.com",
            "order": 1
        },
        "webrunes.com/blog.htm": {
            "name": "Blogs",
            "url": "webrunes.com/blog.htm",
            "author": "webrunes.com",
            "order": 2,
            "active": true
        },
    }
};

describe('jsonld store test', () => {
    before(() => {});

    it("Should create jsonld store", (done) => {
       var store = JsonLDStore;
       setMock(mockval);
       store.init();
       setTimeout(() => {
           console.log("DATA:",store.data);
           should(store.data).equal(mockval.plus);
           done();
       },1000);

    });
});

