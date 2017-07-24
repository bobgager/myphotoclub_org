/**
 * Created by bgager on 4/14/17.
 */


/*example code here: https://github.com/aws/amazon-cognito-identity-js/*/
/*http://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html*/



var awsCognitoConnector = {

    poolData : {
                    UserPoolId : 'us-east-1_CqjIe9kJQ', // Your user pool id here
                    ClientId : '41mncjrkfept827j9cj611mgbp' // Your client id here
                },

    //******************************************************************************************************************
    registerNewUser: function (email, role, username, password, siteID, siteName, callback) {


        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(awsCognitoConnector.poolData);

        var attributeList = [];

        var dataEmail = {
            Name : 'email',
            Value : email
        };
        var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
        attributeList.push(attributeEmail);

        var dataRole = {
            Name : 'custom:role',
            Value : role
        };
        var attributeRole = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataRole);
        attributeList.push(attributeRole);

        var dataSiteID = {
            Name : 'custom:siteID',
            Value : siteID
        };
        var attributeSiteID = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataSiteID);
        attributeList.push(attributeSiteID);

        var dataSiteName = {
            Name : 'custom:siteName',
            Value : siteName
        };
        var attributeSiteName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataSiteName);
        attributeList.push(attributeSiteName);

        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
                callback(false, err.message);
                return;
            }
            callback(true, result.user );
        });

    },

    //*****************************************************************************************************************
    resendVerificationCode: function (cognitoUser, callback) {
        cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) {
                callback(false, err);
                return;
            }
            callback(true, result);
        });
    },

    //******************************************************************************************************************
    verifyNewUser: function (username, verificationCode, callback) {

        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(awsCognitoConnector.poolData);
        var userData = {
            Username : username,
            Pool : userPool
        };

        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.confirmRegistration(verificationCode, true, function(err, result) {
            if (err) {
                callback(false, err);
                return;
            }
            callback(true, result);
        });

    },

    //******************************************************************************************************************
    signInUser: function (username, password, callback) {
        var authenticationData = {
            Username : username,
            Password : password,
        };
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(awsCognitoConnector.poolData);
        var userData = {
            Username : username,
            Pool : userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {

                /*                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                 IdentityPoolId : '...', // your identity pool id here
                 Logins : {
                 // Change the key below according to the specific region your user pool is in.
                 'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>' : result.getIdToken().getJwtToken()
                 }
                 });*/

                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: var s3 = new AWS.S3();


                cognitoUser.getUserAttributes(function(err, result2) {
                    if (err) {
                        callback(false,err);
                        return;
                    }
                    callback(true, result, result2);
                });
            },

            onFailure: function(err) {
                callback(false,err);
            }

        });
    },

    //******************************************************************************************************************
    forgotPassword: function (username, callback) {

        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(awsCognitoConnector.poolData);
        var userData = {
            Username : username,
            Pool : userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function () {
                // successfully initiated reset password request

            },
            onFailure: function(err) {
                callback(false, err);
            },
            //Optional automatic callback
            inputVerificationCode: function(data) {

                callback(true, data.CodeDeliveryDetails.Destination);

/*                console.log('Code sent to: ' + data);
                var verificationCode = prompt('Please input verification code ' ,'');
                var newPassword = prompt('Enter new password ' ,'');
                cognitoUser.confirmPassword(verificationCode, newPassword, this);*/
            }
        });
    },

    //******************************************************************************************************************
    resetPasswordVerificationCode: function (username, verificationCode, newPassword, callback) {

        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(awsCognitoConnector.poolData);
        var userData = {
            Username : username,
            Pool : userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onFailure: function(err) {
                //console.log(err);
                callback(false, err);
            },
            onSuccess: function() {
                //console.log("Password Reset Success");
                callback(true);
            }
        });

    }



};