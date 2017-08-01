


//**********************************************************************************************************************

var siteID;
var theUser = {};

//**********************************************************************************************************************

//**********************************************************************************************************************
function initialize () {

    var pageURL = window.location.href;

    //if the last character of the URL is #, remove it
    if ( pageURL.substr(pageURL.length-1,1) === '#' ){
        pageURL = pageURL.substr(0,pageURL.length -1)
    }

    siteID = pageURL.substring(pageURL.indexOf('?')+1);

    if (siteID === 'createnewsite'){

        //update the branding text link with the full URL
        $('#headerBrandTextLink').attr('href',pageURL);

        awsDynamoDBConnector.initializeAWS(createNewSiteStart);
        return;
    }

    if (siteID === 'signin'){
        $('#login-modal').modal({
            keyboard: false
        });
        return;
    }

    //update the branding text link with the full URL
    $('#headerBrandTextLink').attr('href',pageURL);

    var contentHTML = '' +
        '<div class="row justify-content-center mt-8 mb-8">' +
        '   <div class="col-5 text-center">' +
        '       <h2 class="text-primary">' +
        '           <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Loading Site' +
                '</h2>' +
        '   </div>' +
        '</div>';

    $('#content').html(contentHTML);

    $('#footer-house-ad').show();
    awsDynamoDBConnector.initializeAWS(awsInitialized)

}

//**********************************************************************************************************************
function signInUser (username, password) {

    $('#signInBTN').hide();
    $('#signInDialogMessage').html('');

    var signInDialogMessageHTML = '' +
        '<div class="text-primary">' +
        '   <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Signing In' +
        '</div>' ;

    $('#signInDialogButtonColMessage').html(signInDialogMessageHTML);

    awsCognitoConnector.signInUser(username, password, signInUserReturned);

}

//**********************************************************************************************************************
function signInUserReturned(success, signInData, userData) {

    if (success){

        var signInDialogMessageHTML = '' +
            '<div class="text-primary">' +
            '   <i class="fa fa-check" aria-hidden="true"></i> Success' +
            '</div>' ;

        $('#signInDialogButtonColMessage').html(signInDialogMessageHTML);

        setTimeout(function () {
            $('#login-modal').modal('hide')
            $('#signInDialogButtonColMessage').html('');
            $('#signInBTN').show();
        },1000);

    }
    else {
        //there was a failure

        $('#signInDialogButtonColMessage').html('');

        var signInDialogMessageHTML = '' +
            '<div class="text-danger">' +
            ' That Username/Password combination is incorrect  <i class="fa fa-exclamation " aria-hidden="true"></i> ' +
            '</div>' ;

        $('#signInDialogMessage').html(signInDialogMessageHTML);

        $('#signInBTN').show();

    }


}

//**********************************************************************************************************************
function forgotPassword() {

    $("#login-username").attr("placeholder","Username");
    $('#signInBTN').show();
    $('#changePasswordBTN').hide();
    $('#signInDialogMessage').html('');

//remove any spaces from the Username input
    $('#login-username').val($('#login-username').val().replace(/\s+/g, ''));

    //and convert it to lowercase
    $('#login-username').val($('#login-username').val().toLowerCase());

    var username = $('#login-username').val();

    //make sure they entered a Username
    if (username.length === 0 ){
        var signInDialogMessageHTML = '' +
            '<div class="text-danger">' +
            'Please enter a Username  <i class="fa fa-exclamation " aria-hidden="true"></i> ' +
            '</div>' ;

        $('#signInDialogMessage').html(signInDialogMessageHTML);
        return;
    }

    //we've got a username
    theUser.username = username;
    awsCognitoConnector.forgotPassword(username,forgotPasswordReturned);

}

//**********************************************************************************************************************
function forgotPasswordReturned(success, data) {

    if (!success){

        if (data.code === 'LimitExceededException'){
            var signInDialogMessageHTML = '' +
                '<div class="text-danger">' +
                'Sorry, you&#39;ve made too many requests in a short amount of time.<br><br>Please try again later' +
                '</div>' ;
        }
        else {
            signInDialogMessageHTML = '' +
                '<div class="text-danger">' +
                'Sorry, that Username isn&#39;t recognized<br>Please try again' +
                '</div>' ;
        }

        $('#signInDialogMessage').html(signInDialogMessageHTML);
        return;
    }

    //the username didn't fail

    signInDialogMessageHTML = '' +
        '<div class="text-primary">' +
        'We&#39;ve sent an Email to '+ data +'<br>with a Verification Code<br><br>Please enter it above along with a new Password' +
        '</div>' ;

    $('#signInDialogMessage').html(signInDialogMessageHTML);

    $('#login-username').val('');
    $('#login-password').val('');

    $("#login-username").attr("placeholder","Verification Code");
    $('#signInBTN').hide();
    $('#changePasswordBTN').show();


}

//**********************************************************************************************************************
function changePassword(verificationCode, password) {

    //make sure they entered a Verification Code
    if (verificationCode.length === 0 ){
        var signInDialogMessageHTML = '' +
            '<div class="text-danger">' +
            'Please enter a Verification Code' +
            '</div>' ;

        $('#signInDialogMessage').html(signInDialogMessageHTML);

        return;
    }

    //make sure they entered a Password
    if (password.length < 8 ){
        signInDialogMessageHTML = '' +
            '<div class="text-danger">' +
            'Please make sure your password is at least 8 characters' +
            '</div>' ;

        $('#signInDialogMessage').html(signInDialogMessageHTML);
        return;
    }

    //ok, inputs look good.
    //let's attempt a password reset

    awsCognitoConnector.resetPasswordVerificationCode(theUser.username, verificationCode, password, resetPasswordVerificationCodeReturned);

}

//**********************************************************************************************************************
function resetPasswordVerificationCodeReturned(success, data) {

    if (success){
        //we've successfully changed the users password

        var signInDialogMessageHTML = '' +
            '<div class="text-primary">' +
            'Your Password has been changed<br>Please Sign In' +
            '</div>' ;

        $('#signInDialogMessage').html(signInDialogMessageHTML);

        $('#login-username').attr('placeholder','Username');
        $('#signInBTN').show();
        $('#changePasswordBTN').hide();
        $('#login-username').val('');
        $('#login-password').val('');
        return;
    }
    //there was an error changing the users password
    signInDialogMessageHTML = '' +
        '<div class="text-danger">' +
            'There was an error while trying to reset your Password<br>Please try again' +
        '</div>' ;

    $('#signInDialogMessage').html(signInDialogMessageHTML);

}

//**********************************************************************************************************************
function createNewSiteStart() {

    //hide the house add for creating a new site since we're creating a new site
    $('#footer-house-ad').hide();

    //load up the html to create a new site
    $( "#content" ).load( "pages/new_site_name.html", function() {
        //nothing to do after load
    });

}

//**********************************************************************************************************************
function awsInitialized() {

    //fetch the site information for this siteCode

    awsDynamoDBConnector.fetchSite(siteID, siteReturned);



}

//**********************************************************************************************************************
function siteReturned(success, site) {
    //if success is false, we'll get error information back in the site parameter

    if (!success){
        //there was an error communicating with AWS
        var options = {};
        options.title = 'Communication Error';
        options.message = "We're sorry, but there was a fatal error communicating with The Cloud<br>Error Code: ss_sr_001<br>" + site;
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
        var options = {};
        options.title = 'No Such Site';
        options.message = "We're sorry, but the site<br>"+ window.location.href +"<br>doesn't seem to exist.<br>You may have entered the URL incorrectly";
        options.callback = function () {
            window.open('index.html','_self');
        };
        modalMessage.showMessage(options);

        return;
    }

    //write the branded header text
    var headerText1 = site.headerBrandText1;
    var headerText2 = site.headerBrandText2;
    var headerText3 = site.headerBrandText3;

    $('#headerBrandText').html('<span>'+ headerText1 +'</span>'+ headerText2 +'<span>'+ headerText3 +'</span>');

    //write the header slogan
    $('#headerSlogan').html(site.headerSlogan);


    //for now, load the Member List page
    memberListPage.render();


}

//**********************************************************************************************************************

//**********************************************************************************************************************

