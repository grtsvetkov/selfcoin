/*
 COIN:
 user_id
 name
 description
 condition: [{name, price, description}]
 spend: [{name, price, description}]
 public  (true|false)
 count
 owner
 logo: {}
 */
Coin = new Mongo.Collection('coin');


/*
 GOAL:
 user_id
 coin_id
 name
 price
 */
Goal = new Mongo.Collection('goal');

/*
 coin_id
 user_id
 price
 name
 */
RequestEnroll = new Mongo.Collection('request_enroll');

/*
 WALLET:
 user_id
 coin_id
 count
 */
Wallet = new Mongo.Collection('wallet');

/*
 WALLETLOG
 user_id
 dt
 coin_id
 count
 data
 */
WalletLog = new Mongo.Collection('wallet_log');

/*
 CONTACT
 owner_id
 contact_id
 name
 desciption
 avatar
 */
Contact = new Mongo.Collection('contact');


/*
 from_user
 name
 to_user
 coin_id
 */
RequestForParty = new Mongo.Collection('request_for_party');


/*
 user_id
 dt
 type
 data
 */
Notice = new Mongo.Collection('notice');

Avatar = new Mongo.Collection('avatar');
Avatar128 = new Mongo.Collection('avatar128');

import {LocalStore} from "meteor/jalik:ufs-local";
import {UploadFS} from "meteor/jalik:ufs";

if (Meteor.isServer) {
    var Future = require('fibers/future');
    var gm = require('gm');
}

AvatarStore128 = new LocalStore({
    collection: Avatar128,
    name: 'avatar-128',
    path: 'uploads/avatar-128x128',
    transformRead(from, to, fileId, file, request) {
        from.pipe(to); // this returns the raw data
    },
    // Transform file when writing
    transformWrite(from, to, fileId, file) {
        let gm = Npm.require('gm');
        if (gm) {
            gm(from)
                .autoOrient()
                .gravity('Center')
                .resize(256, 256 + '^')
                .crop(256, 256)
                .stream()
                .pipe(to);
        } else {
            console.error("gm is not available", file);
        }
    },

    permissions: new UploadFS.StorePermissions({
        insert(userId, doc) {
            return userId;
        },
        update(userId, doc) {
            return userId === doc.userId;
        },
        remove(userId, doc) {
            return userId === doc.userId;
        }
    })

});

AvatarStore = new LocalStore({
    collection: Avatar,
    name: 'avatar',
    path: 'uploads/avatar',
    filter: new UploadFS.Filter({
        minSize: 1,
        maxSize: 1024 * 20000, // 20MB,
        contentTypes: ['image/*'],
        extensions: ['jpeg', 'jpg', 'png']
    }),

    transformRead(from, to, fileId, file, request) {
        from.pipe(to); // this returns the raw data
    },

    onValidate: function (file) {
        const tempFilePath = UploadFS.getTempFilePath(file._id);
        let future = new Future();
        const identify = function (err, data) {
            if (err) {
                future.throw(new Meteor.Error('not-an-image', 'The file is not an image'));
            } else {
                future.return();
            }
        };
        gm(tempFilePath).identify(identify);
        return future.wait();
    },
    copyTo: [AvatarStore128],

    permissions: new UploadFS.StorePermissions({
        insert(userId, doc) {
            return userId;
        },
        update(userId, doc) {
            return userId === doc.userId;
        },
        remove(userId, doc) {
            return userId === doc.userId;
        }
    }),

    onRead(fileId, file, request, response) {

        // Allow file access if not private or if token is correct
        if (file.isPublic || request.query.token === file.token) {
            return true;
        } else {
            response.writeHead(403);
            return false;
        }
    },

    onFinishUpload(file) {
        console.log(file.name + ' has been uploaded');
    },
    // Called when a copy error happened
    onCopyError(err, fileId, file) {
        console.error('Cannot create copy ' + file.name);
    },
    // Called when a read error happened
    onReadError(err, fileId, file) {
        console.error('Cannot read ' + file.name);
    },
    // Called when a write error happened
    onWriteError(err, fileId, file) {
        console.error('Cannot write ' + file.name);
    }
});


Logo = new Mongo.Collection('logo');
Logo128 = new Mongo.Collection('logo128');

LogoStore128 = new LocalStore({
    collection: Logo128,
    name: 'logo-128',
    path: 'uploads/logo-128x128',
    transformRead(from, to, fileId, file, request) {
        from.pipe(to); // this returns the raw data
    },
    // Transform file when writing
    transformWrite(from, to, fileId, file) {
        let gm = Npm.require('gm');
        if (gm) {
            /*gm(from)
                .resize(128, 128)
                .gravity('Center')
                .extent(128, 128)
                .quality(75)
                .stream().pipe(to);*/

            gm(from)
                .autoOrient()
                .gravity('Center')
                .resize(256, 256 + '^')
                .crop(256, 256)
                .stream()
                .pipe(to);


        } else {
            console.error("gm is not available", file);
        }
    },

    permissions: new UploadFS.StorePermissions({
        insert(userId, doc) {
            return userId;
        },
        update(userId, doc) {
            return userId === doc.userId;
        },
        remove(userId, doc) {
            return userId === doc.userId;
        }
    })

});

LogoStore = new LocalStore({
    collection: Logo,
    name: 'logo',
    path: 'uploads/logo',
    filter: new UploadFS.Filter({
        minSize: 1,
        maxSize: 1024 * 20000, // 20MB,
        contentTypes: ['image/*'],
        extensions: ['jpeg', 'jpg', 'png']
    }),

    transformRead(from, to, fileId, file, request) {
        from.pipe(to); // this returns the raw data
    },

    onValidate: function (file) {
        const tempFilePath = UploadFS.getTempFilePath(file._id);
        let future = new Future();
        const identify = function (err, data) {
            if (err) {
                future.throw(new Meteor.Error('not-an-image', 'The file is not an image'));
            } else {
                future.return();
            }
        };
        gm(tempFilePath).identify(identify);
        return future.wait();
    },
    copyTo: [LogoStore128],

    permissions: new UploadFS.StorePermissions({
        insert(userId, doc) {
            return userId;
        },
        update(userId, doc) {
            return userId === doc.userId;
        },
        remove(userId, doc) {
            return userId === doc.userId;
        }
    }),

    onRead(fileId, file, request, response) {

        // Allow file access if not private or if token is correct
        if (file.isPublic || request.query.token === file.token) {
            return true;
        } else {
            response.writeHead(403);
            return false;
        }
    },

    onFinishUpload(file) {
        console.log(file.name + ' has been uploaded');
    },
    // Called when a copy error happened
    onCopyError(err, fileId, file) {
        console.error('Cannot create copy ' + file.name);
    },
    // Called when a read error happened
    onReadError(err, fileId, file) {
        console.error('Cannot read ' + file.name);
    },
    // Called when a write error happened
    onWriteError(err, fileId, file) {
        console.error('Cannot write ' + file.name);
    }
});

