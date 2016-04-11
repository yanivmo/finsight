/** 
 * Accounts object
 * The data argument is defined as follows:
 *   data ::= {accounts: List(Account), dates: List(Date)}
 *   Account ::= {name: str, balance: List(float), children: List(Account)}
 *   Date ::= str
 */
function Accounts(data) {
    this.displayedAccounts = [];  // The accounts that are currently displayed in the chart
    this.addedAccounts = [];  // The accounts that were added by the last update
    this.removedAccounts = [];  // The accounts that were removed by the last update

    var accountsDict = {};  // Allows finding an account by its ID

    (function constructor() {
        // Generate an id for each account
        var serialNum = 1;
        iterateAccounts(function(account) {
            var newId = 'acc_' + ('000' + serialNum).slice(-3);
            account.id = newId;
            accountsDict[newId] = account;
            serialNum++;
            return true;
        });
    })();

    /**
     * Iterate the accounts tree.
     * If f returns false the iteration doesn't go deeper.
     */
    function iterateAccounts(f) {
        function iterateAccountChildren(account) {
            if (f(account)) {
                var count = account.children.length;
                for (var i=0; i<count; i++) {
                    iterateAccountChildren(account.children[i], f);
                }
            }
        }
        data.accounts.forEach(iterateAccountChildren);
    }
    
    this.buildUl = function() {
        var html = '';

        function accountToLi(account) {
            html += '<li id=' + account.id + '>' + account.name + '<ul>';
            account.children.forEach(accountToLi);
            html += '</ul></li>';
        }
        
        html += '<ul>';
        data.accounts.forEach(accountToLi);  
        html += '</ul>';
        
        return html;
    };
    
    this.updateSelection = function(newSelection) {
        
        // Takes a list of IDs of all the selected accounts and returns a list of account objects thst
        // should be displayed in the chart.
        function calculateDisplayedAccounts(selection) {
            var selectionDict = {}
            selection.forEach(function(item) {  
                selectionDict[item] = true;
            });
            
            var result = [];
            iterateAccounts(function(account) {
                if (selectionDict[account.id]) {
                    result.push(account);
                    return false;
                } else {
                    return true;
                }
            });
            return result;            
        }
        
        var newDisplayed = calculateDisplayedAccounts(newSelection);
        
        // Rely on the fact that the IDs were assigned in the iteration order
        var iNew = 0;
        var iOld = 0;
        var lenNew = newDisplayed.length;
        var lenOld = this.displayedAccounts.length;
        this.removedAccounts = [];
        this.addedAccounts = [];
        while (iNew < lenNew && iOld < lenOld) {
            var accOld = this.displayedAccounts[iOld];
            var accNew = newDisplayed[iNew];
            
            console.log(accOld.id, accOld.name, accNew.id, accNew.name);
            
            if (accOld.id < accNew.id) {
                this.removedAccounts.push(accOld);
                iOld++;
            } else if (accOld.id > accNew.id) {
                this.addedAccounts.push(accNew);
                iNew++;
            } else {
                iOld++;
                iNew++;
            }
        }
        if (iNew < lenNew) {
            for (; iNew < lenNew; iNew++) {
                console.log('Extra add:', newDisplayed[iNew].id, newDisplayed[iNew].name);
                this.addedAccounts.push(newDisplayed[iNew]);
            }
        } else if (iOld < lenOld) {
            for (; iOld < lenOld; iOld++) {
                console.log('Extra remove:', this.displayedAccounts[iOld].id, this.displayedAccounts[iOld].name);
                this.removedAccounts.push(this.displayedAccounts[iOld]);
            }   
        }
        this.displayedAccounts = newDisplayed;
    };
}