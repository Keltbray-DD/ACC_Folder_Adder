async function createFolderStructure() {
  try {
    access_token = await getAccessToken("data:create data:write data:read");
  } catch {
    console.log("Error: Getting Access Token");
  }
  newProjectName = $("#input_subprojectname").val();
  // Run the function to move folders
  moveFoldersToWIP();
  folderTree.innerHTML = "";
  folderTree.appendChild(createTree(folderStructure));

  console.log(newProjectName);
  console.log(arraySelectedContractorArray);
  topFolder = $("#groupParentFolders").val();

  topFolderData = await createFolder(newProjectName, topFolder);

  console.log(topFolderData);
  var newProjectFolderId = topFolderData.data.id;
  newFolderLink = topFolderData.data.links.webView.href;
  console.log("newFolderLink", newFolderLink);
  console.log("newProjectFolderId", newProjectFolderId);

  await createSubFolderStructure(folderStructure, newProjectFolderId);

  //await createSubFolders(projectFolderStructure,newProjectFolderId)
  console.log("createdFolders", createdFolders);
  const subContratorFolderId = createdFolders.find(
    (element) => element.folderName === "0C.WIP"
  );
  await createSubContracterFolders(
    arraySelectedContractorArray,
    subContratorFolderId.folderId
  );
  await searchAndPerformAction(createdFolders);
  console.log("Webhook Folders:", webhookFolders);
  await addWebhooksToFolders(webhookFolders);
  statusElement.innerHTML = `<p>Project created</p>`;
  submitBtn.style.display = "none";
  newFolderLinkBtn.style.display = "block";
  newProjectBtn.style.display = "block";

  alert(
    "Project creation complete please go to ACC to see your project, please note you still need to apply the naming standard to the relevant folders"
  );
}
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function collectSelectedValues() {
  if (!checkRunning) {
    return;
  }

  arraySelectedContractorArray = [];

  // Get all checked checkboxes
  const selectedCheckboxes = document.querySelectorAll(
    "input[name='SubContractor']:checked"
  );
  console.log(selectedCheckboxes);
  // Collect values from checked checkboxes
  selectedCheckboxes.forEach((checkbox) => {
    arraySelectedContractorArray.push(checkbox.value);
  });

  console.log(arraySelectedContractorArray); // Log the array
  checkRunning = false;
}

async function resetButtons() {
  statusElement.innerHTML = ``;
  submitBtn.disabled = false;
}

async function runChecks() {
  checkRunning = true;
  await collectSelectedValues();
  statusElement.innerHTML = `<p>Running Checks</p>`;
  submitBtn.disabled = true;

  if (!nameInput.value) {
    alert("Please enter project name");
    await resetButtons();
    return;
  }
  if (arraySelectedContractorArray == 0) {
    alert("Please select a minimum of 1 originator");
    await resetButtons();
    return;
  }
  checkRunning = false;

  await createFolderStructure();
}

async function createSubFolderStructure(folderArray, parentFolderId) {
  for (const folder of folderArray) {
    try {
      // Delay between folder creations to avoid rate limits
      await delay(200); // 200ms delay, adjust based on your API limits
      // Show an orange tick while processing children
      updateFolderStatus(folder.name, "pending");
      // Create the folder in ACC
      const responseData = await createFolder(folder.name, parentFolderId);

      // Extract the new folder's ID from the response
      const newFolderId = responseData.data.id;
      console.log(`Created folder: ${folder.name} with ID: ${newFolderId}`);
      statusElement.innerHTML = `<p>${folder.name} created</p>`;

      // Track created folders
      createdFolders.push({ folderName: folder.name, folderId: newFolderId });

      // Check if the folder matches specific criteria for webhook
      const criteria = ["0C.WIP", "0E.SHARED", "0G.PUBLISHED"];
      if (criteria.includes(folder.name)) {
        const endfolderString =
          folder.name === "0C.WIP" ? folder.name : `${folder.name} V2`;
        webhookFolders.push({
          project: `${project_Name}/${newProjectName}`,
          projectId: projectID,
          folderName: folder.name,
          endFolder: endfolderString,
          folderId: newFolderId,
        });
      }

      // If the folder has children, recursively create them under this new folder
      if (folder.children && folder.children.length > 0) {
        console.log(`Creating subfolders under: ${folder.name}`);
        await createSubFolderStructure(folder.children, newFolderId);
      }
      // Update the folder graphic to show a green tick ✅
      await updateFolderStatus(folder.name, "completed");
    } catch (error) {
      console.error(`Error creating folder ${folder.name}:`, error.message);
    }
  }
}

function openFolderLink() {
  window.open(newFolderLink, "_blank").focus();
}

async function createSubContracterFolders(folderArray, parentFolderId) {
  for (const folder of folderArray) {
    try {
      const subFolderData = await createFolder(folder, parentFolderId);
      console.log(subFolderData);
      console.log(subFolderData.data.id);

      console.log(folder + " created");
      statusElement.innerHTML = `<p> ${folder + " created"}</p>`;
      // Update the folder graphic to show a green tick ✅
      await updateFolderStatus(folder, true);
      createdFolders.push({
        folderName: folder,
        folderId: subFolderData.data.id,
      });
    } catch (error) {
      console.error("Error creating subfolder:", folder, error);
    }
  }
}

async function createSubFolders(folderArray, newProjectFolderId) {
  for (const folder of folderArray) {
    if (folder.parentFolder == "TOP_FOLDER") {
      // Show an orange tick while processing children
      updateFolderStatus(folder.folder, "pending");
      try {
        const subFolderData = await createFolder(
          folder.folder,
          newProjectFolderId,
          folder.requireNS
        );
        console.log(subFolderData.data.id);

        //if (folder.requireNS == "Y") {
        //await patchFolder(subFolderData.data.id);  // Assuming patchFolder is also asynchronous
        //}
        if (folder.folder == "0C.KELTBRAY") {
          await createFolder("WIP", subFolderData.data.id);
        }

        console.log(folder.folder + " created");

        statusElement.innerHTML = `<p> ${folder.folder + " created"}</p>`;
        const criteria = ["0A.INCOMING", "0H.ARCHIVED", "Z.PROJECT_ADMIN"];
        var endfolderString;
        if (!criteria.includes(folder.folder)) {
          if (folder.folder != "0C.WIP") {
            endfolderString = folder.folder + " V2";
          } else {
            endfolderString = folder.folder;
          }
          webhookFolders.push({
            project: project_Name + "/" + newProjectName,
            projectId: projectID,
            folderName: folder.folder,
            endFolder: endfolderString,
            folderId: subFolderData.data.id,
          });
        }
        // ✅ Once all children are processed, mark as completed (green tick)
        updateFolderStatus(folder.folder, "completed");
        createdFolders.push({
          folderName: folder.folder,
          folderId: subFolderData.data.id,
        });
      } catch (error) {
        console.error("Error creating subfolder:", folder.folder, error);
      }
    }
  }
}
function updateFolderStatus(folderName, status) {
  const folderElements = document.querySelectorAll(".folder");
  folderElements.forEach((folder) => {
    if (folder.textContent.includes(folderName)) {
      let statusIcon = folder.querySelector(".status-icon");

      if (!statusIcon) {
        statusIcon = document.createElement("span");
        statusIcon.classList.add("status-icon");
        statusIcon.style.marginLeft = "8px";
        folder.appendChild(statusIcon);
      }

      if (status === "pending") {
        statusIcon.innerHTML = "🟠"; // Orange tick while processing
        statusIcon.style.color = "orange";
      } else if (status === "completed") {
        statusIcon.innerHTML = "✅"; // Green tick when complete
        statusIcon.style.color = "green";
      }
    }
  });
}

// Function to create a single folder in ACC
async function createFolder(folderName, parentFolderId) {
  const bodyData = {
    jsonapi: {
      version: "1.0",
    },
    data: {
      type: "folders",
      attributes: {
        name: folderName,
        extension: {
          type: "folders:autodesk.bim360:Folder",
          version: "1.0",
        },
      },
      relationships: {
        parent: {
          data: {
            type: "folders",
            id: parentFolderId,
          },
        },
      },
    },
  };

  const headers = {
    "Content-Type": "application/vnd.api+json",
    Authorization: "Bearer " + access_token, // Make sure to replace access_token with your actual token
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bodyData),
  };

  const apiUrl = `https://developer.api.autodesk.com/data/v1/projects/b.${projectID}/folders`;

  try {
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();

    if (response.ok) {
      console.log(`Folder created: ${folderName}`);
      return data; // Return the response data, which should contain the new folder's ID
    } else {
      console.error(`Failed to create folder: ${folderName}`, data);
      throw new Error(data.errors ? data.errors[0].detail : "Unknown error");
    }
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
}

async function patchFolder(folderID) {
  const bodyData = {
    jsonapi: {
      version: "1.0",
    },
    data: {
      type: "folders",
      id: folderID,
      attributes: {
        extension: {
          type: "folders:autodesk.bim360:Folder",
          version: "1.0",
          data: {
            namingStandardIds: [NSID],
          },
        },
      },
    },
  };

  const headers = {
    "Content-Type": "application/vnd.api+json",
    Authorization: "Bearer " + access_token,
  };

  const requestOptions = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(bodyData),
  };

  const apiUrl =
    "https://developer.api.autodesk.com/data/v1/projects/b." +
    projectID +
    "/folders/" +
    folderID;
  //console.log(apiUrl)
  console.log(requestOptions);
  responeData = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const JSONdata = data;

      //console.log(JSONdata)

      return JSONdata;
    })
    .catch((error) => console.error("Error fetching data:", error));

  return responeData;
}

async function getAccessToken(scopeInput) {
  const bodyData = {
    scope: scopeInput,
  };

  const headers = {
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bodyData),
  };

  const apiUrl =
    "https://prod-30.uksouth.logic.azure.com:443/workflows/df0aebc4d2324e98bcfa94699154481f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jHsW0eISklveK7XAJcG0nhfEnffX62AP0mLqJrtLq9c";
  //console.log(apiUrl)
  //console.log(requestOptions)
  signedURLData = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const JSONdata = data;

      //console.log(JSONdata)

      return JSONdata.access_token;
    })
    .catch((error) => console.error("Error fetching data:", error));

  return signedURLData;
}

async function searchAndPerformAction(folderList) {
  console.log("search folder list", folderList);
  console.log("permissions matrix", folderPermissionList);
  for (const searchFolder of folderList) {
    console.log("Apply permissions to ", searchFolder.folderName);
    for (const permissionFolder of folderPermissionList) {
      if (searchFolder.folderName.includes(permissionFolder.foldername)) {
        console.log(
          `Match found: Folder '${
            searchFolder.foldername
          }' with permissions '${JSON.stringify(
            permissionFolder.folderPermissions
          )}'`
        );

        for (const permissionList of permissionFolder.folderPermissions) {
          await postPermissions(
            searchFolder.folderId,
            projectID,
            permissionList.subjectId,
            permissionList.subjectType,
            permissionList.actions,
            searchFolder.foldername
          );
        }
        statusElement.innerHTML = `<p>Updating Folder permissions: ${searchFolder.foldername}</p>`;
      }
    }
  }
}

async function postPermissions(
  folder_id,
  project_id,
  subject_id,
  subject_type,
  actions_list
) {
  const actionsSearch = permssions.find((obj) => obj.level == actions_list);
  const actionsUse = actionsSearch ? actionsSearch.actions : undefined;
  const bodyData = [
    {
      subjectId: subject_id,
      subjectType: subject_type,
      actions: actionsUse,
    },
  ];

  const headers = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bodyData),
  };

  const apiUrl =
    "https://developer.api.autodesk.com/bim360/docs/v1/projects/" +
    project_id +
    "/folders/" +
    folder_id +
    "/permissions:batch-update";
  //console.log(apiUrl)
  console.log(requestOptions);
  signedURLData = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const JSONdata = data;

      console.log(JSONdata);

      return JSONdata;
    })
    .catch((error) => console.error("Error fetching data:", error));

  return signedURLData;
}
async function addWebhooksToFolders(folderListArray) {
  const bodyData = {
    folderList: folderListArray,
  };

  const headers = {
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bodyData),
  };

  const apiUrl =
    "https://prod-31.uksouth.logic.azure.com:443/workflows/0510c6d5e9c348c6af0f538b092499d9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zhjEQT-4ObR_82oCVDSDo1ZhsLltHpOrKUUzF0bzqCQ";
  //console.log(apiUrl)
  //console.log(requestOptions)
  signedURLData = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const JSONdata = data;

      console.log(JSONdata);

      //return JSONdata
    })
    .catch((error) => console.error("Error fetching data:", error));

  return signedURLData;
}
async function postPermissions(
  folder_id,
  project_id,
  subject_id,
  subject_type,
  actions_list
) {
  const actionsSearch = permssions.find((obj) => obj.level == actions_list);
  const actionsUse = actionsSearch ? actionsSearch.actions : undefined;
  const bodyData = [
    {
      subjectId: subject_id,
      subjectType: subject_type,
      actions: actionsUse,
    },
  ];

  const headers = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bodyData),
  };

  const apiUrl =
    "https://developer.api.autodesk.com/bim360/docs/v1/projects/" +
    project_id +
    "/folders/" +
    folder_id +
    "/permissions:batch-update";
  //console.log(apiUrl)
  console.log(requestOptions);
  signedURLData = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const JSONdata = data;

      console.log(JSONdata);

      return JSONdata;
    })
    .catch((error) => console.error("Error fetching data:", error));

  return signedURLData;
}
