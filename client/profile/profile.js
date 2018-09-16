Template.profile.helpers({
    'name': () => {

        let user = Meteor.user();

        return user && user.profile.name ? user.profile.name :'Имя не указано';
    }
});

Template.profile.events({
    'click #goTo_profileEdit': (e) => {
        e.preventDefault();
        mainView.router.navigate({
                url: '/profileEdit',
                route: {
                    path: '/profileEdit',
                    pageName: 'profileEdit'
                }
            }
        );
    },

    'click #logout': () => {
        Meteor.logout();
        Router.go('/signin');
    },

    'click .avatarBlock': (e) => {

        UploadFS.selectFiles(function (file) {
            let uploader = new UploadFS.Uploader({
                store: AvatarStore,
                adaptive: true,
                capacity: 0.8, // 80%
                chunkSize: 8 * 1024, // 8k
                maxChunkSize: 128 * 1024, // 128k
                maxTries: 5,
                data: file,
                file: {
                    name: file.name,
                    size: file.size,
                    type: file.type
                },
                onError(err, file) {
                    console.error(err);
                },
                onAbort(file) {
                    //appAlert(file.name + ' upload has been aborted');
                },
                onComplete(file) {
                    ///appAlert(file.name + ' has been uploaded');
                },
                onCreate(file) {
                    //appAlert(file.name + ' has been created with ID ' + file._id);
                    Meteor.call('user.setAvatar', file._id);
                },
                onProgress(file, progress) {
                    //appAlert(file.name + ' ' + (progress * 100) + '% uploaded');
                },
                onStart(file) {
                    //appAlert(file.name + ' started');
                },
                onStop(file) {
                    //appAlert(file.name + ' stopped');
                },
            });

            uploader.start();

            //uploader.stop();
            //uploader.abort();
        });
    },

    'click #editName': function () {
        Meteor.call('user.setName', $('#editNameInput').val(), (err) => {
            if(err) {
                console.log(err)
            } else {
                appAlert('Изменения успешно сохранены');
            }
        });
    }


});