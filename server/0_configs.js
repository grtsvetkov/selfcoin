twilioConfig = {
    sid: 'AC304f20cee76d15e7184c954dac5b0905',
    token: '8f09f6220b144034062aa5add7c0f41b',
    from: '+19124000035'
};

Meteor.startup(function () {
    /*    BrowserPolicy.content.allowSameOriginForAll();
     BrowserPolicy.content.allowOriginForAll('http://meteor.local');
     BrowserPolicy.content.allowOriginForAll('https://meteor.local');
     BrowserPolicy.content.allowEval();
     BrowserPolicy.framing.disallow();*/

    // Listen to incoming HTTP requests, can only be used on the server
    WebApp.connectHandlers.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return next();
    });

    UploadFS.config.defaultStorePermissions = new UploadFS.StorePermissions({
        insert(userId, doc) {
            console.log('insert default ', userId);
            return userId;
        },
        update(userId, doc) {
            return userId === doc.userId;
        },
        remove(userId, doc) {
            return userId === doc.userId;
        }
    });

    //UploadFS.config.https = true;
    UploadFS.config.storesPath = 'uploads';
    UploadFS.config.tmpDir = '/tmp';
    UploadFS.config.tmpDirPermissions = '0700';
    //UploadFS.config.simulateWriteDelay = 1000 * 20; // 2 sec
});