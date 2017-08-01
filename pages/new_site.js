var new_site = {

     newSiteObject: {},
     newCreatorObject: {},
     cognitoUser: {},

     //*****************************************************************************************************************
     newSiteInfoSubmit: function() {


         //make sure they entered a club name
         if ($('#newPhotoclubName').val().length === 0 ){
             var options = {};
             options.title = 'Missing Information!';
             options.message = "Please enter the name of your Photo Club";
             options.callback = function () {
                 $('#newPhotoclubName').focus();
             };
             modalMessage.showMessage(options);
             return;
         }

         //remove any spaces from the Nickname input
         $('#newSiteNickname').val($('#newSiteNickname').val().replace(/\s+/g, ''));

         //and convert it to lowercase
         $('#newSiteNickname').val($('#newSiteNickname').val().toLowerCase());

         //make sure they entered a site nickname
         if ($('#newSiteNickname').val().length === 0 ){
             var options = {};
             options.title = 'Missing Information!';
             options.message = "Please enter a Nickname for your Club's website";
             options.callback = function () {
                 $('#newSiteNickname').focus();
             };
             modalMessage.showMessage(options);
             return;
         }

         new_site.newSiteObject.newPhotoclubName = $('#newPhotoclubName').val();
         new_site.newSiteObject.newSiteNickname = $('#newSiteNickname').val();


         $('#newSiteSubmitBTNtext').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Checking Availability');

         setTimeout(function () {
             $('#newSiteSubmitBTNtext').html('Create Site');
         }, 2000);

         //make sure the site Nickname (siteID) hasn't already been taken
         awsDynamoDBConnector.fetchSite(new_site.newSiteObject.newSiteNickname, new_site.siteReturned);
    },

    //*****************************************************************************************************************
    siteReturned: function (success, site) {
        //if success is false, we'll get error information back in the site parameter
        if (!success){
            //there was an error communicating with AWS
            var options = {};
            options.title = 'Communication Error';
            options.message = "We're sorry, but there was a fatal error communicating with The Cloud<br>Error Code: ns_sr_001<br>" + site;
            options.size = 'large';
            options.callback = function () {
                window.open('http://myphotoclub.org','_self');
            };
            modalMessage.showMessage(options);

            return;
        }

        //successful call to AWS

        if(!site){
            //there is no site that matches that siteID
            //so, we're good to go

            //load up the html to create a "creator" account


            var newSiteHTML = '' +
                '<span class="text-primary-darkend font-weight-bold">Photo Club Name:</span><span class="text-primary"> ' + new_site.newSiteObject.newPhotoclubName + '</span><br>' +
                '<span class="text-primary-darkend font-weight-bold">Website URL:</span><span class="text-primary"> myphotoclub.org?' + new_site.newSiteObject.newSiteNickname + '</span>';

            $('#content').hide().load("pages/new_site_account.html", function() {

                $('#newSiteInformation').html(newSiteHTML);

            }).fadeIn('1000');

        }
        else {
            //that siteID already exists, so tell the user they need to pick another one

            var options = {};
            options.title = new_site.newSiteObject.newSiteNickname + ' Already Taken';
            options.message = "We're sorry, but "+ new_site.newSiteObject.newSiteNickname +" has already been registered.<br>Please pick a different Site Nickname" ;
            options.callback = function () {
                $('#newSiteNickname').focus();
            };
            modalMessage.showMessage(options);
        }
    },

    //*****************************************************************************************************************
    reloadNewSiteName: function () {
        //load up the html to create a new site

        $('#content').hide().load("pages/new_site_name.html", function() {

            // populate the last info the user entered
            $('#newPhotoclubName').val(new_site.newSiteObject.newPhotoclubName);
            $('#newSiteNickname').val(new_site.newSiteObject.newSiteNickname);

        }).fadeIn('1000');



    },

    //*****************************************************************************************************************
    signUpCreator: function () {

        //remove any spaces from the Username input
        $('#signup-username').val($('#signup-username').val().replace(/\s+/g, ''));

        //and convert it to lowercase
        $('#signup-username').val($('#signup-username').val().toLowerCase());

        //make sure they entered a Username
        if ($('#signup-username').val().length === 0 ){
            var options = {};
            options.title = 'Missing Information!';
            options.message = "Please enter a Username";
            options.callback = function () {
                $('#signup-username').focus();
            };
            modalMessage.showMessage(options);
            return;
        }

        //make sure they entered a valid email address
        if (!utils.validateEmail($('#signup-email').val())){
            options = {};
            options.title = 'Invalid Email Address!';
            options.message = "Please enter a valid Email Address";
            options.callback = function () {
                $('#signup-email').focus();
            };
            modalMessage.showMessage(options);
            return;
        }

        //make sure the email addresses match
        if($('#signup-email').val() != $('#signup-email-confirm').val()){
            options = {};
            options.title = "Email Addresses Don't Match!";
            options.message = "Please make sure your email address is entered correctly twice";
            options.callback = function () {
                $('#signup-email-confirm').focus();
            };
            modalMessage.showMessage(options);
            return;
        }

        //make sure they entered a Password
        if ($('#signup-password').val().length < 8 ){
            var options = {};
            options.title = 'Invalid Password!';
            options.message = "Please make sure your password is at least 8 characters";
            options.callback = function () {
                $('#signup-password').focus();
            };
            modalMessage.showMessage(options);
            return;
        }

        //make sure the passwords match
        if($('#signup-password').val() != $('#signup-password-confirm').val()){
            options = {};
            options.title = "Passwords Don't Match!";
            options.message = "Please make sure your password is entered correctly twice";
            options.callback = function () {
                $('#signup-password-confirm').focus();
            };
            modalMessage.showMessage(options);
            return;
        }

        //ok, everything seems to have been entered ok

        $('#creatorAccountCreateBTNtext').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Creating Account');
        setTimeout(function () {
            $('#creatorAccountCreateBTNtext').html('Create Account');
        }, 2000);

        new_site.newCreatorObject.email = $('#signup-email').val();
        new_site.newCreatorObject.username = $('#signup-username').val();
        new_site.newCreatorObject.password = $('#signup-password').val();

        awsCognitoConnector.registerNewUser(new_site.newCreatorObject.email, 'creator', new_site.newCreatorObject.username, new_site.newCreatorObject.password, new_site.newSiteObject.newSiteNickname, new_site.newSiteObject.newPhotoclubName, new_site.registerNewUserReturned);

    },

    //*****************************************************************************************************************
    registerNewUserReturned: function (success, data) {

        if (!success){
            //there was some kind of error
            if (data === 'User already exists'){
                var options = {};
                options.title = "Username Already Taken!";
                options.message = "Sorry, that Username has already been registered by someone else<br>Please pick a different Username";
                options.size = 'large';
                options.callback = function () {
                    $('#signup-username').focus();
                };
                modalMessage.showMessage(options);
                return;
            }
            else {
                options = {};
                options.title = "Oops, there was a problem!";
                options.message = data;
                options.callback = function () {

                };
                modalMessage.showMessage(options);
                return;
            }
        }

        //user created successfully
        //save the cognitio user locally so we can use it if needed
        new_site.cognitoUser = data;

        var newSiteHTML = '' +
            '<span class="text-primary-darkend font-weight-bold">Photo Club Name:</span><span class="text-primary"> ' + new_site.newSiteObject.newPhotoclubName + '</span><br>' +
            '<span class="text-primary-darkend font-weight-bold">Website URL:</span><span class="text-primary"> myphotoclub.org?' + new_site.newSiteObject.newSiteNickname + '</span>';

        var newCreatorHTML = '' +
            '<span class="text-primary-darkend font-weight-bold">Username:</span><span class="text-primary"> ' + new_site.newCreatorObject.username + '</span><br>' +
            '<span class="text-primary-darkend font-weight-bold">Email:</span><span class="text-primary"> ' + new_site.newCreatorObject.email + '</span>';

        $('#content').hide().load("pages/new_site_account_verification.html", function() {


            $('#newSiteInformation').html(newSiteHTML);
            $('#newAccountInformation').html(newCreatorHTML);

        }).fadeIn('1000');

    },
    
    //*****************************************************************************************************************
    resendVerificationCode: function () {
        awsCognitoConnector.resendVerificationCode(new_site.cognitoUser, new_site.verficationCodeSent);
    },

    //*****************************************************************************************************************
    verficationCodeSent: function (success, data) {

        if (success){
            var options = {};
            options.title = "Code Sent";
            options.message = "We've sent a new Verification Code to you<br>Please use this new code to verify your account";
            options.callback = function () {

            };
            modalMessage.showMessage(options);
            return;
        }

        options = {};
        options.title = "Something Went Terribly Wrong!<br>Please try again.";
        options.message = data.message;
        options.callback = function () {

        };
        modalMessage.showMessage(options);

    },

    //*****************************************************************************************************************
    verifyCreator: function () {

         //make sure they entered a verification code
        if ($('#signup-account-verification-code').val().length === 0){
            var options = {};
            options.title = "Missing Verification Code";
            options.message = "Please enter a Verification Code before clicking Verify Account";
            options.callback = function () {
                $('#signup-account-verification-code').focus();
            };
            modalMessage.showMessage(options);
            return;
        }

        $('#creatorAccountVerifyBTNtext').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Verifying Account');
        setTimeout(function () {
            $('#creatorAccountVerifyBTNtext').html('Verify Account');
        }, 2000);

        //ok, we have a verfication code so...
        awsCognitoConnector.verifyNewUser(new_site.newCreatorObject.username, $('#signup-account-verification-code').val(),new_site.verifyNewUserReturned);

    },

    //*****************************************************************************************************************
    verifyNewUserReturned: function (success, data) {

         if (!success){

             var options = {};
             options.title = "Verification Code Error";
             //TODO various erros could be returned, so we could provide finer grain messaging as to what went wrong
             options.message = 'That Verification Code is incorrect.<br>Please try again';
             options.callback = function () {
                 $('#signup-account-verification-code').focus();
             };
             modalMessage.showMessage(options);
             return;

         }

        var newSiteHTML = '' +
            '<span class="text-primary-darkend font-weight-bold">Photo Club Name:</span><span class="text-primary"> ' + new_site.newSiteObject.newPhotoclubName + '</span><br>' +
            '<span class="text-primary-darkend font-weight-bold">Website URL:</span><span class="text-primary"> myphotoclub.org?' + new_site.newSiteObject.newSiteNickname + '</span>';

        var newCreatorHTML = '' +
            '<span class="text-primary-darkend font-weight-bold">Username:</span><span class="text-primary"> ' + new_site.newCreatorObject.username + '</span><br>' +
            '<span class="text-primary-darkend font-weight-bold">Email:</span><span class="text-primary"> ' + new_site.newCreatorObject.email + '</span>';

        $('#content').hide().load("pages/new_site_account_verified.html", function() {


            $('#newSiteInformation').html(newSiteHTML);
            $('#newAccountInformation').html(newCreatorHTML);

        }).fadeIn('1000');

    }

};

