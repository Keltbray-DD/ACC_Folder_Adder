let startfolder_list = []

const permssions =[
    {level:"FullController",actions:["PUBLISH","PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE","EDIT","CONTROL"]},
    {level:"Edit",actions:["PUBLISH","PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE","EDIT"]},
    {level:"createFull",actions:["PUBLISH","PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE"]},
    {level:"createPart",actions:["PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE"]},
    {level:"viewFull",actions:["VIEW","DOWNLOAD","COLLABORATE"]},
    {level:"viewPart",actions:["VIEW","COLLABORATE"]}
];

const folderPermissionList =[
    {folderName:"0C.KELTBRAY",folderPermissions:[
        {name:"Keltbray",subjectId:"6b11172f-c01a-4fde-9abe-a3a12a978861",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"0E.SHARED",folderPermissions:[
        {name:"Keltbray",subjectId:"6b11172f-c01a-4fde-9abe-a3a12a978861",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Dalcour",subjectId:"6292dbce-36c9-4582-975a-9455aebad0f7",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Excalon",subjectId:"5ddc8bb2-76b2-4427-a90d-f3a06be71894",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"HMF Consulting",subjectId:"4634db8e-abba-4802-ad6f-52b4c49296bc",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"SSE",subjectId:"d8e74e8c-4360-41d2-9bc2-97f48c02f0a8",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
    ]},
    {folderName:"0F.CLIENT_SHARED",folderPermissions:[
        {name:"SSE",subjectId:"d8e74e8c-4360-41d2-9bc2-97f48c02f0a8",autodeskId:"",subjectType:"COMPANY",actions:"createPart"},
    ]},
    {folderName:"0G.PUBLISHED",folderPermissions:[
        {name:"Keltbray",subjectId:"6b11172f-c01a-4fde-9abe-a3a12a978861",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Dalcour",subjectId:"6292dbce-36c9-4582-975a-9455aebad0f7",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"Excalon",subjectId:"5ddc8bb2-76b2-4427-a90d-f3a06be71894",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"HMF Consulting",subjectId:"4634db8e-abba-4802-ad6f-52b4c49296bc",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
        {name:"SSE",subjectId:"d8e74e8c-4360-41d2-9bc2-97f48c02f0a8",autodeskId:"",subjectType:"COMPANY",actions:"viewFull"},
    ]},
    {folderName:"DAL_Dalcour",folderPermissions:[
        {name:"Dalcour",subjectId:"6292dbce-36c9-4582-975a-9455aebad0f7",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"EXC_Excalon",folderPermissions:[
        {name:"Excalon",subjectId:"5ddc8bb2-76b2-4427-a90d-f3a06be71894",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"HMF_HMF_Consultants",folderPermissions:[
        {name:"HMF Consulting",subjectId:"4634db8e-abba-4802-ad6f-52b4c49296bc",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"SSE_Scottish_and_Southern_Energy_(Client)",folderPermissions:[
        {name:"SSE",subjectId:"d8e74e8c-4360-41d2-9bc2-97f48c02f0a8",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},

]

let folderList_Main =[]

const hub_id = "b.24d2d632-e01b-4ca0-b988-385be827cb04"
let projectID;

let projectData

let postRate = 0;
let getRate = 0;
let postTotalCount = 0;
let progress
let totalFolders
let progressSub
let completedSub
let folderDetailsInput

let deliverableFolders = [];
let statusUpdate

let access_token_create

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submitButton').addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Record the start time
        const startTime = performance.now();

        // Update the HTML element with the elapsed time
        //updateElapsedTime(startTime);
        folderDetailsInput = document.getElementById('folder_details');
        // Call the searchAndPerformAction function here
        await batchUpdatePermissions(startfolder_list);

        // Record the end time
        const endTime = performance.now();

        // Calculate the elapsed time in milliseconds
        const elapsedTime = startTime;

    });

    function updateElapsedTime(elapsedTime) {
        const interval = setInterval(() => {
            const minutes = Math.floor(elapsedTime / (1000 * 60));
            const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

            const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('elapsedTime').textContent = `Time elapsed: ${formattedTime}`;
            elapsedTime += 1000; // Increment elapsed time by 1 second


        }, 1000); // Update every second
    }
});




//batchUpdatePermissions(startfolder_list, clientId, clientSecret)

//postPermissions("urn:adsk.wipemea:fs.folder:co.Oh5aOZXRQMyi3Q4pdbyUfA",accessToken,"08b0cb89-fe11-4629-82da-6acf4c26d059","a7280946-cce3-4200-bbf5-34c29c253b0b","338863393")

async function batchUpdatePermissions(startfolder_list){
    if(startfolder_list.length === 0){
        alert("Please enter a URL before clicking start")
    }else{
        try {
            access_token_create = await getAccessToken("data:write");
        } catch {
            console.log("Error: Getting Create Access Token");
        }
        try {
            access_token_read = await getAccessToken("data:read");
        } catch {
            console.log("Error: Getting Read Access Token");
        }
        try {
            await getFolderList(access_token_read,startfolder_list)
            //console.log(folderList_temp)
            //convertToArray(foldersMIDP)
            console.log(deliverableFolders)
        } catch {
            console.log("Error: Geting folder list");
        }
        try {
            access_token_read = await getAccessToken("data:write");
        } catch {            
            console.log("Error: Getting Read Access Token");
        }
          
        //console.log("Waiting for a minute...");
        //await delay(60000); // Wait for a minute (60 seconds or 60000 milliseconds)
        await searchAndPerformAction(access_token_create,deliverableFolders);

    }

    }

async function generateTokenDataCreate(clientId,clientSecret){
    const bodyData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type:'client_credentials',
    scope:'data:write'
    };

    var formBody = [];
    for (var property in bodyData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(bodyData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    };
    formBody = formBody.join("&")

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formBody,
    };
    const apiUrl = 'https://developer.api.autodesk.com/authentication/v1/authenticate';
    //console.log(requestOptions)
    AccessToken_Local = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        console.log(data.access_token)
        return data.access_token
        })
        .catch(error => console.error('Error fetching data:', error));
        return AccessToken_Local
    }

async function generateTokenDataRead(clientId,clientSecret){
    const bodyData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type:'client_credentials',
    scope:'data:read'
    };

    var formBody = [];
    for (var property in bodyData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(bodyData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    };
    formBody = formBody.join("&")

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formBody,
    };
    const apiUrl = 'https://developer.api.autodesk.com/authentication/v1/authenticate';
    //console.log(requestOptions)
    AccessToken_Local = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        console.log(data.access_token)
        return data.access_token
        })
        .catch(error => console.error('Error fetching data:', error));
        return AccessToken_Local
    }

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
    }
    async function getFolderList(AccessToken, startFolderList, parentFolderPath) {
        try {
            // Array of folder names to skip
            const foldersToSkip = ["0A.INCOMING","Z.PROJECT_ADMIN","ZZ.SHADOW_PROJECT"];
            //const deliverableFoldersToAdd = ["WIP","0E.SHARED","0F.CLIENT_SHARED","0F.SHARED_TO_CLIENT", "0G.PUBLISHED", "0H.ARCHIVED"]
    
            for (const startFolder of startFolderList) {
                const folderList = await getfolderItems(startFolder.folderID, AccessToken, projectID);
                if (!folderList || !folderList.data || !Array.isArray(folderList.data)) {
                    throw new Error("Error getting folder items: Invalid folderList data");
                }
                if (getRate >= 290) {
                    console.log("Waiting for 5 Seconds..."); // Displaying the message for a 60-second delay
                    getRate = 0
                    await delay(5000); // Delaying for 60 seconds
                } else {
                    for (const folder of folderList.data) {
                        if (folder.type === 'folders') {
                            const folderID = "folderID: " + folder.id;
                            const folderNameLocal = "folderPath: " + folder.attributes.name;
                            const fullPath = parentFolderPath ? parentFolderPath + '/' + folderNameLocal.split(': ')[1] : folderNameLocal.split(': ')[1];
                            folderList_Main.push({ folderID: folder.id, folderPath: fullPath, folderNameEnd: folderNameLocal });
                
                            if (folderPermissionList.some(AddName => folderNameLocal.includes(AddName.folderName))) {
                                deliverableFolders.push({ folderID: folder.id, folderPath: fullPath, folderNameEnd: folder.attributes.name });
                            }
                
                            console.log("Added folder:", folderID, fullPath);
                
                            if (!folderPermissionList.some(skipName => folderNameLocal.includes(skipName.folderName))) {
                                //await delay(20000); // Delaying for 20 seconds
                                await getFolderList(AccessToken, [{ folderID: folder.id, folderPath: fullPath }], fullPath);
                            } else {
                                console.log("Skipping getFolderList for folder:", folderID, fullPath);
                            }
                        }
                    }
                }
                }
            }
        catch {
            
        }}
    
        

async function getfolderItems(folder_id,AccessToken,project_id){

    const headers = {
        'Authorization':"Bearer "+AccessToken,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+project_id+"/folders/"+folder_id+"/contents";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
        getRate++
        console.log(getRate)
    return signedURLData
    }

async function postPermissions(AccessToken,folder_id,project_id,subject_id,subject_type,actions_list){
    const actionsSearch = permssions.find(obj => obj.level == actions_list)
    const actionsUse = actionsSearch ? actionsSearch.actions : undefined;
    const bodyData = [{
        subjectId: subject_id,
        subjectType: subject_type,
        actions: actionsUse
        }];

    const headers = {
        'Authorization':"Bearer "+AccessToken,
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
        postRate++
        postTotalCount++
        console.log(postRate, postTotalCount)

    return signedURLData
    }

async function searchAndPerformAction(accessToken, folderList) {

        let completedFolders = 0;

        totalFolders = folderList.length;
        console.log(totalFolders)

        const progressBarMain = document.querySelector('.progress-bar-Main');
        const progressBarSub = document.querySelector('.progress-bar-Sub');

        for (const searchFolder of folderList) {
            for (const permissionFolder of folderPermissionList) {
                if (searchFolder.folderNameEnd.includes(permissionFolder.folderName)) {
                    console.log(`Match found: Folder '${searchFolder.folderName}' with permissions '${JSON.stringify(permissionFolder.folderPermissions)}'`);
                    if (postRate >= 55) {
                        console.log("Waiting 15 seconds for rate limit cooldown");
                        try {
                            access_token_create = await getAccessToken("data:write");
                        } catch {
                            console.log("Error: Getting Create Access Token");
                        }
                        await delay(15000); // Add a delay of 30 seconds
                        postRate = 0;
                    } else {
                        let completedSub = 0;
                        for (const permissionList of permissionFolder.folderPermissions) {
                            await delay(500); // Add a delay of 0.5 second
                            await postPermissions(access_token_create, searchFolder.folderID, projectID, permissionList.subjectId, permissionList.subjectType, permissionList.actions, searchFolder.folderName);
                            const progressBarSubTotal = permissionFolder.folderPermissions.length
                            completedSub++;
                            progressSub = (completedSub / progressBarSubTotal) * 100
                            gsap.to(progressBarSub, {
                                x: `${progressSub}%`,
                                duration: 0.1,
                              });
                        }
                        folderDetailsInput.innerHTML = `<span>Updating Folder: ${searchFolder.folderName}</span>`
                        completedFolders++;
                        progress = (completedFolders / totalFolders) * 100;
                        console.log(progress)
                        //progressBar.value = progress;
                        //progressBar.innerText = `${Math.round(progress)}%`;
                        gsap.to(progressBarMain, {
                            x: `${progress}%`,
                            duration: 0.5,
                          });
                        }
                    }
                }
            }

        }

    // Utility function to introduce a delay
function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

async function getProjectDetails(AccessToken,project_id){

        const headers = {
            'Authorization':"Bearer "+AccessToken,
        };

        const requestOptions = {
            method: 'GET',
            headers: headers,
        };

        const apiUrl = "https://developer.api.autodesk.com/project/v1/hubs/"+hub_id+"/projects/b."+project_id;
        console.log(apiUrl)
        console.log(requestOptions)
        projectData = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data
            console.log(JSONdata)
            //console.log(JSONdata.uploadKey)
            //console.log(JSONdata.urls)
            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));

        return projectData
    }

async function getFolderDetails(AccessToken,project_id,folder_id){

        const headers = {
            'Authorization':"Bearer "+AccessToken,
        };

        const requestOptions = {
            method: 'GET',
            headers: headers,
        };

        const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+project_id+"/folders/"+folder_id;
        //console.log(apiUrl)
        //console.log(requestOptions)
        signedURLData = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data
            //console.log(JSONdata)
            //console.log(JSONdata.uploadKey)
            //console.log(JSONdata.urls)
            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));
            getRate++
            console.log(getRate)
        return signedURLData
        }
    // Function to extract IDs from URL
async function extractIds(urlInputValue) {
        try {
            const url = new URL(urlInputValue);
            const projectId = url.pathname.split('/')[4];
            const folderId = url.searchParams.get('folderUrn');
            const accesstoken = await getAccessToken("data:read")
            const projectName = await getProjectDetails(accesstoken,projectId)
            const folderName = await getFolderDetails(accesstoken,projectId,folderId)


            // Update extracted IDs in the HTML
            document.getElementById('project-id').textContent = projectId;
            document.getElementById('folder-id').textContent = folderId;
            document.getElementById('project-name').textContent = projectName.data.attributes.name;
            document.getElementById('start-folder-id').textContent = folderName.data.attributes.name;

            startfolder_list = [
                {folderID: folderId,folderName: folderName.data.attributes.name},
            ]
            projectID = projectId
            // Show extracted IDs
            document.getElementById('extracted-ids').style.display = 'block';
            console.log(startfolder_list)
        } catch (error) {
            console.error('Invalid URL:', error.message);
            // Reset extracted IDs if URL is invalid
            document.getElementById('project-id').textContent = '';
            document.getElementById('folder-id').textContent = '';
            document.getElementById('project-name').textContent = '';
            document.getElementById('start-folder-id').textContent = '';

            // Hide extracted IDs
            document.getElementById('extracted-ids').style.display = 'none';
        }
    }

    // Add event listener to input field for pasting URL
    document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('start-folder-url');
    urlInput.addEventListener('paste', (event) => {
        const pastedText = (event.clipboardData || window.clipboardData).getData('text');
        extractIds(pastedText);
    });
    })

// Function to create HTML structure for folder permissions
function createPermissionsHTML(data,permissions) {
    const container = document.getElementById('permissions-container');
    if (!container) {
        console.error('Container element not found.');
        return;
    }
    console.log(data)
    data.forEach(folder => {
        const folderDiv = document.createElement('div');
        folderDiv.classList.add('folder');

        const folderNameDiv = document.createElement('div');
        folderNameDiv.classList.add('folder-name');
        folderNameDiv.textContent = folder.folderName;
        folderDiv.appendChild(folderNameDiv);

        const permissionsTable = document.createElement('table');
        permissionsTable.classList.add('permissions-table');

        // Create table header
        const headerRow = permissionsTable.insertRow();
        const th1 = document.createElement('th');
        th1.textContent = 'Name';
        const th2 = document.createElement('th');
        th2.textContent = 'Permissions';
        const th3 = document.createElement('th');
        th3.textContent = 'Actions';
        headerRow.appendChild(th1);
        headerRow.appendChild(th2);
        headerRow.appendChild(th3);

        folder.folderPermissions.forEach(permission => {
            const permissionRow = permissionsTable.insertRow();
            const cell1 = permissionRow.insertCell();
            cell1.textContent = permission.name;

            const cell2 = permissionRow.insertCell();
            const rectangleHTML_viewPart = `<div class="permissionsContainer"><div class="rectangles">
                <div class="rectangle blue-outline"></div>
                <div class="rectangle"></div>
                <div class="rectangle"></div>
                <div  class="rectangle"></div>
                </div>
                <div><p class="permissionLevelText">View</p></div>
            </div>`;
            const rectangleHTML_viewFull = `<div class="permissionsContainer"><div class="rectangles">
                <div class="rectangle blue"></div>
                <div class="rectangle"></div>
                <div class="rectangle"></div>
                <div class="rectangle"></div>
                </div>
                <div><p class="permissionLevelText">View</p></div>
            </div>`;
            const rectangleHTML_createPart = `<div class="permissionsContainer"><div class="rectangles">
                <div class="rectangle blue"></div>
                <div class="rectangle blue-outline"></div>
                <div class="rectangle"></div>
                <div class="rectangle"></div>
                </div>
                <div><p class="permissionLevelText">Create</p></div>
                </div>
            `;
            const rectangleHTML_createFull = `<div class="permissionsContainer"><div class="rectangles">
                <div class="rectangle blue"></div>
                <div class="rectangle blue"></div>
                <div class="rectangle"></div>
                <div class="rectangle"></div>
                </div>
                <div><p class="permissionLevelText">Create</p></div>
                </div>
            `;

            // Apply styles based on permission level
            switch (permission.actions) {
                case 'viewPart':
                    // Add blue-outline class to cell1
                    cell2.innerHTML = rectangleHTML_viewPart
                    break;
                case 'viewFull':
                    // Add blue class to cell1
                    cell2.innerHTML = rectangleHTML_viewFull
                    break;
                case 'createPart':
                    // Add blue class to cell1 and blue-outline class to cell2
                    cell2.innerHTML = rectangleHTML_createPart
                    break;
                case 'createFull':
                    // Add blue class to both cell1 and cell2
                    cell2.innerHTML = rectangleHTML_createFull
                    break;
                default:
                    break;
            }
            const cell3 = permissionRow.insertCell();
            const perm = permissions.find(perm => perm.level === permission.actions);
            if (perm) {
                cell3.textContent = perm.actions.join(', ');
            } else {
                cell2.textContent = 'Unknown Permission Level';
            }
        });

        folderDiv.appendChild(permissionsTable);
        container.appendChild(folderDiv);

        // Toggle visibility of permissions table on click
        folderNameDiv.addEventListener('click', function() {
            permissionsTable.style.display = permissionsTable.style.display === 'none' ? 'table' : 'none';
        });
    });
}



    // Call the function with the provided data
    document.addEventListener('DOMContentLoaded', function() {
        createPermissionsHTML(folderPermissionList,permssions);
    });

    function updateRectangles(state) {

        // Get references to the rectangles
        const rectangle1 = document.getElementById('rectangle1');
        const rectangle2 = document.getElementById('rectangle2');
        const rectangle3 = document.getElementById('rectangle3');
        const rectangle4 = document.getElementById('rectangle4');
        const permissiontext = document.getElementById('PermissionLevel');
      // Reset all rectangles
        rectangle1.classList.remove('blue', 'blue-outline');
        rectangle2.classList.remove('blue', 'blue-outline');
        rectangle3.classList.remove('blue', 'blue-outline');
        rectangle4.classList.remove('blue', 'blue-outline');
    
      // Apply styles based on state
      switch (state) {
        case 'viewPart':
          rectangle1.classList.add('blue-outline');
          permissiontext.innerText = "View"
          break;
        case 'viewFull':
          rectangle1.classList.add('blue');
          permissiontext.innerText = "View"
          break;
        case 'createPart':
          rectangle1.classList.add('blue');
          rectangle2.classList.add('blue-outline');
          permissiontext.innerText = "Create"
          break;
        case 'createFull':
          rectangle1.classList.add('blue');
          rectangle2.classList.add('blue');
          permissiontext.innerText = "Create"
          break;
        case 'createFull':
            rectangle1.classList.add('blue');
            rectangle2.classList.add('blue');
            rectangle3.classList.add('blue-outline');
            permissiontext.innerText = "Edit"
            break;
        default:
          break;
      }
    }