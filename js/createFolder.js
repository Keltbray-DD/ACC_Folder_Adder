async function createFolderStructure(){
    submitBtn.style.display = "none"
    try {
        access_token = await getAccessToken("data:create data:write data:read");
    } catch {
        console.log("Error: Getting Access Token");
    }
    newProjectName = $("#input_subprojectname").val()
    console.log(newProjectName)
    console.log(arraySelectedContractorArray)
    topFolderData = await createFolder(newProjectName,topFolder,"N")

    console.log(topFolderData)
    var newProjectFolderId = topFolderData.data.id
    newFolderLink = topFolderData.data.links.webView.href
    console.log("newFolderLink", newFolderLink)
    console.log("newProjectFolderId", newProjectFolderId)

    await createSubFolders(projectFolderStructure,newProjectFolderId)
    console.log("createdFolders", createdFolders)
    const subContratorFolderId = createdFolders.find(element => element.folderName === "0D.SUB-CONTRACTORS")
    await createSubContracterFolders(arraySelectedContractorArray,subContratorFolderId.folderId)


    await searchAndPerformAction(createdFolders);
    await addWebhooksToFolders(webhookFolders);

    newFolderLinkBtn.style.display = "block"


    alert("Project creation complete please go to ACC to see your project, please note you still need to apply the naming standard to the relevant folders")
}

function openFolderLink(){
    window.open(newFolderLink, '_blank').focus();
}

async function createSubContracterFolders(folderArray,parentFolderId) {
    for (const folder of folderArray) {

            try {
                const subFolderData = await createFolder(folder, parentFolderId);
                console.log(subFolderData);
                console.log(subFolderData.data.id);
                await createFolder("WIP", subFolderData.data.id);

                console.log(folder + " created");
                statusElement.innerHTML = `<p> ${folder+ " created"}</p>`
                createdFolders.push({folderName:folder,folderId:subFolderData.data.id})
            } catch (error) {
                console.error("Error creating subfolder:", folder, error);
            }
    }
}

async function createSubFolders(folderArray,newProjectFolderId) {
    for (const folder of folderArray) {
        if (folder.parentFolder == "TOP_FOLDER") {
            try {
                const subFolderData = await createFolder(folder.folder, newProjectFolderId, folder.requireNS);
                console.log(subFolderData.data.id);
                
                //if (folder.requireNS == "Y") {
                    //await patchFolder(subFolderData.data.id);  // Assuming patchFolder is also asynchronous
                //}
                if (folder.folder == "0C.KELTBRAY") {
                    await createFolder("WIP", subFolderData.data.id);
                }
                
                console.log(folder.folder + " created");
                statusElement.innerHTML = `<p> ${folder.folder+ " created"}</p>`
                webhookFolders.push({project:"SSE - GSP/"+newProjectName,projectId:projectID,folderName:folder.folder,endFolder:folder.folder,folderId:subFolderData.data.id})
                createdFolders.push({folderName:folder.folder,folderId:subFolderData.data.id})
            } catch (error) {
                console.error("Error creating subfolder:", folder.folder, error);
            }
        }
    }
}

async function createFolder(folderName,parentFolder,requireNS){
 
    const bodyData = {
            "jsonapi": {
              "version": "1.0"
            },
            "data": {
              "type": "folders",
              "attributes": {
                "name": folderName,
                "extension": {
                  "type": "folders:autodesk.bim360:Folder",
                  "version": "1.0"
              }},
              "relationships": {
                "parent": {
                  "data": {
                    "type": "folders",
                    "id": parentFolder
                  }
                }
              }
            }
          }
        
    

    const headers = {
        'Content-Type':'application/vnd.api+json',
        'Authorization':'Bearer '+access_token
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+projectID+"/folders";
    //console.log(apiUrl)
    console.log(requestOptions)
    responeData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data

        //console.log(JSONdata)

        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));


    return responeData
    }

    async function patchFolder(folderID){

            const bodyData = {
                "jsonapi": {
                  "version": "1.0"
                },
                "data": {
                  "type": "folders",
                  "id":folderID,
                  "attributes": {
                    "extension": {
                      "type": "folders:autodesk.bim360:Folder",
                      "version": "1.0",
                      "data": {
                        "namingStandardIds": [NSID]
                    }
                  }
                }
                }
            
            }
        
    
        const headers = {
            'Content-Type':'application/vnd.api+json',
            'Authorization':'Bearer '+access_token
        };
    
        const requestOptions = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(bodyData)
        };
    
        const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+projectID+"/folders/"+folderID;
        //console.log(apiUrl)
        console.log(requestOptions)
        responeData = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data
    
            //console.log(JSONdata)
    
            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));
    
    
        return responeData
        }



async function getAccessToken(scopeInput){

    const bodyData = {
        scope: scopeInput,
        };

    const headers = {
        'Content-Type':'application/json'
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://prod-30.uksouth.logic.azure.com:443/workflows/df0aebc4d2324e98bcfa94699154481f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jHsW0eISklveK7XAJcG0nhfEnffX62AP0mLqJrtLq9c";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data

        //console.log(JSONdata)

        return JSONdata.access_token
        })
        .catch(error => console.error('Error fetching data:', error));


    return signedURLData
    }


async function searchAndPerformAction(folderList) {

    for (const searchFolder of folderList) {
        for (const permissionFolder of folderPermissionList) {
            if (searchFolder.folderName.includes(permissionFolder.folderName)) {
                console.log(`Match found: Folder '${searchFolder.folderName}' with permissions '${JSON.stringify(permissionFolder.folderPermissions)}'`);
                

                    for (const permissionList of permissionFolder.folderPermissions) {
                        await postPermissions(searchFolder.folderId, projectID, permissionList.subjectId, permissionList.subjectType, permissionList.actions, searchFolder.folderName);

                    }
                    statusElement.innerHTML = `<p>Updating Folder permissions: ${searchFolder.folderName}</p>`
                    }
                }
            }
        }

async function postPermissions(folder_id,project_id,subject_id,subject_type,actions_list){
    const actionsSearch = permssions.find(obj => obj.level == actions_list)
    const actionsUse = actionsSearch ? actionsSearch.actions : undefined;
    const bodyData = [{
        subjectId: subject_id,
        subjectType: subject_type,
        actions: actionsUse
        }];

    const headers = {
        'Authorization':"Bearer "+access_token,
        'Content-Type':'application/json'
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://developer.api.autodesk.com/bim360/docs/v1/projects/"+project_id+"/folders/"+folder_id+"/permissions:batch-update";
    //console.log(apiUrl)
    console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data

        console.log(JSONdata)

        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));

    return signedURLData
    }
    async function addWebhooksToFolders(folderListArray){

        const bodyData = {
            folderList: folderListArray,
            };
    
        const headers = {
            'Content-Type':'application/json'
        };
    
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyData)
        };
    
        const apiUrl = "https://prod-31.uksouth.logic.azure.com:443/workflows/0510c6d5e9c348c6af0f538b092499d9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zhjEQT-4ObR_82oCVDSDo1ZhsLltHpOrKUUzF0bzqCQ";
        //console.log(apiUrl)
        //console.log(requestOptions)
        signedURLData = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data
    
            //console.log(JSONdata)
    
            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));
    
    
        return signedURLData
        }