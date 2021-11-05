public with sharing class AccountController {
    @AuraEnabled( cacheable = true )
    public static List< Account > fetchAccounts( String searchKey ) {
     
        String strKey = '%' + searchKey + '%';
        return [ SELECT Id, Name, Type, Rating,Industry,
        Phone, Website, AnnualRevenue FROM Account WHERE Name LIKE: strKey  AND Industry='Financial Services' ];
         
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [SELECT Id, Name, Type, Rating,
                Phone, Website, AnnualRevenue,Industry
            FROM Account WHERE Industry='Financial Services'];
    }
}
