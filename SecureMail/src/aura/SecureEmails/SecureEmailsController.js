({
    sendEmail:function(component, event, helper){
      var toAdd =  component.get("v.myEmail.spInfo_Test__To__c");
      var cCAdd =  component.get("v.myEmail.spInfo_Test__Cc__c");
      var subject = component.get("v.myEmail.spInfo_Test__Subject__c");
      var message =  component.get("v.myEmail.spInfo_Test__Message__c");
      var attcv=component.get("v.attach");
    
        if ($A.util.isEmpty(toAdd) || !toAdd.includes("@")) {
            alert('Please Enter valid Email Address');
            
        } else {
           
                helper.sendHelper(component, toAdd, cCAdd, subject,message,attcv);
            
            
        }
      
    },
    
    closeMessage: function(component, event, helper){
        component.set("v.myEmail.spInfo_Test__To__c",null);
      	component.set("v.myEmail.spInfo_Test__Cc__c",null);
      	component.set("v.myEmail.spInfo_Test__Subject__c",null);
      	component.set("v.myEmail.spInfo_Test__Message__c",null);
        component.set("v.mailStatus", false);
        
    },
    
    
    
    doSave: function(component, event, helper) {
      
        
        if (component.find("fileId").get("v.files").length > 0) {
            helper.uploadHelper(component, event/*,toAdd, cCAdd, subject,message*/);
        } else {
            alert('Please Select a Valid File');
        }
        
    },
 	
    handleFilesChange: function(component, event, helper) {
        var fileName = 'No File Selected..';
        if (event.getSource().get("v.files").length > 0) {
            fileName = event.getSource().get("v.files")[0]['name'];
        }
        component.set("v.fileName", fileName);
    },
    
})