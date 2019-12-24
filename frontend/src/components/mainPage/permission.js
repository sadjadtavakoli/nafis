export const isPermit = (section,job) => {
    switch (section) {
        case 'sale':
            return job === 'admin' || job === 'salesperson' || job === 'storekeeper';
            break;
        
        case 'cashregister':
            return job === 'admin' || job === 'cashier' || job === 'accountant';
            break;
            
        case 'depository':
            return job === 'admin' || job === 'storekeeper' || job === 'accountant';
        break;
    
        default:
            return false;
            break;
    }
}