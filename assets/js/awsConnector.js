/**
 * Created by bgager on 4/13/17.
 */

var awsConnector = {
    //******************************************************************************************************************

    dynamodbEast: null,

    //******************************************************************************************************************
    initializeAWS: function(callback){

        var creds = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:9bdbb304-e154-4693-be7a-7cfe9341000d'
        });
        AWS.config.credentials = creds;

        AWS.config.region = 'us-east-1';

        awsConnector.dynamodbEast = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

        callback();

    },

    //******************************************************************************************************************
    fetchSite: function(siteID, callback){

       var params = {
            TableName: 'sites',
            KeyConditionExpression: 'siteID = :siteID ',
            ExpressionAttributeValues: {
                ':siteID': siteID
            }
        };

        awsConnector.dynamodbEast.query(params, function(err, data) {

            if (err){
              callback (false, err);
            }
            else {
                // successful response
                callback(true, data.Items[0]);
            }
        });

    }

    //******************************************************************************************************************
    //******************************************************************************************************************
    //******************************************************************************************************************
};