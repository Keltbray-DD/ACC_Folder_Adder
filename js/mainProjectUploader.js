document.addEventListener("DOMContentLoaded", async function () {
  newFolderLinkBtn = document.getElementById("newFolderLinkBtn");
  newProjectBtn = document.getElementById("newProjectBtn");
  submitBtn = document.getElementById("submitBtn");
  statusElement = document.getElementById("statusUpdate");
  subContractorsListHtml = document.getElementById("subContractorsList");
  gorupParentFoldersElement = document.getElementById("groupParentFolders");
  nameInput = document.getElementById("input_subprojectname");
  folderTree = document.getElementById("folderTree");

  project_Name = sessionStorage.getItem("projectName");
  projectID = sessionStorage.getItem("projectID");
  if (!projectID) {
    location.href = "./index.html";
  }
  console.log(project_Name, projectID);

  await getFolders();
  renderGroupParentFolders(framework_folder_array, gorupParentFoldersElement);
  renderSubContractorList(projectWIPFolders);

  newFolderLinkBtn.style.display = "none";
  newProjectBtn.style.display = "none";
  document.getElementById("appInfo").textContent = `${appName} ${appVersion}`;
});

function renderSubContractorList(data) {
  subContractorsListHtml.innerHTML = "";

  data.forEach(function (record) {
    var gridItem = document.createElement("li");
    gridItem.innerHTML = `
                <input type="checkbox" id="${record.folder}" name="SubContractor" value="${record.folder}" />
                <label for="${record.folder}">${record.folder}</label>

          `;
    subContractorsListHtml.appendChild(gridItem);
  });
}

async function renderGroupParentFolders(data, element) {
  // Create and append options to the dropdown
  data.forEach((option) => {
    var folderID = option.folderID;
    const optionElement = document.createElement("option");
    optionElement.value = folderID;
    optionElement.textContent = option.folderPath;

    // Add click event listener to the project card
    optionElement.addEventListener("change", () => {
      sessionStorage.setItem("parentFolderID", folderID);
      console.log(
        "Selected Parent Folder ID:",
        sessionStorage.getItem("parentFolderID")
      );
    });

    element.appendChild(optionElement);
  });
  // Add an event listener
  element.addEventListener("change", async function () {
    selectedValue = this.value; // Update the variable with the selected value
    sessionStorage.setItem("parentFolderID", selectedValue);
    console.log(
      "Selected Parent Folder ID:",
      sessionStorage.getItem("parentFolderID")
    );
    projectWIPFolders = [];
    projectData = await getPermissionsListFromSP(selectedValue);
    folderPermissionList = JSON.parse(
      projectData[0].project_creation_defualt_permiss
    );
    projectWIPFolders = JSON.parse(projectData[0].project_creation_wip_folders);
    console.log("folderPermissions", folderPermissionList);
    console.log("projectWIPFolders", projectWIPFolders);
    renderSubContractorList(projectWIPFolders);

    folderTree.innerHTML = "";
    folderTree.appendChild(createTree(folderStructure));
  });
}

async function getFolders() {
  folderList_Main = [];
  //statusUpdateLoading.textContent = "Getting Folders..."

  await sortFolderList();
}

async function getFolderListFromSP() {
  const bodyData = {
    project_Name: project_Name,
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
    "https://prod-29.uksouth.logic.azure.com:443/workflows/aa3b3f6ba93f4901acef15184cd5b8de/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=olW_Pb6Al6jJNptqxPXBc-_YBoqN2YOmYiYYBrqd1C8";
  //console.log(apiUrl)
  //console.log(requestOptions)
  signedURLData = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("Raw SP Folder Data", data);
      const JSONdata = data;

      //console.log(JSONdata)
      //console.log(JSONdata.uploadKey)
      //console.log(JSONdata.urls)
      return JSONdata;
    })
    .catch((error) => console.error("Error fetching data:", error));
  return signedURLData;
}

async function sortFolderList() {
  try {
    folderData = await getFolderListFromSP();
    framework_folder_array = JSON.parse(folderData.data[0].framework_folder_array);
    projectWIPFolders = JSON.parse(folderData.data[0].project_creation_wip_folders);
    folderStructure = JSON.parse(folderData.data[0].folder_structure);
    console.log("SP_List_framework_folder_array", framework_folder_array);
    console.log("SP_List_projectWIPFolders", projectWIPFolders);
    console.log("SP_List_folderStructure", folderStructure);

    folderTree.innerHTML = "";
    folderTree.appendChild(createTree(folderStructure));
  } catch {
    console.log("Error: Geting folder list");
    console.error();
  }
}

async function getPermissionsListFromSP(folderId) {
  const bodyData = {
    project_start_folder: folderId,
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
    "https://prod-14.uksouth.logic.azure.com:443/workflows/445adf0423a243c2911e06171bae2c1f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=yLBZ1Wvrju4btc4BfFiYXtq4NMTWL3hs_x9TPBznLeE";
  //console.log(apiUrl)
  //console.log(requestOptions)
  signedURLData = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("Raw SP Folder Data", data);
      const JSONdata = data;

      //console.log(JSONdata)
      //console.log(JSONdata.uploadKey)
      //console.log(JSONdata.urls)
      return JSONdata;
    })
    .catch((error) => console.error("Error fetching data:", error));
  return signedURLData;
}

function createTree(data) {
  const ul = document.createElement("ul");
  data.forEach((item) => {
    // console.log(item)
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.classList.add("folder");

    const toggle = document.createElement("span");
    toggle.classList.add("toggle");
    toggle.textContent = item.children.length > 0 ? "▶" : "";

    const folderSpan = document.createElement("span");
    folderSpan.innerHTML = folderIcon;

    const textNode = document.createTextNode(item.name);

    const statusIcon = document.createElement("span"); // Status Icon Placeholder
    statusIcon.classList.add("status-icon");
    statusIcon.style.marginLeft = "8px"; // Spacing

    div.appendChild(toggle);
    div.appendChild(folderSpan);
    div.appendChild(textNode);
    div.appendChild(statusIcon); // Attach Status Icon
    li.appendChild(div);

    if (item.children.length > 0) {
      const subTree = createTree(item.children);
      subTree.classList.add("hidden");
      li.appendChild(subTree);
      div.addEventListener("click", function (e) {
        e.stopPropagation();
        subTree.classList.toggle("hidden");
        toggle.textContent = subTree.classList.contains("hidden") ? "▶" : "▼";
      });
    }

    ul.appendChild(li);
  });
  return ul;
}

function moveFoldersToWIP() {
  // Locate 0C.WIP in folderStructure
  let wipFolder = folderStructure.find((folder) => folder.name === "0C.WIP");

  if (!wipFolder) {
    console.warn("0C.WIP folder not found!");
    return;
  }

  // Check if arraySelectedContractorArray is an array
  if (
    !Array.isArray(arraySelectedContractorArray) ||
    arraySelectedContractorArray.length === 0
  ) {
    console.warn("arraySelectedContractorArray is empty or not an array.");
    return;
  }

  // Iterate through selected contractors and add them to WIP children
  arraySelectedContractorArray.forEach((item) => {
    // Ensure we're working with an object
    if (typeof item === "string") {
      // Create a new child object
      const newChild = { name: item, children: [] };
      wipFolder.children.push(newChild);
    } else if (typeof item === "object" && item.name) {
      // If item is already an object, push it directly
      wipFolder.children.push(item);
    } else {
      console.warn(`Invalid item in arraySelectedContractorArray:`, item);
    }
  });

  console.log("Updated 0C.WIP:", wipFolder);
}
