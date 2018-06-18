public class MyEmailSendController {
    
   
    static Attachment oAttachment =new Attachment();
    static Id[] attachId=null;
    @AuraEnabled
    public static Attachment saveChunk(Id parentId, String fileName, String base64Data, String contentType, Attachment file) {
        
        if (file == null) {
            oAttachment = saveTheFile(parentId, fileName, base64Data, contentType);
             
        } else {
            appendToFile(file, base64Data);
        }
 		
        return oAttachment;
    
    }
 
    public static Attachment saveTheFile(Id parentId, String fileName, String base64Data, String contentType) {
        
      
       
      	base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
 		oAttachment.Body = EncodingUtil.base64Decode(base64Data);
        System.debug('oAttachment.Body1 '+oAttachment.Body.toString());
        oAttachment.Name = fileName;
        oAttachment.ContentType = contentType;
 		
        return oAttachment;
 		
    }
 
    private static void appendToFile(Attachment file, String base64Data) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
 
 
        String existingBody = EncodingUtil.base64Encode(file.Body);
 
        file.Body = EncodingUtil.base64Decode(existingBody + base64Data);
 
        update file;
    }
    
    
    
    
    
	@AuraEnabled 
    public static void sendMail(String mMail ,String cC ,String mSubject ,String mbody,Attachment att){
    	 System.debug('att '+att);
     List<Messaging.SingleEmailMessage> mails =  new List<Messaging.SingleEmailMessage>();     
  
       oAttachment=att;
      
       Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    
    	List<String> sendTo = new List<String>();
       	sendTo.add(mMail);
       
    	
        
        
 		if(cC.containsWhitespace()){
     	    	cC=cC.deleteWhitespace();
        }
        if(cC.containsAny(',')){
                if(cC.endsWith(',')){ 
                   cC=cC.removeEnd(',');
                }
                if(cC.startsWith(',')){ 
                   cC= cC.removeStart(',');
                   
                }
         }
            
       List<String>	ccAdd = new List<String>();
        if(cC.containsAny(',')){
            for(String strCc : cC.split(',')){
           		ccAdd.add(strCc); 
           	}
        }else{
            ccAdd.add(cC); 
        }
        
        spInfo_Test__MyEmail__c eMail=new spInfo_Test__MyEmail__c(To__c=mMail,Cc__c=cC,Subject__c=mSubject,Message__c=mbody);
        insert eMail; 
       
       	System.debug('eMail.Id :'+eMail.Id+' & attachment :'+oAttachment);
        
        oAttachment.ParentId=eMail.Id;
        upsert oAttachment;
      	List<Id> SetAdd= new List<Id>();
        SetAdd.add(oAttachment.Id);
        attachId=new Id[]{oAttachment.Id};
        mail.setToAddresses(sendTo);
    	mail.setCcAddresses(ccAdd);	
        mail.setReplyTo('abhijeetrathod33@outlook.com');
        mail.setSenderDisplayName('Abhijeet Rathod'); 
    	mail.setSubject(mSubject);
   		if(oAttachment!=null){
            
             mail.setEntityAttachments(SetAdd);
        }
      
       	
      	mail.setHtmlBody(mbody);
    	mails.add(mail);
    	Messaging.sendEmail(mails);
        
   }
}