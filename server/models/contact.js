ContactModel = {
    add: function (username, name, description, avatar) {
        return ContactModel._add(Meteor.userId(), username, name, description, avatar);
    },

    _add: function (user_id, username, name, description, avatar) {

        username = UserModel._normalizeUsername(username);

        let owner = Meteor.users.findOne({_id: user_id}),
            contact = UserModel._getUserByUsername(username);

        if (!contact) {
            contact = UserModel.add(username);

            //@TODO надо что-то придумать
            ContactModel._add(contact._id, owner.username, owner.username, '', '');

            let twilioClient = require('twilio')(twilioConfig.sid, twilioConfig.token);

            twilioClient.messages.create({
                to: '+' + username,
                from: twilioConfig.from,
                body: owner.username + ' приглашает Вас в Coined Coin!'
            }, function (err, message) {
                if (err) {
                    console.log('Twilio send SMS error: ', err);
                } else {
                    //console.log(message);
                }
            });
        }

        let flag = Contact.findOne({owner_id: user_id, contact_id: contact._id});

        if (!flag) {

            return Contact.insert({
                owner_id: user_id,
                contact_id: contact._id,
                name: name,
                description: description,
                avatar: avatar,
                phone: username
            });
        }
    },


    edit: function (contact_id, data) {
        Contact.update({owner_id: Meteor.userId(), contact_id: contact_id}, {$set: data});
    }
};

/**
 * Методы Contact
 */
Meteor.methods({
    'contact.add': ContactModel.add,
    'contact.edit': ContactModel.edit
});
