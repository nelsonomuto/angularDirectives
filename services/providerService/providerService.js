angular.module( 'providerService', [
    'services.http.httpServiceUtil'
])

.factory( 'providerService', function ( httpServiceUtil ) {
    
    return {
        
        getProviderList:  httpServiceUtil.createServiceMethod({
            method: 'GET',
            url: 'providerManagement/providerList'
        }),
        
        getProviderDemographicInfo:  httpServiceUtil.createServiceMethod({
            method: 'GET',
            url: 'providerManagement/NpiDetails'
        }),
        
        getAudit:  httpServiceUtil.createServiceMethod({
            method: 'GET',
            url: 'providerManagement/AuditHistory'
        }),
        
        setAddNewProvider: httpServiceUtil.createServiceMethod({
            method: 'POST',
            url: 'providerManagement/Provider'
        })
    };
    
});