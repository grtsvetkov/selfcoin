let PhoneCodes = new Mongo.Collection('phoneCodes'),

    sendVerificationCode = function (phone) {

        let twilioClient = require('twilio')(twilioConfig.sid, twilioConfig.token),
            code = Math.round(1000 - 0.5 + Math.random() * (9999 - 1000 + 1)) + '';

        PhoneCodes.update({phone: phone}, {$set: {code: code}}, {upsert: true});

        console.log(phone, 'code ', code);

        twilioClient.messages.create({
            to: '+' + phone,
            from: twilioConfig.from,
            body: 'Ваш код подтверждения ' + code
        }, function (err, message) {
            if (err) {
                console.log('Twilio send SMS error: ', err);
            } else {

            }
        });
    };

Meteor.methods({
    'accounts-phone.sendVerificationCode': function (phone) {
        return sendVerificationCode(phone.replace(/\D+/g, ''));
    },

    'accounts-phone.changePhone': function (phone, code) {

        if (!Meteor.userId()) {
            return;
        }

        phone = phone.replace(/\D+/g, '');

        let test = Meteor.users.findOne({username: phone});

        if (test && test._id) {
            throw new Meteor.Error('3', 'Пользователь с таким телефоном уже зарегестрирован в системе');
            return false;
        }

        if (!code) {
            return sendVerificationCode(phone);
        } else {

            if (!PhoneCodes.findOne({phone: phone, code: code})) {
                throw new Meteor.Error('2', 'Код подтверждения введен неправильно');
            }

            PhoneCodes.remove({phone: phone});

            Meteor.users.update({_id: Meteor.userId()}, {$set: {username: phone}});
        }
    }
});

Accounts.registerLoginHandler('phone', function (data) {

    let phone = data.phone.replace(/\D+/g, ''),
        code = data.code.replace(/\D+/g, '');

    if (!PhoneCodes.findOne({phone: phone, code: code})) {
        throw new Meteor.Error('2', 'Код подтверждения введен неправильно');
    }

    PhoneCodes.remove({phone: phone});

    let user = Meteor.users.findOne({'username': phone});

    if (!user) {
        user = UserModel.add(phone);
    }

    return {userId: user._id};
});