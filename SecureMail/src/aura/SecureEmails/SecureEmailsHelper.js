({
	 
	sendHelper: function(component, toAdd, cCAdd, subject,body,attcv) {
    var action = component.get("c.sendMail");
       debugger;
       action.setParams({
            'mMail': toAdd,
            'cC': cCAdd,
            'mSubject': subject,
            'mbody': body,
            'att':attcv
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                
                component.set("v.mailStatus", true);
            }
 
        });
        $A.enqueueAction(action);
    },
    
    
   	MAX_FILE_SIZE: 4500000, 
    CHUNK_SIZE: 750000,      
    
    uploadHelper: function(component, event) {
       
        component.set("v.showLoadingSpinner", true);
       	debugger;
        var fileInput = component.find("fileId").get("v.files");
        
        var file = fileInput[0];
        var self = this;
       
        if (file.size > self.MAX_FILE_SIZE) {
            component.set("v.showLoadingSpinner", false);
            component.set("v.fileName", 'Alert : File size cannot exceed ' + self.MAX_FILE_SIZE + ' bytes.\n' + ' Selected file size: ' + file.size);
            return;
        }
 
        var objFileReader = new FileReader();
          
        objFileReader.onload = $A.getCallback(function() {
            var fileContents = objFileReader.result;
            var base64 = 'base64,';
            var dataStart = fileContents.indexOf(base64) + base64.length;
 
            fileContents = fileContents.substring(dataStart);
           	
            self.uploadProcess(component, file, fileContents);
        });
 
        objFileReader.readAsDataURL(file);
    },
 
    uploadProcess: function(component, file, fileContents) {
        
        var startPosition = 0;
        
        var endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
 
       
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, null);
    },
 
 
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachFile) {
      
        var getchunk = fileContents.substring(startPosition, endPosition);
       	var action = component.get("c.saveChunk");
        action.setParams({
            parentId: component.get("v.parentId"),
            fileName: file.name,
            base64Data: getchunk,
            contentType: file.type,
            file: attachFile
        });
 
       
        action.setCallback(this, function(response) {
           
            attachFile = response.getReturnValue();
            var state = response.getState();
            if (state === "SUCCESS") {
             	component.set("v.attach",attachFile);
                //debugger;
                
                //console.log('attachFile'+attachFile);
                
               	startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition,attachId);
                } else {
                    alert('your File is uploaded successfully');
                    component.set("v.showLoadingSpinner", false);
                }
               
            } else if (state === "INCOMPLETE") {
                alert("From server: " + response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        
        $A.enqueueAction(action);
    }
         
})