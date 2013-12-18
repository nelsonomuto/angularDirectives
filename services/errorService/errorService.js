angular.module( 'errorService', [])

    .factory( 'errorService', [ function ( ) {

        var errorService = {
            checkErrors: function( status, data, headers, callback ){
                // handle anything else
                console.log("Error Status: " + status);
                console.log("Error ID: " + data.id);
                console.log("Error Message: " + data.message);

                callback( status, data );
            }
        };

        return errorService;

    } ] ) ;

