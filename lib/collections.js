/*
 COIN:
 user_id
 name
 description
 condition: [{name, price, description}]
 spend: [{name, price, description}]
 public  (true|false)
 count
 */
Coin = new Mongo.Collection('coin');


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