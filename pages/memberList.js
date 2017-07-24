/**
 * Created by bgager on 5/25/17.
 */

var memberListPage = {

    //******************************************************************************************************************
    render: function () {

        jPM.close();

        globals.currentPage = 'memberListPage';


        $('#content').hide().load("pages/memberList.html?version="+ globals.version, function() {

            //utils.writeDebug('memberList Page loaded',false);
            awsConnector.fetchOldMemberList(memberListPage.memberListReturned);

        }).fadeIn('1000');

    },

    //******************************************************************************************************************
    memberListReturned: function (success, data) {

        if(!success){
            console.log('error retreiving member list: ');
            console.log(data)
            return;
        }

        //console.log('got the member list back')

        //build the members list UI


        $('#userList').fadeOut(1);

        var userListHTML = '';

        data.forEach(function (user, index) {

            if (!user.status){
                user.status = 'Unkown Status';
            }
            if (!user.role){
                user.role = 'Regular Member';
            }

            user.profileImage = user.avatar.substring(15);

            userListHTML += '' +
                '<div class="team-member">' +
                    '<div class="row">' +
                        '<div class="col-sm-2">' +
                            '<a href="team-member.htm" title="View ' + user.firstName + '&#39;s profile">' +
                                '<img src="assets/img/team/'+ user.profileImage +'" class="img-thumbnail" alt="'+ user.firstName +'" />' +
                            '</a>' +
                        '</div>' +
                        '<div class="col-sm-10">' +
                            '<h4 class="name">' +
                                '<a href="team-member.htm" title="View ' + user.firstName + '&#39;s profile">'+ user.firstName + ' ' + user.lastName +'</a>' +
                            '</h4>' +

                            '<p class="role">' + user.role + '</p>' +

                            '<p class="mb-0"><i class="fa fa-map-marker"></i> '+ user.street + ', ' + user.city + ', ' +  user.state+ ' ' +  user.zip + '</p>' +

                            '<p class="mb-0"><i class="fa fa-phone"></i> '+ user.phone + '</p>' +

                            '<p class="mb-2"><i class="fa fa-envelope"></i> ' + user.userEmail + '</p>' +

                            '<a href="http://'+ user.portfolioURL +'" target="_blank"><i class="fa fa-globe"></i> '+ user.portfolioURL +'</a>' +



            //theHTML += '        <span class="col-xs-1 fa fa-globe  text-muted c-icon"></span>';
            //theHTML += '        <span > <span class="col-xs-11 c-text text-muted"><a href="http://'+ theMembers[i].portfolioURL +'" target="_blank">'+ theMembers[i].portfolioURL +'</a></span><br/></span>';



                        '<p class="mt-2">' + user.status + '</p>' ;

                        if (user.status === 'Invited'){
                            userListHTML += '<button class="btn btn-sm btn-outline-primary" type="button" onclick=" adminUsersPage.invitedUserEmail = &#39;' + user.email + '&#39;; adminUsersPage.inviteGUID = &#39;' + user.userGUID + '&#39;; adminUsersPage.sendInvitationEmail(&#39;' + user.email + '&#39;)" ><i class="fa fa-send-o" aria-hidden="true"></i> Resend Invitation </button>';

                        }

                    userListHTML +='' +

                        '</div>' +
                    '</div>' +
                '</div>'

        });

        if (userListHTML === ''){
            userListHTML = "You don't have any Team Members yet. <br>Click the Add Team Member button above to add your first Team Member."
        }

        $('#userList').html(userListHTML);

        $('#userList').fadeIn(3000);





    }

    //******************************************************************************************************************
    //******************************************************************************************************************
};