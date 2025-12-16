const AppScreen = require('../app.screen');
const PinScreen = require('../bca/pin.screen');
const HomeScreen = require('../bca/home.screen');
const ElementUtil = require('../../helpers/ElementUtil');
const APIUtil = require('../../helpers/APIUtil');

const SELECTORS = {
    CONNECTION_STATE: 'id=image_state_color',
    DAFTAR_REKENING_LABEL: '//android.view.ViewGroup[@content-desc="menu Daftar Transfer - Antar Rekening"]',
    TRANSFER_REKENING_LABEL: '//android.view.ViewGroup[@content-desc="menu Transfer - Antar Rekening"]',
    DAFTAR_REKENING_ANTAR_BANK_LABEL: '//android.view.ViewGroup[@content-desc="menu daftar transfer antar bank "]',
    TRANSFER_REKENING_ANTAR_BANK_LABEL: '//android.view.ViewGroup[@content-desc="menu transfer antar bank "]',
    TRANSFER_REKENINGVA_LABEL: '//android.view.ViewGroup[@content-desc="menu bca virtual account "]',
    REK1_TEXTFIELD: 'id=antar_rekening_et1',
    SEND_BUTTON: 'id=button_title_right',

    ANTAR_BANK_NEW_REK_TEXTFIELD: 'id=dafter_bank_ed_1',
    NEW_REK_BANK_SELECTION_BUTTON: 'id=relative_dafter_bank_2',
    BANK_LIST_BUTTON: 'id=transfer_dom_form_bank',
    REKENING_LIST_ANTAR_BANK_BUTTON: 'id=transfer_dom_form_dest_acc',
    AMOUNT_ANTAR_BANK_BUTTON: 'id=transfer_dom_form_amount',

    TRANSFER_SERVICE_BUTTON: 'id=transfer_dom_form_transfer_service',
    ANTAR_BANK_DESC_BUTTON: 'id=transfer_dom_form_notes',
    TRANSFER_PURPOSE_BUTTON: 'id=transfer_dom_form_transaction_purpose',
    TRANSFER_PURPOSE_SELECTION: '//*[(//android.view.ViewGroup[@content-desc="list nomor handphone"])[4]/android.widget.TextView and @text="Lainnya"]',
    
    TRANSFER_POPUP_TEXT: '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.TextView',
        
    VA_POPUP_TEXT: 'id=dlg_sh_msg',
        

    VA_ACCOUNT_CONTAINER: 'id=va_to_account_container',
    STATUS_LABEL: 'id=confirm_screen_tv_1_2',
    REKENING_LIST_BUTTON: 'id=m_transfer_all_2_layoutL',
    REKENING_LIST_BUTTON2: 'id=to_account_field',
    SEARCH_TEXTFIELD: 'id=search_src_text',
    NAMA_LABEL: 'id=nama',
    AMOUNT_BUTTON: 'id=m_transfer_all_4_layoutL',
    AMOUNT_BUTTON2: 'id=amount_field',
    INPUT_TEXTFIELD: 'id=edit_text_input_dialog',
    OK_BUTTON: 'id=btn_ok_input_dialog',
    DESC_BUTTON: 'id=m_transfer_all_6_layoutL',
    DESC_BUTTON2: 'id=transaction_notes',
    DESC_TEXTFIELD: 'id=m_input_dialog_edtTxt_input1',
    OK_DESC_BUTTON: 'id=m_input_dialog_btn_inputOk1',
    OK_POPUP_BUTTON: '//android.widget.Button[@content-desc="PopUp Button - OK"]',
    OK_POPUP_BUTTON2: '//android.widget.Button[@content-desc="PopUp Button - Ok"]',
    OK_POPUP_BUTTON_ANTARBANK: '//android.widget.Button[@content-desc="PopUp Button - OK"]',
    LABEL_BERSHASIL_TRANSFER:'~PopUp Button - Bukti transaksi berhasil disimpan.',
    BACK_POPUP_BUTTON: '~PopUp Button - Back',
    PROGRESS_BAR: 'id=progressBar1',
    PROGRESS_BAR_CANCEL: 'id=button_dialog',
};

class TransferScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    get connectionState(){
        return $(SELECTORS.CONNECTION_STATE);
    }

    get progressBar() {
        return $(SELECTORS.PROGRESS_BAR);
    }

    get progressCancelBtn() {
        return $(SELECTORS.PROGRESS_BAR_CANCEL);
    }

    get btnSend() {
        return $(SELECTORS.SEND_BUTTON);
    }

    get btnDaftar() {
        return $(SELECTORS.DAFTAR_REKENING_LABEL);
    }

    get tfRekening() {
        return $(SELECTORS.REK1_TEXTFIELD);
    }

    get tfVA() {
        return $(SELECTORS.VA_ACCOUNT_CONTAINER);
    }

    get lblStatus() {
        return $(SELECTORS.STATUS_LABEL);
    }

    get btnTransferRekening() {
        return $(SELECTORS.TRANSFER_REKENING_LABEL);
    }

    get btnDaftarRekeningAntarBank() {
        return $(SELECTORS.DAFTAR_REKENING_ANTAR_BANK_LABEL);
    }

    get btnTransferRekeningAntarBank() {
        return $(SELECTORS.TRANSFER_REKENING_ANTAR_BANK_LABEL);
    }

    get btnTransferRekeningVA() {
        return $(SELECTORS.TRANSFER_REKENINGVA_LABEL);
    }

    get btnRekeningList() {
        return $(SELECTORS.REKENING_LIST_BUTTON);
    }
    get btnRekeningList2() {
        return $(SELECTORS.REKENING_LIST_BUTTON2);
    }

    get btnBankList() {
        return $(SELECTORS.BANK_LIST_BUTTON);
    }
    get btnNewRekBankSelection() {
        return $(SELECTORS.NEW_REK_BANK_SELECTION_BUTTON);
    }
   
    get btnRekeningListAntarBank() {
        return $(SELECTORS.REKENING_LIST_ANTAR_BANK_BUTTON);
    }
    get btnAmountAntarBank() {
        return $(SELECTORS.AMOUNT_ANTAR_BANK_BUTTON);
    }

    get btnTransferServiceList() {
        return $(SELECTORS.TRANSFER_SERVICE_BUTTON);
    }
    get btnTransferPurposeList() {
        return $(SELECTORS.TRANSFER_PURPOSE_BUTTON);
    }
    get transferPurposeSelection() {
        return $(SELECTORS.TRANSFER_PURPOSE_SELECTION);
    }

    get tfSearchRekening() {
        return $(SELECTORS.SEARCH_TEXTFIELD);
    }
    
    get lblPopupText() {
        return $(SELECTORS.TRANSFER_POPUP_TEXT);
    }

    get lblVAPopupText() {
        return $(SELECTORS.VA_POPUP_TEXT);
    }

    

    get lblName() {
        return $$(SELECTORS.NAMA_LABEL);
    }

    get btnAmount() {
        return $(SELECTORS.AMOUNT_BUTTON);
    }

    get btnAmount2() {
        return $(SELECTORS.AMOUNT_BUTTON2);
    }

    get tfInput() {
        return $(SELECTORS.INPUT_TEXTFIELD);
    }

    get btnOk() {
        return $(SELECTORS.OK_BUTTON);
    }

    get btnDesc() {
        return $(SELECTORS.DESC_BUTTON);
    }
    get btnDesc2() {
        return $(SELECTORS.DESC_BUTTON2);
    }

    get antarBankNewRekening() {
        return $(SELECTORS.ANTAR_BANK_NEW_REK_TEXTFIELD);
    }

    get btnDescAntarBank() {
        return $(SELECTORS.ANTAR_BANK_DESC_BUTTON);
    }

    get tfInputDesc() {
        return $(SELECTORS.DESC_TEXTFIELD);
    }

    get btnOkDesc() {
        return $(SELECTORS.OK_DESC_BUTTON);
    }

    get btnOkPopUp() {
        return $(SELECTORS.OK_POPUP_BUTTON);
    }

    get btnOkPopUp2() {
        return $(SELECTORS.OK_POPUP_BUTTON2);
    }

    get btnOkPopUpAntarBank() {
        return $(SELECTORS.OK_POPUP_BUTTON_ANTARBANK);
    }
    
    get btnBackPopUp() {
        return $(SELECTORS.BACK_POPUP_BUTTON);
    }

    get lblTextTransferBerhasil() {
        return $(SELECTORS.LABEL_BERSHASIL_TRANSFER);
    }
    enterRekening(rekening, pin){
        
        let isDone=false;

        while(!isDone){
            console.log(this.getFormattedTime()+"start new rekening");
            if(!this.btnDaftar.isDisplayed()){
                HomeScreen.clickButtonHome("");
                HomeScreen.clickButtonTransfer();
            }
            this.WaitForIndicator();
            ElementUtil.doClick(this.btnDaftar);
            driver.pause(400);

            while(this.progressBar.isDisplayed()){
                console.log(this.getFormattedTime()+"wait progress bar enter rekening 1");
                driver.pause(800);
                if(this.progressCancelBtn.isDisplayed()){
                    ElementUtil.doClick(this.progressCancelBtn);
                    driver.pause(300);
                }
            }
            if(this.lblVAPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed() ){
                ElementUtil.doClick(this.btnBackPopUp);
            }else{
                isDone=true;
            }
        }

        console.log(this.getFormattedTime()+"input no rekening");
        // Enter Nomor Rekening
        ElementUtil.doSetValue(this.tfRekening, rekening);

        isDone=false;
        while(!isDone){

            this.WaitForIndicator();
            console.log(this.getFormattedTime()+"send rekening 1");
            this.clickSendButton();
            driver.pause(400);

            while(this.progressBar.isDisplayed()){
                console.log(this.getFormattedTime()+"wait progress bar enter rekening 2");
                driver.pause(800);
                if(this.progressCancelBtn.isDisplayed()){
                    ElementUtil.doClick(this.progressCancelBtn);
                    driver.pause(300);
                }
            }
            if(this.lblVAPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed() ){
                ElementUtil.doClick(this.btnBackPopUp);
                continue;
            }
            isDone=true;
        }
        
        let waitCount=0;
        while(!this.lblStatus.isDisplayed() && waitCount<10){
            driver.pause(300);
            waitCount++;
        }

        if (this.lblStatus.getText() === "ALREADY REGISTERED"){
            driver.back();
            driver.back();
        }else{
            console.log(this.getFormattedTime()+"confirm rekening");

            this.WaitForIndicator();
            //pilih rekening
            this.clickLabelStatus();

            isDone=false;
            while(!isDone){
                console.log(this.getFormattedTime()+"send rekenin 2");
                this.WaitForIndicator();

                this.clickSendButton();
                driver.pause(400);
                let progressCancel=false;
                while(this.progressBar.isDisplayed()){
                    console.log(this.getFormattedTime()+"wait progress bar enter rekening 2");
                    driver.pause(800);
                    if(this.progressCancelBtn.isDisplayed()){
                        ElementUtil.doClick(this.progressCancelBtn);
                        driver.pause(300);
                        progressCancel=true;
                    }
                }
                if(this.lblVAPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed() ){
                    ElementUtil.doClick(this.btnBackPopUp);
                    continue;
                }
                if(progressCancel){
                    console.log(this.getFormattedTime()+"progress cancel 1");
                    continue;
                }
                console.log(this.getFormattedTime()+"masukin pin");
                PinScreen.tfPIN.setValue(pin);
                PinScreen.clickButtonOK();
                console.log(this.getFormattedTime()+"pin ok");
                driver.pause(400); 3990024811
                progressCancel=false;
                while(this.progressBar.isDisplayed()){
                    console.log(this.getFormattedTime()+"wait progress bar enter rekening 3");
                    driver.pause(800);
                    if(this.progressCancelBtn.isDisplayed()){
                        ElementUtil.doClick(this.progressCancelBtn);
                        driver.pause(300);
                        progressCancel=true;
                    }
                }
                if(this.lblVAPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed() ){
                    ElementUtil.doClick(this.btnBackPopUp);
                    continue;
                }
                if(progressCancel){
                    console.log(this.getFormattedTime()+"progress cancel pin");
                    continue;
                }
                isDone=true;

                console.log(this.getFormattedTime()+"done");
            }

            
            driver.back();
        }
    }

    transferRekening(){
        if(!this.btnTransferRekening.isDisplayed()){
            console.log(this.getFormattedTime()+"cannot open transfer rekening, reopen transfer menu");
            HomeScreen.clickButtonHome("");
            HomeScreen.clickButtonTransfer();
            this.transferRekening();
            return;
        }

        this.WaitForIndicator();
        console.log(this.getFormattedTime()+"open transfer rekening");
        ElementUtil.doClick(this.btnTransferRekening);

        while(this.progressBar.isDisplayed()){
            console.log(this.getFormattedTime()+"wait progress bar buka halaman transfer");
            driver.pause(800);
            if(this.progressCancelBtn.isDisplayed()){
                ElementUtil.doClick(this.progressCancelBtn);
                driver.pause(300);
                if(this.lblPopupText.isDisplayed()){
                    console.log(this.getFormattedTime()+"retry setelah progress bar, internet terputus");
                    ElementUtil.doClick(this.btnBackPopUp);
                    this.transferRekening()
                    return;
                }
            }
        }

        if(this.lblPopupText.isDisplayed() && this.lblPopupText.getText().toLowerCase().indexOf("indikator") !== -1 ){
            console.log(this.getFormattedTime()+"indikator transfer rekening");
            ElementUtil.doClick(this.btnBackPopUp);
            this.transferRekening()
            return;
        }
    }

    addNewRekeningAntarBankV3(name,bank,rekening,pin,access_token,id){

        let isDone=false;
        let laststep=0
        if(bank=="CIMB"){
            bank="CIMB NIAGA";
        }
        if(bank=="BANK NEO"){
            bank="BANK NEO COMMERCE";
        }
        while(!isDone){
            if(this.btnDaftarRekeningAntarBank.isDisplayed()){
                laststep=0;
            }
            if(laststep===0){
                ElementUtil.doClick(this.btnDaftarRekeningAntarBank);
                ElementUtil.doSetValue(this.antarBankNewRekening, rekening);
                ElementUtil.doClick(this.btnNewRekBankSelection);
                this.newBankSelectBank(bank);
                laststep=1;
            }
            driver.pause(500);
            this.WaitForIndicator();
            ElementUtil.doClick(this.btnSend);
            while(this.progressBar.isDisplayed()){
                console.log(this.getFormattedTime()+"wait progress bar 1");
                driver.pause(800);
                if(this.progressCancelBtn.isDisplayed()){
                    ElementUtil.doClick(this.progressCancelBtn);
                    driver.pause(300);
                    
                }
            }
            //check gagal indikator & retry
            if(this.lblVAPopupText.isDisplayed() && this.lblVAPopupText.getText().toLowerCase().indexOf("indikator")  && this.btnBackPopUp.isDisplayed()){
                
                if(!this.lblVAPopupText.getText().toLowerCase().indexOf("registered")){
                    ElementUtil.doClick(this.btnBackPopUp);
                    continue;
                }
            }
            
            if(this.checkBtnOkDisplayed()){
                console.log(this.getFormattedTime()+"okbutton");

                this.clickOkPopUpButton();
                //check gagal indikator & retry
                if(this.lblVAPopupText.isDisplayed()  && this.btnBackPopUp.isDisplayed()){
                    
                    ElementUtil.doClick(this.btnBackPopUp);
                    continue;
                }

                PinScreen.tfPIN.setValue(pin);
                PinScreen.clickButtonOK();

                while(this.progressBar.isDisplayed()){
                    console.log(this.getFormattedTime()+"wait progress bar pin");
                    driver.pause(800);
                    if(this.progressCancelBtn.isDisplayed()){
                        ElementUtil.doClick(this.progressCancelBtn);
                        driver.pause(300);
                    }
                }
                //check gagal indikator & retry
                if(this.lblVAPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed()){
                    
                    ElementUtil.doClick(this.btnBackPopUp);
                    continue;
                }
                
                this.clickOkPopUpButton();
            }else{
                if(this.btnBackPopUp.isDisplayed()){
                    console.log(this.getFormattedTime()+"back button");
                    ElementUtil.doClick(this.btnBackPopUp);
                    driver.pressKeyCode(4)
                }
            }
            isDone=true;
        }
        
    }

    transferRekeningAntarBank(){
        ElementUtil.doClick(this.btnTransferRekeningAntarBank);

        if(this.lblPopupText.isDisplayed() && this.lblPopupText.getText().toLowerCase().indexOf("indikator") !== -1 ){
                
            ElementUtil.doClick(this.btnBackPopUp);
            this.transferRekeningAntarBank()
            return;
        }
    }

    rekeningList(){
        try{
            ElementUtil.doClick(this.btnRekeningList);
            return;
        }catch(err){

        }
        try{
            ElementUtil.doClick(this.btnRekeningList2);
            return;
        }catch(err){

        }
    }

    enterRekeningList(rekening){
        console.log(this.getFormattedTime()+"select rekening");
        this.rekeningList();
        ElementUtil.doSetValue(this.tfSearchRekening, rekening);
        ElementUtil.doClick(this.lblName[0]);
        console.log(this.getFormattedTime()+"select rekening done");
    }

    enterAmount(amount){
        this.clickAmountButton();
        ElementUtil.doSetValue(this.tfInput, amount);
        this.clickOkButton();
    }

    enterDesc(desc,retrycount=0){
        console.log(this.getFormattedTime()+"enter description");
        this.clickDescButton();
        driver.pause(400);
        
        if(this.tfInputDesc.isDisplayed()){
            console.log(this.getFormattedTime()+"description input");
            ElementUtil.doSetValue(this.tfInputDesc, desc);
            this.clickOkDescButton();
            console.log(this.getFormattedTime()+"description done");
        }else if(this.btnDesc.isDisplayed() && retrycount<10){
            this.enterDesc(desc,retrycount+1);
        }
    }

    clickLabelStatus(){
        ElementUtil.doClick(this.lblStatus);
    }

    clickSendButton(){
        ElementUtil.doClick(this.btnSend);
    }

    clickAmountButton(){
        try{
            ElementUtil.doClick(this.btnAmount);
            return;
        }catch(err){

        }
        try{
            ElementUtil.doClick(this.btnAmount2);
            return;
        }catch(err){

        }
    }

    clickOkButton(){
        ElementUtil.doClick(this.btnOk);
    }

    clickDescButton(){
        try{
            ElementUtil.doClick(this.btnDesc);
            return;
        }catch(err){

        }
        try{
            ElementUtil.doClick(this.btnDesc2);
            return;
        }catch(err){
            
        }
    }

    clickOkButton(){
        ElementUtil.doClick(this.btnOk);
    }

    clickOkDescButton(){
        ElementUtil.doClick(this.btnOkDesc);
    }

    checkBtnOkDisplayed(){
        return this.btnOkPopUp.isDisplayed() || this.btnOkPopUp2.isDisplayed();
    }

    clickOkPopUpButton(){
        if(this.btnOkPopUp.isDisplayed()){
            ElementUtil.doClick(this.btnOkPopUp);
        }else if(this.btnOkPopUp2.isDisplayed()){
            ElementUtil.doClick(this.btnOkPopUp2);
        }
    }

    clickOkPopUpButtonAntarBank(){
        ElementUtil.doClick(this.btnOkPopUpAntarBank);
    }




    enterRekeningListAntarBank(rekening){
        ElementUtil.doClick(this.btnRekeningListAntarBank);
        ElementUtil.doSetValue(this.tfSearchRekening, rekening);
        ElementUtil.doClick(this.lblName[0]);
    }

    enterAmountAntarBank(amount){
        ElementUtil.doClick(this.btnAmountAntarBank);
        ElementUtil.doSetValue(this.tfInput, amount);
        this.clickOkButton();
    }

    selectBank(bank){
        ElementUtil.doClick(this.btnBankList);
        this.selectBankSelection(bank)
    }

    enterDescAntarBank(desc){
        ElementUtil.doClick(this.btnDescAntarBank);
        ElementUtil.doSetValue(this.tfInput, desc);
        this.clickOkButton();
    }


    newBankSelectBank(bank){
        $('android=new UiScrollable(new UiSelector().resourceIdMatches(\".*:id/share_list_1\").scrollable(true)).scrollIntoView(new UiSelector().text(\"'+bank+'\"))');

        const elem = $('//*[(//android.widget.RelativeLayout[@content-desc="list Nama Bank"])//android.widget.TextView and @text="'+bank+'"]');
        elem.click();

    }
    selectBankSelection(bank){
        ElementUtil.doClick($('//*[(//android.view.ViewGroup[@content-desc="list nomor handphone"])//android.widget.TextView and @text="'+bank+'"]'));
    }

    enterTransferServiceList(service){
        ElementUtil.doClick(this.btnTransferServiceList);
        this.selectTransferService(service);
        if(service==="BI FAST"){
            this.selectTransferPurpose();
        }
    }

    selectTransferService(service){
        ElementUtil.doClick($('//*[/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout[2]/android.widget.FrameLayout/android.view.ViewGroup/androidx.recyclerview.widget.RecyclerView/android.view.ViewGroup[1]/android.widget.TextView and @text="'+service+'"]'));
    }

    selectTransferPurpose(){
        ElementUtil.doClick(this.btnTransferPurposeList);
        ElementUtil.doClick(this.transferPurposeSelection);
    }

    checkTextRekening(pin){
        if (this.lblStatus.getText() === "ALREADY REGISTERED"){
            driver.back();
            driver.back();
        }else{
            this.clickLabelStatus();
            this.clickSendButton();

            //check popup indikator, retry send
            if(this.lblPopupText.isDisplayed() && this.lblPopupText.getText().toLowerCase().indexOf("indikator") !== -1 ){
                    
                ElementUtil.doClick(this.btnBackPopUp);
                checkTextRekening(pin);
                return;
            }

            PinScreen.tfPIN.setValue(pin);
            PinScreen.clickButtonOK();
            driver.back();
        }
    }

    setTransferRekeningV3(rekening, amount, pin, desc, access_token, id, isWD=false){
        try{
            var errorMsg="";
            var errorCode=-1;
            let retrycount=0;
            let isDone = false;
            let retryIndikator = false;
            while(!isDone){
                retrycount++;
                console.log(this.getFormattedTime()+"transfer BCA retry="+retrycount);
                
                if(!retryIndikator){
                    console.log(this.getFormattedTime()+"start input info");
                    this.transferRekening();
                    console.log(this.getFormattedTime()+"screen opened");
                    this.enterDesc(desc);
                    this.enterRekeningList(rekening);
                    this.enterAmount(amount);
                    driver.pause(1000);
                    retryIndikator = true;
                    console.log(this.getFormattedTime()+"done input info");
                }

                console.log(this.getFormattedTime()+"send 1");
                if(!this.btnSend.isDisplayed()){
                    if(this.lblVAPopupText.isDisplayed()){
                        errorMsg=this.lblVAPopupText.getText();
                    }
                    if(this.lblPopupText.isDisplayed()){
                        errorMsg=this.lblPopupText.getText();
                    }
                    console.log(this.getFormattedTime()+"send button ga kelihatan")
                    if(errorMsg==""){
                        retryIndikator = false;
                        continue;
                    }else{
                        console.log(this.getFormattedTime()+"send button ga kelihatan")
                    }
                }
                if(errorMsg==""){
                    this.WaitForIndicator();
                    this.clickSendButton();
                    let progressCancel=false;
                    while(this.progressBar.isDisplayed()){
                        console.log(this.getFormattedTime()+"wait progress bar 1");
                        driver.pause(800);
                        if(this.progressCancelBtn.isDisplayed()){
                            ElementUtil.doClick(this.progressCancelBtn);
                            driver.pause(300);
                            progressCancel=true;
                        }
                    }
                    if(progressCancel){
                        console.log(this.getFormattedTime()+"progress cancel 1");
                        continue;
                    }
    
                    //check popup indikator, retry send
                    if(this.lblVAPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed()){
                            
                        ElementUtil.doClick(this.btnBackPopUp);
                        console.log(this.getFormattedTime()+"retry send 1");
                        continue;
                    }
    
                    console.log(this.getFormattedTime()+"confirm");

                    this.clickOkPopUpButton();
                    progressCancel=false;
                    while(this.progressBar.isDisplayed()){
                        console.log(this.getFormattedTime()+"wait progress bar 1");
                        driver.pause(800);
                        if(this.progressCancelBtn.isDisplayed()){
                            ElementUtil.doClick(this.progressCancelBtn);
                            driver.pause(300);
                            progressCancel=true;
                        }
                    }
    
                    //check popup indikator, retry send
                    if(this.lblVAPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed()){
                            
                        ElementUtil.doClick(this.btnBackPopUp);
                        console.log(this.getFormattedTime()+"retry confirm rekening");
                        continue;
                    }
                    if(progressCancel){
                        console.log(this.getFormattedTime()+"progress cancel 2");
                        continue;
                    }
    
    
                    //PinScreen.tfPIN.setValue(pin);
                    
                    if(Date.now()-global.startTime>270000){
                        throw new Error("lewat batas waktu");
                    }else{
                        console.log(this.getFormattedTime()+"sampai pin dalam "+(Date.now()-global.startTime)+"ms");
                    }
                    console.log(this.getFormattedTime()+"start pin");
                    PinScreen.tapByPin(pin);
    
                    //PinScreen.clickButtonOK();
                    console.log(this.getFormattedTime()+"send pin");
    
                    while(this.progressBar.isDisplayed()){
                        console.log(this.getFormattedTime()+"wait progress bar pin");
                        driver.pause(800);
                        if(this.progressCancelBtn.isDisplayed()){
                            ElementUtil.doClick(this.progressCancelBtn);
                            driver.pause(300);
                        }
                    }
    
                    //check popup indikator, retry send
                    if(this.lblVAPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed()){
                            
                        ElementUtil.doClick(this.btnBackPopUp);
                        console.log(this.getFormattedTime()+"retry setelah pin");
                        continue;
                    }
    
                    console.log(this.getFormattedTime()+"transfer done");
    
                    //stop loop indikator
                    isDone=true;
    
                    var isSucceed=false;
                    let waitCount=0;
    
                    while(!this.lblPopupText.isDisplayed() && !this.lblVAPopupText.isDisplayed()&& waitCount<10){
                        console.log(this.getFormattedTime()+"wait for popup berhasil")
                        driver.pause(500);
                        waitCount++;
                    }
                    
                }
                
    
                const imagePath = 'tests/screenshot/bca/test.png';
                if(!this.lblPopupText.isDisplayed() && !this.lblVAPopupText.isDisplayed()){
                    imagePath = 'tests/screenshot/bca/test'+id+'.png';
                }
                APIUtil.saveScreenshot(driver,imagePath);
                console.log(this.getFormattedTime()+"screenshoted");

                if(this.lblPopupText.isDisplayed()){
                    console.log(this.getFormattedTime()+"popup display1");
                    if(this.lblPopupText.getText().toLowerCase().indexOf("berhasil") !== -1 ){
                        isSucceed=true;
                    }else{
                        errorMsg=this.lblPopupText.getText();
                        errorCode=3;
                    }
                }else if(this.lblVAPopupText.isDisplayed()){
                    console.log(this.getFormattedTime()+"popup display2");
                    if(this.lblVAPopupText.getText().toLowerCase().indexOf("berhasil") !== -1 ){
                        isSucceed=true;
                    }else{
                        errorMsg=this.lblVAPopupText.getText();
                        errorCode=3;
                    }
                }
                console.log(isSucceed+errorMsg);
                
                if(isWD){
                    const upload = APIUtil.updateActuatorTransferTaskDetached(access_token, imagePath, id, isSucceed, errorMsg,errorCode); //TO DO di sesuaikan dengan status dan message error
                    upload.then(response => {
                        console.log(JSON.stringify(response, null, 2));
                    });
                }else{
                    const upload = APIUtil.updateFlushInstructionDetached(access_token, imagePath, amount, id, isSucceed, errorMsg); //TO DO di sesuaikan dengan status dan message error
                    upload.then(response => {
                        console.log(JSON.stringify(response, null, 2));
                    });
                }

                //Tutup Close Pop Up Transfer
                this.clickOkPopUpButton();
            }
        }catch(err){
            let errTask="tf";
            if(!isWD){
                errTask="fl";
            }
            console.log(this.getFormattedTime()+"err "+errTask+" task "+id +" error" + err);
            console.error(err.stack);

            const imagePath = 'tests/errscreenshot/bca/'+errTask+" "+id+'.png';
            APIUtil.saveScreenshot(driver,imagePath);

        }
    }

    openVAScreen(){
        if(!this.btnTransferRekeningVA.isDisplayed()){

            HomeScreen.clickButtonHome("");
            HomeScreen.clickButtonTransfer();
            this.openVAScreen();
            return;
        }
        ElementUtil.doClick(this.btnTransferRekeningVA);

        while(this.progressBar.isDisplayed()){
            console.log(this.getFormattedTime()+"wait progress bar buka halaman transfer");
            driver.pause(800);
            if(this.progressCancelBtn.isDisplayed()){
                ElementUtil.doClick(this.progressCancelBtn);
                driver.pause(300);
                if(this.lblPopupText.isDisplayed()){
                        
                    ElementUtil.doClick(this.btnBackPopUp);
                    console.log(this.getFormattedTime()+"retry setelah progress bar, internet terputus");
                    this.openVAScreen()
                    return;
                }
            }
        }

        if(this.lblPopupText.isDisplayed() && this.lblPopupText.getText().toLowerCase().indexOf("indikator") !== -1 ){
                
            ElementUtil.doClick(this.btnBackPopUp);
            this.openVAScreen()
            return;
        }

    }

    setTransferRekeningVAV2(rekening, amount, pin, desc, access_token, id,isWD=false){
        try{
            let retrycount=0;
            let isDone = false;
            let retryIndikator = false;
            let isSucceed=false;
            let errorMsg="";
            let errorCode=-1;
            while(!isDone){
                retrycount++;
                console.log(this.getFormattedTime()+"transfer VA retry="+retrycount);
                if(!retryIndikator){
                    this.openVAScreen();
                    driver.pause(500);
                    console.log(this.getFormattedTime()+"start input rekening");
                    ElementUtil.doClick(this.tfVA);
        
                    // Enter Nomor Rekening
                    ElementUtil.doSetValue(this.tfInputDesc, rekening);
                    this.clickOkDescButton();
                    console.log(this.getFormattedTime()+"done input rekening");
                    retryIndikator = true;
                }
                console.log(this.getFormattedTime()+"send 1");
                
                if(!this.btnSend.isDisplayed()){
                    let popupmsg="";
                    if(this.lblVAPopupText.isDisplayed()){
                        popupmsg=this.lblVAPopupText.getText();
                    }
                    if(this.lblPopupText.isDisplayed()){
                        popupmsg=this.lblPopupText.getText();
                    }
                    if(!popupmsg.includes("indikator")){
                        isDone=true
                        errorMsg = popupmsg;
                        errorCode=3;
                    }
                    console.log(this.getFormattedTime()+"send button ga kelihatan")
                    retryIndikator = false;
                    continue;
                }

                this.WaitForIndicator();
                this.clickSendButton();

                let progressCancel=false;
                while(this.progressBar.isDisplayed()){
                    console.log(this.getFormattedTime()+"wait progress bar 1");
                    driver.pause(800);
                    if(this.progressCancelBtn.isDisplayed()){
                        ElementUtil.doClick(this.progressCancelBtn);
                        driver.pause(300);
                        progressCancel=true;
                    }
                }
                //tunggu pop up muncul dulu
                driver.pause(1000)
                if(this.lblVAPopupText.isDisplayed() ){
                    console.log(this.getFormattedTime()+"popup display");
                    if(this.lblVAPopupText.getText().toLowerCase().indexOf("tidak") !== -1){
                        isDone=true
                        errorMsg="account not found";
                        errorCode=1;
                        console.log(errorMsg);
                        continue;
                    }else if(this.btnBackPopUp.isDisplayed()){
                        ElementUtil.doClick(this.btnBackPopUp);
                        console.log(this.getFormattedTime()+"retry indikator send 1")
                        continue;
                    }
                        
                }

                if(progressCancel){
                    console.log(this.getFormattedTime()+"progress cancel 1");
                    continue;
                }
                console.log(this.getFormattedTime()+"cofirm account");
    
                this.clickOkPopUpButton();
                if(this.lblVAPopupText.isDisplayed() && this.lblVAPopupText.getText().toLowerCase().indexOf("indikator") !== -1 ){
                        
                    ElementUtil.doClick(this.btnBackPopUp);
                    console.log(this.getFormattedTime()+"retry indikator send confirm va")
                    continue;
                }
                if(this.lblVAPopupText.isDisplayed() && this.lblVAPopupText.getText().toLowerCase().indexOf("gagal") !== -1 ){
                    isDone=true
                    errorMsg="gagal";
                    errorCode=3;
                    continue;
                }
                while(!this.tfInput.isDisplayed()){
                    this.clickOkPopUpButton();
                    driver.pause(400);
                }
                console.log(this.getFormattedTime()+"input nominal");
                ElementUtil.doSetValue(this.tfInput, amount);
                this.clickOkButton();
                progressCancel=false;
                while(this.progressBar.isDisplayed()){
                    console.log(this.getFormattedTime()+"wait progress bar 2");
                    driver.pause(800);
                    if(this.progressCancelBtn.isDisplayed()){
                        ElementUtil.doClick(this.progressCancelBtn);
                        driver.pause(300);
                        progressCancel=true;
                    }
                }
                //tunggu pop up muncul dulu
                driver.pause(1000)
                if(this.lblVAPopupText.isDisplayed() && this.lblVAPopupText.getText().toLowerCase().indexOf("indikator") !== -1 ){
                        
                    ElementUtil.doClick(this.btnBackPopUp);
                    console.log(this.getFormattedTime()+"retry indikator send nominal")
                    continue;
                }

                if(progressCancel){
                    console.log(this.getFormattedTime()+"progress cancel 2");
                    continue;
                }
                console.log(this.getFormattedTime()+"confirm nominal");

                this.clickOkPopUpButton();
                progressCancel=false;
                while(this.progressBar.isDisplayed()){
                    console.log(this.getFormattedTime()+"wait progress bar 3");
                    driver.pause(800);
                    if(this.progressCancelBtn.isDisplayed()){
                        ElementUtil.doClick(this.progressCancelBtn);
                        driver.pause(300);
                        progressCancel=true;
                    }
                }
                driver.pause(500)
                if(this.lblVAPopupText.isDisplayed() && this.lblVAPopupText.getText().toLowerCase().indexOf("indikator") !== -1 ){
                        
                    ElementUtil.doClick(this.btnBackPopUp);
                    console.log(this.getFormattedTime()+"retry indikator sebelum pin")
                    continue;
                }
                if(progressCancel){
                    console.log(this.getFormattedTime()+"progress cancel 3");
                    continue;
                }

                //PinScreen.tfPIN.setValue(pin);

                if(Date.now()-global.startTime>270000){
                    throw new Error("lewat batas waktu");
                }else{
                    console.log(this.getFormattedTime()+"sampai pin dalam "+(Date.now()-global.startTime)+"ms");
                }
                console.log(this.getFormattedTime()+"input pin");
                PinScreen.tapByPin(pin);

                //PinScreen.clickButtonOK();
                console.log(this.getFormattedTime()+"pin ok");
                progressCancel=false;
                while(this.progressBar.isDisplayed()){
                    console.log(this.getFormattedTime()+"wait progress bar 4");
                    driver.pause(800);
                    if(this.progressCancelBtn.isDisplayed()){
                        //ElementUtil.doClick(this.progressCancelBtn);
                        driver.pause(300);
                        progressCancel=true;
                    }
                }
                driver.pause(1000)
                if(this.lblVAPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed() && 
                (this.lblVAPopupText.getText().toLowerCase().indexOf("gagal") || this.lblVAPopupText.getText().toLowerCase().indexOf("lagi"))){
                    console.log(this.lblVAPopupText.getText());
                    ElementUtil.doClick(this.btnBackPopUp);
                    console.log(this.getFormattedTime()+"retry indikator setelah pin")
                    continue;
                }

                if(this.lblPopupText.isDisplayed()){
                    console.log(this.getFormattedTime()+"popup display1");
                    console.log(this.lblPopupText.getText());
                    if(this.lblPopupText.getText().toLowerCase().indexOf("berhasil") !== -1 ){
                        isSucceed=true;
                        progressCancel=false;
                    }else{
                        errorMsg=this.lblPopupText.getText();
                        errorCode=3;
                    }
                }else if(this.lblVAPopupText.isDisplayed()){
                    console.log(this.getFormattedTime()+"popup display2");
                    console.log(this.lblVAPopupText.getText());
                    if(this.lblVAPopupText.getText().toLowerCase().indexOf("berhasil") !== -1 ){
                        isSucceed=true;
                        progressCancel=false;
                    }else{
                        errorMsg=this.lblVAPopupText.getText();
                        errorCode=3;
                    }
                }
                
                if(progressCancel){
                    console.log(this.getFormattedTime()+"progress cancel pin assume success");
                    isSucceed=true;
                    driver.pause(3000);
                    //continue;
                }

                console.log(this.getFormattedTime()+"transfer done");
                isDone=true;
            }
            const imagePath = 'tests/screenshot/bca/test.png';
            APIUtil.saveScreenshot(driver,imagePath);
            if(isWD){
                const upload = APIUtil.updateActuatorTransferTaskDetached(access_token, imagePath, id, isSucceed, errorMsg,errorCode); //TO DO di sesuaikan dengan status dan message error
                upload.then(response => {
                    console.log(JSON.stringify(response, null, 2));
                });
            }else{
                const upload = APIUtil.updateFlushInstructionDetached(access_token, imagePath, amount, id, isSucceed, errorMsg); //TO DO di sesuaikan dengan status dan message error
                upload.then(response => {
                    console.log(JSON.stringify(response, null, 2));
                });
            }
            
            this.clickOkPopUpButton();
    
        }catch(err){
            let errTask="tf";
            if(!isWD){
                errTask="fl";
            }
            console.log(this.getFormattedTime()+"err "+errTask+" task "+id +" error" + err);
            console.error(err.stack);

            const imagePath = 'tests/errscreenshot/bca/'+errTask+" "+id+'.png';
            APIUtil.saveScreenshot(driver,imagePath);

        }
        
    }

    setTransferRekeningAntarBankV4(name,bank,rekening, amount, pin, desc, access_token, id, isWD=false){
        try{
            let retrycount=0;
            let isDone=false;
            let retryIndikator=false;
            let BIFastFailed=false;
            let errorMsg="";
            let errorCode=-1;
            while(!isDone){
                retrycount++;
                console.log(this.getFormattedTime()+"transfer antar bank retry="+retrycount);
                if(!retryIndikator){
                    let transferService = "BI FAST";
                    if(BIFastFailed){
                        transferService = "Realtime Online";
                    }
                    console.log(this.getFormattedTime()+"input rekening");
                    this.addNewRekeningAntarBankV3(name,bank,rekening,pin,access_token,id);
                    console.log(this.getFormattedTime()+"start transfer");
                    this.transferRekeningAntarBank();
                    if(this.btnBackPopUp.isDisplayed()){
                        errorMsg=this.lblPopupText.getText();
                        errorCode=3;
                        isDone=true;
                        continue;
                    }
                    this.selectBank(bank);
                    this.enterRekeningListAntarBank(rekening);
                    this.enterAmountAntarBank(amount);
                    this.enterTransferServiceList(transferService);
                    console.log(this.getFormattedTime()+"done input info");
                    retryIndikator=true;
                }
                console.log(this.getFormattedTime()+"send 1");

                if(!this.btnSend.isDisplayed()){
                    let popupmsg="";
                    if(this.lblVAPopupText.isDisplayed()){
                        popupmsg=this.lblVAPopupText.getText();
                    }
                    if(this.lblPopupText.isDisplayed()){
                        popupmsg=this.lblPopupText.getText();
                    }
                    if(!popupmsg.includes("indikator")){
                        isDone=true
                        errorMsg = popupmsg;
                        errorCode=3;
                    }
                    console.log(this.getFormattedTime()+"send button ga kelihatan")
                    retryIndikator = false;
                    continue;
                }

                this.WaitForIndicator();
                this.clickSendButton();
                let progressCancel=false;
                while(this.progressBar.isDisplayed()){
                    console.log(this.getFormattedTime()+"wait progress bar 1");
                    driver.pause(800);
                    if(this.progressCancelBtn.isDisplayed()){
                        console.log(this.getFormattedTime()+"progress cancel");
                        ElementUtil.doClick(this.progressCancelBtn);
                        driver.pause(300);
                        progressCancel=true;
                    }
                }
                if(progressCancel){
                    console.log(this.getFormattedTime()+"cancel progress cancel");
                    if(!this.btnOkPopUpAntarBank.isDisplayed()){
                        continue;
                    }
                }
                //tunggu pop up muncul dulu
                driver.pause(1000)

                //check gagal indikator & retry loop
                if(this.lblPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed()){
                        
                    ElementUtil.doClick(this.btnBackPopUp);
                    console.log(this.getFormattedTime()+"retry send 1");
                    continue;
                }
                var isSucceed=false;
                //cek kalau ada popup gagal sebelum masukin pin
                if(!this.btnOkPopUpAntarBank.isDisplayed() && (this.lblPopupText.getText().toLowerCase().indexOf("gagal") !== -1 || this.lblPopupText.getText().toLowerCase().indexOf("salah") !== -1)){
                    isSucceed=false;
                    errorMsg=this.lblPopupText.getText();
                    errorCode=3;
                    console.log(this.lblPopupText.getText());
                }else{
                    //check nama rekening
                    if(isWD && this.lblPopupText.getText().toLowerCase().indexOf(name.toLowerCase()) === -1 ){
                        isSucceed=false;
                        errorMsg="account name mismatch";
                        errorCode=4;
                        const imagePath = 'tests/screenshot/bca/test.png';
                        APIUtil.saveScreenshot(driver,imagePath);
                        
                    }else{
                        let noRetry=false;
                        try{
                            console.log(this.getFormattedTime()+"confirm");
                            this.clickOkPopUpButtonAntarBank();
                
                            //check gagal indikator & retry
                            if(this.lblPopupText.isDisplayed() && this.lblPopupText.getText().toLowerCase().indexOf("indikator") !== -1 ){
                                console.log(this.getFormattedTime()+"retry confirm rekening");
                                throw new Error("indikator merah");
                            }
                            
                            //PinScreen.tfPINAntarBank.setValue(pin);

                            if(Date.now()-global.startTime>270000){
                                return;
                                //throw new Error("lewat batas waktu");
                            }else{
                                console.log(this.getFormattedTime()+"sampai pin dalam "+(Date.now()-global.startTime)+"ms");
                            }
                            console.log(this.getFormattedTime()+"input pin");

                            PinScreen.tapByPin(pin);

                            //PinScreen.clickButtonOKAntarBank();
                            
                            console.log(this.getFormattedTime()+"send pin");
                            
                            while(this.progressBar.isDisplayed()){
                                console.log(this.getFormattedTime()+"wait progress bar pin");
                                driver.pause(800);
                                if(this.progressCancelBtn.isDisplayed()){
                                    ElementUtil.doClick(this.progressCancelBtn);
                                    driver.pause(300);
                                }
                            }
                            //check gagal indikator & retry
                            if(this.lblPopupText.isDisplayed() && this.btnBackPopUp.isDisplayed()){
                                console.log(this.getFormattedTime()+"retry setelah pin");
                                throw new Error("indikator merah");
                            }
                        
                        }catch(err){
                            console.error('Error happened, retry:', err);
                            driver.pressKeyCode(4);
                            continue;
                        }

                        isDone=true;
                        console.log(this.getFormattedTime()+"done");

                        this.lblPopupText.waitForDisplayed();
                        if(this.lblPopupText.getText().toLowerCase().indexOf("berhasil") !== -1 ){
                            isSucceed=true;
                        }else{
                            if(errorMsg=="" && this.lblPopupText.isDisplayed()){
                                errorMsg=this.lblPopupText.getText();
                                errorCode=3;
                            }
                        }
                    }
                }
            }
            const imagePath = 'tests/screenshot/bca/test.png';
            APIUtil.saveScreenshot(driver,imagePath);
            //Block Kode untuk POST dan Upload Image Data Transfer
            driver.pause(600)

            if(isWD){
                const upload = APIUtil.updateActuatorTransferTaskDetached(access_token, imagePath, id, isSucceed, errorMsg,errorCode); //TO DO di sesuaikan dengan status dan message error
                upload.then(response => {
                    console.log(JSON.stringify(response, null, 2));
                });
            }else{
                const upload = APIUtil.updateFlushInstructionDetached(access_token, imagePath, amount, id, isSucceed, errorMsg); //TO DO di sesuaikan dengan status dan message error
                upload.then(response => {
                    console.log(JSON.stringify(response, null, 2));
                });
            }

            if(isSucceed){
                isDone=true;
                //Tutup Close Pop Up Transfer
                this.clickOkPopUpButton();
            }else{
                ElementUtil.doClick(this.btnBackPopUp);
                driver.pressKeyCode(4);
            }
    
        }catch(err){
            let errTask="tf";
            if(!isWD){
                errTask="fl";
            }
            console.log(this.getFormattedTime()+"err "+errTask+" task "+id +" error" + err);
            console.error(err.stack);

            const imagePath = 'tests/errscreenshot/bca/'+errTask+" "+id+'.png';
            APIUtil.saveScreenshot(driver,imagePath);

        }
        
        

    }

    finalCheckOnTimeout(id, isWD=false){
        let isSucceed=false;
        let errorMsg="";

        while(this.progressBar.isDisplayed()){
            console.log(this.getFormattedTime()+"finalcheck wait progress bar pin");
            driver.pause(800);
            if(this.progressCancelBtn.isDisplayed()){
                ElementUtil.doClick(this.progressCancelBtn);
                driver.pause(300);
                return;
            }
        }

        if(this.lblPopupText.isDisplayed()){
            console.log(this.getFormattedTime()+"finalcheck popup display1");
            if(this.lblPopupText.getText().toLowerCase().indexOf("berhasil") !== -1 ){
                isSucceed=true;
            }
        }else if(this.lblVAPopupText.isDisplayed()){
            console.log(this.getFormattedTime()+"finalcheck popup display2");
            if(this.lblVAPopupText.getText().toLowerCase().indexOf("berhasil") !== -1 ){
                isSucceed=true;
            }
        }
        if(isSucceed){
            if(isWD){
                const upload = APIUtil.updateActuatorTransferTaskDetached(access_token, imagePath, id, isSucceed, errorMsg); //TO DO di sesuaikan dengan status dan message error
                upload.then(response => {
                    console.log(JSON.stringify(response, null, 2));
                });
            }else{
                const upload = APIUtil.updateFlushInstructionDetached(access_token, imagePath, amount, id, isSucceed, errorMsg); //TO DO di sesuaikan dengan status dan message error
                upload.then(response => {
                    console.log(JSON.stringify(response, null, 2));
                });
            }
        }
        
    }

     scrollElementV2(yCoordinate) {
        driver.touchAction([
            { action: 'press', x: 520, y: 1550 },
            { action: 'wait', ms: 150 },
            { action: 'moveTo', x: 520, y: yCoordinate },
            { action: 'release' }
          ]);
      }


    WaitForIndicator(){
        let connectionStateNow = this.connectionState.getAttribute('contentDescription');
        while(connectionStateNow!=="Green_Indicator"){
            connectionStateNow = this.connectionState.getAttribute('contentDescription');
            if(connectionStateNow==null){
                driver.pause(1000);
                continue;
            }
            console.log('wait for green indicator, now '+connectionStateNow);
            driver.pause(500);
        }
        console.log(this.getFormattedTime()+"indicator is green");
    }

    getFormattedTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
        const year = now.getFullYear();
    
        return `[${hours}:${minutes}:${seconds} ${day}-${month}-${year}] `;
    }

}

module.exports = new TransferScreen();