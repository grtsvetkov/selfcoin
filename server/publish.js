Meteor.startup(function () {
    Meteor.publish('coin', function (mode) {
        if (this.userId) {
            switch (mode) {
                default:
                    return Coin.find({user_id: this.userId});
            }
        }

        return [];
    });
});

Meteor.startup(function () {
    Meteor.publish('wallet', function (mode) {
        if (this.userId) {
            switch (mode) {
                default:
                    return Wallet.find({user_id: this.userId});
            }
        }

        return [];
    });
});

Meteor.startup(function () {
    Meteor.publish('contact', function (mode) {
        if (this.userId) {
            switch (mode) {
                default:
                    return Contact.find({owner_id: this.userId});
            }
        }

        return [];
    });
});