Modules

Authentication
    Customer:
        FullName
        Phone
        Email(Optional)
        UserType:CUSTOMER
        After Register Succesfully:
                KYC: Aaadhaar Card, Avatar, Pancard(Optional).

    Shopkeeper:
        FullName
        Phone
        Email(Optional)
        UserType:SHOPKEEPER
        After Register Succesfully:
                KYC: Aaadhaar Card, Shop Picture, Pancard(Optional), GST Number(optional).





Home:
    Customer:
        Total Purchase Amount (Include all Shopkeeper)
        Top Search Bar
        List of All Shopkeer with purchase amount (which was in pending or will paid).


    Shopkeeper:
        Give And Get Calculation
        Search BAR.
        List of all shop customer 


History Page:
    All transaction should be show in history page like wallet summary(CREDIT AND DEBIT)
    
Edit profile:
    /





simulator open device command:
open -a Simulator --args -CurrentDeviceUDID 6EDC92C3-D603-4F26-900E-67D9BAE31D7A