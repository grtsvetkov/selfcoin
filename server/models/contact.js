ContactModel = {
    add: function (username, name, desciption, avatar) {

        username = UserModel._normalizeUsername(username);

        let owner = Meteor.users.findOne({_id: Meteor.userId()}),
            contact = UserModel._getUserByUsername(username);

        if (!contact) {
            contact = UserModel.add(username);

            let twilioClient = require('twilio')(twilioConfig.sid, twilioConfig.token);

            twilioClient.messages.create({
                to: '+' + username,
                from: twilioConfig.from,
                body: owner.username + ' приглашает Вас в Coined Coin!'
            }, function (err, message) {
                if (err) {
                    console.log('Twilio send SMS error: ', err);
                } else {
                    console.log(message);
                }
            });
        }

        Contact.insert({
            owner_id: Meteor.userId(),
            contact_id: contact._id,
            name: name,
            description: description,
            avatar: avatar
        });
    },

    edit: function(contact_id, data) {
        Contact.update({owner_id: Meteor.userId(), contact_id: contact_id}, { $set: data });
    }
};

/**
 * Методы Contact
 */
Meteor.methods({
    'contact.add': ContactModel.add,
    'contact.edit': ContactModel.edit
});
