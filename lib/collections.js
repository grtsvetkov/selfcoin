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