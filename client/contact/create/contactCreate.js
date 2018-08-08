Template.contactCreate.events({
    'click #create': function() {

        let phone = $('#phone').val().replace(/\D+/g, '');

        if (phone.length != 11) {
            appAlert('Введите корректный номер телефона');
            return;
        }

        let data = getDataFromStruct({
            name: {val: $('#name').val(), field: 'Название'},
            phone: {val: phone, field: 'Телефон'}
        });

        if(data === false) {
            return;
        }

        Meteor.call('contact.add', data.phone, data.name, 'Описание контакта', '',  function(err, data){
            if(err) {
                appAlert(err.reason);
                console.log(err);
            } else {
                Router.go('contactList');
                appAlert('Контакт успешно добавлен');
            }
        });
    }
});
