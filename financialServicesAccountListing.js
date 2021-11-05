import { LightningElement, track,wire } from 'lwc';
import fetchAccounts from '@salesforce/apex/AccountController.fetchAccounts';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
];
 
const columns = [   
    { label: 'Name', fieldName: 'acName',sortable: true,type:'url' ,
    typeAttributes: {
        label: { 
            fieldName: 'Name' 
        },
        target : '_blank'
    }  },
    { label: 'Account Owner', fieldName: 'Owner' },
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'Website', fieldName: 'Website' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue' },
    { label: 'Industry', fieldName: 'Industry', sortable: true },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];


export default class Sample extends NavigationMixin( LightningElement ) {
     
    @track accounts;
    @track error;
    @track columns = columns;
    sortedBy;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
     
 
        @track error;
        @track accList ;
        @wire(getAccountList)
        wiredAccounts({
            error,
            data
        }) {
            if (data) {

                let tempConList = [];             
                data.forEach((record) => {
                    let tempConRec = Object.assign({}, record);  
                    tempConRec.acName = '/' + tempConRec.id;
                    tempConList.push(tempConRec);
                    
                });
                
               // this.consData = tempConList;



                this.accounts = tempConList;
            } else if (error) {
                this.error = error;
            }
    }
    
 
    handleKeyChange( event ) {
         
        const searchKey = event.target.value;
 
        if ( searchKey ) {
 
            fetchAccounts( { searchKey } )   
            .then(result => {
 
                this.accounts = result;
 
            })
            .catch(error => {
 
                this.error = error;
 
            });
 
        } else
        this.accounts = undefined;
 
    }

    handleRowAction( event ) {

        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch ( actionName ) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Account',
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }

    }
    
    onHandleSort( event ) {

        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.accounts];

        cloneData.sort( this.sortBy( sortedBy, sortDirection === 'asc' ? 1 : -1 ) );
        this.accounts = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;

    }

    sortBy( field, reverse, primer ) {

        const key = primer
            ? function( x ) {
                  return primer(x[field]);
              }
            : function( x ) {
                  return x[field];
              };

        return function( a, b ) {
            a = key(a);
            b = key(b);
            return reverse * ( ( a > b ) - ( b > a ) );
        };

    }

}
