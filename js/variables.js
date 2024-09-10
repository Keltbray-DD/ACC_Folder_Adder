
const hubID = "b.24d2d632-e01b-4ca0-b988-385be827cb04"
const account_id = "24d2d632-e01b-4ca0-b988-385be827cb04"
const bucketKey = "wip.dm.emea.2"
const defaultFolder = "urn:adsk.wipemea:fs.folder:co.l7DHLbVaRl-XxgXi8QYFZw" // KELTBRAY - WIP Folder
let templateFolderID
let selectedOptionStartType
let uploadFileList

var AccessToken_DataCreate
var AccessToken_DataRead
var AccessToken_BucketCreate
let accessTokenDataWrite

let ProjectList =[]
let ProjectListRaw

const projectID = "2e6449f9-ce25-4a9c-8835-444cb5ea03bf"
const topFolder = "urn:adsk.wipemea:fs.folder:co.uKW9z6rSSoOFNtj4bWn7UA"
const NSID = "ab4856cc-1546-5a4b-8ff4-99e41fc97170"

let newProjectName
let subContractorsListHtml
let arraySelectedContractorArray = []; 
let access_token
let topFolderData
let createdFolders = []
let webhookFolders = []
let statusElement
let newFolderLink
let newFolderLinkBtn
let submitBtn

const projectFolderStructure = [
    {folder:"0A.INCOMING",parentFolder:"TOP_FOLDER",requireNS:"N"},
    {folder:"0C.WIP",parentFolder:"TOP_FOLDER",requireNS:"Y"},
    {folder:"0D.COMMERCIAL",parentFolder:"TOP_FOLDER",requireNS:"Y"},
    {folder:"0E.SHARED",parentFolder:"TOP_FOLDER",requireNS:"Y"},
    {folder:"0G.PUBLISHED",parentFolder:"TOP_FOLDER",requireNS:"Y"},
    {folder:"0H.ARCHIVED",parentFolder:"TOP_FOLDER",requireNS:"N"},
    {folder:"Z.PROJECT_ADMIN",parentFolder:"TOP_FOLDER",requireNS:"N"}
]

const projectWIPFolders = [
    {folder:"DAL - Dalcour",parentFolder:"0C.WIP"},
    {folder:"EXC - Excalon",parentFolder:"0C.WIP"},
    {folder:"HMF - HMF Consultants",parentFolder:"0C.WIP"},
    {folder:"KEL - Keltbray",parentFolder:"0C.WIP"},
    {folder:"SSE - Scottish and Southern Energy (Client)",parentFolder:"0C.WIP"},
]
const permssions =[
    {level:"FullController",actions:["PUBLISH","PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE","EDIT","CONTROL"]},
    {level:"Edit",actions:["PUBLISH","PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE","EDIT"]},
    {level:"createFull",actions:["PUBLISH","PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE"]},
    {level:"createPart",actions:["PUBLISH_MARKUP","VIEW","DOWNLOAD","COLLABORATE"]},
    {level:"viewFull",actions:["VIEW","DOWNLOAD","COLLABORATE"]},
    {level:"viewPart",actions:["VIEW","COLLABORATE"]}
];

const folderPermissionList =[
    {folderName:"DAL - Dalcour",folderPermissions:[
        {name:"Dalcour",subjectId:"6292dbce-36c9-4582-975a-9455aebad0f7",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"EXC - Excalon",folderPermissions:[
        {name:"Excalon",subjectId:"5ddc8bb2-76b2-4427-a90d-f3a06be71894",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"HMF - HMF Consultants",folderPermissions:[
        {name:"HMF Consulting",subjectId:"4634db8e-abba-4802-ad6f-52b4c49296bc",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"KEL - Keltbray",folderPermissions:[
        {name:"Keltbray",subjectId:"6b11172f-c01a-4fde-9abe-a3a12a978861",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
    ]},
    {folderName:"SSE - Scottish and Southern Energy (Client)",folderPermissions:[
        {name:"SSE",subjectId:"d8e74e8c-4360-41d2-9bc2-97f48c02f0a8",autodeskId:"",subjectType:"COMPANY",actions:"createFull"},
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
    ]}

]
document.addEventListener('DOMContentLoaded', function() {
    newFolderLinkBtn = document.getElementById('newFolderLinkBtn')
    submitBtn = document.getElementById('submitBtn')
    statusElement = document.getElementById('statusUpdate');
    subContractorsListHtml = document.getElementById('subContractorsList');
    renderSubContractorList(projectWIPFolders)
    newFolderLinkBtn.style.display = "none"
  });

  function renderSubContractorList(data) {
    subContractorsListHtml.innerHTML = '';

    data.forEach(function(record) {

        var gridItem = document.createElement('li');
        gridItem.innerHTML = `
                <input type="checkbox" id="${record.folder}" name="SubContractor" value="${record.folder}" />
                <label for="${record.folder}">${record.folder}</label>

          `;
          subContractorsListHtml.appendChild(gridItem);
        
      });
      $('button').on('click', function(e) {
        e.preventDefault();

        $("input:checkbox[name=SubContractor]:checked").each(function() { 
            arraySelectedContractorArray.push($(this).val()); 
        });
        if(arraySelectedContractorArray.length){
            //console.log(arraySelectedContractorArray)
        }
        
    });
}








