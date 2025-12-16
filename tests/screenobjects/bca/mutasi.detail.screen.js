const AppScreen = require('../app.screen');
const moment = require('moment');
const APIUtil = require('../../helpers/APIUtil');
const _ = require('lodash');

const SELECTORS = {
    NOREK_LABEL: 'id=text_view_val_acc_number',
    PERIODE_LABEL: 'id=text_view_val_periode',
    INQUIRY_LABEL: 'id=text_view_val_inquiry_date',
    INQUIRY_TYPE_LABEL: 'id=text_view_val_inquiry_trx_type',
    SEARCH_TEXTFIELD: 'id=search_src_text',

    AMOUNT_LABEL: 'id=list_mutasi_amount',
    DESCRIPTION_LABEL: 'id=list_mutasi_description',
    RECIPIENT_LABEL: 'id=list_mutasi_recipient',
    MUTASI_LABEL: 'id=list_mutasi_debitcredit',

    POPUP_MESSAGE_LABEL: 'id=dlg_sh_msg',
    POPUP_BUTTON: '~PopUp Button - Back',
    SAVE_BUTTON: 'id=btn_save',
    HOME_SCREEN: '~Home-screen',
    

    //Layout Scrolling
    LAYOUT_VIEW: '//androidx.recyclerview.widget.RecyclerView[@resource-id="com.bca:id/content_mutasi"]/android.widget.LinearLayout',

};

class MutasiDetailScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    get lblAmount() {
        return $$(SELECTORS.AMOUNT_LABEL);
    }
    get lblDesc() {
        return $$(SELECTORS.DESCRIPTION_LABEL);
    }
    get lblRecipient() {
        return $$(SELECTORS.RECIPIENT_LABEL);
    }
    get lblMutasi() {
        return $$(SELECTORS.MUTASI_LABEL);
    }
    get lblInquiry() {
        return $(SELECTORS.INQUIRY_LABEL);
    }
    get lblPopUp() {
        return $(SELECTORS.POPUP_MESSAGE_LABEL);
    }
    get btnPopUp() {
        return $(SELECTORS.POPUP_BUTTON);
    }
    get layoutView() {
        return $$(SELECTORS.LAYOUT_VIEW);
    }
    get btnSave() {
        return $(SELECTORS.SAVE_BUTTON);
    }

    printMutasi(token, last_mutations){
        let formattedDate = this.getCurrentDateTime();
        let data = {
            raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
            data: []
        };
        if ($$(SELECTORS.POPUP_BUTTON).length === 0) { //=== "Tidak ada Transaksi"){
            formattedDate = moment(this.lblInquiry.getText(), "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ssZ");
            data = {
                raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
                data: []
            };
            let newData = [];
            let scroll = true;
            // let shouldExit = false; 
            let lastIndex = 0;
            // const index = 1
            // for (let i = 0; i <= scroll; i++) {
            while(scroll){
                // this.lblAmount.forEach((element, index) => {
                let lastRecord = "";
                let lastData = "";
                let raw_date = "";
                let raw_description = "";
                let raw_description_2 = "";
                let raw_amount = "";
                let raw_status = "";
                for (let index = 0; index < this.lblDesc.length; index++) {



                    let isDataEqualized = false;
                    while (!isDataEqualized) {
                        const descElements = this.lblDesc;
                        const amountElements = this.lblAmount;
                        const mutasiElements = this.lblMutasi;
                        const recipientElements = this.lblRecipient;

                        const descCount = descElements.length;
                        const amountCount = amountElements.length;
                        const mutasiCount = mutasiElements.length;
                        const recipientCount = recipientElements.length;

                        if (descCount >= 4 && amountCount >= 4 && mutasiCount === 4 && recipientCount === 4) {
                            isDataEqualized = true;
                            raw_status = this.lblMutasi[index].getText();
                            raw_description_2 = this.lblRecipient[index].getText();
                            raw_description = this.lblDesc[index].getText();
                            raw_amount = this.lblAmount[index].getText();
                        } else {
                            this.scrollElement('com.bca:id/content_mutasi', 3, 'up');
                        }
                    }




                //     // if(!this.lblDesc[index]){
                //     //     this.scrollElement('com.bca:id/content_mutasi', 2, 'up');
                //     // }

                //     //Scrolling jika tidak ada dilayar salah satu element
                //     if(!this.lblAmount[index]){
                //         this.scrollElement('com.bca:id/content_mutasi', 3, 'up');
                //     }else{
                //         raw_amount = this.lblAmount[index].getText();
                //     }

                //     if(this.lblAmount.length < this.lblDesc.length){
                //         index++;
                //     }
                // // }else if(!this.lblAmount[index] && this.lblDesc[index]){
                // //     this.scrollElement('com.bca:id/content_mutasi', 3, 'up');
                // //     raw_amount = this.lblAmount[index].getText();

                //     if(!this.lblDesc[index]){
                //         this.scrollElement('com.bca:id/content_mutasi', 3, 'up');
                //         raw_date = this.lblDesc[index].getText().split("/")[0];
                //         raw_description = this.lblDesc[index].getText();
                //     }else{
                //         raw_date = this.lblDesc[index].getText().split("/")[0];
                //         raw_description = this.lblDesc[index].getText();
                //     } 
                //     if(!this.lblRecipient[index]){
                //         this.scrollElement('com.bca:id/content_mutasi', 3, 'up');
                //         raw_description_2 = this.lblRecipient[index].getText();
                //     }else{
                //         raw_description_2 = this.lblRecipient[index].getText();
                //     } 
                    
                //     if(!this.lblMutasi[index]){
                //         this.scrollElement('com.bca:id/content_mutasi', 3, 'up');
                //         raw_status = this.lblMutasi[index].getText();
                //     }else{
                //         raw_status = this.lblMutasi[index].getText();
                //     }

                    // if(this.lblDesc[index].getText() === "2905/FTSCY/WS95031          50000.00HARITH FANANI     "){ //2905/FTSCY/WS95031          10000.00HARITH FANANI    
                    // console.log(this.lblAmount[index].getText() +" === "+ last_mutations[0].raw_amount); 
                    const desc = raw_description === last_mutations[0].raw_description;
                    const amount = raw_amount === last_mutations[0].raw_amount;
                    const status = raw_status === last_mutations[0].raw_status;
                    
                    
                    if(desc && amount && status){
                        if(this.lblAmount.length > 1){
                            if(this.lblDesc[index+1]){
                                let nextDesc = "";
                                let nextAmount = "";
                                let nextStatus = "";
                                if(this.lblAmount.length < this.lblDesc.length){
                                    nextDesc = this.lblDesc[index+2].getText() === last_mutations[1].raw_description; 
                                    nextAmount = this.lblAmount[index+2].getText() === last_mutations[1].raw_amount;
                                    nextStatus = this.lblMutasi[index+2].getText() === last_mutations[1].raw_status;
                                }else{
                                    nextDesc = this.lblDesc[index+1].getText() === last_mutations[1].raw_description; 
                                    nextAmount = this.lblAmount[index+1].getText() === last_mutations[1].raw_amount;
                                    nextStatus = this.lblMutasi[index+1].getText() === last_mutations[1].raw_status;
                                }
                                    
                                if(nextDesc && nextAmount && nextStatus){
                                    scroll = false;
                                    break;
                                }
                            }else{
                                scroll = false;
                                break;
                            }
                        }else{
                            scroll = false;
                            break;
                        }
                    }
                        console.log(this.lblDesc[index].getText() +" === "+ last_mutations[0].raw_description);
                        
                        newData = {
                        raw_date: raw_date,
                        raw_description: raw_description,
                        raw_description_2: raw_description_2,
                        raw_amount: raw_amount,
                        raw_status: raw_status
                        };
                        data.data.push(newData);
                }

                if(this.lblAmount.length > 1 && data.data.length!=0){
                    lastIndex = data.data.length-1;
                    lastData = data.data[lastIndex].raw_description + data.data[lastIndex].raw_amount + data.data[lastIndex].raw_status;
                    //Scrolling 
                    this.scrollElement('com.bca:id/content_mutasi', 7, 'up');

                    //Check kondisi jika data terakhir di layar sama dengan data terakhir di array
                    console.log(this.lblDesc.length)
                    console.log(this.lblAmount.length)
                    console.log(this.lblMutasi.length)
                    const len = this.lblDesc.length-1;
                    if(!this.lblAmount[len]){
                        let isDataEqualized = false;
                        while (!isDataEqualized) {
                            const descElements = this.lblDesc;
                            const amountElements = this.lblAmount;
                            const mutasiElements = this.lblMutasi;

                            const descCount = descElements.length;
                            const amountCount = amountElements.length;
                            const mutasiCount = mutasiElements.length;

                            if (descCount >= 4 && amountCount >= 4 && mutasiCount === 4) {
                                isDataEqualized = true;
                            } else {
                                this.scrollElement('com.bca:id/content_mutasi', 3, 'up');
                            }
                        }
                        lastRecord = this.lblDesc[len-2].getText() + this.lblAmount[len-1].getText() + this.lblMutasi[len-1].getText();//lastRecord = this.lblDesc[len].getText() + this.lblAmount[len-1].getText() + this.lblMutasi[len].getText();
                    }else{
                        lastRecord = this.lblDesc[len].getText() + this.lblAmount[len].getText() + this.lblMutasi[len].getText();
                    }            
                    console.log(lastRecord);
                    console.log(lastData);
                    if(lastRecord === lastData) break;
                }else{
                    scroll = false;
                    break;
                }
                //Check jika perlu scroll atau tidak
                if(!scroll) break;
    
            }
            
            // console.log("Last record "+ lastRecord)
            // console.log(JSON.stringify(last_mutations, null, 2));
            // console.log(last_mutations[0].raw_description);
            driver.back();
            driver.pause(300);
        }else{
            if(this.btnPopUp.isDisplayed()){
                this.btnPopUp.click();
            }
        }//Tutup IF check if no transaksi
        console.log(JSON.stringify(data, null, 2));
        // console.log("Last index "+ lastIndex)
        //Send Data ke server
        APIUtil.sendCurlRequest(token, data);
    }
    
    printMutasiOneData(token, last_mutations){
        let formattedDate = this.getCurrentDateTime();
        let data = {
            raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
            data: []
        };
        if ($$(SELECTORS.POPUP_BUTTON).length === 0) { //=== "Tidak ada Transaksi"){
            formattedDate = moment(this.lblInquiry.getText(), "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ssZ");
            data = {
                raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
                data: []
            };
            let newData = [];
            let raw_date = "";
            let raw_description = "";
            let raw_description_2 = "";
            let raw_amount = "";
            let raw_status = "";
            for (let index = 0; index < 2; index++) {    
                raw_date = this.lblDesc[index].getText().split("/")[0];
                raw_description = this.lblDesc[index].getText();
                raw_description_2 = this.lblRecipient[index].getText();
                raw_status = this.lblMutasi[index].getText();
                raw_amount = this.lblAmount[index].getText();
                
                newData = {
                raw_date: raw_date,
                raw_description: raw_description,
                raw_description_2: raw_description_2,
                raw_amount: raw_amount,
                raw_status: raw_status
                };
                data.data.push(newData);
            }
            driver.back();
            driver.pause(300);
        }else{
            if(this.btnPopUp.isDisplayed()){
                this.btnPopUp.click();
            }
        }//Tutup IF check if no transaksi
        console.log(JSON.stringify(data, null, 2));
        //Send Data ke server
        APIUtil.sendCurlRequest(token, data);
    }

    printMutasi4Data(token, last_mutations){
        let formattedDate = this.getCurrentDateTime();
        let data = {
            raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
            data: []
        };
        if ($$(SELECTORS.POPUP_BUTTON).length === 0) { //=== "Tidak ada Transaksi"){
            formattedDate = moment(this.lblInquiry.getText(), "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ssZ");
            data = {
                raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
                data: []
            };
            let newData = [];
            let raw_date = "";
            let raw_description = "";
            let raw_description_2 = "";
            let raw_amount = "";
            let raw_status = "";
            let lengthData = this.lblDesc.length;
            if(lengthData>3){
                lengthData = 3;
            }
            for (let index = 0; index < lengthData; index++) {    
                if(this.lblDesc.length === index){
                    break;
                }
                raw_date = this.lblDesc[index].getText().split("/")[0];
                raw_description = this.lblDesc[index].getText();
                raw_description_2 = this.lblRecipient[index].getText();
                raw_status = this.lblMutasi[index].getText();
                raw_amount = this.lblAmount[index].getText();
                
                //Handle jika data di db benar2 kosongan Last Mutation
                if(last_mutations.length > 0 && this.lblDesc.length > 1){
                    const desc = raw_description === last_mutations[0].raw_description;
                    const amount = raw_amount === last_mutations[0].raw_amount;
                    const status = raw_status === last_mutations[0].raw_status;
                    if(desc && amount && status){
                        if(last_mutations.length === 1){
                            break;
                        }else{
                            try{
                                let nextDesc = this.lblDesc[index+1].getText() === last_mutations[1].raw_description; 
                                let nextAmount = this.lblAmount[index+1].getText() === last_mutations[1].raw_amount;
                                let nextStatus = this.lblMutasi[index+1].getText() === last_mutations[1].raw_status;
                                if(nextDesc && nextAmount && nextStatus){
                                    break;
                                }
                            } catch (error) {
                                console.error(`Terjadi kesalahan: ${error}`);
                                break;
                            }

                        }
                        
                    }
                }else if(last_mutations.length > 0 && this.lblDesc.length === 1){ //Handle jika ada 1 mutasi saat pergantian hari dan sudah ada di db
                    const desc = raw_description === last_mutations[0].raw_description;
                    const amount = raw_amount === last_mutations[0].raw_amount;
                    const status = raw_status === last_mutations[0].raw_status;
                    if(desc && amount && status){
                        break;
                    }
                }

                newData = {
                raw_date: raw_date,
                raw_description: raw_description,
                raw_description_2: raw_description_2,
                raw_amount: raw_amount,
                raw_status: raw_status
                };
                data.data.push(newData);
                console.log(newData);//delete ini
            }
            driver.pause(500);
            driver.back();
            // if($$(SELECTORS.DESCRIPTION_LABEL).length === 0) { //check kalau masih nyangkut
            //     driver.back();
            // }
            
        }else{
            if(this.btnPopUp.isDisplayed()){
                this.btnPopUp.click();
            }
        }//Tutup IF check if no transaksi
        console.log(JSON.stringify(data, null, 2));
        //Send Data ke server
        APIUtil.sendCurlRequest(token, data);
        driver.pause(700);
    }

    generateXPathDate(index) {
        return `${SELECTORS.LAYOUT_VIEW}[${index}]/android.widget.LinearLayout[1]/android.widget.TextView[1]`;
    }
    generateXPathAmount(index) {
        return `${SELECTORS.LAYOUT_VIEW}[${index}]/android.widget.LinearLayout[1]/android.widget.TextView[2]`;
    }
    generateXPathDesc(index) {
        return `${SELECTORS.LAYOUT_VIEW}[${index}]/android.widget.LinearLayout[2]/android.widget.TextView[1]`;
    }
    generateXPathDbCr(index) {
        return `${SELECTORS.LAYOUT_VIEW}[${index}]/android.widget.LinearLayout[2]/android.widget.TextView[2]`;
    }
    generateXPathRecipient(index) {
        return `${SELECTORS.LAYOUT_VIEW}[${index}]/android.widget.LinearLayout[3]/android.widget.TextView[1]`;
    }
      
    printMutasiScroll(token, last_mutations){
        let formattedDate = this.getCurrentDateTime();
        let data = {
            raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
            data: []
        };
        let dataTemp = {
            raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
            data: []
        };
        if ($$(SELECTORS.POPUP_BUTTON).length === 0) { //=== "Tidak ada Transaksi"){
            //Constants Element
            let tempData = [];
            let newData = [];
            let isScroll = true;
            let maxScroll = 1;
            // if(lengthData>4){
            //     lengthData = 4;
            // }
            while(isScroll){
                let raw_date = "";
                let raw_description = "";
                let raw_description_2 = "";
                let raw_amount = "";
                let raw_status = "";
                let lengthData = this.layoutView.length;
                let retry = 1;
                for (let index = 0; index < lengthData; index++) { 
                    try {
                        raw_date = $(this.generateXPathDate(index+1)).getText();      
                        raw_description = $(this.generateXPathDesc(index+1)).getText();
                        raw_description_2 = $(this.generateXPathRecipient(index+1)).getText();
                        raw_amount = $(this.generateXPathAmount(index+1)).getText(); 
                        raw_status = $(this.generateXPathDbCr(index+1)).getText(); 

                        tempData = {
                            raw_date: raw_date,
                            raw_description: raw_description,
                            raw_description_2: raw_description_2,
                            raw_amount: raw_amount,
                            raw_status: raw_status
                            };
                        dataTemp.data.push(newData);
                        
                        const dataLen = dataTemp.data.length;
                        const dataLen2 = data.data.length;
                        if(last_mutations.length > 0){
                            if (dataTemp.data.length > 2) {
                                const desc = dataTemp.data[dataLen-1].raw_description === last_mutations[1].raw_description;
                                const amount = dataTemp.data[dataLen-1].raw_amount === last_mutations[1].raw_amount;
                                const status = dataTemp.data[dataLen-1].raw_status === last_mutations[1].raw_status;
                                if(desc && amount && status){
                                    data.data.splice(dataLen2-1, 1);
                                    if(last_mutations.length === 1){
                                        isScroll = false;
                                        break;
                                    }else{
                                        let nextDesc = dataTemp.data[dataLen-2].raw_description === last_mutations[0].raw_description; 
                                        let nextAmount = dataTemp.data[dataLen-2].raw_amount === last_mutations[0].raw_amount;
                                        let nextStatus = dataTemp.data[dataLen-2].raw_status === last_mutations[0].raw_status;
                                        if(nextDesc && nextAmount && nextStatus){
                                            data.data.splice(dataLen2-2, 1);
                                            isScroll = false;
                                            break;
                                        }
                                    }
                                }
                            }  
                            
                            if(dataTemp.data.length > 4) {
                                const desc = dataTemp.data[dataLen-1].raw_description === dataTemp.data[dataLen-5].raw_description;
                                const nextDesc = dataTemp.data[dataLen-2].raw_description === dataTemp.data[dataLen-6].raw_description;

                                const amount = dataTemp.data[dataLen-1].raw_amount === dataTemp.data[dataLen-5].raw_amount;
                                const nextAmount = dataTemp.data[dataLen-2].raw_amount === dataTemp.data[dataLen-6].raw_amount;

                                const status = dataTemp.data[dataLen-1].raw_status === dataTemp.data[dataLen-5].raw_status;
                                const nextStatus = dataTemp.data[dataLen-2].raw_status === dataTemp.data[dataLen-6].raw_status;
                                if(desc && nextDesc && amount && nextAmount && status && nextStatus){
                                    console.log(" End di layar ")
                                    // data.data.splice(dataLen2-2, 1);
                                    // data.data.splice(dataLen2-1, 1);  
                                    isScroll = false;
                                    break;
                                }
                            }
                            
                        }
                        

                        newData = {
                            raw_date: raw_date,
                            raw_description: raw_description,
                            raw_description_2: raw_description_2,
                            raw_amount: raw_amount,
                            raw_status: raw_status
                            };
                            data.data.push(newData);

                        // console.log("Tampung ",dataTemp.data.length); 
                        // console.log("Tampung ",dataTemp.data[dataLen-1].raw_description);    

                    } catch (error) {
                        console.log(" Element tidak terlihat di layar ")
                        // index = index + 1;
                        // break;
                    }  

                        retry = retry+1;
                        // console.log(retry)
                        // console.log(lengthData)
            
                        if(lengthData===retry) {
                            this.scrollElement('com.bca:id/content_mutasi', 24, 'up');
                        }
                           
                        
                        if(maxScroll===20){
                            isScroll = false;
                        }

                    }
                    maxScroll = maxScroll+1;
                    console.log("Max Scroll " ,maxScroll);
                    // this.scrollElement('com.bca:id/content_mutasi', 25, 'up');
            }
                
            
        }else{
            if(this.btnPopUp.isDisplayed()){
                this.btnPopUp.click();
            }
        }//Tutup IF check if no transaksi
        // console.log(JSON.stringify(data, null, 2));
        console.log(JSON.stringify(data, null, 2));
        console.log(JSON.stringify(last_mutations, null, 2));
        //Send Data ke server
        // APIUtil.sendCurlRequest(token, data);
        driver.pause(700);
    }

    printMutasiScrollV2(token, last_mutations){
        let formattedDate = this.getCurrentDateTime();
        let data = {
            raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
            data: []
        };
        let dataTemp = {
            raw_delivery_timestamp: formattedDate,//"2023-05-27T11:13:48+00:00",
            data: []
        };
        if ($$(SELECTORS.POPUP_BUTTON).length === 0) { //=== "Tidak ada Transaksi"){
            //Download Mutasi jika ada transaksi
            //this.downloadMutasi();
            //Constants Element
            let tempData = [];
            let isScroll = true;
            let maxScroll = 1;
            let lengthData = this.lblDesc.length;
            // if(lengthData>3){
                while(isScroll){
                    let raw_date = "";
                    let raw_description = "";
                    let raw_description_2 = "";
                    let raw_amount = "";
                    let raw_status = "";
                    let lengthData = this.layoutView.length;
                    if (lengthData>0){
                        try {
                            raw_date = $(this.generateXPathDate(1)).getText();      
                            raw_description = $(this.generateXPathDesc(1)).getText();
                            raw_description_2 = $(this.generateXPathRecipient(1)).getText();
                            raw_amount = $(this.generateXPathAmount(1)).getText(); 
                            raw_status = $(this.generateXPathDbCr(1)).getText(); 
    
                            // Ganti 'Rp' dengan string kosong
                            raw_amount = raw_amount.replace('Rp.', '');

                            tempData = {
                                raw_date: raw_date,
                                raw_description: raw_description,
                                raw_description_2: raw_description_2,
                                raw_amount: raw_amount,
                                raw_status: raw_status
                                };
                            dataTemp.data.push(tempData);
                            
                        } catch (error) {
                            console.log(" Element tidak terlihat di layar ")
    
                            raw_date = $(this.generateXPathDate(2)).getText();      
                            raw_description = $(this.generateXPathDesc(2)).getText();
                            raw_description_2 = $(this.generateXPathRecipient(2)).getText();
                            raw_amount = $(this.generateXPathAmount(2)).getText(); 
                            raw_status = $(this.generateXPathDbCr(2)).getText(); 

                            // Ganti 'Rp' dengan string kosong
                            raw_amount = raw_amount.replace('Rp.', '');
    
                            tempData = {
                                raw_date: raw_date,
                                raw_description: raw_description,
                                raw_description_2: raw_description_2,
                                raw_amount: raw_amount,
                                raw_status: raw_status
                                };
                            dataTemp.data.push(tempData);
                        }  
    
                        const dataLen = dataTemp.data.length;
                        const dataLen2 = data.data.length;
    
                            if(last_mutations.length != 0){
                                if (dataTemp.data.length > 1) {
                                    let desc = "";
                                    let amount = "";
                                    let status = "";
                                    // if (last_mutations.length === 1){
                                         desc = dataTemp.data[dataLen-1].raw_description === last_mutations[0].raw_description;
                                         amount = dataTemp.data[dataLen-1].raw_amount === last_mutations[0].raw_amount.replace('Rp.', '');
                                         status = dataTemp.data[dataLen-1].raw_status === last_mutations[0].raw_status;
                                    // }
                                    // //Scenario dibawah ini jika pairing 2 data
                                    // else{
                                    //      desc = dataTemp.data[dataLen-2].raw_description === last_mutations[1].raw_description;
                                    //      amount = dataTemp.data[dataLen-2].raw_amount === last_mutations[1].raw_amount;
                                    //      status = dataTemp.data[dataLen-2].raw_status === last_mutations[1].raw_status;
                                    // }
                                    
                                    if(desc && amount && status){
                                        
                                        // if(last_mutations.length === 1){
                                            dataTemp.data.splice(dataLen-1, 1);
                                            // dataTemp.data.splice(dataLen-2, 1); 
                                            isScroll = false;
                                            break;
                                        // }
                                        // else{
                                        //     let nextDesc = dataTemp.data[dataLen-2].raw_description === last_mutations[1].raw_description; 
                                        //     let nextAmount = dataTemp.data[dataLen-2].raw_amount === last_mutations[1].raw_amount;
                                        //     let nextStatus = dataTemp.data[dataLen-2].raw_status === last_mutations[1].raw_status;
                                        //     if(nextDesc && nextAmount && nextStatus){
                                        //         dataTemp.data.splice(dataLen-1, 1); 
                                        //         dataTemp.data.splice(dataLen-2, 1);
                                        //         isScroll = false;
                                        //         break;
                                        //     }
                                        // }
                                    }
                                }else{
                                    //Handle jika row ke-1 Match dengan Last mutations
                                    let desc = "";
                                    let amount = "";
                                    let status = "";
                                    desc = dataTemp.data[dataLen-1].raw_description === last_mutations[0].raw_description;
                                    amount = dataTemp.data[dataLen-1].raw_amount === last_mutations[0].raw_amount.replace('Rp.', '');
                                    status = dataTemp.data[dataLen-1].raw_status === last_mutations[0].raw_status;
                                    
                                    if(desc && amount && status){
                                        if(maxScroll === 1){
                                            console.log(maxScroll, " Reach Ketemu")
                                            dataTemp.data.splice(dataLen-1, 1); 
                                            isScroll = false;
                                            break;
                                        }
                                    }
                                }    
                            
                            }
                            // else{
                                if(dataTemp.data.length > 4) {
                                    const desc1 = dataTemp.data[dataLen-1].raw_description === raw_description;
                                    const amount1 = dataTemp.data[dataLen-1].raw_amount === raw_amount;
                                    const desc2 = dataTemp.data[dataLen-2].raw_description === raw_description;
                                    const amount2 = dataTemp.data[dataLen-2].raw_amount === raw_amount;
                                    const desc3 = dataTemp.data[dataLen-3].raw_description === raw_description;
                                    const amount3 = dataTemp.data[dataLen-3].raw_amount === raw_amount;
                                    let lengthData = this.layoutView.length;
                                    // if(desc1 && amount1 && desc2 && amount2 && desc3 && amount3 && desc4 && amount4 && desc5 && amount5 && desc6 && amount6 && desc7 && amount7){
                                    if(desc1 && amount1 && desc2 && amount2 && desc3 && amount3){
                                        // console.log(JSON.stringify(dataTemp, null, 2));
                                        const dataLen = dataTemp.data.length;
                                        for (let i = 1; i < 5; i++) {
                                            const descMatch = dataTemp.data[dataLen-i].raw_description === raw_description;
                                            const amountMatch = dataTemp.data[dataLen-i].raw_amount === raw_amount;
                                            if(descMatch && amountMatch){
                                                dataTemp.data.splice(dataLen - i, 1);
                                            }else{
                                                break;
                                            }
                                            
                                        }
                                        console.log(lengthData , " lengthData");
                                        // if (dataTemp.data.length === 1){
                                        //     dataTemp.data = [];
                                        // }
                                            for (let index = 0; index < lengthData; index++) { 
                                                try {
                                                    raw_date = $(this.generateXPathDate(index+1)).getText();      
                                                    raw_description = $(this.generateXPathDesc(index+1)).getText();
                                                    raw_description_2 = $(this.generateXPathRecipient(index+1)).getText();
                                                    raw_amount = $(this.generateXPathAmount(index+1)).getText(); 
                                                    raw_status = $(this.generateXPathDbCr(index+1)).getText(); 
                                                } catch (error) {
                                                    index++;
                                                    raw_date = $(this.generateXPathDate(index+1)).getText();      
                                                    raw_description = $(this.generateXPathDesc(index+1)).getText();
                                                    raw_description_2 = $(this.generateXPathRecipient(index+1)).getText();
                                                    raw_amount = $(this.generateXPathAmount(index+1)).getText(); 
                                                    raw_status = $(this.generateXPathDbCr(index+1)).getText(); 
                                                    
                                                    console.log(" Element tidak terlihat di layar ");
                                                }

                                                // Ganti 'Rp' dengan string kosong
                                                raw_amount = raw_amount.replace('Rp.', '');

                                                //Handle jika ada row data dan kena duplicate 
                                                const descMatch = dataTemp.data[0].raw_description === raw_description;
                                                const amountMatch = dataTemp.data[0].raw_amount === raw_amount;
                                                if (dataTemp.data.length === 1){
                                                    if(descMatch && amountMatch){
                                                        // dataTemp.data = [];
                                                        dataTemp.data.splice(0, 1);
                                                        console.log("Remove Duplicate")
                                                    }
                                                }
                                                
                                            if(last_mutations.length > 0){
                                                const desc = raw_description === last_mutations[0].raw_description;
                                                const amount = raw_amount === last_mutations[0].raw_amount.replace('Rp.', '');
                                                const status = raw_status === last_mutations[0].raw_status;
                                                if (desc && amount && status){
                                                    break;
                                                }
                                            }
        
                                                tempData = {
                                                    raw_date: raw_date,
                                                    raw_description: raw_description,
                                                    raw_description_2: raw_description_2,
                                                    raw_amount: raw_amount,
                                                    raw_status: raw_status
                                                    };
                                                dataTemp.data.push(tempData);
                                            }
                                            console.log(" End di layar ")
                                            isScroll = false;
                                            break;
                                    }
                                    
                                // }
                            }
    
                                //Scrolling
                                this.scrollElementV2(1090)
                    
                    }
                        maxScroll = maxScroll+1;
                        console.log("Retry Scroll " ,maxScroll);
                        
                        if(maxScroll===10){
                            isScroll = false;
                            break;
                        }
                }
            // }else{
            //     this.printMutasi4Data(token, last_mutations)
            // }
            
                
            
        }
        // else{
        //     if(this.btnPopUp.isDisplayed()){
        //         this.btnPopUp.click();
        //     }
        // }//Tutup IF check if no transaksi
        console.log(JSON.stringify(dataTemp, null, 2));
        console.log(JSON.stringify(last_mutations, null, 2));
        // Menghapus duplikat dari array menggunakan uniqWith dari lodash
        const uniqueDataArray = _.uniqWith(dataTemp.data, _.isEqual);
        dataTemp.data = uniqueDataArray;
        console.log(JSON.stringify(dataTemp, null, 2));
        //Send Data ke server
        APIUtil.sendCurlRequest(token, dataTemp);
        driver.pause(700);
    }

    scrollElement(elementId, percentage, scrollType) {
        const element = $(`id=${elementId}`);
        const location = element.getLocation();
        const size = element.getSize();
      
        // Menghitung koordinat awal dan akhir untuk scroll
        const startY = scrollType === 'up' ? location.y + size.height - 1 : location.y + 1;
        const endY = scrollType === 'up' ? location.y + 1 : location.y + size.height - 1;
      
        // Menghitung koordinat x pada pertengahan elemen
        const centerX = location.x + Math.floor(size.width / 2);
      
        // Menghitung koordinat y pada persentase yang diberikan
        const scrollY = Math.floor((endY - startY) * percentage / 100) + startY;
      
        // Melakukan swipe dengan koordinat yang telah dihitung
        driver.touchAction([
          { action: 'press', x: centerX, y: startY },
          { action: 'wait', ms: 200 },
          { action: 'moveTo', x: centerX, y: scrollY },
          { action: 'release' }
        ]);
      }

    scrollElementV2(yCoordinate) {
        // const elementTop = elementIdTop
        // const elementBottom = elementIdBottom
      
        // const sizeTop = elementTop.getSize();
        // const locationTop = elementTop.getLocation();
        // const sizeBottom = elementBottom.getSize();
        // const locationBottom = elementBottom.getLocation();
      
        // // Menghitung koordinat awal dan akhir untuk scroll
        // const startY = locationTop.y + sizeTop.height - 1;
        // const endY = locationBottom.y + sizeBottom.height - 1;
      
        // // Menghitung koordinat x pada pertengahan elemen
        // const centerX = locationTop.x + Math.floor(sizeTop.width / 2);
      
        // Melakukan swipe dengan koordinat yang telah dihitung
        // driver.touchAction([
        //   { action: 'press', x: centerX, y: endY },
        //   { action: 'wait', ms: 200 },
        //   { action: 'moveTo', x: centerX, y: startY },
        //   { action: 'release' }
        // ]);
        driver.touchAction([
            { action: 'press', x: 540, y: yCoordinate },
            { action: 'wait', ms: 200 },
            { action: 'moveTo', x: 540, y: 987 },
            { action: 'release' }
          ]);
      }

     getCurrentDateTime() {
        const now = moment().format('YYYY-MM-DDTHH:mm:ssZ');
        return now;
    }

    handleBackMutasi(){
        if (this.btnPopUp.isDisplayed()){
            const msg = this.lblPopUp.getText();
            this.btnPopUp.click();
            driver.back();
            return msg;
        }else{
            driver.pause(300);
            driver.back();
            driver.pause(300);
            driver.back();
            return null;
        }
    }

    downloadMutasi(){
        this.btnSave.click();
    }
}


  

module.exports = new MutasiDetailScreen();
