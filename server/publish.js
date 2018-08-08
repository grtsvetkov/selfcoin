Meteor.startup(function () {
    Meteor.publish('coin', function (mode) {
        if (this.userId) {
            switch (mode) {
                default:
                    return Coin.find({$or: [{owner: this.userId}, {request: this.userId}]});
            }
        }

        return [];
    });


    Meteor.publish('wallet', function (mode, coin_id) {
        if (this.userId) {
            switch (mode) {
                case 'byMyCoin':

                    let owner = Coin.findOne({_id: coin_id, user_id: this.userId});

                    if (!owner) { //Нет такой монеты
                        return [];
                    }

                    return Wallet.find({coin_id: coin_id});
                    break;

                default:
                    return Wallet.find({user_id: this.userId});
            }
        }

        return [];
    });

    Meteor.publish('request_enroll', function (mode, coin_id) {
        if (this.userId) {
            switch (mode) {
                default:

                    let coin = Coin.findOne({_id: coin_id, user_id: this.userId});

                    if (coin) {
                        return RequestEnroll.find({coin_id: coin_id});
                    }
            }
        }

        return [];
    });


    Meteor.publish('contact', function (mode) {
        if (this.userId) {
            switch (mode) {
                default:
                    return Contact.find({owner_id: this.userId});
            }
        }

        return [];
    });

    Meteor.publish('requestForParty', function (mode) {
        if (this.userId) {
            switch (mode) {
                default:
                    return RequestForParty.find({to_user: this.userId});
            }
        }

        return [];
    });

});